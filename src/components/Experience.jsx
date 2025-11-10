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

const experiences = [
  {
    title: "Co-Founder, Product Engineer",
    company_name: "TeachTrack AI",
    icon: "/logos/teachtrack-ai.png",
    iconBg: "#ffffff",
    date: "Jan 2025 – Present",
    points: [
      "Engineered an AI EdTech platform with Python, Flask, and React to identify student learning gaps",
      "Built data pipelines with Pandas + SQL to automate assessments and generate reports, cutting effort by 40%",
      "Created interactive dashboards using Chart.js + React to track performance, increasing teacher use by 25%",
      "Integrated Git version control, unit testing, and code reviews to ensure maintainable and scalable development",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "AvertoAI",
    icon: "/logos/Averto_AI_Logo.jpeg",
    iconBg: "#ffffff",
    date: "May 2025 – Sep. 2025",
    points: [
      "Developed an MVP with Python, FastAPI, and SQL to process purchasing data, reducing excess orders by 40%",
      "Implemented backend APIs and SQL models to manage supplier records and improve inventory reliability",
      "Delivered the MVP system, helping the startup secure $50,000 worth of grants and validate product-market fit",
    ],
  },
  {
    title: "Math and Coding Instructor",
    company_name: "Varsity Tutors",
    icon: "/logos/varsity-tutors.png",
    iconBg: "#ffffff",
    date: "Nov 2024 – Sep. 2025",
    points: [
      "Taught Python, Java, OOP, and data structures to individual and group classes of 10+ students",
      "Created custom lesson plans and applied detailed performance tracking to address gaps in CS and math skills",
      "Led hands-on coding projects and built interactive tools to strengthen engagement and collaborative learning",
    ],
  },
  {
    title: "Finance Coordinator",
    company_name: "Laurier Computing Society",
    icon: "/logos/laurier_cs_logo.png",
    iconBg: "#ffffff",
    date: "May 2024 – Present",
    points: [
      "Manage annual budget and oversee financial allocations for over 300 members ensuring fiscal responsibility and compliance with university policies",
      "Track sponsorships, reimbursements, and event expenses through organized financial reporting systems",
      "Collaborate with the executive team to forecast costs and develop funding strategies for hackathons and large community initiatives",
    ],
  },
  {
    title: "Director of Events",
    company_name: "Virtual Reality Laurier",
    icon: "/logos/vr_laurier.jpeg",
    iconBg: "#ffffff",
    date: "September 2023 – Present",
    points: [
      "Organize and lead campus hackathons and workshops introducing students to VR and 3D development",
      "Manage logistics, budgeting, and partnerships for interactive events with more than 100 attendees each semester",
      "Coordinate collaboration between technical and creative teams to deliver high-impact experiences",
    ],
  },
  {
    title: "Director of Marketing",
    company_name: "Laurier Analytics",
    icon: "/logos/laurieranalytics.jpeg",
    iconBg: "#ffffff",
    date: "May 2024 – Present",
    points: [
      "Lead social media campaigns and outreach across LinkedIn and instragram reaching over 1,000 students and professionals",
      "Manage content calendars and oversee consistent branding for event promotions resulting in a 40 percent increase in engagement",
      "Use analytics tools to measure campaign performance and optimize promotional strategies",
    ],
  },
  {
    title: "Startup Founder Hub Member",
    company_name: "Microsoft Azure",
    icon: "/logos/azure.png",
    iconBg: "#ffffff",
    date: "Aug 2025 – Sep 2025",
    points: [
      "Selected for exclusive startup accelerator program with Microsoft Azure",
      "Gained access to cloud computing resources and mentorship opportunities",
      "Collaborated with other founders on scaling AI-powered educational platforms",
    ],
  },
  {
    title: "Sprint + Voyage",
    company_name: "DMZ",
    icon: "/logos/dmz.png",
    iconBg: "#ffffff",
    date: "May 2025 – Aug 2025",
    points: [
      "Participated in intensive startup accelerator program at Toronto's leading incubator",
      "Developed business model and go-to-market strategy for TeachTrack AI",
      "Pitched to investors and secured initial funding for educational technology venture",
    ],
  },
];

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
        <h3 className='text-white text-[20px] sm:text-[24px] font-bold leading-tight'>
          {experience.title}
        </h3>
        <p className='text-secondary text-[14px] sm:text-[16px] font-semibold leading-tight'>
          {experience.company_name}
        </p>
      </div>

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
