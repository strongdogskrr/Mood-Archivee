import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Sparkles, Film } from 'lucide-react';

interface HeroProps {
  isDark: boolean;
  onStartRecording: () => void;
}

export default function Hero({ isDark, onStartRecording }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16"
    >
      {/* Cinematic Film Camera Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-black/70 mix-blend-multiply z-[1]" />
        
        {/* Soft edge vignette to look like a camera viewfinder */}
        <div className="absolute inset-0 vintage-vignette z-[2]" />

        {/* Dynamic theme-based gradient fade to transition elegantly into content */}
        <div
          className={`absolute inset-x-0 bottom-0 h-48 z-[2] pointer-events-none transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-to-t from-[#111111] to-transparent'
              : 'bg-gradient-to-t from-[#F5F1E8] to-transparent'
          }`}
        />

        <img
          src="https://images.unsplash.com/photo-1510127852285-5b8d57204de7?q=80&w=1600&auto=format&fit=crop"
          alt="Vintage camera golden lens"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.70] contrast-[1.05] saturate-[0.8] scale-105 select-none"
        />
      </div>

      {/* Simulated Viewfinder overlay for authentic Film Cam aesthetic */}
      <div className="absolute inset-6 sm:inset-10 border border-[#F5F1E8]/15 z-[3] pointer-events-none flex flex-col justify-between p-4 sm:p-6 select-none font-mono text-[9px] sm:text-xs text-[#F5F1E8]/60">
        {/* Viewfinder Corners */}
        <div className="flex justify-between">
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block"></span>
              REC
            </span>
            <span className="opacity-75">STBY</span>
          </div>
          <div>ISO 400</div>
        </div>

        {/* Crosshair indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-40">
          <div className="w-6 h-px bg-[#F5F1E8]" />
          <div className="h-6 w-px bg-[#F5F1E8] absolute" />
          <div className="w-8 h-8 rounded-full border border-[#F5F1E8] absolute" />
        </div>

        <div className="flex justify-between items-end">
          <div>24 Fps</div>
          <div className="flex gap-2">
            <span>F/2.8</span>
            <span>1/125</span>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-brand-cream mt-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Tagline */}
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-brand-beige border border-brand-beige/25 px-4 py-1.5 rounded-full bg-brand-black/40 backdrop-blur-xs inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-brown" />
            대학생을 위한 감성 비주얼 다이어리
          </span>

          {/* Logo Name & Slogan */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-semibold tracking-wide leading-none">
              Mood <span className="text-brand-brown italic font-normal tracking-normal font-serif">Archive</span>
            </h1>
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-brand-beige/90 max-w-xl mx-auto italic font-light tracking-wide leading-relaxed">
              &ldquo;당신이 사랑한 찰나의 순간, 공간, 그리고 모든 감정을 머금다.&rdquo;
            </p>
          </div>

          {/* Deep core value description */}
          <div className="max-w-md mx-auto pt-2">
            <p className="text-xs sm:text-sm text-[#F5F1E8]/70 leading-relaxed font-sans font-light tracking-wide">
              우리는 공간보다 그곳의 <span className="text-brand-brown font-mono text-[11px] uppercase tracking-wider font-semibold">분위기</span>를 기억합니다.
              필름의 필터, 그레인, 그림자, 따뜻함, 그리고 고요함의 조각들을 흘려보내지 마세요.
            </p>
          </div>

          {/* CTA & More Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <motion.button
              id="hero-cta-start-recording"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartRecording}
              className="w-full sm:w-auto bg-brand-cream text-brand-black font-mono text-xs sm:text-sm uppercase tracking-widest font-semibold px-8 py-4 rounded-md shadow-lg transition-colors hover:bg-brand-beige duration-300"
            >
              기록 시작하기
            </motion.button>
            
            <motion.button
              id="hero-skip-to-gallery"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const galleryEl = document.getElementById('gallery');
                if (galleryEl && typeof galleryEl.scrollIntoView === 'function') {
                  galleryEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto border border-brand-cream/30 hover:border-brand-beige text-brand-cream hover:bg-brand-cream/5 font-mono text-xs sm:text-sm uppercase tracking-widest font-semibold px-8 py-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Film className="w-4 h-4 text-brand-brown" />
              보관소 둘러보기
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Down indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[#F5F1E8]/40 flex flex-col items-center gap-1 select-none font-mono text-[10px] uppercase tracking-widest">
        <span>아래로 스크롤</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>
    </section>
  );
}
