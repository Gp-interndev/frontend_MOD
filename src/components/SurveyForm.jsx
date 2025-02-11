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
    switch (name) {
      case "mobileNumber":
        return /^[0-9]{10}$/.test(value)
          ? ""
          : "Please enter a valid 10-digit mobile number";
      case "pincode":
        return /^[0-9]{6}$/.test(value)
          ? ""
          : "Please enter a valid 6-digit pincode";
      // case "panNumber":
      //   return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
      //     ? ""
      //     : "Please enter a valid PAN number (if applicable)";
      // case "gstNumber":
      //   if (!value) return ""; // Optional field
      //   return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      //     value
      //   )
      //     ? ""
      //     : "Please enter a valid GST number (if applicable)";
      case "name":
      case "nameOnCertificate":
        return /^[A-Za-z\s]+$/.test(value)
          ? ""
          : "Please enter valid name (letters only)";
      default:
        return value.trim()
          ? ""
          : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
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

    // Skip validation for empty gstNumber or panNumber fields
    if ((name === "gstNumber" || name === "panNumber") && !value) {
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
      // Skip validation for empty gstNumber and panNumber fields
      if ((key === "gstNumber" || key === "panNumber") && !formData[key]) {
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
          siteadress: formData.siteAddress,
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
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg ">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            Survey Information Form
          </h2>

          <div className="scrollable-form">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.name
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.mobileNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter mobile number"
                    />
                    {errors.mobileNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Certificate
                    </label>
                    <input
                      type="text"
                      name="nameOnCertificate"
                      value={formData.nameOnCertificate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.nameOnCertificate
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter name for certificate"
                    />
                    {errors.nameOnCertificate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.nameOnCertificate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Identity Information Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number (If Applicable)
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.gstNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter GST number if applicable"
                    />
                    {errors.gstNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.gstNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number (If Applicable)
                    </label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.panNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter PAN number"
                    />
                    {errors.panNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.panNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gut Number
                    </label>
                    <input
                      type="text"
                      name="gutNumber"
                      value={formData.gutNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.gutNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter gut number"
                    />
                    {errors.gutNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.gutNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location Details Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.district
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter district"
                    />
                    {errors.district && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.district}
                      </p>
                    )}
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
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.taluka
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter taluka"
                    />
                    {errors.taluka && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.taluka}
                      </p>
                    )}
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
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                        errors.village
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200"
                      }`}
                      placeholder="Enter village"
                    />
                    {errors.village && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.village}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Fields - Full Width */}
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Address
                  </label>
                  <input
                    type="text"
                    name="siteAddress"
                    value={formData.siteAddress}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.siteAddress
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                    placeholder="Enter site address"
                  />
                  {errors.siteAddress && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.siteAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correspondence Address
                  </label>
                  <input
                    type="text"
                    name="correspondenceAddress"
                    value={formData.correspondenceAddress}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.correspondenceAddress
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                    placeholder="Enter correspondence address"
                  />
                  {errors.correspondenceAddress && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.correspondenceAddress}
                    </p>
                  )}
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
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.pincode
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                    placeholder="Enter pincode"
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
              <div
                className="flex justify-end gap-4"
                style={{ position: "relative", top: "-5px", left: "-4px" }}
              >
                {/* Back Button */}
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 18px",
                    fontSize: "14px",
                    color: "#2563eb",
                    backgroundColor: "transparent",
                    border: "2px solid #2563eb",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.6s ease-in-out",
                  }}
                  onClick={() => navigate("/LandingPage")} // Navigates back to the previous page
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#ebf2ff")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <i
                    className="bi bi-arrow-left"
                    style={{ marginRight: "8px" }}
                  ></i>{" "}
                  Back
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-colors duration-200"
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
                        setPopupMessage(null); // Close the popup
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
