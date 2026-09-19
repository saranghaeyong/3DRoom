/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { RoomScene } from './components/3d/RoomScene';
import { IntroOverlay } from './components/ui/IntroOverlay';
import { NavigationOverlay } from './components/ui/NavigationOverlay';
import { InteractiveTooltip } from './components/ui/InteractiveTooltip';
import { PortfolioModal } from './components/modals/PortfolioModal';
import { ResumeViewModal } from './components/modals/ResumeViewModal';
import { soundManager } from './utils/audio';

export default function App() {
  // Theme state - LIGHT THEME FIRST (default: false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sarang_theme_mode');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  // Intro welcome screen state
  const [hasEnteredRoom, setHasEnteredRoom] = useState<boolean>(false);

  // Active portfolio modal section: 'about' | 'projects' | 'education' | 'certifications' | 'skills' | 'resume' | 'contact' | 'gallery' | 'guide' | null
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Selected 3D object to focus camera
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  // Hovered 3D object for cursor pill
  const [hoverInfo, setHoverInfo] = useState<{
    id: string;
    label: string;
    hint: string;
    x: number;
    y: number;
  } | null>(null);

  // Audio playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Full resume document modal
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState<boolean>(false);

  // Reset view counter
  const [resetViewTrigger, setResetViewTrigger] = useState<number>(0);

  // Sync dark mode class on <html> element without filter inversion
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('sarang_theme_mode', 'dark');
      } catch {
        // ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('sarang_theme_mode', 'light');
      } catch {
        // ignore
      }
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
    soundManager.playClick(600);
  }, []);

  const toggleAudio = useCallback(() => {
    const isPlaying = soundManager.toggleMute();
    setIsPlayingAudio(isPlaying);
  }, []);

  // Map 3D clicked object to section
  const handleSelectObject = useCallback((objectId: string) => {
    setSelectedObjectId(objectId);

    const objectToSectionMap: Record<string, string> = {
      computer: 'about',
      laptop: 'projects',
      bookshelf: 'education',
      certificate: 'certifications',
      desk: 'skills',
      phone: 'contact',
      resume: 'resume',
      camera: 'gallery',
      github: 'contact',
      lamp: 'guide',
    };

    const section = objectToSectionMap[objectId] || 'about';
    setActiveSection(section);
  }, []);

  // Handle top navigation clicks
  const handleNavigate = useCallback((section: string) => {
    soundManager.playClick(580);
    if (section === 'explore') {
      setActiveSection(null);
      setSelectedObjectId(null);
      setResetViewTrigger((c) => c + 1);
      return;
    }

    const sectionTo3dObjectMap: Record<string, string> = {
      about: 'computer',
      projects: 'laptop',
      education: 'bookshelf',
      certifications: 'certificate',
      skills: 'desk',
      resume: 'resume',
      contact: 'phone',
      gallery: 'camera',
      guide: 'lamp',
    };

    const targetObject = sectionTo3dObjectMap[section] || null;
    setSelectedObjectId(targetObject);
    setActiveSection(section);
  }, []);

  const handleResetCamera = useCallback(() => {
    soundManager.playClick(480);
    setSelectedObjectId(null);
    setActiveSection(null);
    setResetViewTrigger((c) => c + 1);
  }, []);

  const handleCloseModal = useCallback(() => {
    soundManager.playClick(420);
    setActiveSection(null);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#fcfaf7] dark:bg-[#121118] text-[#2c2825] dark:text-[#f8f6f2] font-sans">
      {/* Intro Welcome Screen */}
      <AnimatePresence>
        {!hasEnteredRoom && (
          <IntroOverlay
            onEnter={() => {
              soundManager.playInspect();
              setHasEnteredRoom(true);
            }}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      {/* 3D Room Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <RoomScene
          onSelectObject={handleSelectObject}
          selectedObjectId={selectedObjectId}
          isDarkMode={isDarkMode}
          onHoverObjectChange={setHoverInfo}
          resetViewTrigger={resetViewTrigger}
        />
      </div>

      {/* Navigation and Top Bar Controls */}
      <NavigationOverlay
        onNavigate={handleNavigate}
        activeSection={activeSection}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isPlayingAudio={isPlayingAudio}
        onToggleAudio={toggleAudio}
        onResetCamera={handleResetCamera}
      />

      {/* Dynamic Cursor Tooltip & Bottom Guide Bar */}
      <InteractiveTooltip
        hoverInfo={hoverInfo}
        isDarkMode={isDarkMode}
        onOpenHelp={() => handleNavigate('guide')}
      />

      {/* Floating Interactive Portfolio Panel */}
      <PortfolioModal
        section={activeSection}
        onClose={handleCloseModal}
        isDarkMode={isDarkMode}
        onOpenResumeViewer={() => setIsResumeViewerOpen(true)}
        onNavigateToSection={handleNavigate}
      />

      {/* Printable / Downloadable Full Resume Document Viewer */}
      <ResumeViewModal
        isOpen={isResumeViewerOpen}
        onClose={() => setIsResumeViewerOpen(false)}
        isDarkMode={isDarkMode}
      />
    </main>
  );
}
