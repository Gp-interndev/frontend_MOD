
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DataTable from "./DataTable";

const NextStep = () => {
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (!location.state?.file) {
        setError("No file uploaded");
        return;
      }

      const formData = new FormData();
      formData.append('file', location.state.file);

      try {
        const response = await fetch("http://127.0.0.1:5000/process_csv", { 
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        console.log("Fetched data:", jsonData);

        if (jsonData && jsonData.decimal_degrees) {
          setFileData(jsonData.decimal_degrees);
        } else {
          setError('Invalid data format');
        }
      } catch (error) {
        console.error("Error fetching the data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [location.state?.file]);

  console.log("NextStep - Passing job number to DataTable:", location.state?.jobNumber);

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileData ? (
        <DataTable 
          data={fileData} 
          outwardNumber={location.state?.outwardNumber} // Pass outward number
          jobNumber={location.state?.jobNumber}
          
          
        />
        
      ) : (
        <p></p>
      )}
      
    </div>
  );
};

export default NextStep;
