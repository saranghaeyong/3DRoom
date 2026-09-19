import React from 'react';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Layers,
  Monitor,
  Laptop,
  GraduationCap,
  Award,
  Cpu,
  FileText,
  PhoneCall,
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';

interface NavigationOverlayProps {
  onNavigate: (section: string) => void;
  activeSection: string | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isPlayingAudio: boolean;
  onToggleAudio: () => void;
  onResetCamera: () => void;
}

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  onNavigate,
  activeSection,
  isDarkMode,
  onToggleDarkMode,
  isPlayingAudio,
  onToggleAudio,
  onResetCamera,
}) => {
  const navItems = [
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'about', label: 'About', icon: Monitor },
    { id: 'projects', label: 'Projects', icon: Laptop },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certifications', label: 'Certificates', icon: Award },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
      {/* Brand Header */}
      <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-2xl border border-[#e8e1d7] bg-[#fcfaf7]/90 text-[#2c2825] shadow-xs backdrop-blur-md dark:border-[#383344] dark:bg-[#1a1822]/90 dark:text-[#f2eef8]">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight font-serif">
              {PORTFOLIO_DATA.brand.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-[#eee7dc] text-[#6d6153] dark:bg-[#2c2738] dark:text-[#b4a9c2]">
              {PORTFOLIO_DATA.brand.projectName}
            </span>
          </div>
          <p className="text-[10px] text-[#786c5e] dark:text-[#a094b0] hidden sm:block">
            Interactive 3D Workspace
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <nav
        aria-label="Room Portfolio Navigation"
        className="pointer-events-auto max-w-[95vw] overflow-x-auto no-scrollbar flex items-center gap-1 p-1 rounded-2xl border border-[#e8e1d7] bg-[#fcfaf7]/90 shadow-xs backdrop-blur-md dark:border-[#383344] dark:bg-[#1a1822]/90"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              id={`nav-${item.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#2c2825] text-[#fbfaf8] shadow-xs dark:bg-[#f0ebdf] dark:text-[#191620]'
                  : 'text-[#64594c] hover:text-[#1e1b18] hover:bg-[#f0ebe3] dark:text-[#a69bb5] dark:hover:text-[#f8f6fb] dark:hover:bg-[#282333]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Controls: Dark/Light, Audio, Reset View */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl border border-[#e8e1d7] bg-[#fcfaf7]/90 shadow-xs backdrop-blur-md dark:border-[#383344] dark:bg-[#1a1822]/90 text-[#5a4e41] dark:text-[#a69bb5]">
        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          id="btn-reset-camera"
          title="Reset Camera View"
          className="p-2 rounded-xl hover:bg-[#f0ebe3] dark:hover:bg-[#282333] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Ambient Audio Toggle */}
        <button
          onClick={onToggleAudio}
          id="btn-audio-toggle"
          title={isPlayingAudio ? 'Mute Ambient Audio' : 'Play Gentle Ambient Sound'}
          className="p-2 rounded-xl hover:bg-[#f0ebe3] dark:hover:bg-[#282333] transition-colors cursor-pointer relative"
        >
          {isPlayingAudio ? (
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          {isPlayingAudio && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        {/* Dark / Light Toggle */}
        <button
          onClick={onToggleDarkMode}
          id="btn-theme-toggle"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl hover:bg-[#f0ebe3] dark:hover:bg-[#282333] transition-colors cursor-pointer"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
};
