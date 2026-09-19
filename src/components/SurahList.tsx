import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Volume2, 
  Bookmark, 
  Sparkles, 
  Filter, 
  ChevronDown, 
  Check,
  Scroll,
  Headphones,
  Compass,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ALL_SURAHS } from '../data/surahs';
import { SurahMeta, LastRead, RiwayahId, Reciter } from '../types/quran';
import { RiwayatSection } from './RiwayatSection';
import { getRiwayahById } from '../data/riwayat';

interface SurahListProps {
  onSelectSurah: (surahId: number, startAyah?: number) => void;
  onQuickPlaySurah: (surahId: number) => void;
  lastRead: LastRead | null;
  uiLang: 'ar' | 'en';
  activeRiwayahId: RiwayahId;
  onSelectRiwayah: (id: RiwayahId) => void;
  onOpenRiwayahModalWithId: (id: RiwayahId) => void;
  onSelectReciter: (reciter: Reciter) => void;
  onOpenTajweedLegend?: () => void;
}

export const SurahList: React.FC<SurahListProps> = ({
  onSelectSurah,
  onQuickPlaySurah,
  lastRead,
  uiLang,
  activeRiwayahId,
  onSelectRiwayah,
  onOpenRiwayahModalWithId,
  onSelectReciter,
  onOpenTajweedLegend,
}) => {
  const [mainTab, setMainTab] = useState<'surahs' | 'riwayat'>('surahs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [selectedJuz, setSelectedJuz] = useState<number | 'all'>('all');
  const [isCompactView, setIsCompactView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024; // Default to compact on mobile/tablets to fit without scrolling
    }
    return true;
  });

  const filteredSurahs = useMemo(() => {
    return ALL_SURAHS.filter((surah) => {
      // Revelation filter
      if (filterType !== 'all' && surah.revelationType !== filterType) {
        return false;
      }
      // Juz filter
      if (selectedJuz !== 'all' && surah.startJuz !== selectedJuz) {
        return false;
      }
      // Search term filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      const numMatch = String(surah.id) === term;
      const arabicMatch = surah.nameArabic.includes(term) || `سورة ${surah.nameArabic}`.includes(term);
      const englishMatch = surah.nameEnglish.toLowerCase().includes(term);
      const translationMatch = surah.englishTranslation.toLowerCase().includes(term);

      return numMatch || arabicMatch || englishMatch || translationMatch;
    });
  }, [searchTerm, filterType, selectedJuz]);

  const activeRiwayah = getRiwayahById(activeRiwayahId);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-6 overflow-x-hidden">
      {/* 
        Top Navigation & Viewport Mode Bar
        Fits seamlessly at the top of the screen across all devices 
      */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 p-2 rounded-2xl bg-white border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="tab-surahs-list-btn"
            onClick={() => setMainTab('surahs')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mainTab === 'surahs'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{uiLang === 'ar' ? 'فهرس السور (114)' : 'Surahs (114)'}</span>
          </button>

          <button
            id="tab-riwayat-section-btn"
            onClick={() => setMainTab('riwayat')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mainTab === 'riwayat'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-500" />
            <span>{uiLang === 'ar' ? 'قسم الروايات والمصاحف (8)' : 'Riwayat (8)'}</span>
          </button>
        </div>

        {/* Action Controls Group: Riwayah Badge, Tajweed Guide, Compact Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Riwayah quick display */}
          <button
            id="surah-list-riwayah-badge"
            onClick={() => onOpenRiwayahModalWithId(activeRiwayahId)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'تغيير الرواية وقواعد التجويد' : 'Change Riwayah'}
          >
            <Scroll className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span className="font-amiri font-bold">
              {uiLang === 'ar' ? activeRiwayah.nameArabic : activeRiwayah.nameEnglish}
            </span>
          </button>

          {/* Tajweed Guide button */}
          {onOpenTajweedLegend && (
            <button
              onClick={onOpenTajweedLegend}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-xs font-semibold transition-colors cursor-pointer"
              title={uiLang === 'ar' ? 'دليل ألوان التجويد' : 'Tajweed Color Guide'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{uiLang === 'ar' ? 'ألوان التجويد' : 'Tajweed'}</span>
            </button>
          )}

          {/* Compact Viewport Toggle */}
          <button
            id="toggle-surahlist-compact-view"
            onClick={() => setIsCompactView(!isCompactView)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'التبديل بين العرض المدمج للشاشات والعرض التفصيلي' : 'Toggle compact view to minimize scrolling'}
          >
            {isCompactView ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isCompactView ? (uiLang === 'ar' ? 'العرض الكامل' : 'Full View') : (uiLang === 'ar' ? 'عرض متكيف' : 'Compact')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Riwayat Showcase */}
      {mainTab === 'riwayat' && (
        <RiwayatSection
          activeRiwayahId={activeRiwayahId}
          onSelectRiwayah={onSelectRiwayah}
          onOpenRiwayahModalWithId={onOpenRiwayahModalWithId}
          onSelectReciter={onSelectReciter}
          uiLang={uiLang}
        />
      )}

      {/* Main Tab 2: Surahs Directory */}
      {mainTab === 'surahs' && (
        <>
          {/* Header Area: Either Compact Command Bar or Full Decorative Banner */}
          {isCompactView ? (
            /* COMPACT VIEW: Fits entirely within screen dimensions without pushing Surahs below the fold */
            <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-stone-950 text-stone-100 border border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-amiri text-amber-100 leading-tight">
                    {uiLang === 'ar' ? 'القرآن الكريم بالروايات المتواترة' : 'The Holy Quran with Canonical Riwayat'}
                  </h2>
                  <p className="text-[11px] text-stone-300 font-sans hidden sm:block">
                    {uiLang === 'ar' ? 'التفسير الميسر وتفسير الطبري وألوان التجويد المعتمدة' : 'Al-Muyassar & Al-Tabari Exegesis & Standard Tajweed Colors'}
                  </p>
                </div>
              </div>

              {/* Compact Resume Last Read chip */}
              {lastRead && (
                <button
                  id="resume-last-read-compact-btn"
                  onClick={() => onSelectSurah(lastRead.surahId, lastRead.ayahNumber)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{uiLang === 'ar' ? `متابعة: ${lastRead.surahNameArabic} (${lastRead.ayahNumber})` : `Resume: ${lastRead.surahNameEnglish}`}</span>
                </button>
              )}
            </div>
          ) : (
            /* FULL DETAILED BANNER */
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-stone-100 p-5 sm:p-8 shadow-md border border-emerald-700/50 mb-6">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none islamic-pattern" />
              
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-amber-300 text-xs font-medium mb-2.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {uiLang === 'ar'
                      ? 'القرآن الكريم بالروايات المتواترة والتفسير الميسر وتفسير الطبري'
                      : 'The Holy Quran with Canonical Riwayat, Al-Muyassar & Al-Tabari Exegesis'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-amiri tracking-wide text-amber-100 mb-2">
                  {uiLang === 'ar' ? 'جامع القرآن الكريم والقراءات المعتمدة' : 'The Holy Quran & Canonical Recitations'}
                </h2>

                <p className="text-stone-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
                  {uiLang === 'ar'
                    ? 'تلاوة عطرة خاشعة بأصوات نخبة من كبار المقرئين، مع التفسير الميسر وتفسير الإمام الطبري لكل آية، وتلوين التجويد الدقيق حسب ضوابط كل رواية.'
                    : 'Listen to reverent verse-by-verse recitations by renowned scholars and explore Al-Tafsir Al-Muyassar alongside the landmark classical Tafsir of Imam Al-Tabari across multiple canonical narrations.'}
                </p>

                {/* Quick Resume Last Read */}
                {lastRead && (
                  <div className="mt-4 pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center justify-center">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] text-amber-200/90 font-medium">
                          {uiLang === 'ar' ? 'متابعة القراءة السابقة:' : 'Resume Last Read:'}
                        </div>
                        <div className="text-sm font-semibold font-amiri text-stone-50">
                          {lastRead.surahNameArabic} - {uiLang === 'ar' ? `الآية ${lastRead.ayahNumber}` : `Verse ${lastRead.ayahNumber}`}
                        </div>
                      </div>
                    </div>

                    <button
                      id="resume-last-read-btn"
                      onClick={() => onSelectSurah(lastRead.surahId, lastRead.ayahNumber)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{uiLang === 'ar' ? 'متابعة القراءة' : 'Continue Reading'}</span>
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filter and Search Bar: Streamlined & Compact */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-stone-200/80 mb-5">
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  id="surah-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    uiLang === 'ar'
                      ? 'ابحث باسم السورة، رقمها، أو معناها بالإنجليزية...'
                      : 'Search by Surah name, number, or English translation...'
                  }
                  className="w-full pr-9 pl-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                />
              </div>

              {/* Revelation Type Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 p-0.5 bg-stone-100 rounded-xl">
                <button
                  id="filter-all-surahs"
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-white text-emerald-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {uiLang === 'ar' ? 'الكل (114)' : 'All (114)'}
                </button>
                <button
                  id="filter-meccan-surahs"
                  onClick={() => setFilterType('Meccan')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filterType === 'Meccan'
                      ? 'bg-white text-emerald-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {uiLang === 'ar' ? 'مكية' : 'Meccan'}
                </button>
                <button
                  id="filter-medinan-surahs"
                  onClick={() => setFilterType('Medinan')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filterType === 'Medinan'
                      ? 'bg-white text-emerald-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {uiLang === 'ar' ? 'مدنية' : 'Medinan'}
                </button>
              </div>

              {/* Juz Selector Dropdown */}
              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  id="select-juz-dropdown"
                  value={selectedJuz}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedJuz(val === 'all' ? 'all' : Number(val));
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  <option value="all">
                    {uiLang === 'ar' ? 'جميع الأجزاء (30 جزء)' : 'All 30 Juzs'}
                  </option>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                    <option key={juzNum} value={juzNum}>
                      {uiLang === 'ar' ? `الجزء ${juzNum}` : `Juz ${juzNum}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Surahs Grid: Responsive across phones, tablets, laptops, & ultra-wides */}
          {filteredSurahs.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-stone-200">
              <Compass className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-600">
                {uiLang === 'ar' ? 'لم يتم العثور على سور مطابقة للبحث' : 'No Surahs found matching your criteria'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredSurahs.map((surah) => (
                <div
                  key={surah.id}
                  id={`surah-card-${surah.id}`}
                  onClick={() => onSelectSurah(surah.id)}
                  className="group relative bg-white hover:bg-stone-50/80 rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 hover:border-emerald-500/60 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    {/* Number Badge */}
                    <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-emerald-100 text-stone-700 group-hover:text-emerald-900 border border-stone-200 group-hover:border-emerald-300 text-xs font-bold font-sans flex items-center justify-center transition-colors">
                      {surah.id}
                    </div>

                    {/* Arabic Surah Name */}
                    <div className="text-right flex-1">
                      <h3 className="font-amiri font-bold text-lg sm:text-xl text-stone-900 group-hover:text-emerald-950 transition-colors leading-tight">
                        {surah.nameArabic}
                      </h3>
                      <div className="text-[11px] text-stone-400 font-sans">
                        {surah.nameEnglish}
                      </div>
                    </div>
                  </div>

                  {/* Meta Details & Quick Play */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-sans">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        {uiLang === 'ar'
                          ? surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'
                          : surah.revelationType}
                      </span>
                      <span>•</span>
                      <span>{uiLang === 'ar' ? `${surah.ayahCount} آية` : `${surah.ayahCount} v.`}</span>
                    </div>

                    <button
                      id={`quick-play-surah-${surah.id}-btn`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickPlaySurah(surah.id);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title={uiLang === 'ar' ? 'استماع فوري للسورة' : 'Listen now'}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
