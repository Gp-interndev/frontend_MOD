  import React, { useState, useEffect } from 'react';
  import { useNavigate, useLocation } from 'react-router-dom';

  const PDFViewer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    
    // Get the data and outwardNumber from location state
    const { outwardNumber, data } = location.state || {};

    useEffect(() => {
      document.body.style.overflowY = 'auto';
      return () => {
        document.body.style.overflowY = 'hidden';
      };
    }, []);

    const handleDownload = () => {
      if (!outwardNumber) {
        alert('Outward number not found!');
        return;
      }
      window.location.href = `http://localhost:5000/download-pdf/${outwardNumber}`;   //http://localhost:5000/download-pdf/${outwardNumber}
    };

    const handleBack = () => {
      navigate("/FileUpload", { 
        replace: true,
        state: { 
          outwardNumber,
          data,
          fromPdfViewer: true  // Add a flag to indicate where we're coming from
        } 
      });
    };

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Document Preview</h2>
              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center px-4  text-blue-600 bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors" style={{height:"35px"}}
                >
                  <i className="bi bi-arrow-left mr-2"></i>
                  Back
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center px-3  text-white bg-gradient-to-r from-blue-400 to-blue-600 rounded-md shadow-md hover:from-blue-500 hover:to-blue-700 transition-colors" style={{height:"35px"}}
                >
                  <i className="bi bi-download mr-2"></i>
                  Download PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="w-full h-[800px] relative">
                <iframe
                  src={`http://localhost:5000/view-pdf`}  //http://localhost:5000/view-pdf
                  className="w-full h-full border-0"
                  title="PDF Preview"
                  onLoad={() => setLoading(false)}
                />
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  export default PDFViewer;





  // const handleSubmit = async () => {
  //   try {
  //     setIsGenerating(true);

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
  //     console.error("Document Generation Error:", error);
  //     alert("Error generating document: " + error.message);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };