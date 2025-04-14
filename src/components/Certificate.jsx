import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import fluent1 from "../assets/fluent1.png";
import fluent2 from "../assets/fluent2.png";
import fluent3 from "../assets/fluent3.png";
import fluent4 from "../assets/fluent4.png";
import arrow from "../assets/arrow-left.png";
import { toast } from "react-toastify";

const Certificate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [gutnumber, setgutNumber] = useState("");
  const [nameOnCertificate, setNameOnCertificate] = useState("");
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleArrowClick = () => {
    navigate("/LandingPage");
  };

  const handleSearch = async () => {
    if (!applicationNumber) return;

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get_user/${applicationNumber}`
      );
      const data = await response.json();

      if (response.ok && data.user) {
        setgutNumber(data.user.gutnumber || "");
        setNameOnCertificate(data.user.nameoncertificate || "");
        setApplicantName(data.user.name || "");
        setCertificateGenerated(true);
      } else {
        toast.error("No user found with this Application Number.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setApplicationNumber("");
    setApplicantName("");
    setgutNumber("");
    setNameOnCertificate("");
    setCertificateGenerated(false);
    setShowPdfViewer(false);
    setPdfUrl("");
  };

  const handleViewModPdf = async () => {
    if (!applicationNumber) return;

    try {
      const pdfFileUrl = `http://127.0.0.1:5000/api/pdf/${applicationNumber}`;

      // Try fetching the PDF first to verify it exists
      const response = await fetch(pdfFileUrl);

      if (response.ok) {
        setPdfUrl(pdfFileUrl);
        setShowPdfViewer(true);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to load PDF");
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      toast.error("Something went wrong while loading PDF.");
    }
  };

  const handleClosePdf = () => {
    setShowPdfViewer(false);
    setPdfUrl("");
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/Modpdf-download/${applicationNumber}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `MOD_${applicationNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const handleRunBat = async () => {
    try {
      const response = await fetch("http://localhost:5000/run-bat");
      const data = await response.json();
      if (data.success) {
        alert("BAT file started!");
      } else {
        alert("Failed to run BAT file: " + data.error);
      }
    } catch (error) {
      alert("Error calling backend: " + error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="p-4">
        <div className="flex items-start gap-2 mt-[-20px]">
          <div
            onClick={handleArrowClick}
            className="w-8 h-9 bg-gray-200 flex items-center justify-center rounded mt-1.5 cursor-pointer"
          >
            <img src={arrow} alt="arrow" className="w-6 h-6" />
          </div>
          <div className="flex flex-col w-fit">
            <span className="text-blue-600 font-medium text-[19px]">
              Get Certificate Report
            </span>
            <span className="text-gray-700 text-[12px] whitespace-nowrap">
              Retrieve your approved document
            </span>
          </div>
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-gray-200 p-4 rounded-lg shadow-sm mx-auto">
          <h3 className="font-medium mb-1 mt-[-10px]">
            Find Application Details:
          </h3>

          <div>
            {certificateGenerated ? (
              <>
                {/* First Row */}
                <div className="flex flex-col md:flex-row md:gap-x-3 gap-y-2 mb-2">
                  <div className="w-full md:w-2/5">
                    <label className="block text-sm mb-1">
                      Application Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-blue-500  p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderRadius: "8px" }}
                      value={applicationNumber}
                      onChange={(e) => setApplicationNumber(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="block text-sm mb-1">
                      Applicant Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderRadius: "8px" }}
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Second Row with Button */}
                <div className="flex flex-col md:flex-row md:gap-x-3 gap-y-2 items-end">
                  <div className="w-full md:w-2/5">
                    <label className="block text-sm mb-1">Gut Number</label>
                    <input
                      type="text"
                      className="w-full border border-blue-500  p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderRadius: "8px" }}
                      value={gutnumber}
                      onChange={(e) => setgutNumber(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-2/5">
                    <label className="block text-sm mb-1">
                      Name on Certificate
                    </label>
                    <input
                      type="text"
                      className="w-full border border-blue-500 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ borderRadius: "8px" }}
                      value={nameOnCertificate}
                      onChange={(e) => setNameOnCertificate(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <button
                      onClick={handleClearAll}
                      className="w-full md:w-auto px-3 py-1 text-red-500 border border-red-200 rounded-md hover:bg-red-50"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-2/5">
                  <label className="block text-sm mb-1">
                    Application Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
                    style={{ borderRadius: "8px" }}
                    value={applicationNumber}
                    onChange={(e) => setApplicationNumber(e.target.value)}
                    placeholder="Enter a application number"
                  />
                </div>
                <div className="w-full md:w-2/5">
                  <label className="block text-sm mb-1">
                    Applicant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border p-1 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
                    style={{ borderRadius: "8px" }}
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Please enter applicant name"
                  />
                </div>
                <div className="w-full md:w-1/5">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full p-2 text-gray-700 bg-white hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    style={{ borderRadius: "8px" }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center whitespace-nowrap">
                        <span className="text-xs">Please Wait</span>
                        <div className="ml-1 animate-spin rounded-full h-3 w-3 border-t-2 border-gray-500"></div>
                      </div>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* child cards */}
        <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 px-4">
          <div
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col items-center justify-center text-center 
             cursor-pointer hover:shadow-lg hover:bg-blue-50 hover:scale-[1.02] transition-all duration-200 ease-in-out active:scale-100"
            onClick={handleViewModPdf}
          >
            <img src={fluent1} alt="New Survey" className="w-10 h-10 mb-2" />
            <span className="text-sm font-medium">
              Generate
              <br />
              Mod PDF
            </span>
          </div>

          <div
            onClick={handleRunBat}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col items-center justify-center text-center 
             cursor-pointer hover:shadow-lg hover:bg-blue-50 hover:scale-[1.02] transition-all duration-200 ease-in-out active:scale-100"
          >
            <img
              src={fluent2}
              alt="Update Details"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">
              Generate
              <br />
              NDA Map
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col items-center justify-center text-center 
             cursor-pointer hover:shadow-lg hover:bg-blue-50 hover:scale-[1.02] transition-all duration-200 ease-in-out active:scale-100">
            <img
              src={fluent3}
              alt="Check Certificate"
              className="w-10 h-10 mb-2"
            />
            <span className="text-sm font-medium">
              Generate
              <br />
              Lohgaon Map
            </span>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col items-center justify-center text-center 
             cursor-pointer hover:shadow-lg hover:bg-blue-50 hover:scale-[1.02] transition-all duration-200 ease-in-out active:scale-100">
            <img src={fluent4} alt="Get Report" className="w-10 h-10 mb-2" />
            <span className="text-sm font-medium">
              Generate
              <br />
              CCZM Map
            </span>
          </div>
        </div>

        {/* PDF Viewer Modal */}
        {showPdfViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col"
              style={{ height: "90vh" }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium">
                  MOD PDF- Application Number-{applicationNumber}
                </h3>
                <button
                  onClick={handleClosePdf}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex-grow p-4">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title="PDF Viewer"
                />
              </div>
              <div className="p-4 border-t flex justify-end space-x-2">
                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleClosePdf}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Certificate;
