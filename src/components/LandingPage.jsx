import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import MapImage from "../assets/Basemap.png";
import MonarchImage from "../assets/monarch_logo.jpeg"; // Import your image
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main
        className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${MapImage})`,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Top Left Image */}
        <img
          src={MonarchImage}
          alt="Top Left Icon"
          className="absolute top-4 left-46 w-20 h-20 object-contain z-10"
        />

        <div className="max-w-4xl w-full text-center space-y-6 p-8 rounded-lg backdrop-blur-sm">
          <h1
            className=" font-bold  mb-2 text-transparent bg-clip-text bg-[linear-gradient(90deg,_#000000,_#3b82f6)]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              fontSize:"42px"
            }}
          >
            Welcome to Monarch MOD
          </h1>

          <p className="text-gray-700" style={{fontSize:"17.5px", marginBottom:"40px"}}>
            Monarch MOD (Memorandum of Deposit) provides a secure, transparent,
            and efficient platform for managing property pledges and deposits.
            Designed for both citizens and authorities, we ensure compliance,
            clarity, and peace of mind in every transaction.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/SurveyForm")}
              className=" w-40 border-2 border-blue-600 text-blue-600 px-6 rounded-md hover:bg-blue-50 transition-colors"
              style={{ height: "35px" }}
            >
              New Form
            </button>

            <button
              onClick={() => navigate("/FileUpload")}
              className="w-40 border-2 border-blue-600 text-blue-600 px-6 rounded-md transition-colors hover:bg-blue-50"
              style={{ height: "35px" }}
            >
              Form Data
            </button>
            <button
              onClick={() => navigate("/Certificate")}
              className="w-40 border-2 border-blue-600 text-blue-600 px-6 rounded-md transition-colors"
              style={{ height: "35px" }}
            >
              Get Certificate
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
