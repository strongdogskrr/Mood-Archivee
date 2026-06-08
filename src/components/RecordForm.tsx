import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, Calendar, Film, X, Upload, Check, AlertCircle } from 'lucide-react';
import { MoodType, MOODS, Memory, RecordType, RECORD_TYPES } from '../types';

interface RecordFormProps {
  isDark: boolean;
  preselectedMood: MoodType | null;
  onSave: (memory: Omit<Memory, 'id' | 'timestamp'>) => void;
  onClose: () => void;
}

// 4 high-quality fallback options in case they don't have a picture nearby
const AESTHETIC_PRESETS = [
  {
    name: '아늑한 커피 테이블',
    url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: '클래식 필름 카메라',
    url: 'https://images.unsplash.com/photo-1495707902641-75ca588d2562?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: '기차 창밖 풍경',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
  },
  {
    name: '고요한 도서관 서가',
    url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop',
  }
];

const DEFAULT_FALLBACK_IMAGES: Record<RecordType, string> = {
  Photo: 'https://images.unsplash.com/photo-1495707902641-75ca588d2562?q=80&w=800&auto=format&fit=crop',
  Shorts: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
  Cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
  Exhibit: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
  Book: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop',
  Performance: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=800&auto=format&fit=crop',
};

export default function RecordForm({
  isDark,
  preselectedMood,
  onSave,
  onClose,
}: RecordFormProps) {
  const [recordType, setRecordType] = useState<RecordType>('Photo');
  const [shortsUrl, setShortsUrl] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [mood, setMood] = useState<MoodType>('Calm');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');
  
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync mood with header selected mood if available
  useEffect(() => {
    if (preselectedMood) {
      setMood(preselectedMood);
    }
  }, [preselectedMood]);

  // Handle Drag operations for File Upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일(PNG, JPG, WEBP)만 업로드할 수 있습니다.');
      return;
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 용량이 너무 큽니다. 최대 용량은 5MB입니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setPreviewUrl(reader.result);
        setImageName(file.name);
      }
    };
    reader.onerror = () => {
      setError('이미지 파일을 읽는 데 실패했습니다.');
    };
    reader.readAsDataURL(file);
  };

  // Selector for aesthetic preset
  const selectPresetImage = (url: string, name: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
    setImageName(`클래식 프리셋: ${name}`);
  };

  // Submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isShorts = recordType === 'Shorts';

    if (!title.trim()) {
      setError(isShorts ? '숏츠 제목을 작성해 주세요.' : '기억의 제목을 작성해 주세요.');
      return;
    }
    if (!location.trim()) {
      setError('머문 공간이나 장소를 입력해 주세요.');
      return;
    }
    if (isShorts && !shortsUrl.trim()) {
      setError('숏츠 링크(URL)를 입력해 주세요.');
      return;
    }
    if (!description.trim()) {
      setError(isShorts ? '숏츠 설명을 채워주세요.' : '당시의 분위기나 느낌을 짧은 일기로 채워주세요.');
      return;
    }
    if (recordType === 'Photo' && !imageUrl) {
      setError('찰나의 분위기를 표현할 사진을 하나 업로드하거나 샘플 이미지에서 선택해 주세요.');
      return;
    }

    const finalImageUrl = imageUrl || DEFAULT_FALLBACK_IMAGES[recordType];

    // Call save trigger
    onSave({
      title: title.trim(),
      location: location.trim(),
      date,
      mood,
      description: description.trim(),
      imageUrl: finalImageUrl,
      type: recordType,
      shortsUrl: isShorts ? shortsUrl.trim() : undefined,
    });

    // Reset fields
    setTitle('');
    setLocation('');
    setDate(new Date().toISOString().substring(0, 10));
    setMood('Calm');
    setDescription('');
    setImageUrl('');
    setPreviewUrl('');
    setImageName('');
    setRecordType('Photo');
    setShortsUrl('');
  };

  return (
    <div
      id="record-container"
      className={`relative rounded-lg border p-6 sm:p-8 overflow-hidden transition-all duration-300 ${
        isDark
          ? 'bg-[#1A1A1A] border-brand-cream/15 text-brand-cream'
          : 'bg-[#FAF7F2] border-brand-brown/30 text-brand-black'
      }`}
    >
      {/* Small notebook ring pattern on the side for retro school notebook feel */}
      <div className="absolute top-0 bottom-0 left-2 w-1 flex flex-col justify-around pointer-events-none opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full border border-current" />
        ))}
      </div>

      <div className="pl-4">
        {/* Form Title */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-brown block mb-1">
              RECORDING INTERFACE
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-semibold flex items-center gap-2">
              <Film className="w-5 h-5 text-brand-brown" />
              찰나의 <span className="italic font-normal text-brand-brown">분위기를 기록하다</span>
            </h3>
          </div>
          <button
            id="close-form-btn"
            onClick={onClose}
            className="p-1 px-2 font-mono text-[10px] uppercase tracking-wider text-current/50 hover:text-current hover:bg-brand-brown/10 rounded border border-transparent hover:border-brand-brown/30 transition-all flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> 닫기
          </button>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              id="form-error-banner"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-xs flex items-center gap-2 mb-6"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기록 유형 선택 (Record Type Selector) */}
          <div className="border-b border-brand-brown/10 pb-4">
            <label className="block font-mono text-xs uppercase tracking-wider font-semibold mb-2 text-brand-brown">
              우리의 기록 유형 (Type)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {RECORD_TYPES.map((rt) => {
                const isSelected = recordType === rt.type;
                return (
                  <button
                    key={rt.type}
                    id={`form-type-${rt.type}`}
                    type="button"
                    onClick={() => {
                      setRecordType(rt.type);
                      setError('');
                    }}
                    className={`py-2 rounded border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-brown/25 border-brand-brown text-brand-brown font-semibold shadow-xs'
                        : isDark
                          ? 'border-brand-cream/15 bg-[#222] text-brand-cream/60 hover:text-brand-cream hover:border-brand-cream/35'
                          : 'border-brand-brown/20 bg-white text-brand-black/60 hover:text-brand-black hover:border-brand-brown/40'
                    }`}
                  >
                    <span className="text-xl mb-0.5">{rt.emoji}</span>
                    <span className="text-[10px] font-mono tracking-tighter uppercase">{rt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN: Meta information */}
            <div className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-semibold mb-1.5 text-brand-brown">
                  {recordType === 'Shorts' ? '1. 숏츠 제목' : '1. 기억의 제목'}
                </label>
                <input
                  id="input-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={recordType === 'Shorts' ? '예: 대학교 일상 브이로그 #shorts' : '예: 비 내리는 오후의 창가, 한낮의 푸른 운동장...'}
                  className={`w-full px-3 py-2 bg-transparent border rounded text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-brand-brown ${
                    isDark
                      ? 'border-brand-cream/15 text-brand-cream placeholder-brand-cream/30'
                      : 'border-brand-brown/30 text-brand-black placeholder-brand-brown/50'
                  }`}
                />
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-semibold mb-1.5 text-brand-brown flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> 2. 머문 공간 / 장소
                  </label>
                  <input
                    id="input-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="예: 중앙도서관 3층, 아늑한 다락카페"
                    className={`w-full px-3 py-2 bg-transparent border rounded text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-brand-brown ${
                      isDark
                        ? 'border-brand-cream/15 text-brand-cream placeholder-brand-cream/30'
                        : 'border-brand-brown/30 text-brand-black placeholder-brand-brown/50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-semibold mb-1.5 text-brand-brown flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {recordType === 'Shorts' ? '3. 숏츠 업로드 일자' : '3. 기록하고 싶은 기한'}
                  </label>
                  <input
                    id="input-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full px-3 py-2 bg-transparent border rounded text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-brand-brown ${
                      isDark
                        ? 'border-brand-cream/15 text-brand-cream'
                        : 'border-brand-brown/30 text-brand-black'
                    }`}
                  />
                </div>
              </div>

              {/* Shorts Link Input - ONLY shown when Shorts is selected */}
              <AnimatePresence>
                {recordType === 'Shorts' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block font-mono text-xs uppercase tracking-wider font-semibold mb-1.5 text-brand-brown">
                      숏츠 링크(URL)
                    </label>
                    <input
                      id="input-shorts-url"
                      type="text"
                      value={shortsUrl}
                      onChange={(e) => setShortsUrl(e.target.value)}
                      placeholder="예: https://youtube.com/shorts/... 또는 숏츠 동영상 링크"
                      className={`w-full px-3 py-2 bg-transparent border rounded text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-brand-brown ${
                        isDark
                          ? 'border-brand-cream/15 text-brand-cream placeholder-brand-cream/30 z-10 relative'
                          : 'border-brand-brown/30 text-brand-black placeholder-brand-brown/50 z-10 relative'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mood Selection Card group */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-semibold mb-2 text-brand-brown">
                  {recordType === 'Shorts' ? '4. 숏츠의 감정 색채' : '4. 공간의 감정 색채'}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {MOODS.map((m) => {
                    const isSelected = mood === m.type;
                    return (
                      <button
                        key={m.type}
                        id={`form-mood-${m.type}`}
                        type="button"
                        onClick={() => setMood(m.type)}
                        className={`py-2 rounded border flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-brand-brown/25 border-brand-brown text-brand-brown font-semibold'
                            : isDark
                              ? 'border-brand-cream/15 bg-[#222] text-brand-cream/60 hover:text-brand-cream'
                              : 'border-brand-brown/20 bg-white text-brand-black/60 hover:text-brand-black'
                        }`}
                        title={m.label}
                      >
                        <span className="text-xl">{m.emoji}</span>
                        <span className="text-[10px] font-mono mt-0.5 tracking-tighter uppercase">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Diary Text area */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-semibold mb-1.5 text-brand-brown">
                  {recordType === 'Shorts' ? '5. 숏츠 설명' : '5. 분위기와 머릿결의 조각 (짧은 사색)'}
                </label>
                <textarea
                  id="input-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={recordType === 'Shorts' ? '숏츠 영상의 짤막한 설명을 채워주세요...' : '당시 당신을 감싸던 공기의 온도를 기록하세요. 은은하게 흘러나오던 음악 소리, 마음을 감지럽히던 생각들까지 편하게 녹여내 보세요...'}
                  className={`w-full px-3 py-2 bg-transparent border rounded text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-brand-brown resize-none ${
                    isDark
                      ? 'border-brand-cream/15 text-brand-cream placeholder-brand-cream/30'
                      : 'border-brand-brown/30 text-brand-black placeholder-brand-brown/50'
                  }`}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Image Archiver */}
            <div className="space-y-4">
              <label className="block font-mono text-xs uppercase tracking-wider font-semibold text-brand-brown">
                {recordType === 'Shorts' ? '6. 숏츠 썸네일 이미지 업로드' : '6. 시각적 인화 (사진 업로드)'}
              </label>

              {/* Upload Drop Zone / Preview */}
              <div
                id="drag-and-drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative h-56 rounded border-2 border-dashed flex flex-col items-center justify-center p-4 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-brand-brown bg-brand-brown/10'
                    : isDark
                      ? 'border-brand-cream/15 bg-brand-black/30 hover:border-brand-brown/40'
                      : 'border-brand-brown/30 bg-white/75 hover:border-brand-brown/60'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  id="form-file-picker"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="absolute inset-0 w-full h-full p-2 group">
                    <img
                      src={previewUrl}
                      alt="Memory preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded filter brightness-95"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <p className="font-mono text-xs text-brand-cream flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> 다른 이미지 선택하기
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pointer-events-none text-current/70">
                    <div className="mx-auto w-10 h-10 rounded-full bg-brand-brown/10 flex items-center justify-center text-brand-brown">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold">{recordType === 'Shorts' ? '이곳에 숏츠 썸네일 이미지를 끌어다 놓으세요' : '이곳에 찰나의 순간을 끌어다 놓으세요'}</p>
                    <p className="text-[10px] text-current/50">
                      {recordType === 'Shorts' ? '또는 클릭하여 썸네일 업로드 (최대 5MB)' : '또는 가볍게 클릭하여 사진 선택 (최대 5MB)'}
                    </p>
                    {recordType !== 'Photo' && (
                      <p className="text-[10px] text-brand-brown/85 font-mono">
                        * 미등록 시 아늑하고 분위기 있는 기본 테마 이미지가 설정됩니다
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Status Indicator inside Upload Field */}
              {imageName && (
                <div id="image-status-badge" className="flex items-center gap-2 p-2 rounded text-xs bg-brand-brown/10 border border-brand-brown/20">
                  <Check className="w-3.5 h-3.5 text-brand-brown" />
                  <span className="font-mono truncate flex-1 opacity-90">{imageName}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrl('');
                      setPreviewUrl('');
                      setImageName('');
                    }}
                    className="p-1 hover:text-red-400 transition-colors"
                    title="사진 제거"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Shortcut Presets selector for effortless test */}
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-current/60 mb-2">
                  촬영된 사진이 없다면? 클래식 뷰포인트 프리셋 선택:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {AESTHETIC_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      id={`preset-img-btn-${preset.name.replace(/\s+/g, '-').toLowerCase()}`}
                      type="button"
                      onClick={() => selectPresetImage(preset.url, preset.name)}
                      className={`relative h-12 rounded overflow-hidden border hover:border-brand-brown transition-all ${
                        imageName === `클래식 프리셋: ${preset.name}` ? 'ring-2 ring-brand-brown border-brand-brown' : 'border-transparent'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} referrerPolicy="no-referrer" className="w-full h-full object-cover filter brightness-90 saturate-75" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-mono text-white text-center py-0.5 truncate px-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Form Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-brown/20">
            <button
              id="cancel-record-btn"
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider bg-transparent rounded-sm hover:underline ${
                isDark ? 'text-brand-cream/70' : 'text-brand-black/70'
              }`}
            >
              기록 취소하기
            </button>
            <motion.button
              id="save-memory-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-2.5 bg-brand-brown hover:bg-[#8D7350] text-[#111111] font-mono text-xs uppercase tracking-wider font-semibold rounded-sm shadow-md transition-colors"
            >
              기억 보관소에 저장하기
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
