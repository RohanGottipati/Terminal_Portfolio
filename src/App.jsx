import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Resume from "./components/Resume";
import ScrollToTop from "./components/ScrollToTop";
import SplashCursor from "./components/SplashCursor";

const Home = () => (
  <>
    <Hero />
    <About />
  </>
);

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <div className="relative z-0 min-h-screen flex flex-col">
      <SplashCursor
        SIM_RESOLUTION={256}
        DYE_RESOLUTION={1440}
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2.5}
        PRESSURE={0.1}
        CURL={10}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={1}
      />
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
