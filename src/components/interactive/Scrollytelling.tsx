'use client';

import React, { createContext, useContext, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface ScrollyContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const ScrollyContext = createContext<ScrollyContextType>({
  currentStep: 0,
  setCurrentStep: () => {},
});

export function useScrolly() {
  return useContext(ScrollyContext);
}

export function ScrollyProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <ScrollyContext.Provider value={{ currentStep, setCurrentStep }}>
      <div className="flex flex-col lg:flex-row relative gap-8 items-start w-full">
        {children}
      </div>
    </ScrollyContext.Provider>
  );
}

export function Step({ children, stepIndex }: { children: React.ReactNode, stepIndex: number }) {
  const { currentStep, setCurrentStep } = useScrolly();
  const { ref } = useInView({
    rootMargin: "-45% 0px -45% 0px", // Trigger when fairly central
    onChange: (inView) => {
      if (inView) {
        setCurrentStep(stepIndex);
      }
    }
  });

  const isActive = currentStep === stepIndex;
  const opacityClass = isActive ? 'opacity-100' : 'opacity-100 lg:opacity-40';

  return (
    <div 
      ref={ref} 
      className={`min-h-[60vh] flex flex-col justify-center transition-opacity duration-500 py-10 ${opacityClass}`}
    >
      {children}
    </div>
  );
}

export function ScrollyVisualizer({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden lg:flex w-1/2 sticky top-24 h-[calc(100vh-6rem)] max-h-[800px] items-center justify-center">
      <div className="w-full max-h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function ScrollyText({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full lg:w-1/2 pb-[50vh]">
      {children}
    </div>
  );
}
