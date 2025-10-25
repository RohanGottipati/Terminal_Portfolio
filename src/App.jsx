import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import ScrollToTop from "./components/ScrollToTop";

const Home = () => (
  <>
    <Hero />
    <About />
  </>
);

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <div className="relative z-0 bg-primary min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
// Analytics integration
