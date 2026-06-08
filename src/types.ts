export type MoodType = 'Happy' | 'Calm' | 'Excited' | 'Nostalgic' | 'Lonely';
export type RecordType = 'Photo' | 'Shorts' | 'Cafe' | 'Exhibit' | 'Book' | 'Performance';

export interface Memory {
  id: string;
  title: string;
  location: string;
  date: string;
  mood: MoodType;
  description: string;
  imageUrl: string;
  timestamp: number;
  type?: RecordType; // default to 'Photo' if client didn't supply
  shortsUrl?: string; // link to youtube shorts or similar video platforms
}

export interface MoodMetadata {
  type: MoodType;
  emoji: string;
  label: string;
  colorClass: string; // for border/background highlights
  colorHex: string;
}

export interface RecordTypeMetadata {
  type: RecordType;
  emoji: string;
  label: string;
}

export const RECORD_TYPES: RecordTypeMetadata[] = [
  { type: 'Photo', emoji: '📷', label: '사진' },
  { type: 'Shorts', emoji: '🎬', label: '숏츠' },
  { type: 'Cafe', emoji: '☕', label: '카페' },
  { type: 'Exhibit', emoji: '🎨', label: '전시' },
  { type: 'Book', emoji: '📚', label: '독서' },
  { type: 'Performance', emoji: '🎭', label: '공연' },
];

export const MOODS: MoodMetadata[] = [
  {
    type: 'Happy',
    emoji: '😊',
    label: '행복해',
    colorClass: 'border-[#F5F1E8]/40 hover:border-amber-400 text-amber-300',
    colorHex: '#fbbf24',
  },
  {
    type: 'Calm',
    emoji: '🌿',
    label: '평온해',
    colorClass: 'border-[#F5F1E8]/40 hover:border-emerald-400 text-emerald-300',
    colorHex: '#34d399',
  },
  {
    type: 'Excited',
    emoji: '✨',
    label: '설레어',
    colorClass: 'border-[#F5F1E8]/40 hover:border-indigo-400 text-indigo-300',
    colorHex: '#818cf8',
  },
  {
    type: 'Nostalgic',
    emoji: '📷',
    label: '아련해',
    colorClass: 'border-[#F5F1E8]/40 hover:border-orange-400 text-orange-300',
    colorHex: '#fb923c',
  },
  {
    type: 'Lonely',
    emoji: '🌙',
    label: '쓸쓸해',
    colorClass: 'border-[#F5F1E8]/40 hover:border-purple-400 text-purple-300',
    colorHex: '#c084fc',
  },
];
