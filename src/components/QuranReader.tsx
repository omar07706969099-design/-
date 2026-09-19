import React, { useEffect, useRef, useState } from 'react';
import { 
  BookOpen, 
  Scroll, 
  Volume2, 
  Bookmark, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  BookmarkCheck,
  Compass,
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Eye,
  Type,
  ArrowUpDown,
  CornerDownLeft,
  Languages
} from 'lucide-react';
import { Ayah, SurahMeta, QuranFont, ViewMode, RiwayahId } from '../types/quran';
import { InlineTafsirCard } from './InlineTafsirCard';
import { TajweedAyahRenderer } from '../utils/tajweedColorizer';

interface QuranReaderProps {
  surah: SurahMeta;
  ayahs: Ayah[];
  loading: boolean;
  activeAyahNumber: number;
  isPlaying: boolean;
  onPlayAyah: (ayahNumber: number) => void;
  onOpenTafsir: (ayah: Ayah) => void;
  onToggleBookmark: (ayah: Ayah) => void;
  isBookmarked: (ayahNumber: number) => boolean;
  onNavigateSurah: (surahId: number) => void;
  fontSize: number;
  onChangeFontSize?: (size: number) => void;
  quranFont: QuranFont;
  onChangeQuranFont?: (font: QuranFont) => void;
  viewMode: ViewMode;
  onChangeViewMode?: (mode: ViewMode) => void;
  showTranslation: boolean;
  onToggleShowTranslation?: () => void;
  activeRiwayahId: RiwayahId;
  activeRiwayahNameArabic?: string;
  activeRiwayahNameEnglish?: string;
  onOpenRiwayahModal?: () => void;
  tajweedEnabled?: boolean;
  onToggleTajweed?: () => void;
  onOpenTajweedLegend?: () => void;
  uiLang: 'ar' | 'en';
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  surah,
  ayahs,
  loading,
  activeAyahNumber,
  isPlaying,
  onPlayAyah,
  onOpenTafsir,
  onToggleBookmark,
  isBookmarked,
  onNavigateSurah,
  fontSize,
  onChangeFontSize,
  quranFont,
  onChangeQuranFont,
  viewMode,
  onChangeViewMode,
  showTranslation,
  onToggleShowTranslation,
  activeRiwayahId,
  activeRiwayahNameArabic,
  activeRiwayahNameEnglish,
  onOpenRiwayahModal,
  tajweedEnabled = true,
  onToggleTajweed,
  onOpenTajweedLegend,
  uiLang,
}) => {
  const activeAyahRef = useRef<HTMLDivElement | null>(null);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [expandedInlineTafsirAyah, setExpandedInlineTafsirAyah] = useState<number | null>(null);
  const [selectedMushafAyah, setSelectedMushafAyah] = useState<Ayah | null>(null);
  const [isCompactHeader, setIsCompactHeader] = useState<boolean>(() => {
    // Default to compact header on small viewports so content and features fit without scrolling
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [jumpAyahInput, setJumpAyahInput] = useState<string>('');
  const [showJumpDropdown, setShowJumpDropdown] = useState<boolean>(false);

  // Auto scroll into view when playing ayah changes
  useEffect(() => {
    if (isPlaying && activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeAyahNumber, isPlaying]);

  const handleCopyAyah = (ayah: Ayah) => {
    const text = `﴿ ${ayah.text} ﴾ [سورة ${surah.nameArabic}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const handleJumpToAyah = (targetNum: number) => {
    if (targetNum >= 1 && targetNum <= surah.ayahCount) {
      const el = document.getElementById(`ayah-card-${targetNum}`) || document.getElementById(`mushaf-ayah-badge-${targetNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      onPlayAyah(targetNum);
      setShowJumpDropdown(false);
      setJumpAyahInput('');
    }
  };

  const fontClass =
    quranFont === 'amiri-quran'
      ? 'font-quran'
      : quranFont === 'scheherazade'
      ? 'font-scheherazade'
      : 'font-amiri';

  // Surah 9 (At-Tawbah) does not start with Basmalah
  const showBasmalah = surah.id !== 9 && surah.id !== 1;

  // Active or selected verse for direct Tafsir access
  const activeAyahObj = ayahs.find((a) => a.numberInSurah === activeAyahNumber) || ayahs[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-6 pb-36 overflow-x-hidden">
      {/* 
        ========================================================================
        PINNED / DOCKED QUICK FEATURE BAR
        Guarantees all features (Translation, Tajweed, Riwayah, Tafsir, Fonts, Modes)
        are 100% visible on ALL devices without horizontal scrolling or site shifting!
        ========================================================================
      */}
      <div 
        id="pinned-reader-quick-features-bar"
        className="sticky top-14 sm:top-16 z-30 mb-4 w-full max-w-full bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-md border border-stone-200/90 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 overflow-hidden"
      >
        {/* Core Quick Features Group */}
        <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
          {/* Translation Toggle Button - ALWAYS PROMINENT AND VISIBLE */}
          {onToggleShowTranslation && (
            <button
              id="quick-toggle-translation-btn"
              onClick={onToggleShowTranslation}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                showTranslation
                  ? 'bg-emerald-800 text-amber-200 border-emerald-700 shadow-2xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
              title={uiLang === 'ar' ? 'إظهار / إخفاء الترجمة الإنجليزية' : 'Toggle English translation'}
            >
              <Languages className={`w-3.5 h-3.5 shrink-0 ${showTranslation ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span>
                {uiLang === 'ar' 
                  ? (showTranslation ? 'الترجمة: مفعّلة' : 'الترجمة') 
                  : (showTranslation ? 'Translation: On' : 'Translation')}
              </span>
            </button>
          )}

          {/* Tajweed Mode Toggle */}
          <div className="inline-flex items-center rounded-xl bg-stone-100/90 border border-stone-200 p-0.5 shrink-0">
            <button
              id="toggle-tajweed-colors-btn"
              onClick={onToggleTajweed}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tajweedEnabled
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
              title={uiLang === 'ar' ? 'تفعيل أو تعطيل ألوان التجويد' : 'Toggle Tajweed color coding'}
            >
              <Sparkles className={`w-3.5 h-3.5 ${tajweedEnabled ? 'text-amber-300' : 'text-stone-400'}`} />
              <span>{uiLang === 'ar' ? 'التجويد' : 'Tajweed'}</span>
            </button>

            {onOpenTajweedLegend && (
              <button
                id="open-tajweed-legend-quick-btn"
                onClick={onOpenTajweedLegend}
                className="p-1 text-stone-500 hover:text-emerald-900 hover:bg-stone-200/60 rounded-md transition-colors cursor-pointer"
                title={uiLang === 'ar' ? 'دليل وقواعد ألوان التجويد' : 'Tajweed Color Guide & Legend'}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-800" />
              </button>
            )}
          </div>

          {/* Quick Riwayah Switcher */}
          {activeRiwayahNameArabic && onOpenRiwayahModal && (
            <button
              id="quick-reader-riwayah-btn"
              onClick={onOpenRiwayahModal}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
              title={uiLang === 'ar' ? 'تغيير الرواية وقواعد التجويد' : 'Switch Riwayah & Tajweed Rules'}
            >
              <Scroll className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span className="font-amiri font-bold truncate max-w-[80px] sm:max-w-[130px]">
                {uiLang === 'ar' ? activeRiwayahNameArabic : activeRiwayahNameEnglish}
              </span>
            </button>
          )}

          {/* Direct Tafsir Access for active Ayah */}
          {activeAyahObj && (
            <button
              id="quick-active-tafsir-btn"
              onClick={() => onOpenTafsir(activeAyahObj)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
              title={uiLang === 'ar' ? `تفسير الآية ${activeAyahObj.numberInSurah} (الميسر والطبري)` : `Tafsir for verse ${activeAyahObj.numberInSurah}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>{uiLang === 'ar' ? `تفسير ${activeAyahObj.numberInSurah}` : `Tafsir ${activeAyahObj.numberInSurah}`}</span>
            </button>
          )}
        </div>

        {/* View, Font & Navigation Controls Group */}
        <div className="flex items-center flex-wrap gap-1 sm:gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Switcher */}
          {onChangeViewMode && (
            <button
              id="toggle-viewmode-quick-btn"
              onClick={() => onChangeViewMode(viewMode === 'mushaf' ? 'ayah-by-ayah' : 'mushaf')}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer shrink-0"
              title={uiLang === 'ar' ? 'التبديل بين وضع المصحف والآيات المنفصلة' : 'Toggle between Mushaf & Ayah cards'}
            >
              <ArrowUpDown className="w-3 h-3 text-stone-500 shrink-0" />
              <span>{viewMode === 'mushaf' ? (uiLang === 'ar' ? 'الآيات' : 'Ayahs') : (uiLang === 'ar' ? 'المصحف' : 'Mushaf')}</span>
            </button>
          )}

          {/* Quick Font Size Controls (+ / -) */}
          {onChangeFontSize && (
            <div className="flex items-center rounded-xl bg-stone-100 p-0.5 border border-stone-200/80 shrink-0">
              <button
                onClick={() => onChangeFontSize(Math.min(fontSize + 2, 44))}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-700 cursor-pointer"
                title={uiLang === 'ar' ? 'تكبير الخط' : 'Increase font size'}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1 text-stone-600 select-none">
                {fontSize}
              </span>
              <button
                onClick={() => onChangeFontSize(Math.max(fontSize - 2, 18))}
                className="p-1 rounded-lg hover:bg-stone-200 text-stone-700 cursor-pointer"
                title={uiLang === 'ar' ? 'تصغير الخط' : 'Decrease font size'}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Jump to Verse */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowJumpDropdown(!showJumpDropdown)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-colors"
              title={uiLang === 'ar' ? 'انتقال سريع لرقم الآية' : 'Jump to Ayah'}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-800" />
              <span>{uiLang === 'ar' ? 'آية' : 'Ayah'}</span>
            </button>

            {showJumpDropdown && (
              <div className="absolute top-full mt-1.5 right-0 z-40 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 min-w-[190px] text-right animate-in fade-in zoom-in-95 duration-150">
                <div className="text-xs font-bold text-stone-600 mb-1.5 font-sans">
                  {uiLang === 'ar' ? `اختر آية (1 - ${surah.ayahCount})` : `Select Verse (1 - ${surah.ayahCount})`}
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1}
                    max={surah.ayahCount}
                    value={jumpAyahInput}
                    onChange={(e) => setJumpAyahInput(e.target.value)}
                    placeholder="رقم الآية"
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-200 text-center font-sans focus:outline-hidden focus:border-emerald-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleJumpToAyah(Number(jumpAyahInput));
                      }
                    }}
                  />
                  <button
                    onClick={() => handleJumpToAyah(Number(jumpAyahInput))}
                    className="p-1.5 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 cursor-pointer"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Screen Fit / Compact Header Toggle */}
          <button
            id="toggle-compact-header-btn"
            onClick={() => setIsCompactHeader(!isCompactHeader)}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer transition-colors shrink-0"
            title={uiLang === 'ar' ? 'التبديل بين الترويسة المدمجة والكاملة لتوفير مساحة الشاشة' : 'Toggle compact view to maximize reading area'}
          >
            {isCompactHeader ? <Maximize2 className="w-3 h-3 text-emerald-800" /> : <Minimize2 className="w-3 h-3 text-stone-500" />}
            <span className="hidden xs:inline">{isCompactHeader ? (uiLang === 'ar' ? 'توسيع' : 'Expand') : (uiLang === 'ar' ? 'مدمج' : 'Compact')}</span>
          </button>
        </div>
      </div>

      {/* 
        Surah Header Banner 
        Compact Mode: single sleek line, zero dead-space, content is immediately visible on all devices!
        Full Mode: rich decorative medallion banner
      */}
      {isCompactHeader ? (
        <div className="mb-4 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-stone-100 border border-emerald-800 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold font-amiri text-amber-200">
              سُورَةُ {surah.nameArabic}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-300 font-sans">
              <span>{surah.nameEnglish}</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{uiLang === 'ar' ? `الجزء ${surah.startJuz}` : `Juz ${surah.startJuz}`}</span>
              <span>•</span>
              <span>{uiLang === 'ar' ? `${surah.ayahCount} آيات` : `${surah.ayahCount} Verses`}</span>
            </div>
          </div>

          {showBasmalah && (
            <div className="text-base sm:text-lg font-quran text-amber-100 hidden md:block">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-emerald-700/60 text-stone-100 mb-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-5 sm:p-8 text-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none islamic-pattern" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-amber-300 text-xs font-semibold">
                {uiLang === 'ar' ? `الجزء ${surah.startJuz}` : `Juz ${surah.startJuz}`}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-stone-200 text-xs font-semibold">
                {uiLang === 'ar'
                  ? surah.revelationType === 'Meccan'
                    ? 'سورة مكية'
                    : 'سورة مدنية'
                  : `${surah.revelationType} Surah`}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-stone-200 text-xs font-semibold">
                {uiLang === 'ar' ? `${surah.ayahCount} آيات` : `${surah.ayahCount} Verses`}
              </span>
              {activeRiwayahNameArabic && (
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-amber-300/40 text-amber-200 text-xs font-bold">
                  {uiLang === 'ar' ? `برواية ${activeRiwayahNameArabic}` : `Narration: ${activeRiwayahNameEnglish}`}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-bold font-amiri text-amber-200 mb-1.5 tracking-wide">
              سُورَةُ {surah.nameArabic}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-sans">
              {surah.nameEnglish} — {surah.englishTranslation}
            </p>

            {/* Basmalah */}
            {showBasmalah && (
              <div className="mt-6 pt-4 border-t border-emerald-800/80 w-full max-w-md mx-auto">
                <div className="text-xl sm:text-2xl font-quran text-amber-100 tracking-wider">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-emerald-900">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-base font-bold font-amiri">
            {uiLang === 'ar' ? 'جاري تحميل الآيات الكريمة وفق الرواية المحددة...' : 'Loading verses...'}
          </p>
        </div>
      ) : viewMode === 'mushaf' ? (
        /* Mushaf Continuous Mode with Tajweed Color-Coding */
        <div className="relative">
          <div className="bg-white rounded-3xl p-5 sm:p-10 shadow-sm border border-stone-200/90 text-justify">
            <div 
              className={`${fontClass} leading-[2.6] sm:leading-[2.8] text-stone-900 select-text`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {ayahs.map((ayah) => {
                const isCurrent = activeAyahNumber === ayah.numberInSurah;
                const isSelected = selectedMushafAyah?.numberInSurah === ayah.numberInSurah;

                return (
                  <span
                    key={ayah.numberInSurah}
                    ref={isCurrent ? activeAyahRef : null}
                    className={`transition-colors rounded-lg px-0.5 inline select-text ${
                      isSelected
                        ? 'bg-amber-100/90 ring-2 ring-amber-400'
                        : isCurrent
                        ? 'bg-emerald-100/90 ring-2 ring-emerald-400'
                        : 'hover:bg-amber-50/60'
                    }`}
                    onClick={() => {
                      setSelectedMushafAyah(ayah);
                      onPlayAyah(ayah.numberInSurah);
                    }}
                    onDoubleClick={() => onOpenTafsir(ayah)}
                  >
                    <TajweedAyahRenderer
                      text={ayah.text}
                      riwayahId={activeRiwayahId}
                      enabled={tajweedEnabled}
                    />
                    <button
                      id={`mushaf-ayah-badge-${ayah.numberInSurah}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMushafAyah(ayah);
                        onOpenTafsir(ayah);
                      }}
                      className="ayah-number-badge hover:bg-emerald-700 hover:text-white transition-colors cursor-pointer"
                      title={uiLang === 'ar' ? 'فتح التفسير والبيان' : 'Open Tafsir (Exegesis)'}
                    >
                      {ayah.numberInSurah}
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Floating Ayah Quick Toolbar for Mushaf Mode - Docked above player */}
          {selectedMushafAyah && (
            <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-35 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl shadow-xl border border-stone-200 flex items-center gap-2 max-w-[95vw] animate-in fade-in slide-in-from-bottom-3 duration-200">
              <span className="text-xs font-bold text-emerald-950 font-amiri shrink-0 pl-1 border-l border-stone-200">
                {uiLang === 'ar' ? `آية ${selectedMushafAyah.numberInSurah}` : `v.${selectedMushafAyah.numberInSurah}`}
              </span>

              {/* Tafsir Action */}
              <button
                onClick={() => onOpenTafsir(selectedMushafAyah)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-2xs transition-colors cursor-pointer"
                title={uiLang === 'ar' ? 'عرض التفسير والبيان' : 'View Tafsir'}
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>{uiLang === 'ar' ? 'التفسير' : 'Tafsir'}</span>
              </button>

              {/* Listen Action */}
              <button
                onClick={() => onPlayAyah(selectedMushafAyah.numberInSurah)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{uiLang === 'ar' ? 'استماع' : 'Play'}</span>
              </button>

              {/* Copy Action */}
              <button
                onClick={() => handleCopyAyah(selectedMushafAyah)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                title={uiLang === 'ar' ? 'نسخ الآية' : 'Copy Verse'}
              >
                {copiedAyah === selectedMushafAyah.numberInSurah ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Bookmark */}
              <button
                onClick={() => onToggleBookmark(selectedMushafAyah)}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isBookmarked(selectedMushafAyah.numberInSurah)
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
                title={uiLang === 'ar' ? 'حفظ العلامة' : 'Bookmark'}
              >
                {isBookmarked(selectedMushafAyah.numberInSurah) ? (
                  <BookmarkCheck className="w-3.5 h-3.5" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Close */}
              <button
                onClick={() => setSelectedMushafAyah(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Ayah By Ayah View Mode with Tajweed Color-Coding */
        <div className="space-y-3.5 sm:space-y-5">
          {ayahs.map((ayah) => {
            const isCurrent = activeAyahNumber === ayah.numberInSurah;
            const bookmarked = isBookmarked(ayah.numberInSurah);
            const isInlineTafsirOpen = expandedInlineTafsirAyah === ayah.numberInSurah;

            return (
              <div
                key={ayah.numberInSurah}
                ref={isCurrent ? activeAyahRef : null}
                id={`ayah-card-${ayah.numberInSurah}`}
                className={`rounded-3xl p-4 sm:p-7 transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white hover:bg-stone-50/80 border-stone-200/90 shadow-2xs'
                }`}
              >
                {/* Ayah Header Bar */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100/70 text-emerald-900 border border-emerald-200 font-bold font-sans text-xs flex items-center justify-center">
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      {uiLang === 'ar' ? `الآية ${ayah.numberInSurah}` : `Verse ${ayah.numberInSurah}`}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Listen */}
                    <button
                      id={`listen-ayah-${ayah.numberInSurah}-btn`}
                      onClick={() => onPlayAyah(ayah.numberInSurah)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isCurrent && isPlaying
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{uiLang === 'ar' ? 'استماع' : 'Listen'}</span>
                    </button>

                    {/* Tafsir (Exegesis) Modal trigger */}
                    <button
                      id={`tafsir-ayah-${ayah.numberInSurah}-btn`}
                      onClick={() => onOpenTafsir(ayah)}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs transition-all cursor-pointer"
                      title={uiLang === 'ar' ? 'نافذة التفسير الشامل (الميسر والطبري)' : 'Full Tafsir Dialog'}
                    >
                      <Scroll className="w-3.5 h-3.5 text-amber-700" />
                      <span>{uiLang === 'ar' ? 'التفسير' : 'Tafsir'}</span>
                    </button>

                    {/* Inline Tafsir Toggle */}
                    <button
                      id={`inline-tafsir-toggle-${ayah.numberInSurah}-btn`}
                      onClick={() => setExpandedInlineTafsirAyah(isInlineTafsirOpen ? null : ayah.numberInSurah)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        isInlineTafsirOpen
                          ? 'bg-emerald-800 text-amber-200 border-emerald-900'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                      title={uiLang === 'ar' ? 'تفسير مباشر مع شريط تمرير' : 'Inline scrollable Tafsir'}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {isInlineTafsirOpen 
                          ? (uiLang === 'ar' ? 'إغلاق المباشر' : 'Close Inline') 
                          : (uiLang === 'ar' ? 'مباشر' : 'Inline')}
                      </span>
                    </button>

                    {/* Bookmark */}
                    <button
                      id={`bookmark-ayah-${ayah.numberInSurah}-btn`}
                      onClick={() => onToggleBookmark(ayah)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        bookmarked
                          ? 'bg-amber-100 text-amber-800'
                          : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {bookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    {/* Copy */}
                    <button
                      id={`copy-ayah-${ayah.numberInSurah}-btn`}
                      onClick={() => handleCopyAyah(ayah)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      {copiedAyah === ayah.numberInSurah ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Noble Arabic Ayah Text with Tajweed Color-Coding */}
                <div 
                  className={`text-right ${fontClass} text-stone-900 leading-[2.3] select-text`}
                  style={{ fontSize: `${fontSize}px` }}
                >
                  <TajweedAyahRenderer
                    text={ayah.text}
                    riwayahId={activeRiwayahId}
                    enabled={tajweedEnabled}
                  />
                  <span className="ayah-number-badge">
                    {ayah.numberInSurah}
                  </span>
                </div>

                {/* English Translation */}
                {showTranslation && ayah.translation && (
                  <div className="mt-3.5 pt-3.5 border-t border-stone-100 text-left dir-ltr">
                    <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                      {ayah.translation}
                    </p>
                  </div>
                )}

                {/* Inline Scrollable Tafsir Card */}
                {isInlineTafsirOpen && (
                  <InlineTafsirCard
                    surahId={surah.id}
                    surahNameArabic={surah.nameArabic}
                    ayahNumber={ayah.numberInSurah}
                    uiLang={uiLang}
                    onOpenModal={() => onOpenTafsir(ayah)}
                    onClose={() => setExpandedInlineTafsirAyah(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Surah Navigation (Previous / Next Surah) */}
      <div className="mt-10 pt-6 border-t border-stone-200/80 flex items-center justify-between gap-4">
        {surah.id > 1 ? (
          <button
            id="prev-surah-nav-btn"
            onClick={() => onNavigateSurah(surah.id - 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 border border-stone-200 text-stone-800 hover:text-emerald-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <ChevronRight className={`w-4 h-4 ${uiLang === 'en' ? 'rotate-180' : ''}`} />
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-normal">
                {uiLang === 'ar' ? 'السورة السابقة' : 'Previous'}
              </div>
              <div className="font-amiri font-bold text-sm sm:text-base">
                سورة {surah.id - 1}
              </div>
            </div>
          </button>
        ) : <div />}

        {surah.id < 114 ? (
          <button
            id="next-surah-nav-btn"
            onClick={() => onNavigateSurah(surah.id + 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 border border-stone-200 text-stone-800 hover:text-emerald-950 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <div className="text-left">
              <div className="text-[10px] text-stone-400 font-normal">
                {uiLang === 'ar' ? 'السورة التالية' : 'Next'}
              </div>
              <div className="font-amiri font-bold text-sm sm:text-base">
                سورة {surah.id + 1}
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${uiLang === 'en' ? 'rotate-180' : ''}`} />
          </button>
        ) : <div />}
      </div>
    </div>
  );
};
