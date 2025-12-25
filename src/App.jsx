// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import PageLoader from "./components/PageLoader";
import NoiseOverlay from "./components/NoiseOverlay";
import BackToTop from "./components/BackToTop";

import Home from "./components/Home";
import About from "./components/About";
import Brands from "./components/Brand";
import Contact from "./components/Contact";

function App() {
  return (
    <Router>
      <div className="font-inter bg-black text-light-gray overflow-x-hidden">
        <NoiseOverlay />
        <CustomCursor />
        <PageLoader />
        <Navbar />
        {/* <BackToTop /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
