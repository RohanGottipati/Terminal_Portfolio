import { useEffect, useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";

const Resume = () => {
  const [isPdfReady, setIsPdfReady] = useState(false);
  const resumeUrl = `${import.meta.env.BASE_URL}Rohan_Gottipati_resume.pdf`;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <section className="min-h-screen py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Download My Resume
          </h1>
          <p className="text-secondary text-[17px] max-w-3xl mx-auto leading-[30px]">
            View my experience, skills, and qualifications. Scroll through the resume below or download the PDF for your records.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <motion.a
            href={resumeUrl}
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-blue-800 text-white rounded-lg transition-colors duration-300 font-medium text-base w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Download Resume PDF"
          >
            <FaDownload className="text-lg" />
            <span>Download PDF</span>
          </motion.a>

          <motion.a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-blue-800 text-white rounded-lg transition-colors duration-300 font-medium text-base w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="View Resume PDF in New Page"
          >
            <FaExternalLinkAlt className="text-lg" />
            <span>View Full PDF in New Page</span>
          </motion.a>
        </motion.div>

        {/* Resume Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex justify-center px-4 sm:px-0"
        >
          <div className="w-full max-w-4xl h-[80vh] bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800 relative">
            {!isPdfReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <iframe
              src={resumeUrl}
              title="Resume PDF"
              className="w-full h-full border-0"
              onLoad={() => setIsPdfReady(true)}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;

