export type RevelationType = 'Meccan' | 'Medinan';

export interface SurahMeta {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  englishTranslation: string;
  revelationType: RevelationType;
  ayahCount: number;
  startJuz: number;
}

export interface Ayah {
  numberInSurah: number;
  globalNumber: number;
  text: string;
  translation?: string;
  juz?: number;
  page?: number;
  sajdah?: boolean;
}

export type RiwayahId = 
  | 'hafs' 
  | 'warsh' 
  | 'khalaf' 
  | 'qaloon' 
  | 'doori' 
  | 'soosi' 
  | 'shouba' 
  | 'duri_kisai';

export interface RiwayahInfo {
  id: RiwayahId;
  nameArabic: string;
  nameEnglish: string;
  imamArabic: string;
  imamEnglish: string;
  rawiArabic: string;
  rawiEnglish: string;
  schoolArabic: string;
  schoolEnglish: string;
  qiraahArabic: string;
  qiraahEnglish: string;
  regionArabic: string;
  regionEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  keyFeaturesArabic: string[];
  keyFeaturesEnglish: string[];
  tajweedFocusArabic: string[];
  tajweedFocusEnglish: string[];
  prominentRecitersArabic: string[];
  prominentRecitersEnglish: string[];
  textEdition?: string;
  badgeColor?: string;
}

export interface Reciter {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  riwayahId: RiwayahId;
  riwayahNameArabic: string;
  riwayahNameEnglish: string;
  subtextArabic: string;
  subtextEnglish: string;
  style: 'Murattal' | 'Mujawwad' | 'Muallim';
  audioType: 'ayah' | 'surah';
  folderOrServer: string; // EveryAyah folder or mp3quran server URL
  audioQuality?: string;
}

export type TafsirType = 'muyassar' | 'tabari';

export interface TafsirInfo {
  type: TafsirType;
  nameArabic: string;
  nameEnglish: string;
  authorArabic: string;
  authorEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
}

export interface TafsirResponse {
  surahNumber: number;
  ayahNumber: number;
  tafsirType: TafsirType;
  text: string;
  author: string;
  bookName: string;
}

export interface Bookmark {
  id: string;
  surahId: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayahText: string;
  timestamp: number;
  note?: string;
}

export interface LastRead {
  surahId: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  timestamp: number;
}

export type QuranFont = 'amiri-quran' | 'amiri' | 'scheherazade';
export type ViewMode = 'ayah-by-ayah' | 'mushaf';
