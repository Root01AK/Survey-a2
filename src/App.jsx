import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import SurveyIntro from "./screens/SurveyIntro";
import Survey from "./screens/Survey";
import PhoneLogin from "./screens/Loginscreen";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PhoneLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/surveyintro" element={<SurveyIntro />} />
        <Route path="/survey" element={<Survey />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
