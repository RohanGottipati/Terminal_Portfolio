import React, { Suspense } from "react";
import { BallCanvas } from "./canvas";
import ErrorBoundary from "./ErrorBoundary";

// Skills to include as specified by user (14 total skills for 2 rows: 7 + 7)
const skills = [
  "python", "java", "react", "html", "css", "sql", "flask", 
  "git", "github", "r", "tailwind", "openai", "pandas", "c"
];

// External image links (to be provided by user)
const logoMap = {
  python: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  java: "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg",
  react: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  html: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg",
  css: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg",
  sql: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg",
  flask: "https://raw.githubusercontent.com/devicons/devicon/master/icons/flask/flask-original.svg",
  git: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png",
  github: "https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg",
  r: "https://raw.githubusercontent.com/abranhe/programming-languages-logos/master/src/r/r_64x64.png",
  tailwind: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  openai: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg",
  pandas: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Pandas_logo.svg",
  c: "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png"
};

const skillNames = {
  python: "Python",
  java: "Java",
  react: "React",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  flask: "Flask",
  git: "Git",
  github: "GitHub",
  r: "R",
  tailwind: "Tailwind",
  openai: "OpenAI",
  pandas: "Pandas",
  c: "C"
};

const TechBalls = () => (
  <div className="w-full">
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-7 gap-4 sm:gap-6 justify-items-center max-w-7xl mx-auto">
      {skills.map((skill) => (
        <div className='w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center' key={skill}>
          <Suspense fallback={
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-tertiary rounded-full border-2 border-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-xs text-center font-medium px-2">{skillNames[skill]}</span>
            </div>
          }>
            <ErrorBoundary fallbackText={skillNames[skill]}>
              <BallCanvas icon={logoMap[skill]} />
            </ErrorBoundary>
          </Suspense>
        </div>
      ))}
    </div>
  </div>
);

export default TechBalls; 