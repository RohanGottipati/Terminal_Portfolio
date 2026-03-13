import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt } from "react-icons/fa";
import ProfileCard from "./ProfileCard";
import Dither from "./Dither";
import { profile } from "../constants";

const socialLinks = [
  {
    href: "https://github.com/RohanGottipati",
    icon: FaGithub,
    label: "Visit GitHub profile",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/rohangottipati/",
    icon: FaLinkedin,
    label: "Visit LinkedIn profile",
    external: true,
  },
  {
    href: "mailto:rohan.gottipati@gmail.com",
    icon: FaEnvelope,
    label: "Send email",
    external: false,
  },
  {
    href: "/resume",
    icon: FaFileAlt,
    label: "View resume",
    external: false,
  },
];

const aboutPoints = [
  "Software Engineer Intern @ DOUBL and OneChart",
  "AI/ML Research Assistant at Wilfrid Laurier University",
  "Interested in software engineering, data systems, and machine learning",
  "Constantly learning backend architecture, cloud dev, and full-stack design",
];

const DITHER_BG = (
  <Dither
    waveColor={[0.32, 0.15, 1]}
    disableAnimation={false}
    enableMouseInteraction={false}
    mouseRadius={1}
    colorNum={4}
    pixelSize={2}
    waveAmplitude={0.3}
    waveFrequency={3}
    waveSpeed={0.10}
  />
);

const AboutPoint = ({ point, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.7 + index * 0.08 }}
    className="group flex items-start gap-3 px-3 py-2 -mx-3 rounded-lg cursor-default
               transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02]"
  >
    <span
      className="text-blue-400 flex-shrink-0 mt-0.5 text-base leading-snug
                 transition-transform duration-200 ease-out group-hover:translate-x-1"
    >
      →
    </span>
    <span className="text-secondary text-sm md:text-base leading-relaxed
                     transition-colors duration-200 group-hover:text-white">
      {point}
    </span>
  </motion.li>
);

const Hero = () => {
  const handleContact = () => {
    window.location.href = "mailto:rohan.gottipati@gmail.com";
  };

  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex items-center justify-center bg-transparent px-4 sm:px-6 pt-4 pb-16"
    >
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-16">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-shrink-0 flex justify-center w-full sm:w-auto"
        >
          <ProfileCard
            name={profile.name}
            title={profile.title}
            handle={profile.handle}
            status={profile.status}
            contactText={profile.contactText}
            miniAvatarUrl={profile.miniAvatarUrl}
            showUserInfo
            enableTilt
            behindGlowEnabled={false}
            backgroundSlot={DITHER_BG}
            onContactClick={handleContact}
          />
        </motion.div>

        {/* About Me */}
        <div className="flex-1 flex flex-col items-start text-left min-w-0 max-w-xl lg:max-w-none">

          {/* Heading row — title + icons side by side */}
          <div className="flex items-center gap-4 w-full mb-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white text-2xl md:text-3xl font-bold"
            >
              About Me
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-2.5 items-center"
            >
              {socialLinks.map(({ href, icon: Icon, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center
                             hover:bg-blue-800 transition-all duration-300 hover:scale-110 flex-shrink-0"
                >
                  <Icon className="text-gray-300 text-base" />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-secondary text-sm md:text-base leading-relaxed mb-4"
          >
            Computer Science Student @ Wilfrid Laurier University, Big Data
            Systems Concentration
          </motion.p>

          <ul className="list-none w-full space-y-0.5">
            {aboutPoints.map((point, i) => (
              <AboutPoint key={point} point={point} index={i} />
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
};

export default Hero;
