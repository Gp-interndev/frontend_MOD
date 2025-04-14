import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import NextStep from './components/NextStep';
import SurveyForm from './components/SurveyForm';
import LandingPage from './components/LandingPage';
import PDFViewer from './components/PDFViewer';
import MapPage from './components/MapPage';
import Certificate from './components/Certificate';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/DataTable" element={<DataTable />} />
        <Route path="/next-step" element={<NextStep />} />
        <Route path="/SurveyForm" element={<SurveyForm/>}/>
        <Route path="/LandingPage" element={<LandingPage/>}/>
        <Route path="/pdf-viewer" element={<PDFViewer/>}/>
        <Route path="/MapPage" element={<MapPage/>}/>
        <Route path="/Certificate" element={<Certificate/>}/>

        
        
      </Routes>
    </Router>
  );
}

export default App;
