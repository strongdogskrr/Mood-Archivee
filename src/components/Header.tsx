import React from 'react';
import { Camera, Sun, Moon, Plus, BarChart3, Archive } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenRecord: () => void;
  scrollToSection: (id: string) => void;
  activeSection: string;
}

export default function Header({
  isDark,
  onToggleTheme,
  onOpenRecord,
  scrollToSection,
  activeSection,
}: HeaderProps) {
  return (
    <header
      id="app-header"
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 border-b ${
        isDark
          ? 'bg-brand-black/85 text-brand-cream border-brand-cream/10'
          : 'bg-brand-cream/85 text-brand-black border-brand-brown/20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          id="logo-container"
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full border border-brand-brown/50 bg-transparent overflow-hidden">
            <Camera className="w-4 h-4 text-brand-brown transition-transform duration-500 group-hover:rotate-12" />
            <span className="absolute -inset-1 border border-brand-brown/20 rounded-full scale-75 animate-ping opacity-0 group-hover:opacity-100 duration-1000"></span>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold tracking-wide flex items-baseline gap-1">
              Mood <span className="text-brand-brown italic">Archive</span>
            </h1>
            <p className="text-[9px] uppercase font-mono tracking-[0.25em] text-brand-brown/80 -mt-1 hidden sm:block">
              2026 / 찰나의 아카이빙 diary
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-6">
          <button
            id="nav-to-gallery"
            onClick={() => scrollToSection('gallery')}
            className={`font-mono text-xs sm:text-sm tracking-wider hover:text-brand-brown transition-colors px-2 py-1 flex items-center gap-1.5 ${
              activeSection === 'gallery' ? 'text-brand-brown font-medium' : 'text-current/70'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">보관소</span>
          </button>
          
          <button
            id="nav-to-stats"
            onClick={() => scrollToSection('stats')}
            className={`font-mono text-xs sm:text-sm tracking-wider hover:text-brand-brown transition-colors px-2 py-1 flex items-center gap-1.5 ${
              activeSection === 'stats' ? 'text-brand-brown font-medium' : 'text-current/70'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">감성 통계</span>
          </button>

          <span className="h-4 w-px bg-brand-brown/30 hidden xs:block"></span>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isDark
                ? 'border-brand-cream/10 hover:border-brand-brown/70 hover:bg-brand-cream/5 text-amber-300'
                : 'border-brand-brown/20 hover:border-brand-brown hover:bg-brand-brown/5 text-purple-900'
            }`}
            title={isDark ? '크림색 테마로 전환' : '필름 어둠 테마로 전환'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* CTA / Trigger */}
          <motion.button
            id="header-cta-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenRecord}
            className="font-mono text-[11px] sm:text-xs uppercase tracking-wider bg-brand-brown hover:bg-[#8D7350] text-[#111111] font-semibold px-3 sm:px-4 py-2 rounded-sm transition-colors flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#111111] stroke-[2.5]" />
            기록하기
          </motion.button>
        </nav>
      </div>
    </header>
  );
}
