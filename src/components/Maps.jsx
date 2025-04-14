// import React, { useState, useRef, useEffect } from "react";
// import { MapContainer, TileLayer, WMSTileLayer, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet"; // Import Leaflet to access polyline functionality

// // Function to fetch features based on CQL_FILTER
// const fetchFeatures = async (cqlFilter, layerName) => {
//   const wfsUrl = `https://iwmsgis.pmc.gov.in/geoserver/MOD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=MOD:${layerName}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(
//     cqlFilter
//   )}`;
//   try {
//     const response = await fetch(wfsUrl);
//     const data = await response.json();
//     return data.features;
//   } catch (error) {
//     console.error("Error fetching features:", error);
//     return [];
//   }
// };

// // Function to fit bounds to features
// const fitBoundsToFeatures = (features, map) => {
//   if (features.length > 0) {
//     const bounds = L.latLngBounds([]);
//     features.forEach((feature) => {
//       if (
//         feature.geometry.type === "Polygon" ||
//         feature.geometry.type === "MultiPolygon"
//       ) {
//         const geoJsonLayer = L.geoJSON(feature);
//         bounds.extend(geoJsonLayer.getBounds());
//       }
//     });
//     if (bounds.isValid()) {
//       map.fitBounds(bounds);
//     }
//   }
// };

// // Function to get all points from a polygon
// const getAllPointsFromPolygon = (feature) => {
//   const points = [];

//   if (feature.geometry.type === "Polygon") {
//     feature.geometry.coordinates[0].forEach((coord) => {
//       points.push([coord[1], coord[0]]); // Convert to [lat, lng] format
//     });
//   } else if (feature.geometry.type === "MultiPolygon") {
//     feature.geometry.coordinates.forEach((polygon) => {
//       polygon[0].forEach((coord) => {
//         points.push([coord[1], coord[0]]); // Convert to [lat, lng] format
//       });
//     });
//   }

//   return points;
// };

// // Function to find the nearest points between two polygons
// const findNearestPoints = (polygon1Points, polygon2Points) => {
//   let minDistance = Infinity;
//   let nearestPoint1 = null;
//   let nearestPoint2 = null;

//   for (let i = 0; i < polygon1Points.length; i++) {
//     for (let j = 0; j < polygon2Points.length; j++) {
//       const [lat1, lng1] = polygon1Points[i];
//       const [lat2, lng2] = polygon2Points[j];

//       // Calculate squared distance 
//       const dx = lat2 - lat1;
//       const dy = lng2 - lng1;
//       const squaredDistance = dx * dx + dy * dy;

//       if (squaredDistance < minDistance) {
//         minDistance = squaredDistance;
//         nearestPoint1 = polygon1Points[i];
//         nearestPoint2 = polygon2Points[j];
//       }
//     }
//   }
//   // alert(minDistance)
//   return {
//     point1: nearestPoint1,
//     point2: nearestPoint2,
//   };
// };

// // Function to highlight and connect features
// const highlightFeaturesAndConnect = (
//   modPolygonFeatures,
//   aviationBoundaryFeatures,
//   map
// ) => {
//   // Remove previous highlight layers and polylines
//   map.eachLayer((layer) => {
//     if (
//       layer instanceof L.GeoJSON ||
//       (layer instanceof L.Polyline &&
//         layer.options.className === "connection-line")
//     ) {
//       map.removeLayer(layer);
//     }
//   });

//   // Highlight MOD_Polygon features
//   const modPolygonPoints = {};
//   modPolygonFeatures.forEach((feature, index) => {
//     if (
//       feature.geometry.type === "Polygon" ||
//       feature.geometry.type === "MultiPolygon"
//     ) {
//       const layer = L.geoJSON(feature, {
//         style: {
//           color: "#FF0000", // Red color boundary
//           fillColor: "transparent", // No fill color
//           weight: 3, // Thickness of the boundary
//           fillOpacity: 0, // No fill opacity
//         },
//       });
//       layer.addTo(map);

//       // Store points for connection
//       modPolygonPoints[`mod_${index}`] = getAllPointsFromPolygon(feature);
//     }
//   });

//   // Highlight Aviation_Boundary features
//   const aviationPoints = {};
//   aviationBoundaryFeatures.forEach((feature, index) => {
//     if (
//       feature.geometry.type === "Polygon" ||
//       feature.geometry.type === "MultiPolygon"
//     ) {
//       const layer = L.geoJSON(feature, {
//         style: {
//           color: "#FF0000", // Red color boundary
//           fillColor: "transparent", // No fill color
//           weight: 3, // Thickness of the boundary
//           fillOpacity: 0, // No fill opacity
//         },
//       });
//       layer.addTo(map);

//       // Store points for connection
//       aviationPoints[`aviation_${index}`] = getAllPointsFromPolygon(feature);
//     }
//   });

//   // Check if we have both types of features to connect
//   const modKeys = Object.keys(modPolygonPoints);
//   const aviationKeys = Object.keys(aviationPoints);

//   if (modKeys.length > 0 && aviationKeys.length > 0) {
//     // Create an array to hold connection points
//     const connectionPoints = [];
//     let totalDistance = 0;

//     // For simplicity, we'll connect the first MOD_Polygon with the first Aviation_Boundary
//     const modPointsArray = modPolygonPoints[modKeys[0]];
//     const aviationPointsArray = aviationPoints[aviationKeys[0]];

//     // Find nearest points between these two polygons
//     const { point1, point2, distance } = findNearestPoints(
//       modPointsArray,
//       aviationPointsArray
//     );

//     if (point1 && point2) {
//       connectionPoints.push(point1);
//       connectionPoints.push(point2);
//       totalDistance = distance;
//     }

//     // Create a polyline between the two nearest points
//     if (connectionPoints.length === 2) {
//       const polyline = L.polyline(connectionPoints, {
//         color: "Yellow",
//         weight: 2,
//         className: "connection-line",
//       }).addTo(map);

//       const distance = map
//         .distance(connectionPoints[0], connectionPoints[1])
//         .toFixed(2);
//       // alert(distance)
//       // Bind popup showing distance
//       // polyline.bindPopup(`Distance: ${(distance/1000).toFixed(2)}. Km`).openPopup();

//       // alert(totalDistance,"totaldistance")
//       const formattedDistance = (distance / 1000).toFixed(2) + " km"; // Convert meters to kilometers
//       polyline.bindTooltip(`Distance: ${formattedDistance}`, {
//         permanent: true, // Show the tooltip permanently
//         direction: "center", // Center the tooltip on the line
//         className: "distance-label", // Add a custom class for
//       });
//     }
//   }
// };

// // Effect to handle CQL_FILTER changes
// const MapInteractions = ({ cqlFilterZone, cqlFilterWard, cqlFiltertopo }) => {
//   const map = useMap();

//   useEffect(() => {
//     const handleFilter = async () => {
//       let allFeatures = [];
//       let modPolygonFeatures = [];
//       let aviationBoundaryFeatures = [];
//       let topoFeatures = [];

//       // Fetch MOD_Polygon features
//       if (cqlFilterZone) {
//         modPolygonFeatures = await fetchFeatures(cqlFilterZone, "MOD_Polygon");
//         allFeatures = [...allFeatures, ...modPolygonFeatures];
//       }

//       // Fetch Aviation_Boundary features
//       if (cqlFilterWard) {
//         aviationBoundaryFeatures = await fetchFeatures(
//           cqlFilterWard,
//           "Aviation_Boundary"
//         );
//         allFeatures = [...allFeatures, ...aviationBoundaryFeatures];
//       }

//       // Fetch Raster_toposheet features for bounds calculation only
//       if (cqlFiltertopo) {
//         topoFeatures = await fetchFeatures(cqlFiltertopo, "Raster_toposheet");
//         allFeatures = [...allFeatures, ...topoFeatures];
//       }

//       // Fit bounds to all features
//       if (allFeatures.length > 0) {
//         fitBoundsToFeatures(allFeatures, map);
//       }

//       // Only highlight and connect MOD_Polygon and Aviation_Boundary features
//       highlightFeaturesAndConnect(
//         modPolygonFeatures,
//         aviationBoundaryFeatures,
//         map
//       );
//     };

//     handleFilter();
//   }, [cqlFilterZone, cqlFilterWard, cqlFiltertopo, map]);

//   return null; // This component doesn't render anything
// };

// const MapComponent = ({
//   cqlFilterZone,
//   cqlFilterWard,
//   cqlFiltertopo,
//   initialtosmtopo = true,
//   initialShowWMS1 = false,
//   initialShowWMS2 = true,
//   initialShowWMS3 = true,
//   initialtoposheet = false,
//   initialShowWMSPOINTS = true,
//   showLayerNames = true,
// }) => {
//   const [isLayerPanelCollapsed, setIsLayerPanelCollapsed] = useState(false);
//   const [opacityWMS1, setOpacityWMS1] = useState(1);
//   const [opacityWMS2, setOpacityWMS2] = useState(1);
//   const [opacityWMS3, setOpacityWMS3] = useState(1);
//   const [showWMS1, setShowWMS1] = useState(initialShowWMS1);
//   const [topomap, settopomap] = useState(initialtosmtopo);
//   const [showWMS2, setShowWMS2] = useState(initialShowWMS2);
//   const [showWmsPOINTS, setShowWMSPOINTS] = useState(initialShowWMSPOINTS);

//   const [showWMS3, setShowWMS3] = useState(initialShowWMS3);
//   const [showtoposheet, settoposheet] = useState(initialtoposheet);
//   const [wms2Style, setWms2Style] = useState("");
//   const mapRef = useRef(null);

//   // For a layer toggle popup
//   const [isLayerPopupVisible, setIsLayerPopupVisible] = useState(false);

  

//   const toggleStyle = () => {
//     setWms2Style((prevStyle) => (prevStyle === "" ? "polygon" : ""));
//   };

//   return (
//     <MapContainer
//       center={[18.55, 73.94]}
//       zoom={10}
//       style={{ height: "68vh", width: "100%" }}
//       whenCreated={(map) => (mapRef.current = map)}
//     >
//       {/* Base Map Layer */}
//       {topomap && (
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           zIndex={1}
//         />
//       )}
//       {showWmsPOINTS && (
//         <WMSTileLayer
//           key={`Zone_layer_${cqlFilterZone}`}
//           url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
//           layers="MOD_Points"
//           transparent={true}
//           format="image/png"
//           styles={wms2Style}
//           params={{ CQL_FILTER: cqlFilterZone }}
//           opacity={opacityWMS2}
//           zIndex={2}
//           maxZoom={5}
//         />
//       )}

//       {/* First WMS Layer - Aviation_data */}
//       {showWMS1 && (
//         <WMSTileLayer
//           url="https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms"
//           layers="Aviation_data"
//           transparent={true}
//           format="image/png"
//           opacity={opacityWMS1}
//           zIndex={4}
//         />
//       )}

//       {/* Second WMS Layer - Zone_layer with CQL_FILTER */}
//       {showWMS2 && (
//         <WMSTileLayer
//           key={`Zone_layer_${wms2Style}_${cqlFilterZone}`}
//           url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
//           layers="MOD_Polygon"
//           transparent={true}
//           format="image/png"
//           styles={wms2Style}
//           params={{ CQL_FILTER: cqlFilterZone }}
//           opacity={opacityWMS2}
//           zIndex={3}
//         />
//       )}

//       {/* Third WMS Layer - Ward_Boundary with CQL_FILTER */}
//       {showWMS3 && (
//         <WMSTileLayer
//           key={`Ward_Boundary_${cqlFilterWard}`}
//           url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
//           layers="Aviation_Boundary"
//           transparent={true}
//           format="image/png"
//           params={{ CQL_FILTER: cqlFilterWard }}
//           opacity={opacityWMS3}
//           zIndex={5}
//         />
//       )}

//       {/* Fourth WMS Layer - Raster_toposheet with CQL_FILTER */}
//       {showtoposheet && (
//         <WMSTileLayer
//           key={`Raster_toposheet_${cqlFiltertopo}`}
//           url="https://iwmsgis.pmc.gov.in/geoserver/MOD/wms"
//           layers="Raster_toposheet"
//           transparent={true}
//           format="image/png"
//           opacity={opacityWMS3}
//           zIndex={6}
//         />
//       )}

//       {/* Layer Toggle UI */}
//       <button
//         onClick={() => setIsLayerPopupVisible(!isLayerPopupVisible)} // Toggle popup visibility
//         style={{
//           position: "absolute",
//           top: "10px",
//           right: "10px",
//           zIndex: 1000,
//           background: "#007bff",
//           color: "white",
//           padding: "8px 12px",
//           borderRadius: "5px",
//           border: "none",
//           cursor: "pointer",
//           fontWeight: "bold",
//         }}
//       >
//         {isLayerPopupVisible ? "Hide Layers" : "Show Layers"}
//       </button>

//       {isLayerPopupVisible && (
//         <div
//           style={{
//             position: "absolute",
//             top: "10px",
//             right: "10px",
//             zIndex: 1000,
//             background: "white",
//             padding: "10px",
//             borderRadius: "5px",
//             boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
//           }}
//         >
//           <button
//             onClick={() => setIsLayerPanelCollapsed(!isLayerPanelCollapsed)}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "16px",
//               fontWeight: "bold",
//             }}
//           >
//             {isLayerPanelCollapsed ? "Show Layers" : "Hide Layers"}
//           </button>

//           {!isLayerPanelCollapsed && (
//             <div>
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={showWMS1}
//                   onChange={() => setShowWMS1(!showWMS1)}
//                 />
//                 Aviation_data
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={showWmsPOINTS}
//                   onChange={() => setShowWMSPOINTS(!showWmsPOINTS)}
//                 />
//                 Site Points
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={showWMS2}
//                   onChange={() => setShowWMS2(!showWMS2)}
//                 />
//                 Site_boundary
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={showWMS3}
//                   onChange={() => setShowWMS3(!showWMS3)}
//                 />
//                 Ward_Boundary
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={topomap}
//                   onChange={() => settopomap(!topomap)}
//                 />
//                 OSM Topomap
//               </label>
//               <br />
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={showtoposheet}
//                   onChange={() => settoposheet(!showtoposheet)}
//                 />
//                 Toposheet
//               </label>
//             </div>
//           )}
//         </div>
//       )}

//       <MapInteractions
//         cqlFilterZone={cqlFilterZone}
//         cqlFilterWard={cqlFilterWard}
//         cqlFiltertopo={cqlFiltertopo}
//       />
//     </MapContainer>
//   );
// };

// export default MapComponent;


//---------------------------------------------------------Certicate.jsx code 

// import { useState } from "react";
// import { useNavigate,useLocation } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import Footer from "./Footer";
// import fluent1 from "../assets/fluent1.png";
// import fluent2 from "../assets/fluent2.png";
// import fluent3 from "../assets/fluent3.png";
// import fluent4 from "../assets/fluent4.png";
// import arrow from "../assets/arrow-left.png";

// const Certificate = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [loading, setLoading] = useState(false);
//   const [applicationNumber, setApplicationNumber] = useState("");
//   const [applicantName, setApplicantName] = useState("");
//   const [gutnumber, setgutNumber] = useState("");
//   const [nameOnCertificate, setNameOnCertificate] = useState("");
//   const [certificateGenerated, setCertificateGenerated] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);


  
  

//   const handleArrowClick = () => {
//     navigate("/LandingPage");
//   };


//   const handleSearch = async () => {
//     if (!applicationNumber) return;

//     setLoading(true);

//     try {
//       // Fetch data from your API endpoint
//       const response = await fetch(
//         `http://127.0.0.1:5000/get_user/${applicationNumber}`
//       );
//       const data = await response.json();

//       if (response.ok && data.user) {
//         setgutNumber(data.user.gutnumber || "");
//         setNameOnCertificate(data.user.nameoncertificate || "");
//         setApplicantName(data.user.name || "");
//         setCertificateGenerated(true);
//       } else {
//         console.error("User not found");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearAll = () => {
//     setApplicationNumber("");
//     setApplicantName("");
//     setgutNumber("");
//     setNameOnCertificate("");
//     setCertificateGenerated(false);
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <div className="p-4">
//         <div className="flex items-start gap-2 mt-[-20px]">
//           <div
//             onClick={handleArrowClick}
//             className="w-8 h-9 bg-gray-200 flex items-center justify-center rounded mt-1.5 "
//           >
//             <img src={arrow} alt="arrow" className="w-6 h-6" />
//           </div>
//           <div className="flex flex-col w-fit">
//             <span className="text-blue-600 font-medium text-[19px]">
//               Get Certificate Report
//             </span>
//             <span className="text-gray-700 text-[12px] whitespace-nowrap">
//               Retrieve your approved document
//             </span>
//           </div>
//         </div>
//       </div>

//       <main className="flex-grow flex flex-col items-center justify-center">
//         <div className="w-full max-w-xl bg-gray-200 p-4 rounded-lg shadow-sm mx-auto">
//           <h3 className="font-medium mb-1 mt-[-10px]">
//             Find Application Details:
//           </h3>

//           <div>
//             {certificateGenerated ? (
//               <>
//                 {/* First Row */}
//                 <div className="flex flex-col md:flex-row md:gap-x-3 gap-y-2 mb-2">
//                   <div className="w-full md:w-2/5">
//                     <label className="block text-sm mb-1">
//                       Application Number <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-blue-500  p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       style={{ borderRadius: "8px" }}
//                       value={applicationNumber}
//                       onChange={(e) => setApplicationNumber(e.target.value)}
//                     />
//                   </div>
//                   <div className="w-full md:w-2/5">
//                     <label className="block text-sm mb-1">
//                       Applicant Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       style={{ borderRadius: "8px" }}
//                       value={applicantName}
//                       onChange={(e) => setApplicantName(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 {/* Second Row with Button */}
//                 <div className="flex flex-col md:flex-row md:gap-x-3 gap-y-2 items-end">
//                   <div className="w-full md:w-2/5">
//                     <label className="block text-sm mb-1">Gut Number</label>
//                     <input
//                       type="text"
//                       className="w-full border border-blue-500  p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       style={{ borderRadius: "8px" }}
//                       value={gutnumber}
//                       onChange={(e) => setgutNumber(e.target.value)}
//                     />
//                   </div>
//                   <div className="w-full md:w-2/5">
//                     <label className="block text-sm mb-1">
//                       Name on Certificate
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       style={{ borderRadius: "8px" }}
//                       value={nameOnCertificate}
//                       onChange={(e) => setNameOnCertificate(e.target.value)}
//                     />
//                   </div>
//                   <div className="w-full md:w-auto">
//                     <button
//                       onClick={handleClearAll}
//                       className="w-full md:w-auto px-3 py-1 text-red-500 border border-red-200 rounded-md hover:bg-red-50"
//                     >
//                       Clear All
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
//                 <div className="w-full md:w-2/5">
//                   <label className="block text-sm mb-1">
//                     Application Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full border p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
//                     style={{ borderRadius: "8px" }}
//                     value={applicationNumber}
//                     onChange={(e) => setApplicationNumber(e.target.value)}
//                     placeholder="Enter a application number"
//                   />
//                 </div>
//                 <div className="w-full md:w-2/5">
//                   <label className="block text-sm mb-1">
//                     Applicant Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full border p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
//                     style={{ borderRadius: "8px" }}
//                     value={applicantName}
//                     onChange={(e) => setApplicantName(e.target.value)}
//                     placeholder="Please enter applicant name"
//                   />
//                 </div>
//                 <div className="w-full md:w-1/5">
//                   <button
//                     onClick={handleSearch}
//                     disabled={loading}
//                     className="w-full p-2 text-gray-700 bg-white hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
//                     style={{ borderRadius: "8px" }}
//                   >
//                     {loading ? (
//                       <div className="flex items-center justify-center whitespace-nowrap">
//                         <span className="text-xs">Please Wait</span>
//                         <div className="ml-1 animate-spin rounded-full h-3 w-3 border-t-2 border-gray-500"></div>
//                       </div>
//                     ) : (
//                       "Search"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* child cards */}

//         <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 px-4">
//           <div
//             className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition"
//           >
//             <img src={fluent1} alt="New Survey" className="w-10 h-10 mb-2" />
//             <span className="text-sm font-medium">
//               Generate
//               <br />
//               Mod PDF
//             </span>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition">
//             <img
//               src={fluent2}
//               alt="Update Details"
//               className="w-10 h-10 mb-2"
//             />
//             <span className="text-sm font-medium">
//               Generate
//               <br />
//               CCZM Map
//             </span>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition">
//             <img
//               src={fluent3}
//               alt="Check Certificate"
//               className="w-10 h-10 mb-2"
//             />
//             <span className="text-sm font-medium">
//               Generate
//               <br />
//               NDA Map
//             </span>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition">
//             <img src={fluent4} alt="Get Report" className="w-10 h-10 mb-2" />
//             <span className="text-sm font-medium">
//               Generate
//               <br />
//               Lohgaon Map
//             </span>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Certificate;