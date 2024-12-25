import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../../client/src/pages/Home";
import CodeTask from "../../client/src/pages/CodeTask";

const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/codetask/:id" element={<CodeTask />} />
    </Routes>
  );
  
  export default AppRoutes;