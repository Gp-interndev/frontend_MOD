import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import NextStep from './components/NextStep';
import PleaseWait from './components/PleaseWait';
import ThankuPage from './components/ThankuPage';
import SurveyForm from './components/SurveyForm';
import LandingPage from './components/LandingPage';
import Document from './components/Document';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/DataTable" element={<DataTable />} />
        <Route path="/next-step" element={<NextStep />} />
        <Route path="/pleasewait" element={<PleaseWait/>}/>
        <Route path="/ThankuPage" element={<ThankuPage/>}/>
        <Route path="/SurveyForm" element={<SurveyForm/>}/>
        <Route path="/LandingPage" element={<LandingPage/>}/>
        <Route path="/Document" element={<Document/>}/>

      </Routes>
    </Router>
  );
}

export default App;
