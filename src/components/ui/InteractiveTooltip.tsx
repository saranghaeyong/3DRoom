import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, MousePointerClick, HelpCircle } from 'lucide-react';

interface InteractiveTooltipProps {
  hoverInfo: {
    id: string;
    label: string;
    hint: string;
    x: number;
    y: number;
  } | null;
  isDarkMode: boolean;
  onOpenHelp: () => void;
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  hoverInfo,
  isDarkMode,
  onOpenHelp,
}) => {
  return (
    <>
      {/* Dynamic Cursor Tooltip */}
      <AnimatePresence>
        {hoverInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            style={{
              left: `${hoverInfo.x + 16}px`,
              top: `${hoverInfo.y + 16}px`,
            }}
            className="fixed z-40 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#dfd7cc] bg-[#fdfcf9]/95 text-[#2c2825] shadow-md backdrop-blur-md dark:border-[#383344] dark:bg-[#1c1a24]/95 dark:text-[#ede7f5]"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <div className="text-xs">
              <span className="font-semibold">{hoverInfo.label}</span>
              <span className="mx-1 text-[#8f8274] dark:text-[#8d8299]">•</span>
              <span className="text-[#6d6153] dark:text-[#b4a9c2]">{hoverInfo.hint}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Room Hint Bar */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 select-none">
        <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#e8e1d7] bg-[#fcfaf7]/85 text-[#675c50] shadow-xs backdrop-blur-md text-[11px] font-medium dark:border-[#383344] dark:bg-[#1a1822]/85 dark:text-[#a89cb8]">
          <span className="flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Click any object to explore</span>
          </span>
          <span className="text-[#c4bbb0] dark:text-[#4a4358]">|</span>
          <span className="hidden sm:inline">Drag to rotate • Scroll to zoom</span>
          <button
            onClick={onOpenHelp}
            id="btn-room-guide"
            className="ml-1 text-[#b45309] dark:text-[#f59e0b] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Room Guide</span>
          </button>
        </div>
      </footer>
    </>
  );
};
