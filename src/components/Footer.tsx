import React from 'react';
import { Camera, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  isDark: boolean;
}

export default function Footer({ isDark }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="app-footer"
      className={`py-12 border-t transition-all duration-300 ${
        isDark
          ? 'bg-[#111111] text-brand-cream/60 border-brand-cream/10'
          : 'bg-[#F2ECE0] text-brand-black/60 border-brand-brown/20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center space-y-6">
        
        {/* Core quote requested by user */}
        <div id="footer-quote-container" className="space-y-1.5 max-w-xl">
          <p className="font-serif text-xl sm:text-2xl text-brand-brown italic font-light leading-relaxed">
            &ldquo;기록하는 순간, 평범하던 모든 일상이 마법 같은 기억이 됩니다.&rdquo;
          </p>
          <div className="h-px w-10 bg-brand-brown/30 mx-auto mt-2" />
        </div>

        {/* Branding & description */}
        <div className="flex items-center gap-2 text-current/70">
          <Camera className="w-3.5 h-3.5 text-brand-brown animate-pulse" />
          <span className="font-serif text-sm tracking-wide font-semibold">
            Mood <span className="text-brand-brown italic">Archive</span>
          </span>
          <span className="text-xs font-mono">• v1.0.4 로컬 저장</span>
        </div>

        <div className="text-[10px] font-mono tracking-widest uppercase opacity-75 max-w-sm leading-relaxed">
          가장 눈부신 청춘의 한 페이지를 남기는 대학생들을 위해 제작되었습니다.
          <br />
          모든 인화 조각들과 사색은 당신 브라우저의 전용 보관소에 안전하게 아카이빙됩니다.
        </div>

        {/* Back to Top */}
        <motion.button
          id="scroll-to-top-btn"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="text-xs font-mono tracking-widest text-brand-brown flex items-center gap-1.5 hover:underline focus:outline-hidden"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          맨 위로 돌아가기
        </motion.button>

        {/* Subtle Copyright */}
        <div className="text-[9px] font-mono opacity-40 pt-4">
          &copy; 2026 Mood Archive Project. 모든 권리 보유. 대학생활의 소중한 분위기를 따스하게 간직하세요.
        </div>

      </div>
    </footer>
  );
}
