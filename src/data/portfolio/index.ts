import type { PortfolioData } from "@/types/portfolio";

export const portfolioData: PortfolioData = {
  identity: {
    name: "Rohan Gottipati",
    shortName: "Rohan",
    role: "Software Engineer",
    subtitle: "Interactive portfolio",
    handle: "rohangottipati",
    avatar: "/rohan.jpg",
    tagline: "Terminal-style portfolio for recruiters, founders, and engineering teams.",
    statusLabel: "Currently building",
    statusDetail: "Full-stack software, data, and AI workflow delivery",
    location: "Waterloo, ON",
  },
  about: {
    intro: "",
    studying: "Bachelor of Computer Science, Big Data Concentration at Wilfrid Laurier University.",
    building: "",
    seeking: "",
    currentFocus: "",
    roles: [],
    highlights: [
      "Software Developer Intern at DOUBL and OneChart",
      "AI/ML Research Assistant at Wilfrid Laurier University",
      "Interested in software engineering, data systems, and machine learning",
    ],
  },
  current: {
    building:
      "Interactive demos, transcription workflows, and product infrastructure across startup and healthcare settings.",
    learning:
      "Backend architecture, cloud development, and robust full-stack system design.",
    exploring:
      "Affective computing, real-time AI workflows, and developer-tool style interfaces.",
    workingOn: [
      "Clinician tooling and Chrome-extension workflows at OneChart",
      "Interactive product demos and operational tooling at DOUBL",
      "Research pipelines for emotion-driven trading experiments",
    ],
  },
  experience: [
    {
      slug: "doubl-junior-software-developer",
      title: "Junior Software Developer",
      organization: "DOUBL",
      dateRange: "Apr 2026 – Present",
      summary:
        "Promoted from Software Developer Intern to Junior Software Developer.",
      highlights: [
        "Summer 2026",
      ],
      techUsed: ["Next.js", "TypeScript", "Firebase", "Resend API"],
      category: "work",
      promotedFrom: "Software Developer Intern",
    },
    {
      slug: "doubl-software-developer-intern",
      title: "Software Developer Intern",
      organization: "DOUBL",
      dateRange: "Jan 2026 – Apr 2026",
      summary:
        "Delivered interactive product and growth tooling across demos, messaging reliability, and content operations.",
      highlights: [
        "Accelerated client acquisition demos by developing polished interactive integrations using Next.js and TypeScript.",
        "Reduced spam emails by 95% by implementing strict rate limiting and route authentication using Resend API.",
        "Implemented website content management by adding an admin-based Firebase CMS for text and image editing.",
        "Expedited body scan email delivery time by 85% by automating user notification scripts for 500+ user accounts.",
      ],
      techUsed: ["Next.js", "TypeScript", "Firebase", "Resend API"],
      category: "work",
    },
    {
      slug: "onechart-software-developer-intern",
      title: "Software Developer Intern (Full Stack)",
      organization: "OneChart",
      dateRange: "Jan 2026 – Present",
      summary:
        "Built production-ready clinician tooling spanning Scribe workflows, extension UX, transcription, and structured clinical delivery.",
      highlights: [
        "Built production-ready Scribe platform and Chrome extension for clinicians using TypeScript and React.",
        "Reduced documentation time by 80% by integrating Deepgram and Gemini APIs for real-time transcription.",
        "Enabled seamless cross-platform EMR syncing by implementing structured PDF generation with Supabase backend.",
        "Improved data retrieval speed by 60% by architecting optimized, indexed database schemas and API endpoints.",
      ],
      techUsed: ["TypeScript", "React", "Deepgram", "Gemini", "Supabase"],
      category: "work",
    },
    {
      slug: "laurier-ai-ml-research-assistant",
      title: "AI/ML Research Assistant",
      organization: "Wilfrid Laurier University",
      dateRange: "Jan 2026 – Present",
      summary:
        "Built research infrastructure for affective computing models applied to emotion-driven trading strategies.",
      highlights: [
        "Built scalable data pipelines to evaluate affective computing models applied to emotion-driven trading strategies.",
        "Processed 10K+ labeled sentiment data points by building emotion detection pipelines using Python and NLP.",
        "Engineered simulation environments testing 10+ agent strategies against emotion-weighted performance metrics.",
        "Developed reproducible experiment scripts and visualizations supporting an active research paper for publication.",
      ],
      techUsed: ["Python", "NLP", "Data Pipelines", "Experimentation"],
      category: "research",
    },
    {
      slug: "laurier-computing-society-vp-finance",
      title: "VP of Finance",
      organization: "Laurier Computing Society",
      dateRange: "Jan 2026 – Present",
      summary:
        "Lead annual financial planning and reporting for Laurier Computing Society events and operations.",
      highlights: [
        "Manage annual budget and oversee financial allocations, ensuring fiscal responsibility.",
        "Track sponsorships, reimbursements, and event expenses through organized financial reporting systems.",
      ],
      techUsed: ["Financial Reporting", "Operations", "Leadership"],
      category: "leadership",
      promotedFrom: "Finance Coordinator",
    },
    {
      slug: "laurier-computing-society-finance-coordinator",
      title: "Finance Coordinator",
      organization: "Laurier Computing Society",
      dateRange: "Sep 2025 – Jan 2026",
      summary:
        "Supported financial operations and reimbursement workflows before transitioning into the VP of Finance role.",
      highlights: [
        "Assisted in managing the club's financial operations and tracking expenses for various events.",
        "Supported the VP of Finance in preparing budget reports and processing reimbursement requests.",
      ],
      techUsed: ["Operations", "Budgeting", "Leadership"],
      category: "leadership",
    },
    {
      slug: "teachtrack-ai-cofounder",
      title: "Co-Founder, Software Engineer",
      organization: "TeachTrack AI",
      dateRange: "Jan 2025 – Jan 2026",
      summary:
        "Co-founded and engineered an AI EdTech platform focused on identifying student learning gaps.",
      highlights: [
        "Developed an AI EdTech startup platform using Python, Flask, and React to identify student learning gaps.",
        "Built data pipelines with Pandas + SQL to automate assessments and generate reports, cutting effort by 40%.",
        "Created interactive dashboards using Chart.js + React to track performance, increasing weekly teacher use.",
        "Integrated Git version control, unit testing, and code reviews to ensure maintainable and scalable development.",
      ],
      techUsed: ["Python", "Flask", "React", "Pandas", "SQL"],
      category: "founder",
    },
    {
      slug: "avertoai-software-engineer-intern",
      title: "Software Engineer Intern",
      organization: "AvertoAI",
      dateRange: "May 2025 – Dec 2025",
      summary:
        "Built an early-stage purchasing-data MVP with Python, FastAPI, and SQL to improve supplier operations.",
      highlights: [
        "Developed an MVP with Python, FastAPI, and SQL to process purchasing data, reducing excess orders by 25%.",
        "Implemented RESTful APIs and normalized SQL schemas to manage supplier records across multiple data sources.",
        "Optimized queries with indexing strategies, cutting average API response latency and improving system stability.",
        "Enhanced data accuracy by 30% by implementing multi-stage automated validation pipelines for supplier data.",
      ],
      techUsed: ["Python", "FastAPI", "SQL", "REST APIs"],
      category: "work",
    },
    {
      slug: "dmz-voyage-fellow",
      title: "Basecamp Sprint + Voyage Fellow",
      organization: "DMZ",
      dateRange: "May 2025 – Aug 2025",
      summary:
        "Refined the TeachTrack AI prototype through high-speed iteration, technical demos, and mentor feedback.",
      highlights: [
        "Developed and refined the TeachTrack AI prototype, enhancing scalability and validation speed by 60%.",
        "Built interactive web demos using React and streamlined REST APIs, accelerating iteration cycles.",
        "Presented polished technical demos to mentors and investors, refining MVP architecture through live feedback.",
      ],
      techUsed: ["React", "REST APIs", "MVP Iteration", "Pitching"],
      category: "founder",
    },
    {
      slug: "varsity-tutors-instructor",
      title: "Computer Science Instructor",
      organization: "Varsity Tutors",
      dateRange: "Nov 2024 – Dec 2025",
      summary:
        "Taught core computer science topics through individual and group instruction focused on practical problem solving.",
      highlights: [
        "Taught Python, Java, OOP, data structures and algorithms to individual and group classes of 10+ students.",
        "Developed custom coding exercises and implementations for arrays, linked lists, stacks, queues, and trees.",
        "Walked through debugging, recursion traces, and time complexity concepts to strengthen problem solving.",
      ],
      techUsed: ["Python", "Java", "Data Structures", "Teaching"],
      category: "teaching",
    },
  ],
  projects: [
    {
      slug: "spectra",
      name: "Spectra",
      summary:
        "Security-focused analytics layer for AI agents operating on the Solana blockchain.",
      description:
        "Spectra is a real-time behavioral classification and analytics platform built to act as a security layer for Solana-based AI agents. The project focuses on monitoring behavior, surfacing suspicious patterns, and packaging those signals into an operator-friendly analytics experience.",
      stack: ["Next.js", "React", "TypeScript", "Solana Web3.js", "Supabase"],
      features: [
        "Tracks real-time agent behavior across blockchain activity",
        "Classifies suspicious or risky behavioral patterns",
        "Packages monitoring into a security-oriented analytics experience",
      ],
      role: "Developer",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/RohanGottipati/Spectra",
          kind: "github",
          external: true,
        },
        {
          label: "Devpost",
          href: "https://devpost.com/software/s-e-n-t-r-a",
          kind: "devpost",
          external: true,
        },
      ],
      tags: ["Solana", "AI Agents", "Security", "Analytics"],
    },
    {
      slug: "caresync",
      name: "CareSync",
      summary:
        "AI-powered care coordination workflow for PSWs, family members, and care coordinators.",
      description:
        "CareSync is a healthcare coordination experience designed to streamline communication between support workers, families, and care coordinators. The product centers on clearer updates, shared context, and faster coordination around day-to-day care workflows.",
      stack: ["React", "Node.js", "PostgreSQL", "Auth0", "Backboard.io", "Vultr"],
      features: [
        "Organizes care updates for multiple stakeholder types",
        "Improves communication around ongoing patient support",
        "Packages coordination workflows into a cleaner product experience",
      ],
      role: "Developer",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/RohanGottipati/CareSync",
          kind: "github",
          external: true,
        },
        {
          label: "Devpost",
          href: "https://devpost.com/software/caresync-kj2ch4",
          kind: "devpost",
          external: true,
        },
      ],
      tags: ["AI", "Healthcare", "React"],
    },
    {
      slug: "medalyze",
      name: "Medalyze",
      summary:
        "Olympic athlete analysis in R focused on medal outcomes and performance drivers.",
      description:
        "Medalyze explores Olympic athlete data to uncover how age, physical attributes, and event-level factors influence performance and medal outcomes. The project emphasizes statistical modeling, data cleaning, and analytical storytelling in R.",
      stack: ["R", "Tidyverse", "Tidymodels", "ggplot2"],
      features: [
        "Analyzes athlete attributes against medal outcomes",
        "Explores event-level variables influencing performance",
        "Uses statistical modeling to turn raw data into findings",
      ],
      role: "Developer",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/RohanGottipati/Olympics_Dataset",
          kind: "github",
          external: true,
        },
      ],
      tags: ["R", "Analytics", "Statistics"],
    },
    {
      slug: "letterly",
      name: "Letterly",
      summary:
        "Web typing platform that measures speed, accuracy, and behavior across multiple text modes.",
      description:
        "Letterly is a React and TypeScript typing platform that goes beyond raw WPM by tracking speed, accuracy, and behavioral metrics across different test styles and durations. The project focuses on responsive interaction, live feedback, and a strong learning loop.",
      stack: ["React", "TypeScript", "Tailwind CSS"],
      features: [
        "Measures speed, accuracy, and behavioral typing metrics",
        "Supports multiple text modes and adaptive test durations",
        "Delivers a responsive and feedback-rich practice interface",
      ],
      role: "Developer",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/RohanGottipati/Typing",
          kind: "github",
          external: true,
        },
      ],
      tags: ["React", "TypeScript", "UX"],
    },
    {
      slug: "movemind",
      name: "MoveMind",
      summary:
        "Wearable-sensor ML system for classifying barbell exercises with 89.5% accuracy.",
      description:
        "MoveMind is a machine learning system that classifies barbell exercises such as bench press, squat, and deadlift using wearable sensor data. The project combines data processing, model evaluation, and user-facing presentation for fitness-focused insights.",
      stack: ["Python", "scikit-learn", "Pandas"],
      features: [
        "Classifies multiple barbell movements from wearable inputs",
        "Reached 89.5% accuracy on the modeled exercise set",
        "Packages ML results into an understandable product story",
      ],
      role: "Developer",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/RohanGottipati/MoveMind",
          kind: "github",
          external: true,
        },
      ],
      impact: "89.5% classification accuracy",
      tags: ["Machine Learning", "Wearables", "Classification"],
    },
    {
      slug: "portfolio",
      name: "Portfolio",
      summary:
        "Previous portfolio built as an interactive 3D experience with modern UI animations.",
      description:
        "The previous portfolio combined React, Three.js, Tailwind CSS, and Framer Motion to showcase projects and skills through a more cinematic browsing experience. It serves as the design foundation for this new terminal-style rebuild.",
      stack: ["React", "Three.js", "Tailwind CSS", "Framer Motion"],
      features: [
        "Combined 3D visuals with a responsive layout",
        "Used animated project and skill presentation patterns",
        "Established the brand assets and dark visual language carried forward here",
      ],
      role: "Developer",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/RohanGottipati/Portfolio",
          kind: "github",
          external: true,
        },
      ],
      tags: ["Portfolio", "3D", "React"],
    },
    {
      slug: "quote-of-the-day",
      name: "Quote of the Day",
      summary:
        "React + TypeScript app for daily quotes with a dark/light theme toggle.",
      description:
        "Quote of the Day is a lighter React and TypeScript project that consumes the ZenQuotes API and presents a simple quote-reading experience with theme switching. It demonstrates clean state handling and straightforward API consumption.",
      stack: ["React", "TypeScript", "Tailwind CSS"],
      features: [
        "Fetches fresh quotes from the ZenQuotes API",
        "Supports dark and light theme switching",
        "Keeps the interface minimal and readable",
      ],
      role: "Developer",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/RohanGottipati/Quote_Of_The_Day",
          kind: "github",
          external: true,
        },
      ],
      tags: ["React", "TypeScript", "API"],
    },
  ],
  skills: [
    {
      key: "languages",
      label: "Languages",
      summary: "Programming and markup languages.",
      items: ["Python", "Java", "R", "C", "SQL", "TypeScript", "JavaScript", "HTML", "CSS"],
    },
    {
      key: "frontend",
      label: "Frameworks & Libraries",
      summary: "Core frameworks, libraries, and data tooling.",
      items: ["React", "Next.js", "FastAPI", "pandas", "NumPy", "scikit-learn", "ggplot2", "Tailwind CSS"],
    },
    {
      key: "tools-platforms",
      label: "Tools & Technologies",
      summary: "Infrastructure, APIs, and deployment tools.",
      items: [
        "REST APIs",
        "Node.js",
        "PostgreSQL",
        "Firebase",
        "Supabase",
        "Gemini API",
        "Docker",
        "Git",
        "Vercel",
      ],
    },
  ],
  contact: {
    email: "rohan.gottipati@gmail.com",
    github: "https://github.com/RohanGottipati",
    linkedin: "https://www.linkedin.com/in/rohangottipati/",
    resume: "/resume.pdf",
  },
  quickLinks: [
    {
      label: "GitHub",
      href: "https://github.com/RohanGottipati",
      kind: "github",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/rohangottipati/",
      kind: "linkedin",
      external: true,
    },
    {
      label: "Resume",
      href: "/resume.pdf",
      kind: "resume",
    },
  ],
  pinnedCommands: [
    "/about",
    "/experience",
    "/projects",
    "/project spectra",
    "/skills frontend",
    "/contact",
  ],
};
