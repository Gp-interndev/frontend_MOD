import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import NextStep from './components/NextStep';
import SurveyForm from './components/SurveyForm';
import LandingPage from './components/LandingPage';
import PDFViewer from './components/PDFViewer';
import MapViewer from './components/MapViewer';



function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/DataTable" element={<DataTable />} />
        <Route path="/next-step" element={<NextStep />} />
        <Route path="/SurveyForm" element={<SurveyForm/>}/>
        <Route path="/LandingPage" element={<LandingPage/>}/>
        <Route path="/pdf-viewer" element={<PDFViewer/>}/> 
        <Route path="/map-viewer" element={<MapViewer/>}/> 
      </Routes>
    </Router>
  );
}

export default App;
