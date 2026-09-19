import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  ChevronUp,
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Scroll,
  Info,
  ExternalLink
} from 'lucide-react';
import { TafsirType, Ayah } from '../types/quran';
import { getAyahTafsir } from '../services/quranApi';
import { TAFSIRS } from '../data/reciters';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahId: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  ayah: Ayah | null;
  totalAyahs: number;
  onNavigateAyah: (ayahNumber: number) => void;
  uiLang: 'ar' | 'en';
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  isOpen,
  onClose,
  surahId,
  surahNameArabic,
  surahNameEnglish,
  ayah,
  totalAyahs,
  onNavigateAyah,
  uiLang,
}) => {
  const [activeTafsir, setActiveTafsir] = useState<TafsirType>('muyassar');
  const [tafsirContent, setTafsirContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tafsirFontSize, setTafsirFontSize] = useState<number>(18);
  const [copied, setCopied] = useState<boolean>(false);
  const [isVerseExpanded, setIsVerseExpanded] = useState<boolean>(false);

  useEffect(() => {
    setIsVerseExpanded(false);
  }, [ayah?.numberInSurah]);

  useEffect(() => {
    if (!isOpen || !ayah) return;

    let isMounted = true;
    setLoading(true);

    getAyahTafsir(surahId, ayah.numberInSurah, activeTafsir)
      .then((res) => {
        if (isMounted) {
          setTafsirContent(res.text);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setTafsirContent(
            uiLang === 'ar'
              ? 'تعذر تحميل التفسير في الوقت الحالي، يُرجى التحقق من الاتصال والمحاولة لاحقاً.'
              : 'Could not load Tafsir at this moment. Please check your connection and try again.'
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, surahId, ayah?.numberInSurah, activeTafsir, uiLang]);

  if (!isOpen || !ayah) return null;

  const currentTafsirInfo = TAFSIRS.find((t) => t.type === activeTafsir)!;
  const isLongVerse = (ayah.text?.length || 0) > 180 || !!(ayah.translation && ayah.translation.length > 150);

  const handleCopy = () => {
    const textToCopy = `【 سورة ${surahNameArabic} - الآية ${ayah.numberInSurah} 】\n${ayah.text}\n\n【 ${currentTafsirInfo.nameArabic} 】\n${tafsirContent}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 md:p-6 bg-stone-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="tafsir-modal-dialog"
        className="bg-[#FAF8F5] w-full max-w-3xl h-[92vh] sm:h-[88vh] max-h-[94vh] rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col min-h-0 overflow-hidden text-stone-800"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-stone-100 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3 border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Scroll className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-base sm:text-xl font-bold font-amiri text-stone-50">
                  {uiLang === 'ar' ? 'التفسير والبيان' : 'Quranic Exegesis (Tafsir)'}
                </h3>
                <span className="text-xs text-amber-300/90 font-medium">
                  سورة {surahNameArabic} ({ayah.numberInSurah})
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300 font-sans">
                {surahNameEnglish} - Verse {ayah.numberInSurah} of {totalAyahs}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous Ayah */}
            <button
              id="tafsir-prev-ayah-btn"
              disabled={ayah.numberInSurah <= 1}
              onClick={() => onNavigateAyah(ayah.numberInSurah - 1)}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title={uiLang === 'ar' ? 'الآية السابقة' : 'Previous Ayah'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Next Ayah */}
            <button
              id="tafsir-next-ayah-btn"
              disabled={ayah.numberInSurah >= totalAyahs}
              onClick={() => onNavigateAyah(ayah.numberInSurah + 1)}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title={uiLang === 'ar' ? 'الآية التالية' : 'Next Ayah'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id="close-tafsir-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-stone-200 hover:text-white transition-colors"
              title={uiLang === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Noble Verse Display Card with Dedicated Scrollbar for Long Verses */}
        <div className="p-3 sm:p-4 bg-white border-b border-stone-200/80 shrink-0">
          <div className="bg-emerald-50/50 rounded-2xl p-3 sm:p-4 border border-emerald-100/80 text-right">
            {/* Verse Header & Length Actions */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-emerald-100/70 text-[11px] text-emerald-800">
              <span className="font-semibold flex items-center gap-1.5">
                <span>{uiLang === 'ar' ? 'نص الآية الكريمة' : 'Noble Verse Text'}</span>
                {isLongVerse && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">
                    {uiLang === 'ar' ? 'آية طويلة (قابلة للتمرير)' : 'Long Verse (Scrollable)'}
                  </span>
                )}
              </span>
              {isLongVerse && (
                <button
                  onClick={() => setIsVerseExpanded(!isVerseExpanded)}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded-md hover:bg-emerald-100/70 transition-colors cursor-pointer text-xs"
                >
                  <span>{isVerseExpanded ? (uiLang === 'ar' ? 'طي الآية' : 'Collapse') : (uiLang === 'ar' ? 'توسيع الآية' : 'Expand')}</span>
                  {isVerseExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Scrollable Verse Container with visible scrollbar */}
            <div 
              className={`verse-scrollbar overflow-y-auto px-1 transition-all duration-200 ${
                isVerseExpanded 
                  ? 'max-h-56 sm:max-h-64' 
                  : isLongVerse 
                  ? 'max-h-24 sm:max-h-32' 
                  : 'max-h-40'
              }`}
            >
              <p className="font-quran text-lg sm:text-2xl text-emerald-950 leading-[2.2] select-text">
                {ayah.text}
                <span className="ayah-number-badge">
                  {ayah.numberInSurah}
                </span>
              </p>
              {ayah.translation && (
                <p className="mt-2 text-xs sm:text-sm text-stone-600 font-sans text-left dir-ltr border-t border-emerald-100/60 pt-2 leading-relaxed">
                  {ayah.translation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tafsir Source Switcher (Al-Muyassar vs Al-Tabari) */}
        <div className="px-4 sm:px-5 py-2.5 bg-[#FAF8F5] border-b border-stone-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            <button
              id="tafsir-tab-muyassar"
              onClick={() => setActiveTafsir('muyassar')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTafsir === 'muyassar'
                  ? 'bg-emerald-800 text-amber-200 shadow-xs'
                  : 'text-stone-700 hover:text-emerald-950'
              }`}
            >
              {uiLang === 'ar' ? 'التفسير الميسر' : 'Al-Tafsir Al-Muyassar'}
            </button>
            <button
              id="tafsir-tab-tabari"
              onClick={() => setActiveTafsir('tabari')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTafsir === 'tabari'
                  ? 'bg-emerald-800 text-amber-200 shadow-xs'
                  : 'text-stone-700 hover:text-emerald-950'
              }`}
            >
              {uiLang === 'ar' ? 'تفسير الطبري (جامع البيان)' : 'Tafsir al-Tabari'}
            </button>
          </div>

          {/* Tools: Font Zoom & Copy */}
          <div className="flex items-center gap-1.5">
            <button
              id="zoom-out-tafsir-btn"
              onClick={() => setTafsirFontSize((s) => Math.max(14, s - 2))}
              className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-emerald-900 transition-colors cursor-pointer"
              title={uiLang === 'ar' ? 'تصغير الخط' : 'Decrease font size'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-semibold text-stone-500 w-6 text-center">
              {tafsirFontSize}
            </span>
            <button
              id="zoom-in-tafsir-btn"
              onClick={() => setTafsirFontSize((s) => Math.min(28, s + 2))}
              className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-emerald-900 transition-colors cursor-pointer"
              title={uiLang === 'ar' ? 'تكبير الخط' : 'Increase font size'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              id="copy-tafsir-btn"
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-emerald-900 transition-colors text-xs font-medium ml-1 cursor-pointer"
              title={uiLang === 'ar' ? 'نسخ التفسير' : 'Copy Tafsir'}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{uiLang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>{uiLang === 'ar' ? 'نسخ' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tafsir Book Info Banner */}
        <div className="px-4 sm:px-5 py-2 bg-amber-50/60 border-b border-amber-100/70 flex items-start gap-2.5 text-xs text-stone-600 shrink-0">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="line-clamp-2 sm:line-clamp-none">
            <span className="font-bold text-stone-800">
              {uiLang === 'ar' ? currentTafsirInfo.nameArabic : currentTafsirInfo.nameEnglish}:
            </span>{' '}
            <span>
              {uiLang === 'ar' ? currentTafsirInfo.descriptionArabic : currentTafsirInfo.descriptionEnglish}
            </span>
          </div>
        </div>

        {/* Exegesis (Tafsir) Text Body with Dedicated High-Visibility Scrollbar */}
        <div className="p-4 sm:p-6 md:p-7 overflow-y-auto flex-1 min-h-0 bg-white tafsir-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-emerald-800">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium font-amiri">
                {uiLang === 'ar'
                  ? `جاري تحميل ${currentTafsirInfo.nameArabic}...`
                  : `Loading ${currentTafsirInfo.nameEnglish}...`}
              </p>
            </div>
          ) : (
            <div 
              className="font-amiri text-stone-800 leading-[2.2] text-justify select-text whitespace-pre-line pb-4"
              style={{ fontSize: `${tafsirFontSize}px` }}
            >
              {tafsirContent}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF8F5] px-4 sm:px-5 py-2.5 sm:py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <div className="truncate max-w-[65%] sm:max-w-none">
            {uiLang === 'ar' ? (
              <span>المصدر المعتمد: {currentTafsirInfo.authorArabic}</span>
            ) : (
              <span>Source: {currentTafsirInfo.authorEnglish}</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium transition-colors cursor-pointer"
          >
            {uiLang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
