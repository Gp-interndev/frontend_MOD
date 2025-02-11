// import React from "react";
// import Header from "./Header";
// import Footer from "./Footer";
// import Taskdone from "../assets/Taskdone.png";

// const DataTable = ({ data }) => {

//   const containerStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     height: "24vh",
//   };

//   const leftColumnStyle = {
//     width: "49%",
//     height: "120px",
//     position: "relative",
//     left: "40px",
//     overflowY: "auto",
//     top: "28px",
//   };

//   const rightColumnStyle = {
//     width: "50%",
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "space-between",
//     top: "-345px",
//     height: "70vh",
//   };

//   const tableStyle = {
//     width: "100%",
//     maxHeight: "0px",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#f9f9f9",
//   };

//   const headerStyle = {
//     backgroundColor: "#8d8d8d",
//     color: "white",
//     textAlign: "center",
//     padding: "10px",
//     fontSize: "12px",
//     position:"sticky",
//     top: 0,  // Required for sticky to work
//     zIndex: 1000,  // Ensures it stays above other elements
//   };

//   const cellStyle = {
//     textAlign: "center",
//     padding: "8px",
//     border: "1px solid #ddd",
//     fontSize: "10px",
//   };

//   const mapStyle = {
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     position: "relative",
//     left: "90px",
//     width: "80%",
//     height: "50vh",
//   };

//   const noteStyle = {
//     fontSize: "14px",
//     color: "#555",
//     textAlign: "center",
//     padding: "5px",
//     position: "relative",
//     left: "83px",
//     width: "82%",
//     textAlign: "justify",
//     top: "20px",
//   };

//   const buttonContainerStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     marginTop: "20px",
//   };

//   const backbuttonStyle = {
//     fontSize: "16px",
//     background: "#fff", // Apply radial gradient correctly
//     color: "#2563eb", // White text
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center", // Center text and icon horizontally
//     height: "33px", // Increased height for a better button size
//     width: "245px", // Increased width of the button
//     padding: "0 10px", // Add some padding for better spacing
//     position: "relative",
//     left: "95px",
//     boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", // White box shadow
//     top: "20px",
//   };

//   const submitbuttonStyle = {
//     fontSize: "16px",
//     background: "radial-gradient(circle, #60a5fa, #2563eb)", // Apply radial gradient correctly
//     color: "white", // White text
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center", // Center text and icon horizontally
//     height: "33px", // Increased height for a better button size
//     width: "245px", // Increased width of the button
//     padding: "0 10px", // Add some padding for better spacing
//     position: "relative",
//     left: "-40px",
//     top: "20px",
//   };

//   const fileIconStyle = {
//     marginLeft: "10px", // Space between text and icon (reduce to bring closer)
//     fontSize: "18px", // Icon size
//     color: "white", // Ensures the icon is white
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <Header />
//       <div
//         className="content"
//         style={{ position: "relative", left: "40px", top: "20px" }}
//       >
//         <h2 className="text-lg font-semibold">Review Land Information</h2>
//         <p className="para" style={{ width: "600px", fontSize: "12.3px" }}>
//           {" "}
//           Please review the land details extracted from your uploaded file. The
//           information is displayed on the left, while the land layout is shown
//           on the map to the right. Once you're satisfied, the data will be saved
//           to the database.
//         </p>
//         <hr className="w-1/2 border bg-blue-200 border-blue-200 mb-2 mt-2" />
//         <h3 className="mt-2 mb-1" style={{ fontWeight: "bold" }}>
//           1. Important Information
//         </h3>
//         <p className="text-gray-700" style={{ fontSize: "12px" }}>
//           <strong>Outward Number:</strong> SWAC/2564/6/5395/ATS (BM) <br />
//           <strong>Survey/Gut Number:</strong> 58 <br />
//           <strong>Owner Name:</strong> Rajeev Saha <br />
//           <strong>Phone Number:</strong> +91 12345 67890 <br />
//           <strong>Address:</strong> Plot No. 15, Hilltop Co-op Housing Society
//           Limited <br />
//           <strong>Village:</strong> Kondhwa Bk <br />
//           <strong>Taluka:</strong> Haveli <br />
//           <strong>District:</strong> Pune <br />
//           <strong>Pin Code:</strong> 411048
//         </p>
//         {/* Elevation Details */}
//         <h3 className="mt-2 mb-2" style={{ fontWeight: "bold" }}>
//           2. Elevation Details
//         </h3>
//         <p className="text-gray-700" style={{fontSize:"13px"}}>
//           AGL: <strong>29.50 meter</strong> &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;{" "}
//           AMSL: <strong>600.00 meter</strong>
//         </p>
//         <h3 className="mt-3  mb-2" style={{ fontWeight: "bold" }}>
//           3.Plot Coordinate and Elevation
//         </h3>
//       </div>

//       {/* Content Wrapper */}
//       <div style={containerStyle}>
//         {/* Left Column (Land Information Table) */}

//         <div className="hide-scrollbar" style={leftColumnStyle}>
//           <div style={tableStyle}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={headerStyle}>
//                   <th>P_name</th>
//                   <th>Latitude</th>
//                   <th>Longitude</th>
//                   <th>Latitude (DMS)</th>
//                   <th>Longitude (DMS)</th>
//                   <th>NDA Distance (km)</th>
//                   <th>LOH Distance (km)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, index) => (
//                   <tr key={index}>
//                     <td style={cellStyle}>{item.P_name}</td>
//                     <td style={cellStyle}>{item.latitude.toFixed(4)}</td>
//                     <td style={cellStyle}>{item.longitude.toFixed(4)}</td>
//                     <td style={cellStyle}>{item.latitude_dms}</td>
//                     <td style={cellStyle}>{item.longitude_dms}</td>
//                     <td style={cellStyle}>
//                       {item.distances_to_reference_points_km.NDA.toFixed(4)}
//                     </td>
//                     <td style={cellStyle}>
//                       {item.distances_to_reference_points_km.loh.toFixed(4)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Right Column (Map Section) */}
//         <div style={rightColumnStyle}>
//           {/* Map */}
//           <iframe src="/map.html" style={mapStyle} title="Map"></iframe>

//           {/* Note */}
//           <div style={noteStyle}>
//             <span style={{ color: "#000000" }}>NOTE:</span> If some information
//             appears to be incorrect. For the best accuracy and output, please
//             review your Excel file, make the necessary corrections, and upload
//             it again.
//           </div>

//           {/* Buttons */}
//           <div style={buttonContainerStyle}>
//             {/* Back Button */}
//             <button style={backbuttonStyle}>
//               <i
//                 className="bi bi-arrow-left"
//                 style={{ color: "#2563eb", marginRight: "10px" }}
//               ></i>{" "}
//               Back
//             </button>

//             {/* Submit Button */}
//             <button style={submitbuttonStyle}>
//               Submit
//               <i className="bi bi-file-earmark-text" style={fileIconStyle}></i>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default DataTable;

import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const DataTable = ({ data, outwardNumber }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!outwardNumber) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get_user/${outwardNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched User Data:", data);

        if (data?.user) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [outwardNumber]);

  // Rest of your styles remain the same
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    height: "24vh",
  };

  const leftColumnStyle = {
    width: "49%",
    height: "120px",
    position: "relative",
    left: "40px",
    overflowY: "auto",
    top: "28px",
  };

  const rightColumnStyle = {
    width: "50%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    top: "-345px",
    height: "70vh",
  };

  const tableStyle = {
    width: "100%",
    maxHeight: "0px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  };

  const headerStyle = {
    backgroundColor: "#8d8d8d",
    color: "white",
    textAlign: "center",
    padding: "10px",
    fontSize: "12px",
    position: "sticky",
    top: 0, // Required for sticky to work
    zIndex: 1000,
  };

  const cellStyle = {
    textAlign: "center",
    padding: "8px",
    border: "1px solid #ddd",
    fontSize: "10px",
  };

  const mapStyle = {
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
    left: "90px",
    width: "80%",
    height: "50vh",
  };

  const noteStyle = {
    fontSize: "14px",
    color: "#555",
    textAlign: "center",
    padding: "5px",
    position: "relative",
    left: "83px",
    width: "82%",
    textAlign: "justify",
    top: "20px",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  };

  const backbuttonStyle = {
    fontSize: "16px",
    background: "#fff", // Apply radial gradient correctly
    color: "#2563eb", // White text
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center text and icon horizontally
    height: "33px", // Increased height for a better button size
    width: "245px", // Increased width of the button
    padding: "0 10px", // Add some padding for better spacing
    position: "relative",
    left: "95px",
    boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.2)", // White box shadow
    top: "20px",
  };

  const submitbuttonStyle = {
    fontSize: "16px",
    background: "radial-gradient(circle, #60a5fa, #2563eb)", // Apply radial gradient correctly
    color: "white", // White text
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Center text and icon horizontally
    height: "33px", // Increased height for a better button size
    width: "245px", // Increased width of the button
    padding: "0 10px", // Add some padding for better spacing
    position: "relative",
    left: "-40px",
    top: "20px",
  };

  const fileIconStyle = {
    marginLeft: "10px", // Space between text and icon (reduce to bring closer)
    fontSize: "18px", // Icon size
    color: "white", // Ensures the icon is white
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div
        className="content"
        style={{ position: "relative", left: "40px", top: "20px" }}
      >
        <h2 className="text-lg font-semibold">Review Land Information</h2>
        <p className="para" style={{ width: "600px", fontSize: "12.3px" }}>
          Please review the land details extracted from your uploaded file. The
          information is displayed on the left, while the land layout is shown
          on the map to the right. Once you're satisfied, the data will be saved
          to the database.
        </p>
        <hr className="w-1/2 border bg-blue-200 border-blue-200 mb-2 mt-2" />
        <h3 className="mt-2 mb-1" style={{ fontWeight: "bold" }}>
          1. Important Information
        </h3>

        {loading ? (
          <p>Loading user information...</p>
        ) : userData ? (
          <p className="text-gray-700" style={{ fontSize: "12px" }}>
            <strong>Outward Number:</strong> {userData.outwardnumber} <br />
            <strong>Survey/Gut Number:</strong> {userData.gutnumber || "N/A"}{" "}
            <br />
            <strong>Owner Name:</strong> {userData.name || "N/A"} <br />
            <strong>Phone Number:</strong> {userData.mobilenumber || "N/A"}{" "}
            <br />
            <strong>Address:</strong> {userData.siteadress || "N/A"} <br />
            <strong>Village:</strong> {userData.village || "N/A"} <br />
            <strong>Taluka:</strong> {userData.taluka || "N/A"} <br />
            <strong>District:</strong> {userData.district || "N/A"} <br />
            <strong>Pin Code:</strong> {userData.pincode || "N/A"}
          </p>
        ) : (
          <p>No user data available</p>
        )}

        <h3 className="mt-2 mb-2" style={{ fontWeight: "bold" }}>
          2. Elevation Details
        </h3>
        <p className="text-gray-700" style={{ fontSize: "13px" }}>
          AGL: <strong>29.50 meter</strong> &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;{" "}
          AMSL: <strong>600.00 meter</strong>
        </p>
        <h3 className="mt-3  mb-2" style={{ fontWeight: "bold" }}>
          3.Plot Coordinate and Elevation
        </h3>
      </div>

      {/* Content Wrapper */}
      <div style={containerStyle}>
        {/* Left Column (Land Information Table) */}

        <div className="hide-scrollbar" style={leftColumnStyle}>
          <div style={tableStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={headerStyle}>
                  <th>P_name</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Height</th>
                  <th>Latitude (DMS)</th>
                  <th>Longitude (DMS)</th>
                  <th>NDA Distance (km)</th>
                  <th>LOH Distance (km)</th>
                  {/* <th>boundary_distances(km)</th> */}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{item.P_name}</td>
                    <td style={cellStyle}>{item.latitude.toFixed(4)}</td>
                    <td style={cellStyle}>{item.longitude.toFixed(4)}</td>
                    <td style={cellStyle}>{item.Height}</td>
                    <td style={cellStyle}>{item.latitude_dms}</td>
                    <td style={cellStyle}>{item.longitude_dms}</td>
                    <td style={cellStyle}>
                      {item.distances_to_reference_points_km.NDA.toFixed(4)}
                    </td>
                    <td style={cellStyle}>
                      {item.distances_to_reference_points_km.loh.toFixed(4)}
                    </td>
                    

                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (Map Section) */}
        <div style={rightColumnStyle}>
          {/* Map */}
          <iframe src="/map.html" style={mapStyle} title="Map"></iframe>

          {/* Note */}
          <div style={noteStyle}>
            <span style={{ color: "#000000" }}>NOTE:</span> If some information
            appears to be incorrect. For the best accuracy and output, please
            review your Excel file, make the necessary corrections, and upload
            it again.
          </div>

          {/* Buttons */}
          <div style={buttonContainerStyle}>
            {/* Back Button */}
            <button style={backbuttonStyle}>
              <i
                className="bi bi-arrow-left"
                style={{ color: "#2563eb", marginRight: "10px" }}
              ></i>{" "}
              Back
            </button>

            {/* Submit Button */}
            <button style={submitbuttonStyle}>
              Submit
              <i className="bi bi-file-earmark-text" style={fileIconStyle}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DataTable;
