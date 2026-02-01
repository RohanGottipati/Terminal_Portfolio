import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

// Custom CSS to override default styles
const customStyles = `
  .vertical-timeline-element-icon {
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 50% !important;
    overflow: hidden !important;
  }
  
  .vertical-timeline-element-icon img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 50% !important;
  }
  
  .logo-container {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px solid #e5e7eb;
  }
  
  .logo-container.teachtrack {
    background: white;
  }
  
  .logo-container.dmz {
    background: white;
    padding: 2px;
  }
  
  .logo-container.dmz img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
  
  .logo-container.azure {
    background: white;
    padding: 6px;
  }
  
  .logo-container.azure img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
  
  .logo-container.averto {
    background: white;
    padding: 4px;
  }
  
  .logo-container.averto img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
  
  .logo-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

import { experiences } from "../constants";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={experience.date}
      dateClassName="text-white font-semibold text-sm sm:text-base"
      iconStyle={{
        background: "transparent",
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      icon={
        <div className={`logo-container ${experience.company_name === 'TeachTrack AI' ? 'teachtrack' : ''} ${experience.company_name === 'DMZ' ? 'dmz' : ''} ${experience.company_name === 'Microsoft Azure' ? 'azure' : ''} ${experience.company_name === 'AvertoAI' ? 'averto' : ''}`}>
          <img
            src={experience.icon}
            alt={experience.company_name}
            className='w-full h-full object-contain'
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div
            className='w-full h-full flex items-center justify-center text-gray-600 font-bold text-xs hidden'
            style={{ display: 'none' }}
          >
            {experience.company_name}
          </div>
        </div>
      }
    >
      <div className="space-y-2">
        {experience.roles ? (
          // Render Promotion/Group Layout
          <div>
            <h3 className='text-white text-[24px] font-bold'>{experience.company_name}</h3>
            <p className='text-secondary text-[16px] font-semibold mb-4'>{experience.date}</p>

            <div className='relative mt-6 ml-2 pl-6 space-y-8'>
              {/* Vertical connecting line */}
              <div className="absolute left-[0px] top-[22px] bottom-6 w-[2px] bg-slate-700"></div>
              {experience.roles.map((role, index) => (
                <div key={index} className='relative'>
                  {/* Timeline Dot */}
                  <div className='absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-700 border-2 border-[#1d1836]'></div>

                  <h4 className='text-white text-[20px] font-bold'>{role.title}</h4>
                  <p className='text-secondary text-[14px] font-semibold'>{role.date}</p>

                  <ul className='mt-2 list-disc ml-5 space-y-1'>
                    {role.points.map((point, idx) => (
                      <li key={idx} className='text-white-100 text-[13px] pl-1 tracking-wider'>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Render Standard Single Role Layout
          <>
            <h3 className='text-white text-[20px] sm:text-[24px] font-bold leading-tight'>
              {experience.title}
            </h3>
            <p className='text-secondary text-[14px] sm:text-[16px] font-semibold leading-tight'>
              {experience.company_name}
            </p>
            {experience.points && experience.points.length > 0 && (
              <ul className='mt-5 list-disc ml-5 space-y-2'>
                {experience.points.map((point, index) => (
                  <li
                    key={`experience-point-${index}`}
                    className='text-white-100 text-[13px] sm:text-[14px] pl-1 tracking-wider leading-relaxed'
                  >
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 flex flex-col items-center"
    >
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <motion.div className="text-center mb-12">
        <p className="text-secondary text-sm uppercase tracking-wider mb-2">
          What I have done so far
        </p>
        <h2 className="text-white text-3xl sm:text-4xl font-bold">
          Work Experience.
        </h2>
      </motion.div>

      <div className='w-full max-w-6xl mx-auto'>
        <VerticalTimeline lineColor="#232631">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </motion.div>
  );
};

export default Experience;
// Experience updates
