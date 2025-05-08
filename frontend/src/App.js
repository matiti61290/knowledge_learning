import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login"
import Home from "./pages/Home"
import Formation from "./pages/Formation"

function App() {
 return (
  <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path="/formation" element={<Formation />} />
    </Routes>
  </div>
 )
}

export default App