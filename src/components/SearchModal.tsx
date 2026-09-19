import React, { useState } from 'react';
import { Search, X, BookOpen, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { ALL_SURAHS } from '../data/surahs';
import { SurahMeta } from '../types/quran';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (surahId: number, ayahNumber?: number) => void;
  uiLang: 'ar' | 'en';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSurah,
  uiLang,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  // Check for Surah:Ayah syntax like 2:255 or 36:1
  const directMatch = query.match(/^(\d{1,3}):(\d{1,3})$/);
  const directSurahNum = directMatch ? Number(directMatch[1]) : null;
  const directAyahNum = directMatch ? Number(directMatch[2]) : null;
  const validDirectSurah = directSurahNum && directSurahNum >= 1 && directSurahNum <= 114
    ? ALL_SURAHS.find((s) => s.id === directSurahNum)
    : null;

  const results = ALL_SURAHS.filter((s) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    return (
      String(s.id) === q ||
      s.nameArabic.includes(q) ||
      `سورة ${s.nameArabic}`.includes(q) ||
      s.nameEnglish.toLowerCase().includes(q) ||
      s.englishTranslation.toLowerCase().includes(q)
    );
  }).slice(0, 10);

  const quickLinks = [
    { nameArabic: 'الفاتحة', surahId: 1, ayah: 1 },
    { nameArabic: 'آية الكرسي', surahId: 2, ayah: 255 },
    { nameArabic: 'الكهف', surahId: 18, ayah: 1 },
    { nameArabic: 'يس', surahId: 36, ayah: 1 },
    { nameArabic: 'الرحمن', surahId: 55, ayah: 1 },
    { nameArabic: 'الواقعة', surahId: 56, ayah: 1 },
    { nameArabic: 'الملك', surahId: 67, ayah: 1 },
    { nameArabic: 'الإخلاص', surahId: 112, ayah: 1 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="search-modal-dialog"
        className="bg-[#FAF8F5] w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800"
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-emerald-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-modal-input"
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                uiLang === 'ar'
                  ? 'ابحث باسم السورة، رقمها، أو اكتب الآية مثل 2:255...'
                  : 'Search by Surah name, number, or ayah reference like 2:255...'
              }
              className="w-full pr-11 pl-10 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-3 p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Direct verse shortcut match */}
          {validDirectSurah && directAyahNum && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-800">
                  {uiLang === 'ar' ? 'الانتقال المباشر للآية:' : 'Direct Verse Jump:'}
                </div>
                <div className="text-base font-bold font-amiri text-emerald-950">
                  سورة {validDirectSurah.nameArabic} - الآية {directAyahNum}
                </div>
              </div>
              <button
                onClick={() => {
                  onSelectSurah(validDirectSurah.id, directAyahNum);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
              >
                {uiLang === 'ar' ? 'انتقال' : 'Go to Verse'}
              </button>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                {uiLang === 'ar' ? 'نتائج السور' : 'Matching Surahs'}
              </h4>
              <div className="space-y-1.5">
                {results.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSurah(s.id);
                      onClose();
                    }}
                    className="w-full p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-stone-200/80 hover:border-emerald-300 transition-all flex items-center justify-between text-right"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center">
                        {s.id}
                      </span>
                      <div>
                        <div className="font-amiri font-bold text-base text-stone-900">
                          سورة {s.nameArabic}
                        </div>
                        <div className="text-xs text-stone-500 font-sans">
                          {s.nameEnglish} ({s.englishTranslation})
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                      {s.ayahCount} {uiLang === 'ar' ? 'آية' : 'ayahs'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick shortcuts */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{uiLang === 'ar' ? 'مقاطع وسور مباركة شائعة' : 'Frequently Read Surahs'}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {quickLinks.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectSurah(item.surahId, item.ayah);
                    onClose();
                  }}
                  className="p-2.5 bg-white hover:bg-emerald-50 border border-stone-200 rounded-xl text-center transition-all group"
                >
                  <div className="font-amiri font-bold text-sm text-stone-800 group-hover:text-emerald-950">
                    {item.nameArabic}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {item.ayah > 1 ? `آية ${item.ayah}` : 'بداية السورة'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium transition-colors"
          >
            {uiLang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
