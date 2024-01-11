import React from "react";
import Tournament from "./pages/Tournament";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TestEnv from "./pages/TestEnv";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TestEnv />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
