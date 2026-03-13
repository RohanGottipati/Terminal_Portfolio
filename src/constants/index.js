import {
  mobile,
  backend,
  creator,
  web,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
} from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "experience",
    title: "Experience",
  },
  {
    id: "contact",
    title: "Contact Me",
  },
  {
    id: "resume",
    title: "Resume",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "Python",
    icon: "/logos/python.svg",
  },
  {
    name: "Java",
    icon: "/logos/java.svg",
  },
  {
    name: "R",
    icon: "/logos/r.svg",
  },
  {
    name: "C",
    icon: "/logos/c.svg",
  },
  {
    name: "SQL",
    icon: "/logos/sql.svg",
  },
  {
    name: "React",
    icon: "/src/assets/tech/reactjs.png",
  },
  {
    name: "HTML",
    icon: "/src/assets/tech/html.png",
  },
  {
    name: "CSS",
    icon: "/src/assets/tech/css.png",
  },
  {
    name: "Matlab",
    icon: "/logos/matlab.svg",
  },
  {
    name: "Flask",
    icon: "/logos/flask.svg",
  },
  {
    name: "Pandas",
    icon: "/logos/pandas.svg",
  },
  {
    name: "NumPy",
    icon: "/logos/numpy.svg",
  },
  {
    name: "Tailwind CSS",
    icon: "/src/assets/tech/tailwind.png",
  },
  {
    name: "Git",
    icon: "/src/assets/tech/git.png",
  },
  {
    name: "GitHub",
    icon: "/logos/github.svg",
  },
  {
    name: "OpenAI API",
    icon: "/logos/openai.svg",
  },
  {
    name: "Jupyter Notebook",
    icon: "/logos/jupyter.svg",
  },
];

const experiences = [
  {
    title: "Software Developer Intern",
    company_name: "DOUBL",
    icon: "/logos/doubl.jpg",
    iconBg: "#E6DEDD",
    date: "Jan 2026 – Present",
    points: [
      "Accelerated client acquisition demos by developing polished interactive integrations using Next.js and TypeScript.",
      "Reduced spam emails by 95% by implementing strict rate limiting and route authentication using Resend API.",
      "Implemented website content management by adding an admin-based Firebase CMS for text and image editing.",
      "Expedited body scan email delivery time by 85% by automating user notification scripts for 500+ user accounts.",
    ],
  },
  {
    title: "Software Developer Intern (Full Stack)",
    company_name: "OneChart",
    icon: "/logos/onechart.jpg",
    iconBg: "#383E56",
    date: "Jan 2026 – Present",
    points: [
      "Built production-ready Scribe platform and Chrome extension for clinicians using TypeScript and React.",
      "Reduced documentation time by 80% by integrating Deepgram and Gemini APIs for real-time transcription.",
      "Enabled seamless cross-platform EMR syncing by implementing structured PDF generation with Supabase backend.",
      "Improved data retrieval speed by 60% by architecting optimized, indexed database schemas and API endpoints.",
    ],
  },
  {
    title: "AI/ML Research Assistant",
    company_name: "Wilfrid Laurier University",
    icon: "/logos/wilfrid_laurier_university.png",
    iconBg: "#383E56",
    date: "Jan 2026 – Present",
    points: [
      "Built scalable data pipelines to evaluate affective computing models applied to emotion-driven trading strategies.",
      "Processed 10K+ labeled sentiment data points by building emotion detection pipelines using Python and NLP.",
      "Engineered simulation environments testing 10+ agent strategies against emotion-weighted performance metrics.",
      "Developed reproducible experiment scripts and visualizations supporting an active research paper for publication.",
    ],
  },
  {
    company_name: "Laurier Computing Society",
    icon: "/logos/laurier_cs_logo.jpg",
    iconBg: "#383E56",
    date: "Sep 2025 – Present",
    roles: [
      {
        title: "VP of Finance",
        date: "Jan 2026 – Present",
        points: [
          "Manage annual budget and oversee financial allocations, ensuring fiscal responsibility.",
          "Track sponsorships, reimbursements, and event expenses through organized financial reporting systems.",
        ],
      },
      {
        title: "Finance Coordinator",
        date: "Sep 2025 – Jan 2026",
        points: [
          "Assisted in managing the club's financial operations and tracking expenses for various events.",
          "Supported the VP of Finance in preparing budget reports and processing reimbursement requests.",
        ],
      },
    ],
  },
  {
    title: "Co-Founder, Software Engineer",
    company_name: "TeachTrack AI",
    icon: "/logos/teachtrack-ai.png",
    iconBg: "#E6DEDD",
    date: "Jan 2025 – Jan 2026",
    points: [
      "Developed an AI EdTech startup platform using Python, Flask, and React to identify student learning gaps.",
      "Built data pipelines with Pandas + SQL to automate assessments and generate reports, cutting effort by 40%.",
      "Created interactive dashboards using Chart.js + React to track performance, increasing weekly teacher use.",
      "Integrated Git version control, unit testing, and code reviews to ensure maintainable and scalable development.",
    ],
  },
  {
    title: "Software Engineer Intern",
    company_name: "AvertoAI",
    icon: "/logos/Averto_AI_Logo.jpeg",
    iconBg: "#383E56",
    date: "May 2025 – Dec 2025",
    points: [
      "Developed an MVP with Python, FastAPI, and SQL to process purchasing data, reducing excess orders by 25%.",
      "Implemented RESTful APIs and normalized SQL schemas to manage supplier records across multiple data sources.",
      "Optimized queries with indexing strategies, cutting average API response latency and improving system stability.",
      "Enhanced data accuracy by 30% by implementing multi-stage automated validation pipelines for supplier data.",
    ],
  },
  {
    title: "Basecamp Sprint + Voyage Fellow",
    company_name: "DMZ",
    icon: "/logos/dmz.png",
    iconBg: "#E6DEDD",
    date: "May 2025 – Aug 2025",
    points: [
      "Developed and refined the TeachTrack AI prototype, enhancing scalability and validation speed by 60%.",
      "Built interactive web demos using React and streamlined REST APIs, accelerating iteration cycles.",
      "Presented polished technical demos to mentors and investors, refining MVP architecture through live feedback.",
    ],
  },
  {
    title: "Computer Science Instructor",
    company_name: "Varsity Tutors",
    icon: "/logos/varsity-tutors.png",
    iconBg: "#383E56",
    date: "Nov 2024 – Dec 2025",
    points: [
      "Taught Python, Java, OOP, data structures and algorithms to individual and group classes of 10+ students.",
      "Developed custom coding exercises and implementations for arrays, linked lists, stacks, queues, and trees.",
      "Walked through debugging, recursion traces, and time complexity concepts to strengthen problem solving.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Spectra",
    description:
      "Spectra is a real-time behavioral classification and analytics platform that acts as a security layer for AI agents on the Solana blockchain.",
    tags: [
      {
        name: "Solana",
        color: "blue-text-gradient",
      },
      {
        name: "AI Agents",
        color: "green-text-gradient",
      },
      {
        name: "Analytics",
        color: "pink-text-gradient",
      },
    ],
    image: "/logos/spectra.png",
    links: [
      { url: "https://github.com/RohanGottipati/Spectra", logo: null },
      { url: "https://devpost.com/software/s-e-n-t-r-a", logo: "/logos/devpost.jpg" },
    ],
  },
  {
    name: "CareSync",
    description:
      "AI-powered care coordination platform for Personal Support Workers (PSWs), family members, and care coordinators.",
    tags: [
      { name: "AI", color: "blue-text-gradient" },
      { name: "Healthcare", color: "green-text-gradient" },
      { name: "React", color: "pink-text-gradient" },
    ],
    image: "/assets/tech/CareSync.png",
    links: [
      { url: "https://github.com/RohanGottipati/CareSync", logo: null },
      { url: "https://devpost.com/software/caresync-kj2ch4", logo: "/logos/devpost.jpg" },
    ],
  },
  {
    name: "Medalyze",
    description: "This project analyzes Olympic athlete data using R to uncover how age, physical attributes, and event factors influence performance and medal outcomes.",
    tags: [
      { name: "R", color: "blue-text-gradient" },
      { name: "Data Analysis", color: "green-text-gradient" },
      { name: "Statistical Modeling", color: "pink-text-gradient" },
    ],
    image: "/logos/TeachTrackAI.jpg",
    source_code_link: "https://github.com/RohanGottipati/Olympics_Dataset",
  },
  {
    name: "Letterly",
    description: "An advanced web-based typing platform built with React, TypeScript, and Tailwind CSS that dynamically measures speed, accuracy, and behavior metrics across multiple text modes and adaptive test durations.",
    tags: [
      { name: "React", color: "blue-text-gradient" },
      { name: "TypeScript", color: "green-text-gradient" },
      { name: "AI/ML", color: "pink-text-gradient" },
    ],
    image: "/logos/typing.png",
    source_code_link: "https://github.com/RohanGottipati/Typing",
  },
  {
    name: "MoveMind",
    description: "Machine learning system that classifies barbell exercises (bench press, squat, deadlift, etc.) with 89.5% accuracy using wearable sensor data.",
    tags: [
      { name: "React", color: "blue-text-gradient" },
      { name: "Node.js", color: "green-text-gradient" },
      { name: "MongoDB", color: "pink-text-gradient" },
    ],
    image: "/logos/MoveMind.webp",
    source_code_link: "https://github.com/RohanGottipati/MoveMind",
  },
  {
    name: "Portfolio",
    description: "Interactive 3D portfolio website showcasing projects and skills with Three.js animations, responsive design, and modern UI components.",
    tags: [
      { name: "React", color: "blue-text-gradient" },
      { name: "Three.js", color: "green-text-gradient" },
      { name: "Tailwind CSS", color: "pink-text-gradient" },
    ],
    image: "/logos/Portfolio.png",
    source_code_link: "https://github.com/RohanGottipati/Portfolio",
  },
  {
    name: "Quote of the Day",
    description: "A React TypeScript application that displays daily quotes from the ZenQuotes API with dark/light mode toggle.",
    tags: [
      { name: "React", color: "blue-text-gradient" },
      { name: "TypeScript", color: "green-text-gradient" },
      { name: "Tailwind CSS", color: "pink-text-gradient" },
    ],
    image: "/logos/quote.png",
    source_code_link: "https://github.com/RohanGottipati/Quote_Of_The_Day",
  },
];

const education = [
  {
    school_name: "Wilfrid Laurier University",
    degree: "Bachelor of Computer Science",
    date: "Waterloo, ON | Sept 2024 – Apr 2028",
    points: [
      "Concentration in Big Data Systems",
      "Option in Data Analytics",
    ],
  },
];

const profile = {
  name: 'Rohan Gottipati',
  title: 'Software Engineer',
  handle: 'rohangottipati',
  status: 'Online',
  contactText: 'Contact Me',
  // Same picture as About section
  miniAvatarUrl: '/rohan.jpg?v=3',
};

export { services, technologies, experiences, testimonials, projects, education, profile };
