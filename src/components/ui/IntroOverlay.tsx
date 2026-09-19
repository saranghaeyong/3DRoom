import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface IntroOverlayProps {
  onEnter: () => void;
  isDarkMode: boolean;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onEnter, isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none ${
        isDarkMode
          ? 'bg-[#121118]/95 text-[#f5f1eb]'
          : 'bg-[#fcfaf7]/95 text-[#2c2825]'
      } backdrop-blur-md transition-colors duration-500`}
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Subtle decorative badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border border-[#e5ded4] bg-[#f5f0e8]/80 text-[#716558] dark:border-[#383344] dark:bg-[#201d29] dark:text-[#a69db3]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#b45309] dark:text-[#f59e0b]" />
          <span>Interactive 3D Portfolio</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-serif text-[#1e1b18] dark:text-[#f8f6f2]">
            {PORTFOLIO_DATA.brand.name}
          </h1>
          <p className="text-xs sm:text-sm tracking-widest text-[#7c7163] dark:text-[#a89ea8] font-mono uppercase">
            {PORTFOLIO_DATA.brand.title}
          </p>
        </motion.div>

        {/* Welcome Quote */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg text-[#524941] dark:text-[#d3c9d9] font-serif italic"
        >
          "Welcome to my room."
        </motion.p>

        {/* Enter Room Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="pt-4"
        >
          <button
            onClick={onEnter}
            id="enter-room-button"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md bg-[#2c2825] text-[#faf8f5] hover:bg-[#433d38] dark:bg-[#eee8df] dark:text-[#18161e] dark:hover:bg-[#ffffff] active:scale-98 cursor-pointer"
          >
            <span>Enter Room</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <p className="mt-4 text-xs text-[#8c8072] dark:text-[#888194]">
            Rotate 360° • Zoom • Click objects to explore
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
