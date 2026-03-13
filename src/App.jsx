import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Resume from "./components/Resume";
import ScrollToTop from "./components/ScrollToTop";

const Home = () => (
  <>
    <Hero />
  </>
);

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <div className="relative z-0 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  </BrowserRouter>
);

export default App;
// Analytics integration
