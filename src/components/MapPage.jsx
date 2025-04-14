// import React, { useState, useRef, useEffect } from "react";
// import Header from "./Header";
// import MapComponent from "./mapcomponent";
// import html2canvas from "html2canvas";
// import { useNavigate, useParams } from "react-router-dom";

// const MapPage = () => {
//   const { outwardNumber } = useParams();
//   const navigate = useNavigate();

//   // Define CQL filters
//   const cqlFilterZone = outwardNumber
//     ? `outward = '${outwardNumber}' AND typeofsite = 'plot'`
//     : "typeofsite = 'plot'";
//   const cqlFilterWard1 = "Aviation_N = 'NDA'";
//   const cqlFilterWard2 = "Aviation_N = 'Lohagaon'";

//   // Create refs for maps
//   const map1Ref = useRef(null);
//   const map2Ref = useRef(null);
//   const map3Ref = useRef(null);

//   // State for screenshots
//   const [map1Screenshot, setMap1Screenshot] = useState(null);
//   const [map2Screenshot, setMap2Screenshot] = useState(null);
//   const [map3Screenshot, setMap3Screenshot] = useState(null);

//   // Screenshot capture functionality
//   const captureMapScreenshot = async (mapRef, mapType) => {
//     if (!mapRef?.current) {
//       console.error(`Error: ${mapType} map reference is not available!`);
//       return null;
//     }

//     try {
//       const canvas = await html2canvas(mapRef.current);
//       return canvas.toDataURL("image/png");
//     } catch (error) {
//       console.error(`Error capturing ${mapType} screenshot:`, error);
//       return null;
//     }
//   };

//   // Effect to capture screenshots
//   useEffect(() => {
//     const captureScreenshots = async () => {
//       const map1Captured = await captureMapScreenshot(map1Ref, "map1");
//       const map2Captured = await captureMapScreenshot(map2Ref, "map2");
//       const map3Captured = await captureMapScreenshot(map3Ref, "map3");
  
//       setMap1Screenshot(map1Captured);
//       setMap2Screenshot(map2Captured);
//       setMap3Screenshot(map3Captured);
  
//       // Store screenshots in localStorage
//       localStorage.setItem('map1Screenshot', map1Captured);
//       localStorage.setItem('map2Screenshot', map2Captured);
//       localStorage.setItem('map3Screenshot', map3Captured);
//     };
  
//     // Capture screenshots after map renders
//     const timer = setTimeout(captureScreenshots, 10000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />

//       <div className="container mx-auto px-4 py-6">
//         {/* Map Container - using grid layout for 3 maps */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           {/* Map 1 - NDA Map */}
//           <div className="h-[65vh] border rounded-lg overflow-hidden">
//             <div ref={map1Ref} className="h-[calc(100%-40px)]">
//               <MapComponent
//                 className="h-full"
//                 cqlFilterZone={cqlFilterZone}
//                 cqlFilterWard={cqlFilterWard1}
//                 initialShowWMS1={false}
//                 initialShowWMS2={true}
//                 initialShowWMSPOINTS={true}
//                 initialShowWMS3={true}
//                 initialtoposheet={false}
//                 showLayerNames={true}
//               />
//             </div>
//           </div>

//           {/* Map 2 - Lohagaon Map */}
//           <div className="h-[65vh] border rounded-lg overflow-hidden">
//             <div ref={map2Ref} className="h-[calc(100%-40px)]">
//               <MapComponent
//                 className="h-full"
//                 cqlFilterZone={cqlFilterZone}
//                 cqlFilterWard={cqlFilterWard2}
//                 initialtosmtopo={true}
//                 initialShowWMS1={false}
//                 initialShowWMS2={true}
//                 initialShowWMSPOINTS={true}
//                 initialShowWMS3={true}
//                 initialtoposheet={false}
//                 showLayerNames={true}
//               />
//             </div>
//           </div>

//           {/* Map 3 - Toposheet Map */}
//           <div className="h-[65vh] border rounded-lg overflow-hidden">
//             <div ref={map3Ref} className="h-[calc(100%-40px)]">
//               <MapComponent
//                 className="h-full"
//                 cqlFilterZone={cqlFilterZone}
//                 initialtosmtopo={false}
//                 initialShowWMS1={false}
//                 initialShowWMS2={true}
//                 initialShowWMSPOINTS={true}
//                 initialShowWMS3={false}
//                 initialtoposheet={true}
//                 showLayerNames={true}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MapPage;





import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import MapComponent from "./mapcomponent";
import html2canvas from "html2canvas";
import { useNavigate, useParams } from "react-router-dom";

const MapPage = () => {
  const { outwardNumber } = useParams();
  const navigate = useNavigate();

  // Define CQL filters
  const cqlFilterZone = outwardNumber
    ? `outward = '${outwardNumber}' AND typeofsite = 'plot'`
    : "typeofsite = 'plot'";
  const cqlFilterWard1 = "Aviation_N = 'NDA'";
  const cqlFilterWard2 = "Aviation_N = 'Lohagaon'";

  // Create refs for maps
  const map1Ref = useRef(null);
  const map2Ref = useRef(null);
  const map3Ref = useRef(null);
  const map4Ref = useRef(null);

  // State for screenshots
  const [map1Screenshot, setMap1Screenshot] = useState(null);
  const [map2Screenshot, setMap2Screenshot] = useState(null);
  const [map3Screenshot, setMap3Screenshot] = useState(null);
  const [map4Screenshot, setMap4Screenshot] = useState(null);

  // State to track map loading status
  const [mapsLoaded, setMapsLoaded] = useState({
    map1: false,
    map2: false,
    map3: false,
    map4: false
  });

  // State to track screenshot requests
  const [screenshotRequested, setScreenshotRequested] = useState(false);

  // Handle map load events
  const handleMapLoad = (mapNumber) => {
    setMapsLoaded(prev => ({
      ...prev,
      [`map${mapNumber}`]: true
    }));
  };

  // Screenshot capture functionality
  const captureMapScreenshot = async (mapRef, mapType) => {
    if (!mapRef?.current) {
      console.error(`Error: ${mapType} map reference is not available!`);
      return null;
    }

    try {
      const canvas = await html2canvas(mapRef.current);
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error(`Error capturing ${mapType} screenshot:`, error);
      return null;
    }
  };

  // Listen for screenshot requests from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (localStorage.getItem('requestScreenshot') === 'true') {
        setScreenshotRequested(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Capture screenshots when all maps are loaded and requested
  useEffect(() => {
    const allMapsLoaded = Object.values(mapsLoaded).every(Boolean);
    
    if (allMapsLoaded && screenshotRequested) {
      const captureAndStoreScreenshots = async () => {
        // Add small delay to ensure complete rendering
        await new Promise(resolve => setTimeout(resolve, 20000));

        const map1Captured = await captureMapScreenshot(map1Ref, "map1");
        const map2Captured = await captureMapScreenshot(map2Ref, "map2");
        const map3Captured = await captureMapScreenshot(map3Ref, "map3");
        const map4Captured = await captureMapScreenshot(map4Ref, "map4");

        // Update state
        setMap1Screenshot(map1Captured);
        setMap2Screenshot(map2Captured);
        setMap3Screenshot(map3Captured);
        setMap4Screenshot(map4Captured);

        // Store in localStorage
        localStorage.setItem('map1Screenshot', map1Captured);
        localStorage.setItem('map2Screenshot', map2Captured);
        localStorage.setItem('map3Screenshot', map3Captured);
        localStorage.setItem('map4Screenshot', map4Captured);
        
        // Notify that screenshots are ready
        localStorage.setItem('screenshotsReady', 'true');
        setScreenshotRequested(false);
      };

      captureAndStoreScreenshots();
    }
  }, [mapsLoaded, screenshotRequested]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Map Container - using grid layout for 3 maps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Map 1 - NDA Map */}
          <div className="h-[65vh] border rounded-lg overflow-hidden">
            <div ref={map1Ref} className="h-[calc(100%-40px)]">
              <MapComponent
                className="h-full"
                cqlFilterZone={cqlFilterZone}
                cqlFilterWard={cqlFilterWard1}
                initialShowWMS1={false}
                initialShowWMS2={true}
                initialShowWMSPOINTS={true}
                initialShowWMS3={true}
                initialtoposheet={false}
                showLayerNames={true}
                onLoad={() => handleMapLoad(1)}
              />
            </div>
          </div>

          {/* Map 2 - Lohagaon Map */}
          <div className="h-[65vh] border rounded-lg overflow-hidden">
            <div ref={map2Ref} className="h-[calc(100%-40px)]">
              <MapComponent
                className="h-full"
                cqlFilterZone={cqlFilterZone}
                cqlFilterWard={cqlFilterWard2}
                initialtosmtopo={true}
                initialShowWMS1={false}
                initialShowWMS2={true}
                initialShowWMSPOINTS={true}
                initialShowWMS3={true}
                initialtoposheet={false}
                showLayerNames={true}
                onLoad={() => handleMapLoad(2)}
              />
            </div>
          </div>

          {/* Map 3 - Toposheet Map */}
          <div className="h-[65vh] border rounded-lg overflow-hidden">
            <div ref={map3Ref} className="h-[calc(100%-40px)]">
              <MapComponent
                className="h-full"
                cqlFilterZone={cqlFilterZone}
                initialtosmtopo={false}
                initialShowWMS1={false}
                initialShowWMS2={true}
                initialShowWMSPOINTS={true}
                initialShowWMS3={false}
                initialtoposheet={true}
                showLayerNames={true}
                onLoad={() => handleMapLoad(3)}
              />
            </div>
          </div>

          {/* Map 4 - CCZM Map */}
          <div className="h-[65vh] border rounded-lg overflow-hidden">
            <div ref={map4Ref} className="h-[calc(100%-40px)]">
            <MapComponent
                  className="map-container"
                  cqlFilterZone={cqlFilterZone}
                  initialtosmtopo={false}
                  initialShowWMS1={true}
                  initialShowWMS2={true}
                  initialShowWMSPOINTS={true}
                  initialShowWMS3={false}
                  initialtoposheet={false}
                  showLayerNames={true}
                  onLoad={() => handleMapLoad(4)}
                />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MapPage;
