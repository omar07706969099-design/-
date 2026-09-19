import React from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Search, 
  Sliders, 
  Compass, 
  Languages, 
  ChevronRight,
  BookMarked,
  Scroll,
  Sparkles
} from 'lucide-react';
import { QuranFont, ViewMode, RiwayahId } from '../types/quran';

interface NavbarProps {
  currentSurahId: number | null;
  onBackToSurahList: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenSettings: () => void;
  onOpenRiwayahModal: () => void;
  onOpenTajweedLegend?: () => void;
  activeRiwayahId: RiwayahId;
  activeRiwayahNameArabic: string;
  activeRiwayahNameEnglish: string;
  surahNameArabic?: string;
  surahNameEnglish?: string;
  uiLang: 'ar' | 'en';
  onToggleUiLang: () => void;
  fontSize: number;
  quranFont: QuranFont;
  viewMode: ViewMode;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSurahId,
  onBackToSurahList,
  onOpenSearch,
  onOpenBookmarks,
  onOpenSettings,
  onOpenRiwayahModal,
  onOpenTajweedLegend,
  activeRiwayahNameArabic,
  activeRiwayahNameEnglish,
  surahNameArabic,
  surahNameEnglish,
  uiLang,
  onToggleUiLang,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full max-w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2">
        {/* Left / Brand Section */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
          {currentSurahId ? (
            <button
              id="back-to-surahs-btn"
              onClick={onBackToSurahList}
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors font-medium text-xs sm:text-sm shrink-0"
              title={uiLang === 'ar' ? 'الرجوع لقائمة السور' : 'Back to Surah list'}
            >
              <ChevronRight className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${uiLang === 'en' ? 'rotate-180' : ''}`} />
              <span className="hidden xs:inline">{uiLang === 'ar' ? 'الفهرس' : 'Surahs'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 flex items-center justify-center text-amber-300 shadow-sm border border-emerald-700/50 shrink-0">
                <BookOpen className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold font-amiri text-stone-900 leading-tight truncate">
                  {uiLang === 'ar' ? 'القرآن الكريم' : 'The Holy Quran'}
                </h1>
                <p className="text-[10px] sm:text-xs text-stone-500 font-sans hidden md:block truncate">
                  {uiLang === 'ar' ? 'التفسير الميسر والطبري والقراءات المتواترة' : 'Al-Muyassar & Al-Tabari Exegesis'}
                </p>
              </div>
            </div>
          )}

          {/* If inside a Surah, show title */}
          {currentSurahId && surahNameArabic && (
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <span className="text-stone-300">|</span>
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="font-amiri font-bold text-sm sm:text-lg text-emerald-950 truncate max-w-[90px] sm:max-w-[140px] md:max-w-none">
                  سورة {surahNameArabic}
                </span>
                <span className="text-xs text-stone-500 hidden lg:inline truncate">
                  {surahNameEnglish}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right / Controls Section - Always constrained to screen */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Riwayah Selector Badge */}
          <button
            id="open-riwayah-btn"
            onClick={onOpenRiwayahModal}
            className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-emerald-900/90 text-amber-200 hover:bg-emerald-950 transition-all text-[11px] sm:text-xs font-semibold border border-emerald-800 shadow-2xs shrink-0 cursor-pointer"
            title={uiLang === 'ar' ? 'تغيير الرواية وقواعد التجويد' : 'Switch Narration & Rules'}
          >
            <Scroll className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="font-amiri text-xs sm:text-sm truncate max-w-[65px] sm:max-w-none">
              {uiLang === 'ar' ? activeRiwayahNameArabic : activeRiwayahNameEnglish}
            </span>
          </button>

          {/* Tajweed Guide button */}
          {onOpenTajweedLegend && (
            <button
              id="open-tajweed-guide-btn"
              onClick={onOpenTajweedLegend}
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors text-[11px] sm:text-xs font-semibold border border-amber-300/80 shadow-2xs shrink-0 cursor-pointer"
              title={uiLang === 'ar' ? 'أحكام وقواعد ألوان التجويد' : 'Tajweed Color Rules'}
            >
              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="hidden md:inline font-sans">
                {uiLang === 'ar' ? 'التجويد' : 'Tajweed'}
              </span>
            </button>
          )}

          {/* Search button */}
          <button
            id="open-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-stone-700 hover:text-emerald-900 hover:bg-stone-100 transition-colors text-xs border border-stone-200/70 shrink-0 cursor-pointer"
            title={uiLang === 'ar' ? 'البحث في السور والآيات' : 'Search Quran'}
          >
            <Search className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="hidden lg:inline text-xs font-medium">
              {uiLang === 'ar' ? 'بحث' : 'Search'}
            </span>
          </button>

          {/* Bookmarks */}
          <button
            id="open-bookmarks-btn"
            onClick={onOpenBookmarks}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-stone-700 hover:text-emerald-900 hover:bg-stone-100 transition-colors text-xs border border-stone-200/70 shrink-0 cursor-pointer"
            title={uiLang === 'ar' ? 'العلامات المرجعية والمحفوظات' : 'Bookmarks & Saved'}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden lg:inline text-xs font-medium">
              {uiLang === 'ar' ? 'المحفوظات' : 'Saved'}
            </span>
          </button>

          {/* Reading Display Settings */}
          <button
            id="open-settings-btn"
            onClick={onOpenSettings}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-stone-700 hover:text-emerald-900 hover:bg-stone-100 transition-colors text-xs border border-stone-200/70 shrink-0 cursor-pointer"
            title={uiLang === 'ar' ? 'خيارات القراءة والخط' : 'Display Settings'}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="hidden xl:inline text-xs font-medium">
              {uiLang === 'ar' ? 'المظهر' : 'Settings'}
            </span>
          </button>

          {/* Language / Translation Toggle Button - ALWAYS VISIBLE */}
          <button
            id="toggle-ui-lang-btn"
            onClick={onToggleUiLang}
            className="flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 transition-colors text-xs font-bold shrink-0 cursor-pointer shadow-2xs"
            title={uiLang === 'ar' ? 'Switch interface to English' : 'التحويل للغة العربية'}
          >
            <Languages className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-sans text-[11px] sm:text-xs uppercase">
              {uiLang === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
