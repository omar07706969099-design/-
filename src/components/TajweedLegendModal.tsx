import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Scroll, Check, Info, HelpCircle } from 'lucide-react';
import { RiwayahId } from '../types/quran';
import { TAJWEED_COLORS, TajweedRuleType } from '../utils/tajweedColorizer';
import { getRiwayahById } from '../data/riwayat';

interface TajweedLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRiwayahId: RiwayahId;
  uiLang: 'ar' | 'en';
}

export const TajweedLegendModal: React.FC<TajweedLegendModalProps> = ({
  isOpen,
  onClose,
  activeRiwayahId,
  uiLang,
}) => {
  if (!isOpen) return null;

  const activeRiwayah = getRiwayahById(activeRiwayahId);

  // Group rules into logical categories
  const categories = [
    {
      titleAr: 'أحكام المدود (المقادير والألوان)',
      titleEn: 'Prolongation Rules (Madd & Durations)',
      rules: ['madd_lazim', 'madd_muttasil', 'madd_munfasil', 'madd_badal'] as TajweedRuleType[],
    },
    {
      titleAr: 'أحكام الغنة والساكن والتنوين',
      titleEn: 'Ghunnah, Nun Sakinah & Tanwin Rules',
      rules: ['ghunnah', 'ikhfa', 'idgham_ghunnah', 'idgham_no_ghunnah', 'iqlab'] as TajweedRuleType[],
    },
    {
      titleAr: 'أحكام القلقلة والحروف التي لا تُلفظ',
      titleEn: 'Qalqalah & Unvoiced Letters',
      rules: ['qalqalah', 'silent'] as TajweedRuleType[],
    },
    {
      titleAr: `الأحكام الخاصة برواية ${activeRiwayah.nameArabic}`,
      titleEn: `Special Rules for Narration: ${activeRiwayah.nameEnglish}`,
      rules: (
        activeRiwayahId === 'warsh'
          ? ['naql_warsh', 'taghleedh_lam', 'tarqeeq_ra', 'madd_badal']
          : activeRiwayahId === 'soosi'
          ? ['idgham_kabir']
          : activeRiwayahId === 'khalaf'
          ? ['sakt_khalaf']
          : []
      ) as TajweedRuleType[],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="tajweed-legend-modal-dialog"
        className="bg-[#FAF8F5] w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-800 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-stone-100 px-5 sm:px-6 py-4 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-amiri text-amber-200 leading-tight">
                {uiLang === 'ar' ? 'دليل ألوان التجويد وأحكام القراءة' : 'Tajweed Color Guide & Recitation Rules'}
              </h3>
              <p className="text-xs text-stone-300 font-sans">
                {uiLang === 'ar' 
                  ? `وفقاً للمصحف المجود المعتمد برواية ${activeRiwayah.nameArabic}`
                  : `According to the Standard Tajweed Mushaf for ${activeRiwayah.nameEnglish}`}
              </p>
            </div>
          </div>
          <button
            id="close-tajweed-legend-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-stone-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Active Narration Note */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              <span className="font-bold font-amiri text-base block mb-0.5">
                {uiLang === 'ar' ? `الرواية الحالية: ${activeRiwayah.nameArabic}` : `Current Narration: ${activeRiwayah.nameEnglish}`}
              </span>
              {uiLang === 'ar'
                ? `يتم تلوين المصحف الشريف تلقائياً بالألوان القياسية المعتمدة في مصاحف التجويد، مع مراعاة الفروق الدقيقة الخاصة برواية ${activeRiwayah.nameArabic} في مقادير المدود وأحكام الأداء.`
                : `Verses are dynamically color-coded following the standard Tajweed Mushaf, tailored with the exact rulings and durations for ${activeRiwayah.nameEnglish}.`}
            </div>
          </div>

          {/* Categories Grid */}
          {categories.map((cat, cIdx) => {
            if (cat.rules.length === 0) return null;

            return (
              <div key={cIdx} className="space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-stone-700 uppercase tracking-wider pb-1.5 border-b border-stone-200/80">
                  {uiLang === 'ar' ? cat.titleAr : cat.titleEn}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cat.rules.map((ruleKey) => {
                    const rule = TAJWEED_COLORS[ruleKey];
                    if (!rule) return null;

                    return (
                      <div
                        key={ruleKey}
                        className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                            ruleKey === 'madd_lazim' ? 'bg-red-600' :
                            ruleKey === 'madd_muttasil' ? 'bg-rose-600' :
                            ruleKey === 'madd_munfasil' ? 'bg-orange-500' :
                            ruleKey === 'madd_badal' ? 'bg-amber-600' :
                            ruleKey === 'ghunnah' ? 'bg-emerald-600' :
                            ruleKey === 'ikhfa' ? 'bg-emerald-500' :
                            ruleKey === 'idgham_ghunnah' ? 'bg-teal-600' :
                            ruleKey === 'idgham_no_ghunnah' ? 'bg-stone-400' :
                            ruleKey === 'iqlab' ? 'bg-amber-500' :
                            ruleKey === 'qalqalah' ? 'bg-sky-600' :
                            ruleKey === 'naql_warsh' ? 'bg-indigo-600' :
                            ruleKey === 'taghleedh_lam' ? 'bg-blue-900' :
                            ruleKey === 'tarqeeq_ra' ? 'bg-cyan-600' :
                            ruleKey === 'idgham_kabir' ? 'bg-teal-700' :
                            ruleKey === 'sakt_khalaf' ? 'bg-purple-600' :
                            'bg-stone-300'
                          }`} />

                          <h5 className={`text-xs sm:text-sm font-bold font-amiri ${rule.color}`}>
                            {uiLang === 'ar' ? rule.labelAr : rule.labelEn}
                          </h5>
                        </div>

                        <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed font-sans">
                          {uiLang === 'ar' ? rule.descAr : rule.descEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500 font-sans">
            {uiLang === 'ar' ? 'معتمد وفق ضوابط الرسم والضبط العثماني' : 'Standard Uthmani Tajweed Edition'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {uiLang === 'ar' ? 'فهمت ذلك' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
