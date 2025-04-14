import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import MapComponent from "./mapcomponent";

const DataTable = ({ data, outwardNumber, jobNumber }) => {
  const cqlFilterZone = `outward = '${outwardNumber}' AND typeofsite = 'plot'`; // Define cqlFilterZone
  const cqlFilterWard1 = "Aviation_N = 'NDA'"; // Define cqlFilterWard if needed
  const cqlFilterWard2 = "Aviation_N = 'Lohagaon'";
  const location = useLocation();

  const [activeMap, setActiveMap] = useState("map1");

  console.log("DataTable - Received job number as prop:", jobNumber);
  console.log(
    "DataTable - Job number from location state:",
    location.state?.jobNumber
  );

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [aviationData, setAviationData] = useState([]);
  const [geometry, setGeometry] = useState(null);

  // Memoized data fetching function with improved error handling
  const fetchUserData = useMemo(
    () => async () => {
      if (!outwardNumber) return null;

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get_user/${outwardNumber}`,
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

  useEffect(() => {
    const fetchAviationData = async () => {
      if (!outwardNumber) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/get_aviation_data/${outwardNumber}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch geometry and aviation data");
        }

        const data = await response.json();

        // Set geometry and aviation data to state
        if (data.geometry) {
          setGeometry(data.geometry);
        }
        if (data.aviation_data) {
          setAviationData(data.aviation_data); // Update with array of zones
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

  // old
  const documentJobNumber = jobNumber || location.state?.jobNumber || "";

  const handleSubmit = async () => {
    //  old handlesubmit for submiting and processing file
    try {
      setIsGenerating(true);

      // const jobNumber = location.state?.jobNumber || '';
      console.log("Sending job number to API:", documentJobNumber);

      const generateResponse = await fetch(
        "http://127.0.0.1:5000/generate_doc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            outwardNumber,
            fileData: data,
            jobNumber: documentJobNumber,
          }),
        }
      );

      const result = await generateResponse.json();

      if (!generateResponse.ok) {
        throw new Error(result.error || "Failed to generate document");
      }

      if (result.success) {
        navigate("/pdf-viewer", {
          state: { outwardNumber, data, documentJobNumber },
        });
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

  const handleBackClick = () => {
    navigate("/LandingPage");
  };

  // Rest of styles
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    height: "24vh",
    marginTop: "150px",
    marginBottom: "10px",
  };

  const leftColumnStyle = {
    width: "50%",
    height: "250px",
    position: "relative",
    left: "20px",
    overflowY: "auto",
    top: "-150px",
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
    top: "-400px",
    height: "85vh",
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
    top: "-95px",
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
        style={{ position: "relative", left: "20px", top: "10px" }}
      >
        <div
          className="bg-gray-200 p-4 rounded-lg shadow-sm"
          style={{ width: "50vw", backgroundColor: "#f9f9f9", paddingBottom:"2px" }}
        >
          <h3
            className="mb-1 font-bold mt-[-10px] text-transparent bg-clip-text bg-[linear-gradient(to_right,_#000000,_#3b82f6,_#60a5fa)]"
            style={{ fontSize: "17px" }}
          >
            ❮ Application Details
          </h3>

          <hr
            className="h-[0.5px] mb-4 w-full rounded border-none"
            style={{
              // adjust based on your text length
              background:
                "linear-gradient(to right, #000000, #3b82f6, #60a5fa)",
            }}
          />

          {loading ? (
            <p>Loading user information...</p>
          ) : userData ? (
            <div
              className="rounded-lg p-2 max-w-2xl text-gray-700 text-sm shadow-lg"
              style={{
                background: "radial-gradient(circle at center,  #f4f4f4)",
              }}
            >
              <div className="grid grid-cols-2 gap-y-1">
                <div className="grid grid-cols-2">
                  <span
                    className="text-black whitespace-nowrap"
                    style={{ fontSize: "13px" }}
                  >
                    Outward Number:
                  </span>
                  <strong>{userData.outwardnumber}</strong>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-black whitespace-nowrap">
                    Survey/CTS/Plot No:
                  </span>
                  <strong>{userData.gutnumber || "N/A"}</strong>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-black whitespace-nowrap">
                    Owner Name:
                  </span>
                  <strong>{userData.name || "N/A"}</strong>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-black whitespace-nowrap">
                    Phone Number:
                  </span>
                  <strong>{userData.mobilenumber || "N/A"}</strong>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-black whitespace-nowrap">Village:</span>
                  <strong>{userData.village || "N/A"}</strong>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-black whitespace-nowrap">Taluka:</span>
                  <strong>{userData.taluka || "N/A"}</strong>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-black whitespace-nowrap">
                    District:
                  </span>
                  <strong>{userData.district || "N/A"}</strong>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-black whitespace-nowrap">
                    Pin Code:
                  </span>
                  <strong>{userData.pincode || "N/A"}</strong>
                </div>
              </div>
            </div>
          ) : (
            <p>No user data available</p>
          )}

          <h3
            className="mt-2 mb-2 font-bold text-transparent bg-clip-text bg-[linear-gradient(to_right,_#000000,_#3b82f6,_#60a5fa)]"
            style={{ fontSize: "17px" }}
          >
            ❮ Elevation Details
          </h3>
          <hr
            className="h-[0.5px] mb-4 w-full rounded border-none"
            style={{
              // adjust based on your text length
              background:
                "linear-gradient(to right, #000000, #3b82f6, #60a5fa)",
            }}
          />
          <div
            className="rounded-lg p-4 shadow-lg mb-4"
            style={{
              background: "radial-gradient(circle at center,#e5e5e5, #f4f4f4)",
            }}
          >
            <p className="text-gray-700 text-sm flex justify-between">
              <span className="w-1/2">
                <span className="text-black">Zone:</span>{" "}
                <strong>
                  {aviationData.length > 0
                    ? aviationData.map((item) => item.zone).join(", ")
                    : "N/A"}
                </strong>
              </span>
              <span className="w-1/2">
                <span className="text-black">Elevation:</span>{" "}
                <strong>
                  {aviationData.length > 0
                    ? aviationData.map((item) => item.elevation).join(", ")
                    : "N/A"}
                </strong>
              </span>
            </p>
          </div>
        </div>
      </div>
      <h3
        className="mb-1 font-bold mt-[15px] ms-6  text-transparent bg-clip-text bg-[linear-gradient(to_right,_#000000,_#3b82f6,_#60a5fa)]"
        style={{ fontSize: "17px" }}
      >
        ❮ Plot Coordinate and Elevation
      </h3>

      <div style={containerStyle}>
        <div className="hide-scrollbar" style={leftColumnStyle}>
          <div style={tableStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={headerStyle}>
                  <th>Point Name</th>
                  {/* <th>Latitude</th>
                  <th>Longitude</th> */}

                  <th>Longitude(DMS)</th>
                  <th>Latitude (DMS)</th>
                  <th>Height</th>
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

                    <td style={cellStyle}>{item.longitude_dms}</td>
                    <td style={cellStyle}>{item.latitude_dms}</td>
                    <td style={cellStyle}>{Math.floor(item.Height)}</td>
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
            className=" maps p-1 w-[100%] md:w-[95%] lg:w-[90%] relative overflow-hidden"
            style={{ top: "-80px", left: "50px" }}
          >
            {/* Buttons with white shadow background */}
            <div className="flex justify-between space-x-1 mb-4 p-2 shadow-lg rounded-lg bg-white sticky top-0 z-10">
              <button
                onClick={() => setActiveMap("map1")}
                className={`px-6 py-1 text-sm rounded transition-all ${
                  activeMap === "map1"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                NDA-MAP
              </button>
              <button
                onClick={() => setActiveMap("map2")}
                className={`px-4 py-1 text-sm rounded transition-all ${
                  activeMap === "map2"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                LOHAGAON-MAP
              </button>
              <button
                onClick={() => setActiveMap("map3")}
                className={`px-3 py-1 text-sm rounded transition-all ${
                  activeMap === "map3"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                TOPOSHEET-MAP
              </button>

              <button
                onClick={() => setActiveMap("map4")}
                className={`px-3 py-1 text-sm rounded transition-all ${
                  activeMap === "map4"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                CCZM-MAP
              </button>
            </div>

            {/* Render the active map based on state */}
            <div className="h-[calc(100%-60px)] overflow-hidden">
              {activeMap === "map1" && (
                <MapComponent
                  className="map-container"
                  cqlFilterZone={cqlFilterZone}
                  cqlFilterWard={cqlFilterWard1}
                  initialShowWMS1={false}
                  initialShowWMS2={true}
                  initialShowWMSPOINTS={true}
                  initialShowWMS3={true}
                  initialtoposheet={false}
                  showLayerNames={true}
                />
              )}

              {activeMap === "map2" && (
                <MapComponent
                  className="map-container"
                  cqlFilterZone={cqlFilterZone}
                  cqlFilterWard={cqlFilterWard2}
                  initialtosmtopo={true}
                  initialShowWMS1={false}
                  initialShowWMS2={true}
                  initialShowWMSPOINTS={true}
                  initialShowWMS3={true}
                  initialtoposheet={false}
                  showLayerNames={true}
                />
              )}

              {activeMap === "map3" && (
                <MapComponent
                  className="map-container"
                  cqlFilterZone={cqlFilterZone}
                  initialtosmtopo={false}
                  initialShowWMS1={false}
                  initialShowWMS2={true}
                  initialShowWMSPOINTS={true}
                  initialShowWMS3={false}
                  initialtoposheet={true}
                  showLayerNames={true}
                />
              )}

              {activeMap === "map4" && (
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
                  Confirm and Save
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
