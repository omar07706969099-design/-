import React, { useState, useEffect } from 'react';
import { 
  Scroll, 
  X, 
  Maximize2, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut,
  Info 
} from 'lucide-react';
import { TafsirType } from '../types/quran';
import { getAyahTafsir } from '../services/quranApi';
import { TAFSIRS } from '../data/reciters';

interface InlineTafsirCardProps {
  surahId: number;
  surahNameArabic: string;
  ayahNumber: number;
  uiLang: 'ar' | 'en';
  onOpenModal: () => void;
  onClose: () => void;
}

export const InlineTafsirCard: React.FC<InlineTafsirCardProps> = ({
  surahId,
  surahNameArabic,
  ayahNumber,
  uiLang,
  onOpenModal,
  onClose,
}) => {
  const [activeTafsir, setActiveTafsir] = useState<TafsirType>('muyassar');
  const [tafsirText, setTafsirText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(16);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAyahTafsir(surahId, ayahNumber, activeTafsir)
      .then((res) => {
        if (isMounted) {
          setTafsirText(res.text);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load inline tafsir:', err);
        if (isMounted) {
          setTafsirText(
            uiLang === 'ar'
              ? 'تعذر تحميل التفسير لهذه الآية. يرجى تجربة التفسير الآخر أو فتح النافذة المخصصة.'
              : 'Could not load exegesis for this verse. Please try the other Tafsir or open the modal.'
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahId, ayahNumber, activeTafsir, uiLang]);

  const currentTafsirInfo = TAFSIRS.find((t) => t.type === activeTafsir)!;

  const handleCopy = () => {
    const textToCopy = `【 تفسير الآية ${ayahNumber} من سورة ${surahNameArabic} - ${currentTafsirInfo.nameArabic} 】\n${tafsirText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id={`inline-tafsir-${ayahNumber}`}
      className="mt-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 shadow-xs overflow-hidden text-stone-800 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* Top Header & Controls */}
      <div className="bg-amber-100/70 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <Scroll className="w-4 h-4 text-amber-800 shrink-0" />
          <span className="text-xs font-bold text-amber-950 font-amiri text-sm">
            {uiLang === 'ar' ? `تفسير الآية (${ayahNumber})` : `Exegesis of Verse (${ayahNumber})`}
          </span>

          {/* Tafsir Source Tabs */}
          <div className="flex items-center gap-1 bg-amber-200/60 p-0.5 rounded-lg mr-2">
            <button
              onClick={() => setActiveTafsir('muyassar')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTafsir === 'muyassar'
                  ? 'bg-emerald-800 text-amber-200 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-950'
              }`}
            >
              {uiLang === 'ar' ? 'الميسر' : 'Muyassar'}
            </button>
            <button
              onClick={() => setActiveTafsir('tabari')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTafsir === 'tabari'
                  ? 'bg-emerald-800 text-amber-200 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-950'
              }`}
            >
              {uiLang === 'ar' ? 'الطبري' : 'Tabari'}
            </button>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-1.5">
          {/* Font Controls */}
          <button
            onClick={() => setFontSize((s) => Math.max(14, s - 1))}
            className="p-1 rounded-md bg-white border border-amber-200 text-stone-600 hover:text-emerald-900 transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'تصغير الخط' : 'Smaller text'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-semibold text-stone-600 w-5 text-center">
            {fontSize}
          </span>
          <button
            onClick={() => setFontSize((s) => Math.min(24, s + 1))}
            className="p-1 rounded-md bg-white border border-amber-200 text-stone-600 hover:text-emerald-900 transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'تكبير الخط' : 'Larger text'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1 rounded-md bg-white border border-amber-200 text-stone-600 hover:text-emerald-900 transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'نسخ التفسير' : 'Copy Tafsir'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Maximize to Modal Button */}
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white hover:bg-emerald-50 border border-amber-200 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'فتح في نافذة كاملة' : 'Open in full dialog'}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">{uiLang === 'ar' ? 'نافذة كاملة' : 'Full view'}</span>
          </button>

          {/* Close Inline View */}
          <button
            onClick={onClose}
            className="p-1 rounded-md bg-white hover:bg-rose-50 text-stone-500 hover:text-rose-700 border border-amber-200 transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'إغلاق التفسير' : 'Close Tafsir'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Book Info Subheader */}
      <div className="px-4 py-1.5 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5 truncate">
          <Info className="w-3 h-3 text-amber-700 shrink-0" />
          <span className="font-semibold text-stone-800">
            {uiLang === 'ar' ? currentTafsirInfo.nameArabic : currentTafsirInfo.nameEnglish}:
          </span>
          <span className="truncate">
            {uiLang === 'ar' ? currentTafsirInfo.descriptionArabic : currentTafsirInfo.descriptionEnglish}
          </span>
        </div>
        <span className="text-[10px] text-stone-400 shrink-0 font-sans mr-2">
          {uiLang === 'ar' ? 'اسحب للتمرير ↕' : 'Scrollable ↕'}
        </span>
      </div>

      {/* Scrollable Exegesis Text Container - PREVENTS TEXT FROM BEING CUT OFF */}
      <div 
        id={`inline-tafsir-content-${ayahNumber}`}
        className="p-4 sm:p-5 max-h-60 sm:max-h-72 overflow-y-auto tafsir-scrollbar bg-white/90"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8 text-emerald-800 gap-2">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium font-amiri">
              {uiLang === 'ar' ? 'جاري تحميل التفسير...' : 'Loading exegesis...'}
            </span>
          </div>
        ) : (
          <div 
            className="font-amiri text-stone-800 leading-[2.1] text-justify select-text whitespace-pre-line"
            style={{ fontSize: `${fontSize}px` }}
          >
            {tafsirText}
          </div>
        )}
      </div>
    </div>
  );
};
