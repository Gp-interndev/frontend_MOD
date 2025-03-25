import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import MapComponent from "./mapcomponent";

const DataTable = ({ data, outwardNumber }) => {
  const cqlFilterZone = `outward = '${outwardNumber}' AND typeofsite = 'plot'`; // Define cqlFilterZone
  const cqlFilterWard1 = "Aviation_N = 'NDA'"; // Define cqlFilterWard if needed
  const cqlFilterWard2 = "Aviation_N = 'Lohagaon'";
  const cqlFilterWard3 = "	PALETTE_INDEX = '253.0'";
  const cqlFiltertopo = "PALETTE_INDEX = '253.0'";

  // const [cqlFilterZone, setCqlFilterZone] = useState('');
  // const [cqlFilterWard, setCqlFilterWard] = useState('');

  // const applyZoneFilter = () => {
  //   setCqlFilterZone(cqlFilterZone ? '' : "zone = 'D.M.C. Zone 5'");
  // };

  // const applyWardFilter = () => {
  //   setCqlFilterWard(cqlFilterWard ? '' : "ward_name = 'Ward 10'");
  // };

  // return (
  //   <div>
  //     <MapComponent cqlFilterZone={cqlFilterZone} cqlFilterWard={cqlFilterWard} />

  //     {/* Buttons to Apply Filters */}
  //     <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000, background: 'white', padding: '10px', borderRadius: '5px' }}>
  //       <button onClick={applyZoneFilter}>
  //         {cqlFilterZone ? 'Remove Zone Filter' : 'Apply Zone Filter'}
  //       </button>
  //       <br /><br />
  //       <button onClick={applyWardFilter}>
  //         {cqlFilterWard ? 'Remove Ward Filter' : 'Apply Ward Filter'}
  //       </button>
  //     </div>
  //   </div>
  // );

  const [activeMap, setActiveMap] = useState("map1");

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [aviationData, setAviationData] = useState(null);
  const [geometry, setGeometry] = useState(null);

  // Memoized data fetching function with improved error handling
  const fetchUserData = useMemo(
    () => async () => {
      if (!outwardNumber) return null;

      try {
        const response = await fetch(
          `http://localhost:5000/get_user/${outwardNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Optional: Add timeout or other headers if needed
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch user data. Status: ${response.status}`
          );
        }

        const responseData = await response.json();
        return responseData?.user || null;
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Unable to load user information. Please try again.");
        return null;
      }
    },
    [outwardNumber]
  );

  // useEffect(() => {
  //   const fetchAviationData = async () => {
  //     if (outwardNumber) {
  //       try {
  //         const response = await fetch(
  //           `http://localhost:5000/get_aviation_data/${outwardNumber}`
  //         );
  //         if (response.ok) {
  //           const data = await response.json();
  //           console.log("Aviation Data Fetched:", data);
  //           setAviationData(data); // Set the updated aviation data in the state
  //         } else {
  //           console.log("Error fetching aviation data:", await response.json());
  //           setAviationData(null);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching aviation data:", error);
  //       }
  //     }
  //   };

  //   fetchAviationData();
  // }, [outwardNumber]);

  useEffect(() => {
    const fetchAviationData = async () => {
      if (!outwardNumber) return;

      setLoading(true);
      try {
        // Fetch both geometry and aviation data using the combined API
        const response = await fetch(
          `http://localhost:5000/get_aviation_data/${outwardNumber}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch geometry and aviation data");
        }

        const data = await response.json();

        // Set both geometry and aviation data to state
        if (data.geometry) {
          setGeometry(data.geometry);
        }
        if (data.aviation_data) {
          setAviationData(data.aviation_data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAviationData();
  }, [outwardNumber]);

  // Improved useEffect for data loading
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await fetchUserData();
        setUserData(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [fetchUserData]);

  const handleSubmit = async () => {
    //  old handlesubmit for submiting and processing file
    try {
      setIsGenerating(true);

      const generateResponse = await fetch(
        "http://localhost:5000/generate_doc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            outwardNumber,
            fileData: data,
          }),
        }
      );

      const result = await generateResponse.json();

      if (!generateResponse.ok) {
        throw new Error(result.error || "Failed to generate document");
      }

      if (result.success) {
        navigate("/pdf-viewer", { state: { outwardNumber, data } });
      } else {
        throw new Error(result.error || "Failed to generate document");
      }
    } catch (error) {
      console.error("Document Generation Error:", error);
      alert("Error generating document: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // const handleSubmit = async () => {
  //   // new handlesubmit for saving data to database also
  //   try {
  //     setIsGenerating(true);

  //     // Get the file from the NextStep component through location state
  //     // We need to access one level up since NextStep is the parent component
  //     const file =
  //       window.history.state?.usr?.file || window.history.state?.state?.file;

  //     if (!file) {
  //       throw new Error("File not available. Please upload again.");
  //     }

  //     // First, update the CSV data in the database
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("outwardNumber", outwardNumber);

  //     console.log("Updating CSV data with outward number:", outwardNumber);

  //     // Send the data to the backend to update the database
  //     const updateResponse = await fetch("http://localhost:5000/update_csv", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const updateResult = await updateResponse.json();

  //     if (!updateResponse.ok) {
  //       throw new Error(updateResult.error || "Failed to update CSV data");
  //     }

  //     console.log("CSV data updated successfully:", updateResult.message);

  //     // Then proceed with document generation
  //     const generateResponse = await fetch(
  //       "http://localhost:5000/generate_doc",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           outwardNumber,
  //           fileData: data,
  //         }),
  //       }
  //     );

  //     const result = await generateResponse.json();

  //     if (!generateResponse.ok) {
  //       throw new Error(result.error || "Failed to generate document");
  //     }

  //     if (result.success) {
  //       navigate("/pdf-viewer", { state: { outwardNumber, data } });
  //     } else {
  //       throw new Error(result.error || "Failed to generate document");
  //     }
  //   } catch (error) {
  //     console.error("Operation Error:", error);
  //     alert("Error: " + error.message);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const handleBackClick = () => {
    navigate(-1);
  };

  // Rest of your styles remain the same
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    height: "24vh",
    marginTop: "150px",
    marginBottom: "10px",
  };

  const leftColumnStyle = {
    width: "50%",
    height: "325px",
    position: "relative",
    left: "40px",
    overflowY: "auto",
    top: "-128px",
    borderRadius: "5px",
    borderTop: "none",
    borderBottom: "2px solid #333",
  };

  const rightColumnStyle = {
    width: "50%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    top: "-280px",
    height: "80vh",
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
    background: "radial-gradient(circle, #3498db, #2980b9)", // Radial gradient effect
    color: "white",
    textAlign: "center",
    padding: "15px 10px",
    height: "35px",
    fontSize: "13px",
    position: "sticky",
    top: 0, // Required for sticky to work
    zIndex: 1000,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
    // borderRadius: "15px",
    overflow: "visible", // Ensures border-radius is applied properly
  };

  const cellStyle = {
    textAlign: "center",
    padding: "8px",
    border: "1px solid #ddd",
    fontSize: "10px",
  };

  // const mapStyle = {
  //   border: "1px solid #ccc",
  //   borderRadius: "5px",
  //   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  //   position: "relative",
  //   left: "90px",
  //   width: "80%",
  //   height: "70vh",
  //   top: "-65px",
  //   marginBottom:"5px"
  // };

  const mapStyle = {
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    height: "50vh",
    marginBottom: "10px",
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
    top: "-60px",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    position: "relative",
    top: "-80px",
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

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div
        className="content"
        style={{ position: "relative", left: "40px", top: "20px" }}
      >
        {/* <h2 className="text-lg font-semibold">Review Land Information</h2>
        <p className="para" style={{ width: "600px", fontSize: "12.3px" }}>
          Please review the land details extracted from your uploaded file. The
          information is displayed on the left, while the land layout is shown
          on the map to the right. Once you're satisfied, the data will be saved
          to the database.
        </p> */}
        {/* <hr className="w-1/2 border bg-blue-200 border-blue-200 mb-2 mt-2" /> */}
        <h3 className="mb-1" style={{ fontWeight: "bold", marginTop: "-10px" }}>
          1. Important Information
        </h3>

        {loading ? (
          <p>Loading user information...</p>
        ) : userData ? (
          <p className="text-gray-700" style={{ fontSize: "12.2px" }}>
            <div className="grid grid-cols-2 gap-y-1  max-w-lg">
              <div>
                Outward Number:<strong>{userData.outwardnumber}</strong>
              </div>
              <div>
                Survey/Gut Number:{" "}
                <strong>{userData.gutnumber || "N/A"}</strong>
              </div>

              <div>
                Owner Name: <strong>{userData.name || "N/A"}</strong> 
              </div>
              <div>
                Phone Number: <strong>{userData.mobilenumber || "N/A"}</strong> 
              </div>

              {/* <div>
                <strong>Address:</strong> {userData.siteadress || "N/A"}
              </div> */}
              <div>
                Village: <strong>{userData.village || "N/A"}</strong> 
              </div>

              <div>
                Taluka: <strong>{userData.taluka || "N/A"}</strong> 
              </div>
              <div>
                District: <strong>{userData.district || "N/A"}</strong>
              </div>

              <div className="col-span-1">
                Pin Code: <strong>{userData.pincode || "N/A"}</strong> 
              </div>
            </div>
          </p>
        ) : (
          <p>No user data available</p>
        )}

        <h3 className="mt-2 mb-2" style={{ fontWeight: "bold" }}>
          2. Elevation Details
        </h3>
        <p className="text-gray-700 text-sm flex justify-start gap-36">
          <span>
            Zone: <strong>{aviationData?.zone || "N/A"}</strong>
          </span>
          <span>
            Elevation: <strong>{aviationData?.elevation || "N/A"}</strong>
          </span>
        </p>

        <h3 className="mt-3  mb-2" style={{ fontWeight: "bold" }}>
          3. Plot Coordinate and Elevation
        </h3>
      </div>

      <div style={containerStyle}>
        <div className="hide-scrollbar" style={leftColumnStyle}>
          <div style={tableStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={headerStyle}>
                  <th>Point Name</th>
                  {/* <th>Latitude</th>
                  <th>Longitude</th> */}
                  <th>Height</th>
                  <th>Longitude(DMS)</th>
                  <th>Latitude (DMS)</th>
                  <th>NDA Distance (km)</th>
                  <th>LOH Distance (km)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td style={cellStyle}>{item.P_name}</td>
                    {/* <td style={cellStyle}>{item.latitude.toFixed(4)}</td>
                    <td style={cellStyle}>{item.longitude.toFixed(4)}</td> */}
                    <td style={cellStyle}>{Math.floor(item.Height)}</td>
                    <td style={cellStyle}>{item.longitude_dms}</td>
                    <td style={cellStyle}>{item.latitude_dms}</td>
                    <td style={cellStyle}>
                      {item.distances_to_reference_points_km.NDA.toFixed(1)}
                    </td>
                    <td style={cellStyle}>
                      {item.distances_to_reference_points_km.loh.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={rightColumnStyle}>
          <div
            className="p-1 w-[100%] md:w-[95%] lg:w-[85%] h-[80vh] relative overflow-hidden"
            style={{ top: "-70px", left: "80px" }}
          >
            {/* Buttons with white shadow background */}
            <div className="flex justify-between space-x-1 mb-4 p-2 shadow-lg rounded-lg bg-white sticky top-0 z-10">
              <button
                onClick={() => setActiveMap("map1")}
                className={`px-9 py-1 text-sm rounded transition-all ${
                  activeMap === "map1"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                NDA-MAP
              </button>
              <button
                onClick={() => setActiveMap("map2")}
                className={`px-8 py-1 text-sm rounded transition-all ${
                  activeMap === "map2"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                LOHAGAON-MAP
              </button>
              <button
                onClick={() => setActiveMap("map3")}
                className={`px-6 py-1 text-sm rounded transition-all ${
                  activeMap === "map3"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                TOPOSHEET-MAP
              </button>
            </div>

            {/* Render the active map based on state */}
            <div className="h-[calc(100%-60px)] overflow-hidden">
              {activeMap === "map1" && (
                <MapComponent
                  cqlFilterZone={cqlFilterZone}
                  cqlFilterWard={cqlFilterWard1}
                  initialShowWMS1={false}
                  initialShowWMS2={true}
                  initialShowWMSPOINTS = {true}
                  initialShowWMS3={true}
                  initialtoposheet={false}
                  showLayerNames={true}
                />
              )}
              {activeMap === "map2" && (
                <MapComponent
                  cqlFilterZone={cqlFilterZone}
                  cqlFilterWard={cqlFilterWard2}
                  initialtosmtopo={true}
                  initialShowWMS1={false}
                  initialShowWMS2={true}
                  initialShowWMSPOINTS = {true}
                  initialShowWMS3={true}
                  initialtoposheet={false}
                  showLayerNames={true}
                />
              )}
              {activeMap === "map3" && (
                <MapComponent
                  cqlFilterZone={cqlFilterZone}
                  initialtosmtopo={false}
                  initialShowWMS1={false}
                  initialShowWMS2={true}
                  initialShowWMSPOINTS = {true}
                  initialShowWMS3={false}
                  initialtoposheet={true}
                  showLayerNames={true}
                />
              )}
            </div>
          </div>

          {/* <div style={noteStyle}>
            <span style={{ color: "#000000" }}>NOTE:</span> If some information
            appears to be incorrect. For the best accuracy and output, please
            review your Excel file, make the necessary corrections, and upload
            it again.
          </div> */}
          <div style={buttonContainerStyle}>
            <button style={backbuttonStyle} onClick={handleBackClick}>
              <i
                className="bi bi-arrow-left"
                style={{ color: "#2563eb", marginRight: "10px" }}
              ></i>
              Back
            </button>
            <button
              style={submitbuttonStyle}
              onClick={handleSubmit}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <>
                  Submit
                  <i
                    className="bi bi-file-earmark-text"
                    style={fileIconStyle}
                  ></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default DataTable;

