import React, { useState } from 'react';
import { 
  Scroll, 
  Check, 
  Headphones, 
  MapPin, 
  UserCheck, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Search,
  SlidersHorizontal,
  Compass,
  Volume2
} from 'lucide-react';
import { RiwayahId, RiwayahInfo, Reciter } from '../types/quran';
import { RIWAYAT, RIWAYAH_SCHOOLS, getRiwayahById } from '../data/riwayat';
import { getRecitersByRiwayah } from '../data/reciters';

interface RiwayatSectionProps {
  activeRiwayahId: RiwayahId;
  onSelectRiwayah: (id: RiwayahId) => void;
  onOpenRiwayahModalWithId: (id: RiwayahId) => void;
  onSelectReciter?: (reciter: Reciter) => void;
  onPlayAyah?: (ayahNumber: number) => void;
  uiLang: 'ar' | 'en';
}

export const RiwayatSection: React.FC<RiwayatSectionProps> = ({
  activeRiwayahId,
  onSelectRiwayah,
  onOpenRiwayahModalWithId,
  onSelectReciter,
  uiLang,
}) => {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRiwayat = RIWAYAT.filter((r) => {
    // School filter
    if (selectedSchool === 'madinah') {
      if (r.id !== 'warsh' && r.id !== 'qaloon') return false;
    } else if (selectedSchool === 'kufa') {
      if (r.id !== 'hafs' && r.id !== 'shouba' && r.id !== 'khalaf' && r.id !== 'duri_kisai') return false;
    } else if (selectedSchool === 'basra') {
      if (r.id !== 'doori' && r.id !== 'soosi') return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.nameArabic.includes(q) || r.nameEnglish.toLowerCase().includes(q);
      const matchImam = r.imamArabic.includes(q) || r.imamEnglish.toLowerCase().includes(q);
      const matchRawi = r.rawiArabic.includes(q) || r.rawiEnglish.toLowerCase().includes(q);
      const matchRegion = r.regionArabic.includes(q) || r.regionEnglish.toLowerCase().includes(q);
      const matchFeatures = r.tajweedFocusArabic.some((f) => f.includes(q)) || r.tajweedFocusEnglish.some((f) => f.toLowerCase().includes(q));
      return matchName || matchImam || matchRawi || matchRegion || matchFeatures;
    }

    return true;
  });

  return (
    <section 
      id="riwayat-section"
      className="rounded-3xl bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-900 text-stone-100 p-6 sm:p-10 shadow-xl border border-emerald-800/60 relative overflow-hidden mb-12"
    >
      {/* Decorative background Islamic pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none islamic-pattern" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-emerald-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-amber-300 text-xs font-semibold mb-3">
              <Scroll className="w-3.5 h-3.5" />
              <span>{uiLang === 'ar' ? 'الروايات والقراءات المتواترة' : 'Canonical Quranic Narrations'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-amiri text-amber-100 tracking-wide">
              {uiLang === 'ar' ? 'قسم الروايات القرآنية والمصاحف' : 'The Quranic Narrations & Qira‘at'}
            </h2>
            <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl font-sans leading-relaxed">
              {uiLang === 'ar'
                ? 'استكشف القراءات القرآنية المتواترة بأصولها ورواياتها الموثقة عن كبار أئمة التابعين بالمدينة والكوفة والبصرة، مع إمكانية التبديل بين نصوص المصاحف وتلاوات المشايخ.'
                : 'Explore the canonical Quranic transmissions from the schools of Madinah, Kufa, and Basra. Switch text orthography and listen to authentic regional reciters.'}
            </p>
          </div>

          {/* Quick Active Badge */}
          <div className="bg-emerald-900/90 border border-amber-400/40 rounded-2xl p-3.5 flex items-center gap-3 shrink-0 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-stone-300">
                {uiLang === 'ar' ? 'الرواية المفعلة حالياً في التطبيق:' : 'Currently Active in Reader:'}
              </div>
              <div className="font-amiri font-bold text-base text-amber-200">
                {uiLang === 'ar' ? getRiwayahById(activeRiwayahId).nameArabic : getRiwayahById(activeRiwayahId).nameEnglish}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* School Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-950/60 rounded-2xl border border-emerald-800/70 overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              id="school-tab-all"
              onClick={() => setSelectedSchool('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSchool === 'all'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              {uiLang === 'ar' ? 'جميع الروايات (8)' : 'All Narrations (8)'}
            </button>
            <button
              id="school-tab-madinah"
              onClick={() => setSelectedSchool('madinah')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSchool === 'madinah'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              {uiLang === 'ar' ? 'مدرسة المدينة (ورش، قالون)' : 'Madinah School'}
            </button>
            <button
              id="school-tab-kufa"
              onClick={() => setSelectedSchool('kufa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSchool === 'kufa'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              {uiLang === 'ar' ? 'مدرسة الكوفة (حفص، خلف...)' : 'Kufa School'}
            </button>
            <button
              id="school-tab-basra"
              onClick={() => setSelectedSchool('basra')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSchool === 'basra'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              {uiLang === 'ar' ? 'مدرسة البصرة (الدوري، السوسي)' : 'Basra School'}
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={uiLang === 'ar' ? 'ابحث عن رواية، إمام، أو حكم تجويد...' : 'Search narration, imam, or rule...'}
              className="w-full pr-10 pl-4 py-2 rounded-2xl bg-stone-950/70 border border-emerald-800/70 text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Riwayat Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRiwayat.map((r) => {
            const isActive = r.id === activeRiwayahId;
            const reciters = getRecitersByRiwayah(r.id);

            return (
              <div
                key={r.id}
                id={`riwayah-card-${r.id}`}
                className={`rounded-3xl p-5 sm:p-6 transition-all duration-200 border flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-b from-emerald-900/90 to-teal-950/90 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                    : 'bg-stone-900/80 hover:bg-stone-850/90 border-emerald-900/70 hover:border-emerald-700/80 shadow-sm'
                }`}
              >
                <div>
                  {/* Top Tags & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-amber-300 border border-emerald-700/60 text-[11px] font-semibold">
                      {uiLang === 'ar' ? r.schoolArabic : r.schoolEnglish}
                    </span>

                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[11px] font-bold shadow-xs">
                        <Check className="w-3 h-3" />
                        <span>{uiLang === 'ar' ? 'مفعلة للقراءة' : 'Active'}</span>
                      </span>
                    )}
                  </div>

                  {/* Narration Title */}
                  <h3 className="text-xl sm:text-2xl font-bold font-amiri text-stone-50 mb-1">
                    {uiLang === 'ar' ? r.nameArabic : r.nameEnglish}
                  </h3>

                  {/* Imam and Rawi */}
                  <div className="space-y-1 my-3 text-xs text-stone-300 font-sans border-y border-emerald-900/60 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{uiLang === 'ar' ? `الإمام: ${r.imamArabic}` : `Imam: ${r.imamEnglish}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{uiLang === 'ar' ? `الانتشار: ${r.regionArabic}` : `Region: ${r.regionEnglish}`}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-300 font-sans leading-relaxed line-clamp-3 mb-3">
                    {uiLang === 'ar' ? r.descriptionArabic : r.descriptionEnglish}
                  </p>

                  {/* Tajweed Focus Badges */}
                  <div className="mb-4">
                    <div className="text-[11px] text-stone-400 font-semibold mb-1.5">
                      {uiLang === 'ar' ? 'أبرز أصول وقواعد الرواية:' : 'Key Tajweed Highlights:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.tajweedFocusArabic.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-700/50 text-[10px] text-emerald-200"
                        >
                          {uiLang === 'ar' ? tag : r.tajweedFocusEnglish[idx] || tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions & Reciters */}
                <div className="pt-4 border-t border-emerald-900/60">
                  {/* Prominent reciters preview */}
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Headphones className="w-3.5 h-3.5 text-amber-300" />
                      <span>{uiLang === 'ar' ? `${reciters.length} قراء متاحون` : `${reciters.length} Reciters`}</span>
                    </span>
                    <span className="text-[11px] text-emerald-300">
                      {r.prominentRecitersArabic[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Select / Activate button */}
                    <button
                      id={`activate-riwayah-${r.id}-btn`}
                      onClick={() => onSelectRiwayah(r.id)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                        isActive
                          ? 'bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold'
                          : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{uiLang === 'ar' ? 'الرواية الحالية' : 'Current Riwayah'}</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{uiLang === 'ar' ? 'اعتماد الرواية' : 'Select Narration'}</span>
                        </>
                      )}
                    </button>

                    {/* Open Full Guide Dialog */}
                    <button
                      id={`details-riwayah-${r.id}-btn`}
                      onClick={() => onOpenRiwayahModalWithId(r.id)}
                      className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors cursor-pointer"
                      title={uiLang === 'ar' ? 'عرض تفاصيل وأصول الرواية' : 'View full narration rules'}
                    >
                      <Scroll className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
