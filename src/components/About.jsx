import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
          <div className="relative w-48 h-48 md:w-56 md:h-56">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-30"></div>
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl">
              <Avatar className="w-full h-full rounded-full">
                <AvatarImage
                  src="/rohan.jpg?v=3"
                  alt="Rohan Gottipati"
                  className="w-full h-full object-cover scale-[2.5]"
                  style={{ objectPosition: '48% 15%' }}
                />
                <AvatarFallback className="text-2xl bg-gray-800 text-white">RG</AvatarFallback>
              </Avatar>
            </div>
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

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-secondary text-base md:text-lg leading-relaxed mb-6"
          >
            <p className="mb-4">
              Computer Science Student @ Wilfrid Laurier University, Big Data Systems Concentration
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center md:justify-start mb-6"
          >
            <Badge variant="outline" className="px-4 py-2 bg-blue-500/20 border-blue-500 text-blue-400 text-sm font-medium rounded-full">
              Software Engineer
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-blue-500/20 border-blue-500 text-blue-400 text-sm font-medium rounded-full">
              Data Enthusiast
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-blue-500/20 border-blue-500 text-blue-400 text-sm font-medium rounded-full">
              Builder
            </Badge>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-secondary text-sm md:text-base leading-relaxed mb-8 space-y-3"
          >
            <p>
              - Software Engineer Intern @ DOUBL and OneChart
            </p>
            <p>
              - AI/ML Research Assistant at Wilfrid Laurier University
            </p>
            <p>
              - Interested in software engineering, data systems, and machine learning
            </p>
            <p>
              - Constantly learning backend architecture, cloud dev, and full-stack design
            </p>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
