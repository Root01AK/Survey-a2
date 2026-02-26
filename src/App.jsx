import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import ConsentForm from "./screens/ConsentForm";
import About from "./screens/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/consent" element={<ConsentForm />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;