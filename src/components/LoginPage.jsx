import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate hook

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    // Check if both email and password are filled
    if (email && password) {
      // If valid, navigate to file upload page
      navigate("/LandingPage"); 
    }
    // If not valid, do nothing (form will not submit or rerender)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">
            Upload your Excel file to preview and process the data.
          </p>
          <hr className="border-t border-gray-300 mt-4" />
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md shadow-gray-400 p-6">
          <h3 className="text-xl font-semibold text-center mb-2">
            Login to Your Account
          </h3>
          <p className="text-center text-sm text-gray-600 mb-6">
            Fields marked with [<span className="text-red-600">*</span>] are
            mandatory.*
          </p>
          <hr
            className="border-t border-blue-300"
            style={{ marginTop: "-5px", marginBottom: "10px" }}
          />

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1">
                Email ID<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your Email ID"
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {email && (
                  <X
                    className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setEmail("")}
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-gray-600">
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-300 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
              disabled={!email || !password} // Disable button if any field is missing
            >
              LOGIN
            </button>

            <div className="text-center">
              <a href="#" className="text-blue-500 hover:text-blue-600">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
