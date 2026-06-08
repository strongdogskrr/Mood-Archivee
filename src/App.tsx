import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Memory, MoodType } from './types';
import { INITIAL_MEMORIES } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import MoodCards from './components/MoodCards';
import RecordForm from './components/RecordForm';
import ArchiveGrid from './components/ArchiveGrid';
import Stats from './components/Stats';
import Footer from './components/Footer';
import { Sparkles, Calendar, BookOpen, AlertCircle } from 'lucide-react';

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(key) : null;
    } catch (e) {
      console.warn('Storage access blocked:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage write blocked:', e);
    }
  }
};

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Default to dark mode as requested by "Dark mode UI" first
    const saved = safeStorage.getItem('mood-archive-theme');
    return saved ? saved === 'dark' : true;
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = safeStorage.getItem('mood-archive-memories');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((m): m is Memory => m !== null && typeof m === 'object');
        }
      } catch (e) {
        console.error('Failed to parse memories from localStorage, using defaults', e);
      }
    }
    // Default 6 items
    return INITIAL_MEMORIES;
  });

  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MoodType | null>(null);
  const [isRecordOpen, setIsRecordOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Persist theme choice
  useEffect(() => {
    safeStorage.setItem('mood-archive-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Persist memories
  useEffect(() => {
    safeStorage.setItem('mood-archive-memories', JSON.stringify(memories));
  }, [memories]);

  // Track active scroll section for header nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const heroEl = document.getElementById('hero');
      const galleryEl = document.getElementById('gallery');
      const statsEl = document.getElementById('stats');

      if (statsEl && scrollPos >= statsEl.offsetTop) {
        setActiveSection('stats');
      } else if (galleryEl && scrollPos >= galleryEl.offsetTop) {
        setActiveSection('gallery');
      } else if (heroEl) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  // Trigger form opening + scrolling to form nicely
  const handleOpenRecord = () => {
    setIsRecordOpen(true);
    setTimeout(() => {
      const recordEl = document.getElementById('record-section');
      if (recordEl && typeof recordEl.scrollIntoView === 'function') {
        recordEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Add new card
  const handleSaveMemory = (newMemory: Omit<Memory, 'id' | 'timestamp'>) => {
    const memoryWithId: Memory = {
      ...newMemory,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    setMemories((prev) => [memoryWithId, ...prev]);
    setIsRecordOpen(false);

    // Dynamic scroll back to the gallery to see the new entry
    setTimeout(() => {
      const galleryEl = document.getElementById('gallery');
      if (galleryEl && typeof galleryEl.scrollIntoView === 'function') {
        galleryEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  // Delete card
  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m && m.id !== id));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="app-root"
      className={`min-h-screen film-grain transition-colors duration-500 flex flex-col ${
        isDark ? 'bg-brand-black text-brand-cream' : 'bg-[#FAF7F2] text-brand-black'
      }`}
    >
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenRecord={handleOpenRecord}
        scrollToSection={scrollToSection}
        activeSection={activeSection}
      />

      {/* Hero container */}
      <Hero isDark={isDark} onStartRecording={handleOpenRecord} />

      {/* Main Flow Grid */}
      <main className="flex-1 w-full flex flex-col">
        {/* Today's Mood selections & quick triggers */}
        <MoodCards
          isDark={isDark}
          selectedMood={selectedMoodFilter}
          onSelectMood={(mood) => {
            setSelectedMoodFilter(mood);
            // Auto scroll gallery if mood was selected to match filtered items
            if (mood) {
              scrollToSection('gallery');
            }
          }}
        />

        {/* Dynamic sliding Recording interface */}
        <AnimatePresence>
          {isRecordOpen && (
            <motion.div
              id="record-section"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`w-full py-12 px-4 border-b ${
                isDark ? 'bg-brand-black border-brand-cream/10' : 'bg-brand-cream border-brand-brown/15'
              }`}
            >
              <div className="max-w-4xl mx-auto">
                <RecordForm
                  isDark={isDark}
                  preselectedMood={selectedMoodFilter}
                  onSave={handleSaveMemory}
                  onClose={() => setIsRecordOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Archive Masonry Gallery */}
        <ArchiveGrid
          isDark={isDark}
          memories={memories}
          onDelete={handleDeleteMemory}
          selectedMoodFilter={selectedMoodFilter}
          onSetMoodFilter={setSelectedMoodFilter}
        />

        {/* Statistics section */}
        <Stats isDark={isDark} memories={memories} />
      </main>

      {/* Consistent design visual credit & quote footer */}
      <Footer isDark={isDark} />
    </div>
  );
}
