import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Check, 
  Sparkles, 
  MapPin, 
  User, 
  Volume2, 
  Info,
  ChevronLeft,
  ChevronRight,
  Scroll,
  Search,
  Headphones,
  School
} from 'lucide-react';
import { RiwayahId, RiwayahInfo, Reciter } from '../types/quran';
import { RIWAYAT } from '../data/riwayat';
import { getRecitersByRiwayah } from '../data/reciters';

interface RiwayahModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRiwayahId: RiwayahId;
  onSelectRiwayah: (id: RiwayahId) => void;
  onSelectReciter?: (reciter: Reciter) => void;
  uiLang: 'ar' | 'en';
}

export const RiwayahModal: React.FC<RiwayahModalProps> = ({
  isOpen,
  onClose,
  activeRiwayahId,
  onSelectRiwayah,
  onSelectReciter,
  uiLang,
}) => {
  const [selectedDetailId, setSelectedDetailId] = useState<RiwayahId>(activeRiwayahId);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentDetail = RIWAYAT.find((r) => r.id === selectedDetailId) || RIWAYAT[0];
  const recitersForDetail = getRecitersByRiwayah(selectedDetailId);

  const filteredRiwayat = RIWAYAT.filter((r) => {
    if (selectedSchool === 'madinah') {
      if (r.id !== 'warsh' && r.id !== 'qaloon') return false;
    } else if (selectedSchool === 'kufa') {
      if (r.id !== 'hafs' && r.id !== 'shouba' && r.id !== 'khalaf' && r.id !== 'duri_kisai') return false;
    } else if (selectedSchool === 'basra') {
      if (r.id !== 'doori' && r.id !== 'soosi') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.nameArabic.includes(q) || r.nameEnglish.toLowerCase().includes(q);
      const matchImam = r.imamArabic.includes(q) || r.imamEnglish.toLowerCase().includes(q);
      const matchRawi = r.rawiArabic.includes(q) || r.rawiEnglish.toLowerCase().includes(q);
      return matchName || matchImam || matchRawi;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="riwayah-modal-dialog"
        className="bg-[#FAF8F5] border border-stone-200/90 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 sm:py-5 border-b border-stone-200/80 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shadow-xs">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-amiri tracking-wide text-stone-50">
                {uiLang === 'ar' ? 'دليل الروايات والقراءات القرآنية المتواترة' : 'Quranic Narrations & Qira‘at Directory'}
              </h2>
              <p className="text-xs text-emerald-200/90 font-sans">
                {uiLang === 'ar' 
                  ? 'منظومة شاملة للروايات المتواترة: الأصول، مواطن الانتشار، والمقرئون المعتمدون' 
                  : 'Comprehensive directory of canonical transmissions, Tajweed rules, and reciters'}
              </p>
            </div>
          </div>
          <button
            id="close-riwayah-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={uiLang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split view */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left / Riwayat list with schools and search */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-stone-200/80 p-3 sm:p-4 overflow-y-auto bg-stone-50/70 flex flex-col gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-riwayah-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={uiLang === 'ar' ? 'بحث عن رواية أو إمام...' : 'Search narration or imam...'}
                className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* School Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                onClick={() => setSelectedSchool('all')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedSchool === 'all'
                    ? 'bg-emerald-900 text-amber-200'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {uiLang === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSelectedSchool('madinah')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedSchool === 'madinah'
                    ? 'bg-emerald-900 text-amber-200'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {uiLang === 'ar' ? 'المدينة' : 'Madinah'}
              </button>
              <button
                onClick={() => setSelectedSchool('kufa')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedSchool === 'kufa'
                    ? 'bg-emerald-900 text-amber-200'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {uiLang === 'ar' ? 'الكوفة' : 'Kufa'}
              </button>
              <button
                onClick={() => setSelectedSchool('basra')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedSchool === 'basra'
                    ? 'bg-emerald-900 text-amber-200'
                    : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {uiLang === 'ar' ? 'البصرة' : 'Basra'}
              </button>
            </div>

            {/* Riwayat items */}
            <div className="space-y-1.5 flex-1">
              {filteredRiwayat.map((riwayah) => {
                const isActive = activeRiwayahId === riwayah.id;
                const isInspected = selectedDetailId === riwayah.id;
                const reciterCount = getRecitersByRiwayah(riwayah.id).length;

                return (
                  <div
                    key={riwayah.id}
                    id={`modal-riwayah-item-${riwayah.id}`}
                    onClick={() => setSelectedDetailId(riwayah.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border text-right flex items-center justify-between gap-2 ${
                      isInspected 
                        ? 'bg-emerald-900 text-white border-emerald-800 shadow-sm' 
                        : 'bg-white text-stone-800 hover:bg-emerald-50/50 border-stone-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isInspected ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {uiLang === 'ar' ? 'المفعلة' : 'Active'}
                        </span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        isInspected ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {reciterCount} {uiLang === 'ar' ? 'قراء' : 'Reciters'}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-[10px] ${isInspected ? 'text-emerald-300' : 'text-stone-400'}`}>
                          {riwayah.schoolArabic.split(' ')[1] || riwayah.schoolArabic}
                        </span>
                        <h3 className="font-bold text-base font-amiri leading-tight">
                          {uiLang === 'ar' ? riwayah.nameArabic : riwayah.nameEnglish}
                        </h3>
                      </div>
                      <p className={`text-xs truncate max-w-[170px] ${
                        isInspected ? 'text-emerald-200/90' : 'text-stone-500'
                      }`}>
                        {uiLang === 'ar' ? riwayah.qiraahArabic : riwayah.qiraahEnglish}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right / Detailed view of selected Riwayah */}
          <div className="w-full md:w-7/12 p-5 sm:p-6 overflow-y-auto space-y-5 bg-[#FAF8F5]">
            {/* Top overview card */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <button
                  id="modal-apply-riwayah-btn"
                  onClick={() => {
                    onSelectRiwayah(currentDetail.id);
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                    activeRiwayahId === currentDetail.id
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-900'
                  }`}
                >
                  {activeRiwayahId === currentDetail.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>{uiLang === 'ar' ? 'الرواية مفعلة حالياً' : 'Currently Active'}</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>{uiLang === 'ar' ? 'اعتماد هذه الرواية' : 'Apply Narration'}</span>
                    </>
                  )}
                </button>

                <div className="text-right">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    {uiLang === 'ar' ? currentDetail.schoolArabic : currentDetail.schoolEnglish}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-amiri text-stone-900 mt-1">
                    {uiLang === 'ar' ? currentDetail.nameArabic : currentDetail.nameEnglish}
                  </h3>
                  <div className="text-xs text-stone-500 font-sans">
                    {uiLang === 'ar' ? currentDetail.qiraahArabic : currentDetail.qiraahEnglish}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed text-right">
                {uiLang === 'ar' ? currentDetail.descriptionArabic : currentDetail.descriptionEnglish}
              </p>

              {/* Bio & Regions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                <div className="flex items-start gap-2 text-stone-600 text-right">
                  <User className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block">{uiLang === 'ar' ? 'الإمام المقرئ:' : 'Imam:'}</strong>
                    <span>{uiLang === 'ar' ? currentDetail.imamArabic : currentDetail.imamEnglish}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-stone-600 text-right">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block">{uiLang === 'ar' ? 'مواطن الانتشار:' : 'Region:'}</strong>
                    <span>{uiLang === 'ar' ? currentDetail.regionArabic : currentDetail.regionEnglish}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules & Distinctive Tajweed Principles */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {currentDetail.tajweedFocusArabic.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold">
                      {uiLang === 'ar' ? tag : currentDetail.tajweedFocusEnglish[idx] || tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-sm sm:text-base font-amiri">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{uiLang === 'ar' ? 'أبرز أصول وقواعد الرواية' : 'Distinctive Tajweed Rules'}</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 text-right">
                {(uiLang === 'ar' ? currentDetail.keyFeaturesArabic : currentDetail.keyFeaturesEnglish).map((feature, i) => (
                  <li key={i} className="flex items-start justify-end gap-2">
                    <span className="leading-relaxed">{feature}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-2" />
                  </li>
                ))}
              </ul>
            </div>

            {/* Reciters for this Riwayah with direct activation */}
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  {recitersForDetail.length} {uiLang === 'ar' ? 'تسجيلات وقراء متاحون' : 'Available Reciters'}
                </span>
                <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-sm sm:text-base font-amiri">
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>{uiLang === 'ar' ? 'قراء الرواية المتوفرون' : 'Reciters for this Narration'}</span>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {recitersForDetail.map((rec) => (
                  <div 
                    key={rec.id}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/60 border border-stone-200/70 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {onSelectReciter && (
                        <button
                          onClick={() => {
                            onSelectRiwayah(currentDetail.id);
                            onSelectReciter(rec);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs flex items-center gap-1 cursor-pointer"
                          title={uiLang === 'ar' ? 'تشغيل تلاوة هذا القارئ' : 'Play this reciter'}
                        >
                          <Headphones className="w-3 h-3 text-amber-300" />
                          <span>{uiLang === 'ar' ? 'استماع وتفعيل' : 'Play & Select'}</span>
                        </button>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 text-[10px] font-semibold">
                        {rec.audioType === 'ayah' ? (uiLang === 'ar' ? 'آية بآية' : 'Verse') : (uiLang === 'ar' ? 'سورة كاملة' : 'Full Surah')}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-stone-900 font-amiri text-sm">
                        {uiLang === 'ar' ? rec.nameArabic : rec.nameEnglish}
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        {uiLang === 'ar' ? rec.subtextArabic : rec.subtextEnglish}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200/80 bg-stone-100/90 flex items-center justify-between text-xs text-stone-500">
          <span>
            {uiLang === 'ar' 
              ? 'تعتمد القراءات القرآنية المتواترة على الأسانيد الصحيحة المتصلة إلى النبي ﷺ' 
              : 'Canonical transmissions verified through authentic unbroken chains (Sanad).'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold transition-colors cursor-pointer"
          >
            {uiLang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
