import React, { Suspense } from "react";
import { motion } from "framer-motion";
import ProjectCards from "./ProjectCards";
import TechBalls from "./TechBalls";

const Projects = () => (
  <section id="projects" className="min-h-screen py-20">
    <div className="max-w-7xl mx-auto px-6">
      {/* Project Cards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mb-24"
      >
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider mb-3"
          >
            My work
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] mb-6"
          >
            Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-secondary text-[17px] max-w-3xl mx-auto leading-[30px]"
          >
            Following projects showcase my skills and experience through real-world examples. Each project is briefly described with links to code repositories and live demos.
          </motion.p>
        </div>
        <ProjectCards />
      </motion.div>

      {/* 3D Tech Balls Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        <div className="text-center mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white font-black md:text-[40px] sm:text-[32px] xs:text-[28px] text-[22px] mb-6"
          >
            Technologies I Work With
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-secondary text-[17px] max-w-2xl mx-auto leading-[30px]"
          >
            Here are some of the technologies and tools I use to bring ideas to life
          </motion.p>
        </div>
        <div className="flex justify-center">
          <Suspense fallback={
            <div className="text-white text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg">Loading technologies...</p>
            </div>
          }>
            <TechBalls />
          </Suspense>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Projects;
// Updated project info
