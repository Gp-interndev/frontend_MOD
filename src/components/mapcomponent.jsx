import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, WMSTileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet to access polyline functionality

// Function to fetch features based on CQL_FILTER
const fetchFeatures = async (cqlFilter, layerName) => {
  const wfsUrl = `https://iwmsgis.pmc.gov.in/geoserver/MOD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=MOD:${layerName}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(
    cqlFilter
  )}`;
  try {
    const response = await fetch(wfsUrl);
    const data = await response.json();
    return data.features;
  } catch (error) {
    console.error("Error fetching features:", error);
    return [];
  }
};

// Function to fit bounds to features
const fitBoundsToFeatures = (features, map) => {
  if (features.length > 0) {
    const bounds = L.latLngBounds([]);
    features.forEach((feature) => {
      if (
        feature.geometry.type === "Polygon" ||
        feature.geometry.type === "MultiPolygon"
      ) {
        const geoJsonLayer = L.geoJSON(feature);
        bounds.extend(geoJsonLayer.getBounds());
      }
    });
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    }
  }
};

// Function to get all points from a polygon
const getAllPointsFromPolygon = (feature) => {
  const points = [];

  if (feature.geometry.type === "Polygon") {
    feature.geometry.coordinates[0].forEach((coord) => {
      points.push([coord[1], coord[0]]); // Convert to [lat, lng] format
    });
  } else if (feature.geometry.type === "MultiPolygon") {
    feature.geometry.coordinates.forEach((polygon) => {
      polygon[0].forEach((coord) => {
        points.push([coord[1], coord[0]]); // Convert to [lat, lng] format
      });
    });
  }

  return points;
};

// Function to find the nearest points between two polygons
const findNearestPoints = (polygon1Points, polygon2Points) => {
  let minDistance = Infinity;
  let nearestPoint1 = null;
  let nearestPoint2 = null;

  for (let i = 0; i < polygon1Points.length; i++) {
    for (let j = 0; j < polygon2Points.length; j++) {
      const [lat1, lng1] = polygon1Points[i];
      const [lat2, lng2] = polygon2Points[j];

      // Calculate squared distance (no need for square root for comparison)
      const dx = lat2 - lat1;
      const dy = lng2 - lng1;
      const squaredDistance = dx * dx + dy * dy;

      if (squaredDistance < minDistance) {
        minDistance = squaredDistance;
        nearestPoint1 = polygon1Points[i];
        nearestPoint2 = polygon2Points[j];
      }
    }
  }
// alert(minDistance)
  return {
    point1: nearestPoint1,
    point2: nearestPoint2,
  };
};

// Function to highlight and connect features
const highlightFeaturesAndConnect = (
  modPolygonFeatures,
  aviationBoundaryFeatures,
  map
) => {
  // Remove previous highlight layers and polylines
  map.eachLayer((layer) => {
    if (
      layer instanceof L.GeoJSON ||
      (layer instanceof L.Polyline &&
        layer.options.className === "connection-line")
    ) {
      map.removeLayer(layer);
    }
  });

  // Highlight MOD_Polygon features
  const modPolygonPoints = {};
  modPolygonFeatures.forEach((feature, index) => {
    if (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    ) {
      const layer = L.geoJSON(feature, {
        style: {
          color: "#FF0000", // Red color boundary
          fillColor: "transparent", // No fill color
          weight: 3, // Thickness of the boundary
          fillOpacity: 0, // No fill opacity
        },
      });
      layer.addTo(map);

      // Store points for connection
      modPolygonPoints[`mod_${index}`] = getAllPointsFromPolygon(feature);
    }
  });

  // Highlight Aviation_Boundary features
  const aviationPoints = {};
  aviationBoundaryFeatures.forEach((feature, index) => {
    if (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    ) {
      const layer = L.geoJSON(feature, {
        style: {
          color: "#FF0000", // Red color boundary
          fillColor: "transparent", // No fill color
          weight: 3, // Thickness of the boundary
          fillOpacity: 0, // No fill opacity
        },
      });
      layer.addTo(map);

      // Store points for connection
      aviationPoints[`aviation_${index}`] = getAllPointsFromPolygon(feature);
    }
  });

  // Check if we have both types of features to connect
  const modKeys = Object.keys(modPolygonPoints);
  const aviationKeys = Object.keys(aviationPoints);

  if (modKeys.length > 0 && aviationKeys.length > 0) {
    // Create an array to hold connection points
    const connectionPoints = [];
    let totalDistance = 0;

    // For simplicity, we'll connect the first MOD_Polygon with the first Aviation_Boundary
    const modPointsArray = modPolygonPoints[modKeys[0]];
    const aviationPointsArray = aviationPoints[aviationKeys[0]];

    // Find nearest points between these two polygons
    const { point1, point2, distance } = findNearestPoints(
      modPointsArray,
      aviationPointsArray
    );

    if (point1 && point2) {
      connectionPoints.push(point1);
      connectionPoints.push(point2);
      totalDistance = distance;
    }

    // Create a polyline between the two nearest points
    if (connectionPoints.length === 2) {
      const polyline = L.polyline(connectionPoints, {
        color: "Yellow",
        weight: 2,
        className: "connection-line",
      }).addTo(map);

      const distance = map.distance(connectionPoints[0], connectionPoints[1]).toFixed(2);
      // alert(distance)
      // Bind popup showing distance
      // polyline.bindPopup(`Distance: ${(distance/1000).toFixed(2)}. Km`).openPopup();

      // alert(totalDistance,"totaldistance")
      const formattedDistance = (distance / 1000).toFixed(2) + " km"; // Convert meters to kilometers
      polyline.bindTooltip(`Distance: ${formattedDistance}`, {
        permanent: true, // Show the tooltip permanently
        direction: "center", // Center the tooltip on the line
        className: "distance-label", // Add a custom class for
      });
    }
  }
};

// Effect to handle CQL_FILTER changes
const MapInteractions = ({ cqlFilterZone, cqlFilterWard, cqlFiltertopo }) => {
  const map = useMap();

  useEffect(() => {
    const handleFilter = async () => {
      let allFeatures = [];
      let modPolygonFeatures = [];
      let aviationBoundaryFeatures = [];
      let topoFeatures = [];

      // Fetch MOD_Polygon features
      if (cqlFilterZone) {
        modPolygonFeatures = await fetchFeatures(cqlFilterZone, "MOD_Polygon");
        allFeatures = [...allFeatures, ...modPolygonFeatures];
      }

      // Fetch Aviation_Boundary features
      if (cqlFilterWard) {
        aviationBoundaryFeatures = await fetchFeatures(
          cqlFilterWard,
          "Aviation_Boundary"
        );
        allFeatures = [...allFeatures, ...aviationBoundaryFeatures];
      }

      // Fetch Raster_toposheet features for bounds calculation only
      if (cqlFiltertopo) {
        topoFeatures = await fetchFeatures(cqlFiltertopo, "Raster_toposheet");
        allFeatures = [...allFeatures, ...topoFeatures];
      }

      // Fit bounds to all features
      if (allFeatures.length > 0) {
        fitBoundsToFeatures(allFeatures, map);
      }

      // Only highlight and connect MOD_Polygon and Aviation_Boundary features
      highlightFeaturesAndConnect(
        modPolygonFeatures,
        aviationBoundaryFeatures,
        map
      );
    };

    handleFilter();
  }, [cqlFilterZone, cqlFilterWard, cqlFiltertopo, map]);

  return null; // This component doesn't render anything
};

const MapComponent = ({
  cqlFilterZone,
  cqlFilterWard,
  cqlFiltertopo,
  initialtosmtopo = true,
  initialShowWMS1 = false,
  initialShowWMS2 = true,
  initialShowWMS3 = true,
  initialtoposheet = false,
  initialShowWMSPOINTS = true,
  showLayerNames = true,
}) => {


  const [isLayerPanelCollapsed, setIsLayerPanelCollapsed] = useState(false);
  const [opacityWMS1, setOpacityWMS1] = useState(1);
  const [opacityWMS2, setOpacityWMS2] = useState(1);
  const [opacityWMS3, setOpacityWMS3] = useState(1);
  const [showWMS1, setShowWMS1] = useState(initialShowWMS1);
  const [topomap, settopomap] = useState(initialtosmtopo);
  const [showWMS2, setShowWMS2] = useState(initialShowWMS2);
  const [showWmsPOINTS, setShowWMSPOINTS] = useState(initialShowWMSPOINTS);

  const [showWMS3, setShowWMS3] = useState(initialShowWMS3);
  const [showtoposheet, settoposheet] = useState(initialtoposheet);
  const [wms2Style, setWms2Style] = useState("");
  const mapRef = useRef(null);

  

  const toggleStyle = () => {
    setWms2Style((prevStyle) => (prevStyle === "" ? "polygon" : ""));
  };

  return (
    <MapContainer
      center={[18.59, 73.84]}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      {/* Base Map Layer */}
      {topomap && (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          zIndex={1}
        />
      )}
      {showWmsPOINTS && (
        <WMSTileLayer
          key={`Zone_layer_${cqlFilterZone}`}
          url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
          layers="MOD_Points"
          transparent={true}
          format="image/png"
          styles={wms2Style}
          params={{ CQL_FILTER: cqlFilterZone }}
          opacity={opacityWMS2}
          zIndex={2}
        />
      )}

      {/* First WMS Layer - Aviation_data */}
      {showWMS1 && (
        <WMSTileLayer
          url="https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms"
          layers="Aviation_data"
          transparent={true}
          format="image/png"
          opacity={opacityWMS1}
          zIndex={4}
        />
      )}

      {/* Second WMS Layer - Zone_layer with CQL_FILTER */}
      {showWMS2 && (
        <WMSTileLayer
          key={`Zone_layer_${wms2Style}_${cqlFilterZone}`}
          url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
          layers="MOD_Polygon"
          transparent={true}
          format="image/png"
          styles={wms2Style}
          params={{ CQL_FILTER: cqlFilterZone }}
          opacity={opacityWMS2}
          zIndex={3}
        />
      )}

      

      {/* Third WMS Layer - Ward_Boundary with CQL_FILTER */}
      {showWMS3 && (
        <WMSTileLayer
          key={`Ward_Boundary_${cqlFilterWard}`}
          url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
          layers="Aviation_Boundary"
          transparent={true}
          format="image/png"
          params={{ CQL_FILTER: cqlFilterWard }}
          opacity={opacityWMS3}
          zIndex={5}
        />
      )}

      {/* Fourth WMS Layer - Raster_toposheet with CQL_FILTER */}
      {showtoposheet && (
        <WMSTileLayer
          key={`Raster_toposheet_${cqlFiltertopo}`}
          url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
          layers="Raster_toposheet"
          transparent={true}
          format="image/png"
          opacity={opacityWMS3}
          zIndex={6}
        />
      )}

      {/* Layer Toggle UI */}
      {showLayerNames && (
  <div
    style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: 1000,
      background: "white",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
    }}
  >
    <button
      onClick={() => setIsLayerPanelCollapsed(!isLayerPanelCollapsed)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
      }}
    >
      {isLayerPanelCollapsed ? "Show Layers" : "Hide Layers"}
    </button>

    {!isLayerPanelCollapsed && (
      <div>
        <label>
          <input
            type="checkbox"
            checked={showWMS1}
            onChange={() => setShowWMS1(!showWMS1)}
          />
          Aviation_data
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showWmsPOINTS}
            onChange={() => setShowWMSPOINTS(!showWmsPOINTS)}
          />
          Site Points
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showWMS2}
            onChange={() => setShowWMS2(!showWMS2)}
          />
          Site_boundary
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showWMS3}
            onChange={() => setShowWMS3(!showWMS3)}
          />
          Ward_Boundary
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={topomap}
            onChange={() => settopomap(!topomap)}
          />
          OSM Topomap
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={showtoposheet}
            onChange={() => settoposheet(!showtoposheet)}
          />
          Toposheet
        </label>
      </div>
    )}
  </div>
)}

      <MapInteractions
        cqlFilterZone={cqlFilterZone}
        cqlFilterWard={cqlFilterWard}
        cqlFiltertopo={cqlFiltertopo}
      />
    </MapContainer>
  );
};

export default MapComponent;

// Opacity toggles on map

{
  /* Opacity Sliders */
}
{
  /* <div style={{ position: 'absolute', bottom: '50px', left: '10px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px' }}>
        <p>Layer Opacity</p>
        <label>
          Aviation_data:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacityWMS1}
            onChange={(e) => setOpacityWMS1(parseFloat(e.target.value))}
          />
        </label>
        <br />
        <label>
          Zone_layer:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacityWMS2}
            onChange={(e) => setOpacityWMS2(parseFloat(e.target.value))}
          />
        </label>
        <br />
        <label>
          Ward_Boundary:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacityWMS3}
            onChange={(e) => setOpacityWMS3(parseFloat(e.target.value))}
          />
        </label>
      </div> */
}

{
  /* Style Button
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px' }}>
        <button onClick={toggleStyle}>
          {wms2Style === '' ? 'Change Style to "Polygon"' : 'Revert to Default Style'}
        </button>
      </div> */
}
