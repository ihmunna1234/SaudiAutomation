import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import IqamaTool from "./pages/IqamaTool";
import ComingSoon from "./pages/ComingSoon";
import { tools } from "./config/tools";

export default function App() {
  const comingSoonRoutes = tools.filter((t) => !t.available);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/iqama" element={<IqamaTool />} />
        {comingSoonRoutes.map((tool) => (
          <Route path={tool.path} element={<ComingSoon />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
