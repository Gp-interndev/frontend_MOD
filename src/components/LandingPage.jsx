import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import MapImage from "../assets/Basemap.png";
import { useNavigate } from "react-router-dom";



const LandingPage = () => {
     const navigate = useNavigate();
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main 
          className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage:`url(${MapImage})`,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            // backgroundBlend: 'overlay'
            
          }}
        >
          <div className="max-w-4xl w-full text-center space-y-6  p-8 rounded-lg backdrop-blur-sm">
            <h1 className="text-5xl font-bold text-gray-900 mb-4" style={{textAlign:"center"}}>
            Memorandum of Deposit
            </h1>
            
            <p className="text-xl text-gray-700 mb-8">
              Access land and building details, expenses, completion records, and more, all in one place.
            </p>
            
            <div className="flex justify-center gap-4">
              <button  onClick={() => navigate("/SurveyForm")} className="bg-blue-600 text-white px-6 rounded-md hover:bg-blue-700 transition-colors"  style={{height:'35px'}}>
                New Form
              </button>
              <button onClick={() => navigate("/FileUpload")} className="border-2 border-blue-600 text-blue-600 px-6  rounded-md hover:bg-blue-50 transition-colors" style={{height:'35px'}}>
                Forward Form Data
              </button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  };
  
  export default LandingPage;