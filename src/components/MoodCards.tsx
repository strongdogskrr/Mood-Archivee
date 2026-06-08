import React from 'react';
import { motion } from 'motion/react';
import { MoodType, MOODS } from '../types';
import { Smile, SlidersHorizontal } from 'lucide-react';

interface MoodCardsProps {
  isDark: boolean;
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType | null) => void;
}

export default function MoodCards({
  isDark,
  selectedMood,
  onSelectMood,
}: MoodCardsProps) {
  return (
    <div
      id="todays-mood-section"
      className={`py-12 border-b transition-colors duration-300 ${
        isDark
          ? 'bg-brand-black text-brand-cream border-brand-cream/10'
          : 'bg-brand-cream text-brand-black border-brand-brown/20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-brown block mb-1">
              오늘의 감정 주파수
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-wide">
              오늘의 <span className="italic font-normal text-brand-brown">기분</span>
            </h2>
            <p className="text-xs text-current/75 mt-1 font-light sm:max-w-md">
              지금 이 순간, 당신의 마음은 어떤 색을 띠고 있나요? 아래에서 감정을 골라 순간을 기록하거나 보관소를 필터링하세요.
            </p>
          </div>
          
          {/* Clear Filter button */}
          {selectedMood && (
            <motion.button
              id="clear-mood-filter-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onSelectMood(null)}
              className="font-mono text-[10px] uppercase tracking-wider text-brand-brown border border-brand-brown/30 hover:border-brand-brown px-3 py-1.5 rounded-sm self-start sm:self-auto flex items-center gap-1.5 transition-all"
            >
              <SlidersHorizontal className="w-3 h-3" />
              감정 필터 해제
            </motion.button>
          )}
        </div>

        {/* Emotion cards/grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4">
          {MOODS.map((moodItem) => {
            const isSelected = selectedMood === moodItem.type;
            
            return (
              <motion.button
                key={moodItem.type}
                id={`mood-card-${moodItem.type}`}
                onClick={() => onSelectMood(isSelected ? null : moodItem.type)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex flex-col items-center justify-center p-6 rounded-md border text-center transition-all duration-300 ${
                  isSelected
                    ? isDark
                      ? 'bg-brand-brown/20 border-brand-brown text-brand-cream shadow-[0_0_15px_rgba(166,138,100,0.25)]'
                      : 'bg-brand-brown/15 border-brand-brown text-brand-black shadow-[0_4px_12px_rgba(166,138,100,0.15)]'
                    : isDark
                      ? 'bg-[#1A1A1A] border-brand-cream/10 text-brand-cream/80 hover:text-brand-cream hover:border-brand-brown/40'
                      : 'bg-[#FAF7F2] border-brand-brown/15 text-brand-black/90 hover:text-brand-black hover:border-brand-brown/50'
                }`}
              >
                {/* Visual Camera lens-ring feedback */}
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-brown opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-brown"></span>
                  </span>
                )}

                {/* Big Emoji */}
                <span className="text-4xl mb-3 drop-shadow-sm transition-transform group-hover:scale-110">
                  {moodItem.emoji}
                </span>

                {/* Mood Tag */}
                <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                  {moodItem.label}
                </span>

                <span className="text-[10px] opacity-60 font-serif italic mt-0.5">
                  {moodItem.type === 'Happy' && '따스한 햇살'}
                  {moodItem.type === 'Calm' && '초록빛 홍차'}
                  {moodItem.type === 'Excited' && '두근두근 설렘'}
                  {moodItem.type === 'Nostalgic' && '아득한 그리움'}
                  {moodItem.type === 'Lonely' && '스며드는 달빛'}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
