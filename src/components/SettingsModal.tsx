import React from 'react';
import { Sliders, X, Check, Eye, Type, Scroll, Sparkles, HelpCircle } from 'lucide-react';
import { QuranFont, ViewMode, RiwayahId } from '../types/quran';
import { RIWAYAT } from '../data/riwayat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  quranFont: QuranFont;
  onChangeQuranFont: (font: QuranFont) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  showTranslation: boolean;
  onToggleShowTranslation: () => void;
  activeRiwayahId: RiwayahId;
  onOpenRiwayahModal: () => void;
  tajweedEnabled?: boolean;
  onToggleTajweed?: () => void;
  onOpenTajweedLegend?: () => void;
  uiLang: 'ar' | 'en';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fontSize,
  onChangeFontSize,
  quranFont,
  onChangeQuranFont,
  viewMode,
  onChangeViewMode,
  showTranslation,
  onToggleShowTranslation,
  activeRiwayahId,
  onOpenRiwayahModal,
  tajweedEnabled = true,
  onToggleTajweed,
  onOpenTajweedLegend,
  uiLang,
}) => {
  if (!isOpen) return null;

  const currentRiwayah = RIWAYAT.find((r) => r.id === activeRiwayahId) || RIWAYAT[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="settings-modal-dialog"
        className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-amiri text-stone-50">
              {uiLang === 'ar' ? 'خيارات العرض والخط القرآني' : 'Display & Typography Settings'}
            </h3>
          </div>
          <button
            id="close-settings-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-stone-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Active Narration Card */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenRiwayahModal();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Scroll className="w-3.5 h-3.5 text-emerald-700" />
                <span>{uiLang === 'ar' ? 'تغيير الرواية' : 'Change Narration'}</span>
              </button>

              <div className="text-right">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {uiLang === 'ar' ? 'الرواية القرآنية المفعلة' : 'Active Quranic Narration'}
                </label>
                <div className="text-base font-bold font-amiri text-emerald-950">
                  {uiLang === 'ar' ? currentRiwayah.nameArabic : currentRiwayah.nameEnglish}
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-500 text-right">
              {uiLang === 'ar' ? currentRiwayah.descriptionArabic : currentRiwayah.descriptionEnglish}
            </p>
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
              {uiLang === 'ar' ? 'نمط عرض السورة' : 'Reading View Mode'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="viewmode-ayah-by-ayah-btn"
                onClick={() => onChangeViewMode('ayah-by-ayah')}
                className={`p-3.5 rounded-2xl border text-right transition-all ${
                  viewMode === 'ayah-by-ayah'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {uiLang === 'ar' ? 'آية تلو آية' : 'Verse by Verse'}
                </div>
                <div className="text-xs text-stone-500 font-normal">
                  {uiLang === 'ar' ? 'بطاقات مع الترجمة وأزرار التفسير السريع' : 'Cards with translation & quick Tafsir'}
                </div>
              </button>

              <button
                id="viewmode-mushaf-btn"
                onClick={() => onChangeViewMode('mushaf')}
                className={`p-3.5 rounded-2xl border text-right transition-all ${
                  viewMode === 'mushaf'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {uiLang === 'ar' ? 'المصحف الشريف' : 'Mushaf Layout'}
                </div>
                <div className="text-xs text-stone-500 font-normal">
                  {uiLang === 'ar' ? 'نص قرآني متصل كصفحات المصحف' : 'Continuous flowing Quran text'}
                </div>
              </button>
            </div>
          </div>

          {/* Font Family Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
              {uiLang === 'ar' ? 'نوع الخط القرآني' : 'Arabic Quranic Font'}
            </label>
            <div className="space-y-2">
              {[
                { id: 'amiri-quran', name: 'الخط الأميري للمصحف (Amiri Quran)', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
                { id: 'scheherazade', name: 'خط شهرزاد النسخي (Scheherazade New)', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
                { id: 'amiri', name: 'الخط الأميري المعتاد (Amiri Classic)', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
              ].map((f) => {
                const isSelected = quranFont === f.id;
                return (
                  <button
                    key={f.id}
                    id={`select-font-${f.id}`}
                    onClick={() => onChangeQuranFont(f.id as QuranFont)}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-right transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-stone-700 mb-1">
                        {f.name}
                      </div>
                      <div 
                        className={`text-base text-emerald-950 ${
                          f.id === 'amiri-quran' ? 'font-quran' : f.id === 'scheherazade' ? 'font-scheherazade' : 'font-amiri'
                        }`}
                      >
                        {f.sample}
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-emerald-600 shrink-0 mr-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {uiLang === 'ar' ? 'حجم الخط القرآني' : 'Quran Font Size'}
              </label>
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {fontSize}px
              </span>
            </div>
            <input
              id="font-size-slider"
              type="range"
              min="20"
              max="42"
              step="2"
              value={fontSize}
              onChange={(e) => onChangeFontSize(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            {/* Live Size Preview Box */}
            <div className="mt-3 p-4 bg-white rounded-2xl border border-stone-200 text-center">
              <div 
                className={`text-emerald-950 font-quran leading-relaxed`}
                style={{ fontSize: `${fontSize}px` }}
              >
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </div>
            </div>
          </div>

          {/* Tajweed Color Coding Setting */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>{uiLang === 'ar' ? 'تلوين أحكام التجويد حسب الرواية' : 'Riwayah-Specific Tajweed Color Rules'}</span>
                </div>
                <div className="text-xs text-stone-500">
                  {uiLang === 'ar' 
                    ? 'المدود، الغنن، الإخفاء، القلقلة، وأحكام ورش وخلف والسوسي' 
                    : 'Madd, Ghunnah, Qalqalah, and specific Riwayah rules'}
                </div>
              </div>
              {onToggleTajweed && (
                <button
                  id="settings-toggle-tajweed-btn"
                  onClick={onToggleTajweed}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    tajweedEnabled ? 'bg-emerald-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      tajweedEnabled ? 'right-6' : 'right-0.5'
                    }`}
                  />
                </button>
              )}
            </div>

            {onOpenTajweedLegend && (
              <button
                id="settings-open-tajweed-legend-btn"
                onClick={() => {
                  onClose();
                  onOpenTajweedLegend();
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-amber-800" />
                <span>{uiLang === 'ar' ? 'فتح دليل وقواعد ألوان التجويد' : 'Open Tajweed Legend & Rules'}</span>
              </button>
            )}
          </div>

          {/* Translation Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200">
            <div>
              <div className="text-sm font-semibold text-stone-800">
                {uiLang === 'ar' ? 'إظهار الترجمة الإنجليزية' : 'Show English Translation'}
              </div>
              <div className="text-xs text-stone-500">
                {uiLang === 'ar' ? 'ترجمة صحيح إنترناشونال للآيات' : 'Sahih International verse translation'}
              </div>
            </div>
            <button
              id="toggle-translation-btn"
              onClick={onToggleShowTranslation}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                showTranslation ? 'bg-emerald-700' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  showTranslation ? 'right-6' : 'right-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            {uiLang === 'ar' ? 'حفظ وإغلاق' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
