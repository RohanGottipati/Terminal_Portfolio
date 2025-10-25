import React, { Suspense } from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import ErrorBoundary from "./ErrorBoundary";

const Tech = () => {
  return (
    <div className='w-full'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 sm:gap-8 justify-items-center max-w-6xl mx-auto'>
        {technologies.map((technology) => (
          <div className='w-28 h-28 flex items-center justify-center' key={technology.name}>
            <Suspense fallback={<div className="text-white text-xs text-center">{technology.name}</div>}>
              <ErrorBoundary fallbackText={technology.name}>
                <BallCanvas icon={technology.icon} />
              </ErrorBoundary>
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tech;
// Tech stack updates
