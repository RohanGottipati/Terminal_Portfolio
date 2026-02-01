import React from "react";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com/in/rohangottipati/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#2563eb] transition-colors duration-300"
            >
              <FaLinkedin className="text-2xl" />
            </a>
            <a
              href="https://github.com/RohanGottipati"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#2563eb] transition-colors duration-300"
            >
              <FaGithub className="text-2xl" />
            </a>
            <a
              href="mailto:rohan.gottipati@gmail.com"
              className="text-white hover:text-[#2563eb] transition-colors duration-300"
            >
              <FaEnvelope className="text-2xl" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-secondary text-sm">
              Rohan Gottipati 2026 – All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; // Social media features
