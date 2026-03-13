import { useLayoutEffect, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const MotionButton = motion(Button);

const Resume = () => {
  const resumeUrl = `${import.meta.env.BASE_URL}resume.pdf`;
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let objectUrl;
    fetch(resumeUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch PDF");
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => setError(true));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [resumeUrl]);

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
          <MotionButton
            asChild
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-blue-800 text-white rounded-lg transition-colors duration-300 font-medium text-base w-full sm:w-auto justify-center focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Download Resume PDF"
          >
            <a href={resumeUrl} download>
              <FaDownload className="text-lg" />
              <span>Download PDF</span>
            </a>
          </MotionButton>

          <MotionButton
            asChild
            variant="outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-blue-800 text-white border-gray-600 rounded-lg transition-colors duration-300 font-medium text-base w-full sm:w-auto justify-center focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="View Resume PDF in New Page"
          >
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <FaExternalLinkAlt className="text-lg" />
              <span>View Full PDF in New Page</span>
            </a>
          </MotionButton>
        </motion.div>

        {/* Resume Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex justify-center px-4 sm:px-0"
        >
          {isMobile ? (
            <div className="w-full max-w-4xl bg-gray-900 rounded-xl shadow-2xl border border-gray-800 flex flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-secondary text-base leading-relaxed">
                PDF preview is not supported on mobile browsers. Use the buttons above to download or open the resume in a new tab.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl h-[80vh] bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-800 flex items-center justify-center">
              {error ? (
                <div className="flex flex-col items-center gap-4 text-secondary">
                  <p>Could not load PDF preview.</p>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open PDF
                  </a>
                </div>
              ) : !blobUrl ? (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
              ) : (
                <iframe
                  src={blobUrl}
                  title="Resume PDF"
                  className="w-full h-full border-0"
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
