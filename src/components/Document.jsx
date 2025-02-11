import React, { useEffect, useState } from 'react';

const Document = ({ outwardNumber }) => {
  const [userData, setUserData] = useState(null);
  const [sitePoints, setSitePoints] = useState([]);
  const [buildingPoints, setBuildingPoints] = useState([]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Fetch user data from the API
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_user/${outwardNumber}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('User Data:', data); // Check the response structure
        setUserData(data); // Set user data when fetched
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, [outwardNumber]);
  
  useEffect(() => {
    fetch('http://localhost/MOD_new/MOD/APIS/ARP.php')
      .then((response) => response.json())
      .then((data) => {
        console.log('Coordinates Data:', data); // Check the response structure
        setSitePoints(data.sitePoints || []); // Set site points
        setBuildingPoints(data.buildingPoints || []); // Set building points
      })
      .catch((error) => console.error('Error fetching coordinates data:', error));
  }, []);
  

  // Helper function to format coordinates table
  const CoordinatesTable = ({ title, points, type }) => (
    <div className="w-full mb-8">
      <h2 className="font-bold text-lg mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Sr. No</th>
              <th className="border border-gray-300 p-2 text-left">Description of Pillars</th>
              <th className="border border-gray-300 p-2">Latitude</th>
              <th className="border border-gray-300 p-2">Longitude</th>
              <th className="border border-gray-300 p-2">AMSL, height of Coordinates (m)</th>
              <th className="border border-gray-300 p-2">Aerial Distance between Coordinates and ARP of NDA, Pune</th>
              <th className="border border-gray-300 p-2">Aerial Distance between Coordinates and ARP LOHEGAON, Pune</th>
              <th className="border border-gray-300 p-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">Point No. {type}{index + 1} :- Differential GPS Observation taken on Ground IN STATIC mode</td>
                <td className="border border-gray-300 p-2 text-center">{point.latitude}</td>
                <td className="border border-gray-300 p-2 text-center">{point.longitude}</td>
                <td className="border border-gray-300 p-2 text-center">{point.Height}</td>
                <td className="border border-gray-300 p-2 text-center">{point.distances_to_reference_points_km.NDA} Km</td>
                <td className="border border-gray-300 p-2 text-center">{point.distances_to_reference_points_km.loh} Km</td>
                <td className="border border-gray-300 p-2">{point.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg max-h-screen overflow-y-auto">
      <div className="mb-8">
        <div className="text-right mb-4">Date: {currentDate}</div>

        <div className="mb-4">
          <p className="font-bold">To,</p>
          <p>{userData?.builderName || "Royal Builders"}</p>
          <p>{userData?.address || "Survey No.- 58, Hissa No.- 58/1/1/1/1"}</p>
          <p>{userData?.village || "Village- Kondhwa Khurd"}</p>
          <p>{userData?.taluka || "Taluka - Haveli"}</p>
          <p>{userData?.district || "District - Pune-411048"}</p>
        </div>

        <div className="mb-8">
          <p className="font-bold">SUB: AUTHENTICATION OF CO-ORDINATES, AMSL, HEIGHTS AND AERIAL DISTANCE REGARDING</p>
          <p className="mt-4">
            With reference to above Site, the Co-ordinates, Aerial Distance and AMSL, Heights of site shown by you are given in Annexure - I which is enclosed herewith for purpose of Airport NOC.
          </p>
        </div>

        <CoordinatesTable 
          title="Annexure - IA ( Co-Ordinates Of Site/Plot )" 
          points={sitePoints}
          type="P"
        />

        <CoordinatesTable 
          title="Annexure - IB ( Co-Ordinates Of Building/Block )" 
          points={buildingPoints}
          type="B"
        />

        <div className="mt-8">
          <p className="font-bold mb-4">Notes:</p>
          <ol className="list-decimal ml-6">
            <li className="mb-2">The Co-ordinates given are based on observations of Differential GPS instrument in STATIC mode and they are in WGS84 Co-ordinates system.</li>
            <li className="mb-2">The heights are based on the Height of Reference station which is connected to SOI GTS BM using DT levelling.</li>
            <li className="mb-2">Accuracy of Co-ordinates is ± 1 m and Aerial distance rounded off up to first decimal of Km.</li>
            <li className="mb-2">This certificate is being issued on Applicants request only to enable them to apply for clearance from concerned authorities.</li>
          </ol>
        </div>

        <div className="mt-8 text-right">
          <p className="font-bold">For Monarch Surveyors & Engineering Consultants Ltd.</p>
          <p className="mt-4">Director</p>
        </div>
      </div>
    </div>
  );
};

export default Document;



// import React, { useRef, useState, useEffect } from "react";
// import { useReactToPrint } from "react-to-print";
// import { useLocation } from "react-router-dom";

// const Document = () => {
//   const documentRef = useRef();
//   const location = useLocation();
//   const [userData, setUserData] = useState(null);
//   const [sitePoints, setSitePoints] = useState([]);
//   const [buildingPoints, setBuildingPoints] = useState([]);
//   const [error, setError] = useState(null);
//   const outwardNumber = location.state?.outwardNumber;
//   const file = location.state?.file;

//   // Fetch User Data (name, village, etc.)
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!outwardNumber) return;

//       try {
//         const response = await fetch(`http://127.0.0.1:5000/get_user/${outwardNumber}`);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//         const data = await response.json();
//         console.log("Fetched User Data:", data);

//         if (data?.user) setUserData(data.user);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     };

//     fetchUserData();
//   }, [outwardNumber]);

//   // Fetch File Data (Coordinates Table)
//   useEffect(() => {
//     const fetchFileData = async () => {
//       if (!file) {
//         setError("No file uploaded");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         const response = await fetch("http://localhost/MOD_new/MOD/APIS/ARP.php", {
//           method: "POST",
//           body: formData,
//         });

//         if (!response.ok) throw new Error("Network response was not ok");

//         const jsonData = await response.json();
//         console.log("Fetched File Data:", jsonData);

//         if (jsonData?.decimal_degrees) {
//           setSitePoints(jsonData.decimal_degrees.sitePoints || []);
//           setBuildingPoints(jsonData.decimal_degrees.buildingPoints || []);
//         } else {
//           setError("Invalid data format");
//         }
//       } catch (error) {
//         console.error("Error fetching file data:", error);
//         setError(error.message);
//       }
//     };

//     fetchFileData();
//   }, [file]);

//   const handlePrint = useReactToPrint({
//     content: () => documentRef.current,
//     documentTitle: `MOD_monarch_Report_${outwardNumber}`,
//   });

//   const currentDate = new Date().toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });

//   const CoordinatesTable = ({ title, points, type }) => (
//     <div className="w-full mb-8">
//       <h2 className="font-bold text-lg mb-4">{title}</h2>
//       <table className="w-full border-collapse bg-white border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 p-2">Sr. No</th>
//             <th className="border border-gray-300 p-2">Description of Pillars</th>
//             <th className="border border-gray-300 p-2">Latitude</th>
//             <th className="border border-gray-300 p-2">Longitude</th>
//             <th className="border border-gray-300 p-2">AMSL (m)</th>
//             <th className="border border-gray-300 p-2">Aerial Distance (NDA)</th>
//             <th className="border border-gray-300 p-2">Aerial Distance (Lohegaon)</th>
//             <th className="border border-gray-300 p-2">Remarks</th>
//           </tr>
//         </thead>
//         <tbody>
//           {points.map((point, index) => (
//             <tr key={index} className="hover:bg-gray-50">
//               <td className="border border-gray-300 p-2">{index + 1}</td>
//               <td className="border border-gray-300 p-2">
//                 Point No. {type}{index + 1} - GPS Observation in STATIC mode
//               </td>
//               <td className="border border-gray-300 p-2 text-center">{point.latitude}</td>
//               <td className="border border-gray-300 p-2 text-center">{point.longitude}</td>
//               <td className="border border-gray-300 p-2 text-center">{point.amsl}</td>
//               <td className="border border-gray-300 p-2 text-center">{point.aerialDistanceNDA} Km</td>
//               <td className="border border-gray-300 p-2 text-center">{point.aerialDistanceLohegaon} Km</td>
//               <td className="border border-gray-300 p-2">{point.remarks}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="w-full max-w-7xl mx-auto p-8 bg-white shadow-lg rounded-lg">
//       <button onClick={handlePrint} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
//         Download PDF
//       </button>

//       <div ref={documentRef} className="p-8">
//         <div className="text-right mb-4">Date: {currentDate}</div>

//         {userData ? (
//           <div className="mb-4">
//             <p className="font-bold">To,</p>
//             <p>{userData.name}</p>
//             <p>{userData.address}</p>
//             <p>{userData.village}</p>
//             <p>{userData.taluka}</p>
//             <p>{userData.district}</p>
//           </div>
//         ) : (
//           <p>Loading user data...</p>
//         )}

//         <div className="mb-8">
//           <p className="font-bold">
//             SUB: AUTHENTICATION OF CO-ORDINATES, AMSL, HEIGHTS AND AERIAL DISTANCE REGARDING
//           </p>
//           <p className="mt-4">
//             With reference to the above Site, the coordinates, aerial distance, and AMSL heights
//             are given in Annexure - I for Airport NOC.
//           </p>
//         </div>

//         {sitePoints.length > 0 && <CoordinatesTable title="Annexure - IA ( Co-Ordinates Of Site/Plot )" points={sitePoints} type="P" />}
//         {buildingPoints.length > 0 && <CoordinatesTable title="Annexure - IB ( Co-Ordinates Of Building/Block )" points={buildingPoints} type="B" />}

//         <div className="mt-8 text-right">
//           <p className="font-bold">For Monarch Surveyors & Engineering Consultants Ltd.</p>
//           <p className="mt-4">Director</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Document;
