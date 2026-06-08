import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, Film, Camera, Award, Sparkles } from 'lucide-react';
import { Memory, MOODS } from '../types';

interface StatsProps {
  isDark: boolean;
  memories: Memory[];
}

export default function Stats({ isDark, memories }: StatsProps) {
  const totalCount = memories.length;

  // Calculate Most Used Mood
  const moodCounts = memories.reduce((acc, m) => {
    if (m && m.mood) {
      acc[m.mood] = (acc[m.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  let mostUsedMood = 'None';
  let mostUsedEmoji = '📷';
  let mostUsedLabel = '없음';
  let maxCount = 0;

  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsedMood = mood;
      const meta = MOODS.find((m) => m.type === mood);
      if (meta) {
        mostUsedEmoji = meta.emoji;
        mostUsedLabel = meta.label;
      }
    }
  });

  const moodPercentage = totalCount > 0 ? Math.round((maxCount / totalCount) * 100) : 0;

  // Calculate Monthly Records: we count the entries in each of the last 6 months
  const getPastSixMonths = () => {
    const list = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthNum = d.getMonth() + 1;
      list.push({
        rawYear: d.getFullYear(),
        rawMonth: d.getMonth(),
        label: `${monthNum}월`,
        count: 0,
      });
    }
    return list;
  };

  const monthlyBuckets = getPastSixMonths();
  memories.forEach((mem) => {
    if (mem && mem.date) {
      const memDate = new Date(mem.date);
      if (!isNaN(memDate.getTime())) {
        const m = memDate.getMonth();
        const y = memDate.getFullYear();
        const match = monthlyBuckets.find((b) => b.rawMonth === m && b.rawYear === y);
        if (match) {
          match.count += 1;
        }
      }
    }
  });

  // Current Month Records count
  const currentMonthName = `${new Date().getMonth() + 1}월`;
  const currentMonthCount = monthlyBuckets[monthlyBuckets.length - 1]?.count || 0;

  // Max count in buckets for relative scaling in custom charts
  const maxBucketCount = Math.max(...monthlyBuckets.map((b) => b.count), 1);

  return (
    <section
      id="stats"
      className={`py-16 border-t border-b transition-colors duration-300 ${
        isDark
          ? 'bg-brand-black text-brand-cream border-brand-cream/10'
          : 'bg-brand-cream text-brand-black border-brand-brown/20'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <div className="mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-brown block mb-1">
            CAM DIAGNOSTICS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-wide">
            기억의 <span className="italic font-normal text-brand-brown">감성 통계</span>
          </h2>
          <p className="text-xs text-current/70 mt-1 font-light max-w-md">
            당신이 아카이빙해 온 영감, 기억들의 색채 비율, 그리고 기록 주기 분석입니다.
          </p>
        </div>

        {/* STATS BENTO GRID CARD INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* STAT 1: TOTAL MEMORIES */}
          <motion.div
            id="stat-total-memories"
            whileHover={{ y: -3 }}
            className={`p-6 rounded border relative flex flex-col justify-between ${
              isDark
                ? 'bg-[#181818] border-brand-cream/10'
                : 'bg-[#FAF8F5] border-brand-brown/25'
            }`}
          >
            {/* Viewfinder brackets in corner */}
            <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-brand-brown uppercase tracking-wider">
              [ 01_T_EXPOSURES ]
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-current/60 flex items-center gap-1.5 mb-1">
                <Film className="w-3.5 h-3.5 text-brand-brown" />
                누적 아카이브 개수
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-mono font-semibold tracking-tight text-brand-brown">
                  {totalCount.toString().padStart(2, '0')}
                </span>
                <span className="text-xs font-serif text-current/50 italic">장의 기억 인화됨</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-brown/10 text-xs font-light text-current/70">
              {totalCount > 0
                ? '필름 아카이징이 순조롭게 진행되고 있습니다. 소중한 오늘 하루를 보전하셨습니다.'
                : '아카이브가 현재 비어 있습니다. 당신의 학창 시절 낭만 일기를 기록해 필름을 가득 채워보세요.'}
            </div>
          </motion.div>

          {/* STAT 2: MOST USED MOOD */}
          <motion.div
            id="stat-most-used-mood"
            whileHover={{ y: -3 }}
            className={`p-6 rounded border relative flex flex-col justify-between ${
              isDark
                ? 'bg-[#181818] border-brand-cream/10'
                : 'bg-[#FAF8F5] border-brand-brown/25'
            }`}
          >
            <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-brand-brown uppercase tracking-wider">
              [ 02_MAIN_EMOTION ]
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-current/60 flex items-center gap-1.5 mb-2">
                <Award className="w-3.5 h-3.5 text-brand-brown" />
                지배적인 감정 색채
              </span>
              
              {totalCount > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{mostUsedEmoji}</div>
                  <div>
                    <h4 className="font-serif text-2xl font-semibold leading-none">{mostUsedLabel}</h4>
                    <p className="text-xs font-mono text-brand-brown mt-1.5">
                      {maxCount}회 기록 ({moodPercentage}%)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-current/40 py-2 font-mono text-xs italic">
                  아직 충분한 기록이 누적되지 않았습니다.
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-brand-brown/10 text-xs font-light text-current/70">
              {totalCount > 0
                ? `최근에는 주로 '${mostUsedLabel}' 감정을 소중하게 간직하셨군요. 은은한 분위기를 자아내고 있네요.`
                : '오늘 하루의 감정 필터를 콕 선택해 일기를 기록해 보세요.'}
            </div>
          </motion.div>

          {/* STAT 3: MONTHLY RECORDS */}
          <motion.div
            id="stat-monthly-count"
            whileHover={{ y: -3 }}
            className={`p-6 rounded border relative flex flex-col justify-between ${
              isDark
                ? 'bg-[#181818] border-brand-cream/10'
                : 'bg-[#FAF8F5] border-brand-brown/25'
            }`}
          >
            <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-brand-brown uppercase tracking-wider">
              [ 03_CURRENT_CYCLE ]
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-current/60 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-brown" />
                이번 달 아카이브 / {currentMonthName}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-mono font-semibold tracking-tight text-brand-brown">
                  {currentMonthCount.toString().padStart(2, '0')}
                </span>
                <span className="text-xs font-serif text-current/50 italic">개의 순간 간직함</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-brown/10 text-xs font-light text-current/70">
              {currentMonthCount > 0
                ? `이번 ${currentMonthName}에 남겨주신 ${currentMonthCount}개의 순간들. 대학의 사계절이 빛나고 있습니다.`
                : '아직 이번 달에는 기록된 소중한 조각이 없어요. 사소한 장소의 영감이라도 간직해 보시는 것은 어떨까요?'}
            </div>
          </motion.div>

        </div>

        {/* MONTHLY TIMELINE ANALOG PLOT */}
        <div
          id="stat-timeline-graph"
          className={`p-6 rounded border transition-all duration-300 ${
            isDark
              ? 'bg-[#1A1A1A] border-brand-cream/10'
              : 'bg-[#FAF7F2] border-brand-brown/20'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-6 border-b border-brand-brown/10 pb-4">
            <div>
              <h4 className="font-serif text-xl font-bold tracking-wide flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-brown" />
                시간의 결: 아카이브 누적 밀도
              </h4>
              <p className="text-[11px] font-mono text-current/60">
                지나간 6차례의 캘린더 주기 속에서 생성된 아카이브 히스토그램입니다.
              </p>
            </div>
            <div className="text-[10px] font-mono text-brand-brown uppercase tracking-widest">
              SHUTTER SPECTRUM / TIMELINE WAVE
            </div>
          </div>

          {/* Histograms / Custom Styled Columns */}
          <div className="grid grid-cols-6 gap-3 sm:gap-6 pt-6 relative h-40 items-end">
            {monthlyBuckets.map((bucket, index) => {
              const fileCount = bucket.count;
              const heightPct = Math.round((fileCount / maxBucketCount) * 100);

              return (
                <div key={index} className="flex flex-col items-center group h-full justify-end">
                  {/* Floating count on hover */}
                  <span className="text-[10px] font-mono font-bold text-brand-brown mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    {fileCount}
                  </span>

                  {/* Aesthetic column representing index bars */}
                  <div className="w-full relative rounded-t-xs overflow-hidden transition-all duration-300" style={{ height: `${Math.max(heightPct, 5)}%` }}>
                    {/* Retro tape film color strip */}
                    <div className="absolute inset-0 bg-brand-brown/30 border-t-2 border-brand-brown group-hover:bg-brand-brown/50 transition-colors" />
                    
                    {/* Diagonal lines to look like technical blueprint paper */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,currentColor_4px,currentColor_8px)]" />
                  </div>

                  {/* X-Axis Month label */}
                  <span className="font-mono text-[10px] text-current/75 mt-3 tracking-widest">
                    {bucket.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
