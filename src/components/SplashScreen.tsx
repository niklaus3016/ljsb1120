import React, { useEffect, useState } from 'react';
import { MANDATORY_DISCLAIMER } from '../types';
import { BrandEmblem } from './Icons';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), 1700);
    const doneTimer = window.setTimeout(() => onComplete(), 2050);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setFading(true);
    window.setTimeout(onComplete, 220);
  };

  return (
    <div
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleSkip();
      }}
      aria-label="进入灵境胜杯"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-10 cursor-pointer select-none transition-opacity duration-300 bg-[#F7F2E8] dark:bg-[#161210] text-[#2E1F18] dark:text-[#EFE6D8] ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="pt-4 text-xs tracking-[0.25em] text-[#7B6356] dark:text-[#9C8A7A]">
        潮汕传统民俗器物模拟
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center mb-6">
          <BrandEmblem className="w-24 h-24 text-[#8B3A2B] dark:text-[#C86D55]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-[0.18em] text-[#2E1F18] dark:text-[#EFE6D8]">
          灵境胜杯
        </h1>

        <div className="mt-4 flex items-center gap-3 text-xs tracking-[0.22em] text-[#7B6356] dark:text-[#9C8A7A]">
          <span className="w-6 h-px bg-[#8B3A2B]/35 dark:bg-[#C86D55]/35" />
          <span>心诚则灵 · 顺其自然</span>
          <span className="w-6 h-px bg-[#8B3A2B]/35 dark:bg-[#C86D55]/35" />
        </div>
      </div>

      <div className="max-w-md text-center pb-safe">
        <p className="text-xs leading-relaxed text-[#7B6356] dark:text-[#9C8A7A]">
          {MANDATORY_DISCLAIMER}
        </p>
      </div>
    </div>
  );
};
