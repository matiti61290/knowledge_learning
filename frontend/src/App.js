import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from './component/Header.js'
import Login from "./pages/Login"
import Home from "./pages/Home"
import Formations from "./pages/Formations";
import Formation from "./pages/Formation"
import Category from "./pages/Category.js"

function App() {
 return (
  <div>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/formations' element={<Formations />}/>
      <Route path="/formations/:formationId" element={<Formation />} />
      <Route path="/category/:categoryId" element={<Category />} />
    </Routes>
  </div>
 )
}

export default App