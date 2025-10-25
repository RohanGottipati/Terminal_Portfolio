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
    title: "Co-Founder, Software Development Lead",
    company_name: "TeachTrack AI",
    icon: starbucks,
    iconBg: "#383E56",
    date: "Jan 2025 – Present",
    points: [
      "Built an AI platform with Flask and React to automate student learning gap analysis",
      "Created real-time dashboards and data pipelines that save teachers 12+ hours/week",
      "Improved AI accuracy by 30% using iterative educator feedback",
    ],
  },
  {
    title: "Math and Coding Tutor",
    company_name: "Varsity Tutors",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Nov 2024 – Present",
    points: [
      "Tutored students in Python, Java, and algorithm problem solving",
      "Designed custom programming projects to build real-world skills",
      "Advised students on AI and software development career paths",
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
    name: "TeachTrack AI",
    description:
      "AI-powered EdTech platform built with Flask and React. Automatically identifies student learning gaps and generates real-time dashboards for teachers.",
    tags: [
      {
        name: "Python",
        color: "blue-text-gradient",
      },
      {
        name: "Flask",
        color: "green-text-gradient",
      },
      {
        name: "React",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
  {
    name: "AI Resume Analyzer",
    description:
      "A tool using OpenAI + Flask + React to generate ATS-optimized feedback on student resumes. Highlights formatting issues, keyword gaps, and degree relevance.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Flask",
        color: "green-text-gradient",
      },
      {
        name: "OpenAI API",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Visual Job Application Tracker",
    description:
      "A job tracker web app with filtering and real-time visual updates. Helps students manage roles, companies, and interview progress.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Node.js",
        color: "green-text-gradient",
      },
      {
        name: "Tailwind CSS",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },
  {
    name: "Interactive Job Market Dashboard",
    description:
      "Real-time dashboard with public job data visualizations (salary trends, roles, locations). Built with Chart.js and React.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Chart.js",
        color: "green-text-gradient",
      },
      {
        name: "Node.js",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
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

export { services, technologies, experiences, testimonials, projects, education };
// i18n support
