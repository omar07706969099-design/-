import React from 'react';
import { Bookmark, X, Trash2, ArrowRight, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Bookmark as BookmarkType, LastRead } from '../types/quran';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onRemoveBookmark: (id: string) => void;
  onJumpToAyah: (surahId: number, ayahNumber: number) => void;
  lastRead: LastRead | null;
  uiLang: 'ar' | 'en';
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onJumpToAyah,
  lastRead,
  uiLang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="bookmarks-modal-dialog"
        className="bg-[#FAF8F5] w-full max-w-xl max-h-[85vh] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden text-stone-800"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-300/30">
              <Bookmark className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold font-amiri text-stone-50">
              {uiLang === 'ar' ? 'المحفوظات والعلامات المرجعية' : 'Bookmarks & Reading History'}
            </h3>
          </div>
          <button
            id="close-bookmarks-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-stone-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Last Read Section */}
          {lastRead && (
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{uiLang === 'ar' ? 'آخر موضع توقفت عنده:' : 'Last Read Position:'}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-amiri font-bold text-base text-stone-900">
                    {lastRead.surahNameArabic} ({lastRead.surahNameEnglish})
                  </h4>
                  <p className="text-xs text-stone-600 font-sans">
                    {uiLang === 'ar' ? `الآية الكريمة: ${lastRead.ayahNumber}` : `Verse ${lastRead.ayahNumber}`}
                  </p>
                </div>
                <button
                  id="jump-last-read-btn"
                  onClick={() => {
                    onJumpToAyah(lastRead.surahId, lastRead.ayahNumber);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{uiLang === 'ar' ? 'متابعة' : 'Resume'}</span>
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Bookmarks List */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
              {uiLang === 'ar' ? `الآيات المحفوظة (${bookmarks.length})` : `Saved Verses (${bookmarks.length})`}
            </h4>

            {bookmarks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/80 p-6">
                <Bookmark className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-stone-700 mb-1">
                  {uiLang === 'ar' ? 'لا توجد آيات محفوظة بعد' : 'No saved bookmarks yet'}
                </p>
                <p className="text-xs text-stone-500">
                  {uiLang === 'ar'
                    ? 'يمكنك حفظ أي آية بالضغط على أيقونة الإشارة المرجعية بجانب الآية أثناء القراءة.'
                    : 'You can bookmark any verse while reading by clicking the bookmark icon.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:border-emerald-300 transition-all flex items-start justify-between gap-3"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        onJumpToAyah(bm.surahId, bm.ayahNumber);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-amiri font-bold text-base text-emerald-950">
                          سورة {bm.surahNameArabic}
                        </span>
                        <span className="text-xs font-semibold text-stone-500 font-sans">
                          {uiLang === 'ar' ? `[الآية ${bm.ayahNumber}]` : `[Verse ${bm.ayahNumber}]`}
                        </span>
                      </div>
                      <p className="font-quran text-sm text-stone-800 line-clamp-2 leading-relaxed">
                        {bm.ayahText}
                      </p>
                    </div>

                    <button
                      id={`delete-bookmark-${bm.id}`}
                      onClick={() => onRemoveBookmark(bm.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                      title={uiLang === 'ar' ? 'حذف العلامة' : 'Remove'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium text-xs transition-colors"
          >
            {uiLang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
