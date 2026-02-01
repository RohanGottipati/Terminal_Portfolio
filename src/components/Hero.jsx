import React from "react";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";

const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-transparent">
      <div className="text-center w-full flex flex-col items-center justify-center">
        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0, 0.71, 0.2, 1.01] }}
          className="mb-8"
        >
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <Typewriter
              text="Hey! I'm Rohan Gottipati"
              speed={30}
            />
          </div>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
          className="flex justify-center space-x-6 mb-12"
        >
          <motion.a
            href="https://github.com/RohanGottipati"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors duration-300"
            aria-label="Visit GitHub profile"
          >
            <FaGithub className="text-gray-300 text-xl hover:text-white transition-colors duration-300" />
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/rohangottipati/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors duration-300"
          >
            <FaLinkedin className="text-gray-300 text-xl hover:text-white transition-colors duration-300" />
          </motion.a>

          <motion.a
            href="mailto:rohan.gottipati@gmail.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors duration-300"
          >
            <FaEnvelope className="text-gray-300 text-xl hover:text-white transition-colors duration-300" />
          </motion.a>

          <motion.a
            href="/resume"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors duration-300"
          >
            <FaFileAlt className="text-gray-300 text-xl hover:text-white transition-colors duration-300" />
          </motion.a>
        </motion.div>

        {/* Scroll Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mt-8"
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="cursor-pointer"
            onClick={scrollToAbout}
          >
            <svg
              className="w-8 h-8 text-blue-800 hover:text-blue-700 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
