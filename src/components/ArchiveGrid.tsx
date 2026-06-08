import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Trash2, Calendar, MapPin, Eye, Filter, ArrowUpDown, Camera } from 'lucide-react';
import { Memory, MoodType, MOODS, RecordType, RECORD_TYPES } from '../types';

interface ArchiveGridProps {
  isDark: boolean;
  memories: Memory[];
  onDelete: (id: string) => void;
  selectedMoodFilter: MoodType | null;
  onSetMoodFilter: (mood: MoodType | null) => void;
}

export default function ArchiveGrid({
  isDark,
  memories,
  onDelete,
  selectedMoodFilter,
  onSetMoodFilter,
}: ArchiveGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<RecordType | 'All'>('All');

  // Apply filters: search, mood filter, record type filter
  const filteredMemories = memories
    .filter((m) => {
      if (!m) return false;
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesTitle = m.title?.toLowerCase().includes(query) || false;
        const matchesLoc = m.location?.toLowerCase().includes(query) || false;
        const matchesDesc = m.description?.toLowerCase().includes(query) || false;
        const matchesMood = m.mood?.toLowerCase().includes(query) || false;
        return matchesTitle || matchesLoc || matchesDesc || matchesMood;
      }
      return true;
    })
    .filter((m) => {
      if (!m) return false;
      // 2. Mood selection
      if (selectedMoodFilter) {
        return m.mood === selectedMoodFilter;
      }
      return true;
    })
    .filter((m) => {
      if (!m) return false;
      // 2b. Record Type selection
      if (selectedTypeFilter !== 'All') {
        const memoryType = m.type || 'Photo';
        return memoryType === selectedTypeFilter;
      }
      return true;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      const isValidA = !isNaN(dateA);
      const isValidB = !isNaN(dateB);
      if (!isValidA && !isValidB) return 0;
      if (!isValidA) return 1;
      if (!isValidB) return -1;
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <section id="gallery" className="py-16 max-w-6xl mx-auto px-4">
      {/* Title & Senses */}
      <div className="mb-12 text-center md:text-left md:flex items-end justify-between border-b pb-6 border-brand-brown/15">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-brand-brown block mb-1">
            DIGITAL EXPOSURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-wide">
            기억 <span className="italic font-normal text-brand-brown">보관소</span>
          </h2>
          <p className="text-xs text-current/80 mt-1 font-light max-w-md">
            폴라로이드 필름 위 기억들을 살펴보고, 그날의 감정 주파수나 구절을 검색해 소중한 찰나를 다시 느껴보세요.
          </p>
        </div>

        {/* Info stats for matching results */}
        <div className="mt-4 md:mt-0 font-mono text-xs text-brand-brown/80">
          전체 {memories.length}장의 필름 중 {filteredMemories.length}장 보임
        </div>
      </div>

      {/* FILTER & CONTROL PANEL */}
      <div
        id="archive-filter-controls"
        className={`p-4 rounded-md mb-10 border transition-all duration-300 flex flex-col md:flex-row gap-4 items-center justify-between ${
          isDark
            ? 'bg-[#181818] border-brand-cream/10'
            : 'bg-[#FAF8F5] border-brand-brown/20'
        }`}
      >
        {/* Search Input Bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown/70" />
          <input
            id="search-memories-input"
            type="text"
            placeholder="단골 카페, 노을, 자정, 과제..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 bg-transparent border rounded text-xs transition-all focus:outline-hidden focus:ring-1 focus:ring-brand-brown ${
              isDark
                ? 'border-brand-cream/15 text-brand-cream placeholder-brand-cream/35'
                : 'border-brand-brown/25 text-brand-black placeholder-brand-brown/50'
            }`}
          />
        </div>

        {/* Filter Quick-Buttons & Sorting Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
          {/* Mood filter dropdown style selector */}
          <div className="flex items-center gap-1.5 bg-brand-brown/5 px-2.5 py-1 rounded border border-brand-brown/15">
            <Filter className="w-3.5 h-3.5 text-brand-brown" />
            <select
              id="mood-select-filter"
              value={selectedMoodFilter || ''}
              onChange={(e) => onSetMoodFilter((e.target.value as MoodType) || null)}
              className="bg-transparent border-none text-xs font-mono text-current focus:outline-hidden cursor-pointer"
            >
              <option value="">모든 감정 색채</option>
              {MOODS.map((mo) => (
                <option key={mo.type} value={mo.type} className={isDark ? 'bg-[#181818]' : 'bg-[#FAF8F5]'}>
                  {mo.emoji} {mo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order toggle */}
          <button
            id="sort-date-toggle"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className={`px-3 py-1.5 rounded border text-xs font-mono tracking-wider flex items-center gap-1.5 transition-colors duration-300 ${
              isDark
                ? 'border-brand-cream/15 hover:bg-brand-cream/5 hover:border-brand-brown lg:bg-[#202020]'
                : 'border-brand-brown/20 hover:bg-brand-brown/5 hover:border-brand-brown bg-white'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-brown" />
            <span>정렬: {sortOrder === 'desc' ? '최신 순으로' : '오래된 순으로'}</span>
          </button>
        </div>
      </div>

      {/* RECORD TYPE FILTER */}
      <div id="type-filter-tabs" className="mb-8 flex flex-wrap items-center gap-2 border-b border-brand-brown/10 pb-4">
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-brown font-semibold mr-2 block">
          기록 유형 (Type)
        </span>
        <button
          id="type-filter-all"
          onClick={() => setSelectedTypeFilter('All')}
          className={`px-3 py-1 text-xs font-semibold rounded-xs cursor-pointer transition-all border ${
            selectedTypeFilter === 'All'
              ? 'bg-brand-brown text-[#111] border-brand-brown'
              : isDark
                ? 'border-brand-cream/10 text-brand-cream/60 hover:text-brand-cream bg-[#222]/30'
                : 'border-brand-brown/15 text-brand-black/60 hover:text-brand-black bg-white/40'
          }`}
        >
          🎞️ 전체
        </button>
        {RECORD_TYPES.map((rt) => {
          const isSelected = selectedTypeFilter === rt.type;
          return (
            <button
              key={rt.type}
              id={`type-filter-${rt.type}`}
              onClick={() => setSelectedTypeFilter(rt.type)}
              className={`px-3 py-1 text-xs font-medium rounded-xs cursor-pointer transition-all border flex items-center gap-1 ${
                isSelected
                  ? 'bg-brand-brown text-[#111] border-brand-brown font-semibold shadow-xs'
                  : isDark
                    ? 'border-brand-cream/10 text-brand-cream/60 hover:text-brand-cream bg-[#222]/30'
                    : 'border-brand-brown/15 text-brand-black/60 hover:text-brand-black bg-white/40'
              }`}
            >
              <span>{rt.emoji}</span>
              <span>{rt.label}</span>
            </button>
          );
        })}
      </div>

      {/* MASONRY PICTURE GRID */}
      {filteredMemories.length > 0 ? (
        <div
          id="masonry-gallery-grid"
          className="columns-1 xs:columns-2 md:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMemories.map((memory, index) => {
              if (!memory) return null;
              const matchedMood = MOODS.find((md) => md.type === memory.mood);
              const matchedType = RECORD_TYPES.find((rt) => rt.type === (memory.type || 'Photo'));
              const cardId = `memory-card-${memory.id || index}`;

              return (
                <motion.div
                  key={memory.id || index}
                  id={cardId}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45 }}
                  className={`break-inside-avoid relative rounded-sm overflow-hidden p-3.5 border transition-all duration-500 group flex flex-col ${
                    isDark
                      ? 'bg-[#1A1A1A] border-brand-cream/10 hover:border-brand-brown/60'
                      : 'bg-[#FAF7F2] border-brand-brown/20 hover:border-brand-brown'
                  }`}
                  style={{
                    boxShadow: isDark
                      ? '0 4px 20px rgba(0,0,0,0.4)'
                      : '0 4px 20px rgba(166,138,100,0.08)',
                  }}
                  onMouseEnter={() => setActiveCardId(memory.id || null)}
                  onMouseLeave={() => setActiveCardId(null)}
                >
                  {/* Aspect-variable Film Cam frame top photo */}
                  <div className="relative overflow-hidden bg-black rounded-xs aspect-4/3 mb-4.5">
                    <img
                      src={memory.imageUrl || ''}
                      alt={memory.title || '기억'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-[0.88]"
                    />

                    {/* Camera Film Indicator tags / Date on top overlay */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                      <span className="font-mono text-[9px] font-semibold text-brand-cream bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-xs uppercase tracking-wider">
                        {matchedMood?.emoji || '📷'} {matchedMood?.label || '기억'}
                      </span>
                      {matchedType && (
                        <span className="font-mono text-[9px] font-semibold text-[#111111] bg-brand-cream px-2 py-0.5 rounded-full border border-brand-brown/30 backdrop-blur-xs uppercase tracking-wider">
                          {matchedType.emoji} {matchedType.label}
                        </span>
                      )}
                    </div>

                    {/* Quick Eye action overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <p className="font-serif italic text-xs text-white opacity-90 text-center line-clamp-2 max-w-[85%]">
                        &ldquo;{(memory.description || '').slice(0, 75)}...&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card Editorial Description details (Polaroid Bottom style) */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta: Location and Date */}
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono opacity-60 mb-1.5">
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3 text-brand-brown inline" />
                          {memory.location || ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-brown inline" />
                          {memory.date || ''}
                        </span>
                      </div>

                      {/* Header block */}
                      <h4 className="font-serif text-xl font-semibold tracking-wide leading-tight text-current group-hover:text-brand-brown transition-colors mb-2.5">
                        {memory.title || ''}
                      </h4>

                      {/* Description body */}
                      <p className="text-xs text-current/75 font-light leading-relaxed mb-4 whitespace-pre-wrap">
                        {memory.description || ''}
                      </p>

                      {/* Watch Video button (for Youtube Shorts or similar URLs) */}
                      {memory.type === 'Shorts' && memory.shortsUrl && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mb-4"
                        >
                          <a
                            href={memory.shortsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 bg-brand-brown hover:bg-[#8D7350] text-[#111111] font-mono text-[10.5px] uppercase font-bold tracking-widest rounded-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            title="새 창에서 영상 보기"
                          >
                            <span>▶ 영상 보기</span>
                          </a>
                        </motion.div>
                      )}
                    </div>

                    {/* Delete action footer bar */}
                    <div className="pt-3 border-t border-brand-brown/10 flex justify-between items-center text-[10px] uppercase font-mono tracking-widest text-brand-brown">
                      <span>FPS 24 / N-84</span>
                      <button
                        id={`delete-btn-${memory.id || index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (memory.id) {
                            setDeleteConfirmId(memory.id);
                          }
                        }}
                        className="opacity-40 group-hover:opacity-100 hover:text-red-500 hover:opacity-100 p-1 flex items-center gap-1 transition-all"
                        title="기억 지우기"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">삭제</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty Search or Filters result state */
        <motion.div
          id="empty-gallery-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-12 text-center rounded border border-dashed text-current/60 flex flex-col items-center justify-center ${
            isDark ? 'border-brand-cream/15' : 'border-brand-brown/30'
          }`}
        >
          <Camera className="w-10 h-10 text-brand-brown mb-3 stroke-[1.5] animate-pulse" />
          <h4 className="font-serif text-lg font-semibold mb-1">인화된 필름이 없습니다</h4>
          <p className="text-xs max-w-sm mb-4">
            설정하신 감정 필터나 검색 조건에 일치하는 사색의 순간이 없습니다. 필터를 초기화하거나 새로운 하루를 아카이브해 보세요.
          </p>
          <div className="flex gap-3">
            <button
              id="empty-reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                onSetMoodFilter(null);
                setSelectedTypeFilter('All');
              }}
              className="px-3 py-1.5 border border-brand-brown/30 text-xs font-mono uppercase tracking-wider rounded-sm hover:-translate-y-0.5 hover:border-brand-brown transition-all"
            >
              필터 초기화
            </button>
          </div>
        </motion.div>
      )}

      {/* Beautiful Custom Confirmation Modal for Deletion */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35 }}
              className={`w-full max-w-sm p-6 rounded-md border text-center relative ${
                isDark
                  ? 'bg-[#181818] border-brand-cream/15 text-brand-cream shadow-2xl'
                  : 'bg-[#FAF8F5] border-brand-brown/30 text-brand-black shadow-2xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                <Trash2 className="w-5 h-5 text-red-500 animate-pulse" />
              </div>

              <h3 className="font-serif text-lg font-semibold tracking-wide mb-1.5 text-current">
                정말 삭제하시겠습니까?
              </h3>

              <p className="text-xs opacity-75 mb-6 leading-relaxed max-w-xs mx-auto">
                이 아름다운 기억 폴라로이드 조각을 완전히 지웁니다. 이 작업은 되돌릴 수 없습니다.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  id="cancel-delete-btn"
                  onClick={() => setDeleteConfirmId(null)}
                  className={`flex-1 py-2 rounded-sm font-mono text-[11px] uppercase tracking-wider border font-medium transition-all cursor-pointer ${
                    isDark
                      ? 'border-brand-cream/15 hover:bg-brand-cream/5 text-brand-cream/80'
                      : 'border-brand-brown/30 hover:bg-brand-brown/5 text-brand-brown'
                  }`}
                >
                  취소
                </button>
                <button
                  id="confirm-delete-btn"
                  onClick={() => {
                    if (deleteConfirmId) {
                      onDelete(deleteConfirmId);
                      setDeleteConfirmId(null);
                    }
                  }}
                  className="flex-1 py-2 rounded-sm font-mono text-[11px] uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-colors cursor-pointer"
                >
                  기억 삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
