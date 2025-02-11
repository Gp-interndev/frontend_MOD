import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import propimage from "../assets/Property.png";

const PleaseWait = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center">
          {/* Heading */}
          <h1 className="text-4xl font-bold text-blue-500 mb-4">
            Please Wait
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-12 max-w-xl mx-auto" style={{fontSize:"16.5px"}}>
            We are in the process of submitting your information. This may take
            a moment. Please don't close the page while we finalize your
            submission. Thank you for your patience!
          </p>

          {/* Illustration */}
          <div className="mb-12">
            <img
              src={propimage}
              alt="Form submission illustration"
              className="mx-auto w-52"
            />
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-lg mx-auto">
            <div className="h-4 bg-gray-200 overflow-hidden" style={{borderRadius:"5px"}}>
              <div
                className="h-full bg-blue-500  transition-all duration-300 ease-out"
                style={{ width: `${progress}%`, borderRadius:'5px' }}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PleaseWait;
