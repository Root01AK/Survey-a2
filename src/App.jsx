import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import SurveyIntro from "./screens/SurveyIntro";
import Survey from "./screens/Survey";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/surveyintro" element={<SurveyIntro />} />
        <Route path="/survey" element={<Survey />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;