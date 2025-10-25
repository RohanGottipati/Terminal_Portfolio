import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex-shrink-0 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-30"></div>
            <img
              src="/rohan.jpg?v=3"
              alt="Rohan Gottipati"
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-blue-500 shadow-2xl"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex-1 text-center md:text-left"
        >
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-white text-3xl md:text-4xl font-bold mb-6"
          >
            About Me
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-secondary text-lg md:text-xl leading-relaxed mb-6"
          >
            I'm a Computer Science student at Wilfrid Laurier University specializing in Big Data Systems and Data Analytics.
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-secondary text-lg md:text-xl leading-relaxed mb-8"
          >
            I love building full-stack and AI-powered tools that make life easier for others.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <span className="px-4 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full text-blue-400 text-sm font-medium">
              SWE
            </span>
            <span className="px-4 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full text-blue-400 text-sm font-medium">
              AI Enthusiast
            </span>
            <span className="px-4 py-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full text-blue-400 text-sm font-medium">
              Founder
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
// Animation improvements
