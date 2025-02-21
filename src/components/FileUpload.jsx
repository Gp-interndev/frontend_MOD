import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import excelicon from "../assets/file-excel.png";
import uploadIcon from "../assets/UploadIcon.svg";
import { Trash, Search } from "lucide-react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [buttonText, setButtonText] = useState("Upload File");
  const [fileName, setFileName] = useState("");
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [userName, setUserName] = useState("");
  const [outwardNumber, setOutwardNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();
  const [navigationTimeout, setNavigationTimeout] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "text/csv" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsFileUploaded(true);
      setButtonText("Re-upload File");
    } else {
      alert("Please upload a valid .csv or .xlsx file");
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      fileInputRef.current.click();
    }
  };

  const handleReuploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteClick = () => {
    if (isProcessing) {
      setIsCanceling(true);
      // Clear the navigation timeout to prevent page change
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
      // Reset states after a brief delay to show the red cancel state
      setTimeout(() => {
        setShowProgressBar(false);
        setIsProcessing(false);
        setIsCanceling(false);
        setFile(null);
        setFileName("");
        setIsFileUploaded(false);
        setButtonText("Upload File");
        fileInputRef.current.value = "";
      }, 500);
    } else {
      setFile(null);
      setFileName("");
      setIsFileUploaded(false);
      setButtonText("Upload File");
      fileInputRef.current.value = "";
    }
  };

  const handleOutwardNumberChange = (e) => {
    setOutwardNumber(e.target.value);
  };

  const handleNextClick = () => {
    if (isFileUploaded && outwardNumber.trim()) {
      setShowProgressBar(true);
      setIsProcessing(true);
      const timeout = setTimeout(() => {
        navigate("/next-step", {
          state: { file: file, outwardNumber: outwardNumber },
        });
      }, 2000);
      setNavigationTimeout(timeout);
    } else if (!outwardNumber.trim()) {
      alert("Please enter an outward number");
    }
  };

  const getDeleteButtonClasses = () => {
    if (isProcessing && !isCanceling) {
      return "text-blue-500 hover:text-blue-600"; // Blue during processing
    }
    if (isCanceling) {
      return "text-red-500 hover:text-red-600"; // Red when canceling
    }
    return "text-red-500 hover:text-red-600"; // Default red
  };

  // fetch the username using a out word number
  const handleGetUser = async () => {
    if (!outwardNumber.trim()) {
      alert("Please enter an outward number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://mod.dpzoning.com/api/get_user/${outwardNumber}`,  //http://127.0.0.1:5000/get_user/${outwardNumber}
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
      console.log("Fetched Data:", data); // Debugging

      if (data?.user) {
        setUserName(data.user.name);
        setOutwardNumber(data.user.outwardnumber);
      } else {
        alert("No user found for this outward number");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("Error fetching user details: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-md shadow-gray-400 rounded-lg p-6 max-w-md w-full text-center">
          <h2
            className="text-lg font-bold text-gray-800 mb-0 text-start"
            style={{ fontSize: "20px", marginTop: "-10px" }}
          >
            {isProcessing
              ? "Processing Your File..."
              : isFileUploaded
              ? "File Uploaded Successfully"
              : "Upload Your File"}
          </h2>
          <p
            className="text-gray-600 mb-6 text-justify"
            style={{ fontSize: "12.8px" }}
          >
            {isProcessing
              ? "Your file is currently being parsed, and the data is being extracted for processing. Please hold on as we gather the information for you."
              : isFileUploaded
              ? "Your file has been uploaded from Windows. Proceed to preview and process the data."
              : "Upload your Excel file to begin processing and mapping your land details. Ensure your file is in the correct format for smooth processing."}
          </p>

          {/* Outward Number Input Field */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="flex-grow border border-gray-300 rounded-lg p-3 bg-white">
                <input
                  type="text"
                  value={outwardNumber}
                  onChange={handleOutwardNumberChange}
                  placeholder="Enter Outward Number"
                  className="w-full text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={handleGetUser}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Show User Name After Fetch */}
          {userName && (
            <div className="mt-1 mb-2 p-3 bg-gray-100 border rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                User Name: {userName}
              </p>
            </div>
          )}

          <div className="border-gray-300 rounded-lg p-4 bg-gray-50 mb-6 flex flex-col items-center">
            <img
              src={excelicon}
              alt="Excel Logo"
              className="w-6 h-6 mx-auto mb-1"
            />
            <p className="text-sm text-dark text-center">
              {isFileUploaded ? fileName : "Drag and drop your Excel file here"}
            </p>
            <p className="text-xs text-gray-400 mt-1 text-center">
              {isProcessing
                ? "Please hold on while we extract the information."
                : isFileUploaded
                ? "Click 'Next' to preview and process the data."
                : "Only .xlsx format files are supported for upload."}
            </p>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx"
              onChange={handleFileChange}
            />

            {showProgressBar ? (
              <div
                className="progress w-full mt-3"
                role="progressbar"
                aria-label="Example 20px high"
                aria-valuenow="50"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ height: "20px", backgroundColor: "#e0e0e0" }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: "0%",
                    backgroundColor: "blue",
                    height: "100%",
                    transition: "width 2s ease-in-out",
                  }}
                  ref={(el) => {
                    if (el) {
                      setTimeout(() => {
                        el.style.width = "100%";
                      }, 200);
                    }
                  }}
                ></div>
              </div>
            ) : (
              <button
                className="flex items-center justify-center w-1/3 bg-white-500 text-dark border py-1 rounded-lg text-sm mt-4"
                onClick={
                  isFileUploaded ? handleReuploadClick : handleUploadClick
                }
              >
                <img
                  src={uploadIcon}
                  alt="Upload Icon"
                  className="w-4 h-4 mr-2"
                />
                {buttonText}
              </button>
            )}
          </div>

          <div className="flex justify-between gap-4 w-full">
            <button
              className={`flex items-center justify-center w-1/2 bg-white py-2 px-4 rounded-lg text-sm shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 ${getDeleteButtonClasses()}`}
              onClick={handleDeleteClick}
            >
              {isProcessing ? (
                <>Cancel</>
              ) : (
                <>
                  Delete
                  <Trash className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            <button
              className={`flex items-center justify-center w-1/2 bg-blue-300 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-all duration-200 ${
                isFileUploaded && outwardNumber.trim()
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleNextClick}
              disabled={
                !isFileUploaded || isProcessing || !outwardNumber.trim()
              }
            >
              Next →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FileUpload;
