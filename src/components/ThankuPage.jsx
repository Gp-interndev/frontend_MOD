import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import amicoimg from "../assets/amico.png";
import Taskdone from "../assets/Taskdone.png"; 
import ViewIcon from "../assets/ViewIcon.png"; 

const ThankuPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-blue-500 mb-4">
            Thank You!
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-12 max-w-xl mx-auto" style={{ fontSize: "16.5px" }}>
            We have successfully received your information. Our team will review the
            details, and you will be notified if any further action is needed. We appreciate
            your effort in providing accurate data!
          </p>

          {/* Illustration */}
          <div className="mb-12">
            <img
              src={amicoimg}
              alt="Success illustration"
              className="mx-auto w-56"
              style={{ position: 'relative', top: '-30px' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 max-w-md mx-auto">
            <button 
              className="w-80 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              style={{
                position: "relative",
                left: '65px',
                top: "-50px"
              }}
            >
              <span>Submit Another Form</span>
              <img 
                src={Taskdone} 
                alt="Submit Icon" 
                className="w-5 h-5" // Same size as previous icon
              />
            </button>
            
            <button 
              className="w-80 py-2 text-blue-500 bg-white border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              style={{
                position: "relative",
                left: "65px",
                top: "-50px"
              }}
            >
              <span>View Submitted Details</span>
              <img 
                src={ViewIcon} 
                alt="View Icon" 
                className="w-5 h-5" // Same size as previous icon
              />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankuPage;
