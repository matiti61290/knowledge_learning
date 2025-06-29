import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from './component/Header.js'
import Footer from "./component/Footer.js";
import Login from "./pages/Login"
import Home from "./pages/Home"
import Formations from "./pages/Formations";
import Formation from "./pages/Formation"
import Category from "./pages/Category.js"
import Lesson from './pages/Lesson.js'
import Register from "./pages/Register.js";
import UserProfile from "./pages/UserProfile.js";
import Certificate from "./pages/Certificate.js";
import PageNotFound from "./pages/PageNotFound.js";

function App() {
 return (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <main className="flex-grow-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/formations' element={<Formations />}/>
        <Route path="/formations/:formationId" element={<Formation />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/formations/:formationId/:lessonId" element={<Lesson />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/userProfile" element={<UserProfile/>} />
        <Route path="/certification/:formationId" element={<Certificate />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
 )
}

export default App