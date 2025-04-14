import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SurveyForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    nameOnCertificate: "",
    gstNumber: "",
    panNumber: "",
    siteAddress: "",
    gutNumber: "",
    district: "",
    taluka: "",
    village: "",
    pincode: "",
    correspondenceAddress: "",
  });

  const [errors, setErrors] = useState({});
  // const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState(null); // success or error

  const validateField = (name, value) => {
    // Simply check if required fields have values
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the error if there's any existing error for the field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Skip validation for empty optional fields
    if (
      (name === "gstNumber" || name === "panNumber" || name === "gutNumber") &&
      !value
    ) {
      return;
    }

    // Validate the field if necessary
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Iterate over each key in formData
    Object.keys(formData).forEach((key) => {
      // Skip validation for empty optional fields
      if (
        (key === "gstNumber" || key === "panNumber" || key === "gutNumber") &&
        !formData[key]
      ) {
        return;
      }

      // Validate other fields
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Set the errors state with the new errors object
    setErrors(newErrors);

    // Return true if no errors are found, otherwise false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPopupType(null);
    setPopupMessage(null);

    if (!validateForm()) {
      setPopupType("error");
      setPopupMessage("Please fill the required fields in the form.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/save_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          mobilenumber: formData.mobileNumber,
          nameoncertificate: formData.nameOnCertificate,
          gstnumber: formData.gstNumber,
          pannumber: formData.panNumber,
          siteaddress: formData.siteAddress,
          gutnumber: formData.gutNumber,
          district: formData.district,
          taluka: formData.taluka,
          village: formData.village,
          pincode: formData.pincode,
          correspondanceadress: formData.correspondenceAddress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPopupType("success");
        setPopupMessage(`Outward Number: ${data.outwardnumber}`);

        setFormData({
          name: "",
          mobileNumber: "",
          nameOnCertificate: "",
          gstNumber: "",
          panNumber: "",
          siteAddress: "",
          gutNumber: "",
          district: "",
          taluka: "",
          village: "",
          pincode: "",
          correspondenceAddress: "",
        });
      } else {
        setPopupType("error");
        setPopupMessage(
          data.error || "An error occurred while submitting the form."
        );
      }
    } catch (error) {
      setPopupType("error");
      setPopupMessage("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div
        className="max-w-4xl mx-auto rounded-lg shadow-lg px-2"
        style={{ height: "96vh", backgroundColor: "#f9f9f9" }}
      >
        <div className="p-1">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
            SURVEY INFORMATION FORM
          </h2>
          <hr className="border-t border-blue-200 mb-4 w-1/2 mx-auto" />

          <p
            className="text-center text-sm text-gray-600 mb-6 leading-relaxed mx-auto"
            style={{ maxWidth: "700px" }}
          >
            Fill in the required details to submit a new property survey
            request. Ensure all information is accurate to avoid processing
            delays. Once submitted, your application will be recorded and
            reviewed by Monarch officials.
          </p>

          <div className="form">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Certificate (This name will be printed on the certificate)
                    </label>
                    <input
                      type="text"
                      name="nameOnCertificate"
                      value={formData.nameOnCertificate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter name for certificate"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Survey/CTS/Plot No (Optional)
                    </label>
                    <input
                      type="text"
                      name="gutNumber"
                      value={formData.gutNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter Survey/CTS/Plot No if applicable"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Village
                    </label>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter village"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taluka
                    </label>
                    <input
                      type="text"
                      name="taluka"
                      value={formData.taluka}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter taluka"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter district"
                    />
                  </div>
                </div>

                {/* Identity Information Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter GST number if applicable"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter Pan number if applicable"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter pincode"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Site Address
                    </label>
                    <input
                      type="text"
                      name="siteAddress"
                      value={formData.siteAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter SiteAddress"
                    />
                  </div>
                  {/* Address Fields - Full Width */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correspondence Address
                    </label>
                    <input
                      type="text"
                      name="correspondenceAddress"
                      value={formData.correspondenceAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-gray-100 border border-blue-300 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.6)] focus:outline-none"
                      placeholder="Enter correspondence address"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4" style={{ position: "relative", top: "-15px" }}>
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => navigate("/LandingPage")}
                  className="w-36 h-10 flex items-center justify-center gap-2 px-4 text-sm font-medium text-gray-700 border border-gray-400 bg-white rounded-lg transition duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <i className="bi bi-arrow-left"></i>
                  Back
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-36 h-10 px-4 text-sm font-medium text-white rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, #3b82f6, #60a5fa)`, // Blue-500 to Blue-400
                  }}
                >
                  Submit
                </button>
              </div>
            </form>

            {popupMessage && (
              <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
                <div
                  className={`bg-white p-6 rounded-lg shadow-lg ${
                    popupType === "success"
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                  style={{ width: "20vw" }}
                >
                  <h3
                    className={`text-lg font-semibold ${
                      popupType === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {popupType === "success" ? "Success!" : "Error!"}
                  </h3>
                  <p className="mt-2">{popupMessage}</p>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => {
                        setPopupMessage(null);
                        if (popupType === "success") {
                          navigate("/LandingPage"); // replace with your desired route
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
