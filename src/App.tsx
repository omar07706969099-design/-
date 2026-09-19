import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SurahList } from './components/SurahList';
import { QuranReader } from './components/QuranReader';
import { TafsirModal } from './components/TafsirModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { BookmarksModal } from './components/BookmarksModal';
import { SettingsModal } from './components/SettingsModal';
import { SearchModal } from './components/SearchModal';
import { RiwayahModal } from './components/RiwayahModal';
import { TajweedLegendModal } from './components/TajweedLegendModal';
import { ALL_SURAHS } from './data/surahs';
import { RECITERS, getDefaultReciterForRiwayah } from './data/reciters';
import { RIWAYAT } from './data/riwayat';
import { getSurahVerses } from './services/quranApi';
import { 
  Ayah, 
  SurahMeta, 
  Reciter, 
  Bookmark, 
  LastRead, 
  QuranFont, 
  ViewMode,
  RiwayahId 
} from './types/quran';

export default function App() {
  // Narration (Riwayah) state
  const [activeRiwayahId, setActiveRiwayahId] = useState<RiwayahId>(() => {
    try {
      const saved = localStorage.getItem('quran_riwayah') as RiwayahId;
      if (saved && RIWAYAT.some((r) => r.id === saved)) return saved;
    } catch {}
    return 'hafs';
  });
  const [isRiwayahModalOpen, setIsRiwayahModalOpen] = useState<boolean>(false);

  // Navigation & Reading state
  const [currentSurahId, setCurrentSurahId] = useState<number | null>(null);
  const [currentAyahNumber, setCurrentAyahNumber] = useState<number>(1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingVerses, setLoadingVerses] = useState<boolean>(false);

  // Exegesis (Tafsir) state
  const [tafsirAyah, setTafsirAyah] = useState<Ayah | null>(null);
  const [isTafsirOpen, setIsTafsirOpen] = useState<boolean>(false);

  // Audio recitation state
  const [reciter, setReciter] = useState<Reciter>(() => {
    try {
      const saved = localStorage.getItem('quran_reciter');
      if (saved) {
        const found = RECITERS.find((r) => r.id === saved);
        if (found) return found;
      }
    } catch (e) {}
    return RECITERS[0]; // Mishary Alafasy
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);

  // UI preferences
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quran_font_size');
      return saved ? Number(saved) : 26;
    } catch {
      return 26;
    }
  });
  const [quranFont, setQuranFont] = useState<QuranFont>(() => {
    try {
      const saved = localStorage.getItem('quran_font_family') as QuranFont;
      return saved || 'amiri-quran';
    } catch {
      return 'amiri-quran';
    }
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('quran_view_mode') as ViewMode;
      return saved || 'ayah-by-ayah';
    } catch {
      return 'ayah-by-ayah';
    }
  });
  const [showTranslation, setShowTranslation] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quran_show_translation');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [tajweedEnabled, setTajweedEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('quran_tajweed_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [uiLang, setUiLang] = useState<'ar' | 'en'>('ar');

  // Modals state
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTajweedLegendOpen, setIsTajweedLegendOpen] = useState<boolean>(false);

  // Bookmarks and Last Read local storage
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('quran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lastRead, setLastRead] = useState<LastRead | null>(() => {
    try {
      const saved = localStorage.getItem('quran_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep HTML lang and dir updated
  useEffect(() => {
    document.documentElement.lang = uiLang;
    document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
  }, [uiLang]);

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('quran_riwayah', activeRiwayahId);
      localStorage.setItem('quran_font_size', String(fontSize));
      localStorage.setItem('quran_font_family', quranFont);
      localStorage.setItem('quran_view_mode', viewMode);
      localStorage.setItem('quran_show_translation', String(showTranslation));
      localStorage.setItem('quran_tajweed_enabled', String(tajweedEnabled));
      localStorage.setItem('quran_reciter', reciter.id);
      localStorage.setItem('quran_bookmarks', JSON.stringify(bookmarks));
      if (lastRead) {
        localStorage.setItem('quran_last_read', JSON.stringify(lastRead));
      }
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  }, [activeRiwayahId, fontSize, quranFont, viewMode, showTranslation, tajweedEnabled, reciter, bookmarks, lastRead]);

  // Load verses when currentSurahId or activeRiwayahId changes
  useEffect(() => {
    if (!currentSurahId) return;

    let isSubscribed = true;
    setLoadingVerses(true);

    getSurahVerses(currentSurahId, activeRiwayahId)
      .then((data) => {
        if (isSubscribed) {
          setAyahs(data);
          setLoadingVerses(false);
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          console.error(err);
          setLoadingVerses(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [currentSurahId, activeRiwayahId]);

  // Handle switching Riwayah
  const handleSelectRiwayah = (newRiwayahId: RiwayahId) => {
    setActiveRiwayahId(newRiwayahId);
    try {
      localStorage.setItem('quran_riwayah', newRiwayahId);
    } catch {}

    // Recommend and switch to the pre-eminent reciter for that narration
    const defaultRec = getDefaultReciterForRiwayah(newRiwayahId);
    setReciter(defaultRec);
  };

  // Handle selecting a Surah
  const handleSelectSurah = useCallback((surahId: number, startAyah: number = 1) => {
    setCurrentSurahId(surahId);
    setCurrentAyahNumber(startAyah);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const currentMeta = ALL_SURAHS.find((s) => s.id === surahId);
    if (currentMeta) {
      setLastRead({
        surahId,
        ayahNumber: startAyah,
        surahNameArabic: currentMeta.nameArabic,
        surahNameEnglish: currentMeta.nameEnglish,
        timestamp: Date.now(),
      });
    }
  }, []);

  // Quick play surah from list
  const handleQuickPlaySurah = useCallback((surahId: number) => {
    handleSelectSurah(surahId, 1);
    setIsPlaying(true);
  }, [handleSelectSurah]);

  // Play a specific ayah
  const handlePlayAyah = (ayahNumber: number) => {
    setCurrentAyahNumber(ayahNumber);
    setIsPlaying(true);

    if (currentSurahId) {
      const currentMeta = ALL_SURAHS.find((s) => s.id === currentSurahId);
      if (currentMeta) {
        setLastRead({
          surahId: currentSurahId,
          ayahNumber,
          surahNameArabic: currentMeta.nameArabic,
          surahNameEnglish: currentMeta.nameEnglish,
          timestamp: Date.now(),
        });
      }
    }
  };

  // Toggle play/pause
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Ayah advance
  const handleNextAyah = () => {
    if (currentSurahId === null) return;
    const currentMeta = ALL_SURAHS.find((s) => s.id === currentSurahId);
    if (!currentMeta) return;

    if (currentAyahNumber < currentMeta.ayahCount) {
      setCurrentAyahNumber((prev) => prev + 1);
      setIsPlaying(true);
    } else if (currentSurahId < 114) {
      // Advance to next Surah
      handleSelectSurah(currentSurahId + 1, 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevAyah = () => {
    if (currentAyahNumber > 1) {
      setCurrentAyahNumber((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleNextSurah = () => {
    if (currentSurahId && currentSurahId < 114) {
      handleSelectSurah(currentSurahId + 1, 1);
      setIsPlaying(true);
    }
  };

  const handlePrevSurah = () => {
    if (currentSurahId && currentSurahId > 1) {
      handleSelectSurah(currentSurahId - 1, 1);
      setIsPlaying(true);
    }
  };

  // Open Tafsir for Ayah
  const handleOpenTafsir = (ayah: Ayah) => {
    setTafsirAyah(ayah);
    setIsTafsirOpen(true);
  };

  // Navigate to adjacent Ayah in Tafsir modal
  const handleNavigateTafsirAyah = (ayahNumber: number) => {
    const targetAyah = ayahs.find((a) => a.numberInSurah === ayahNumber);
    if (targetAyah) {
      setTafsirAyah(targetAyah);
      setCurrentAyahNumber(ayahNumber);
    }
  };

  // Bookmarks
  const isBookmarked = (ayahNumber: number): boolean => {
    if (!currentSurahId) return false;
    return bookmarks.some(
      (b) => b.surahId === currentSurahId && b.ayahNumber === ayahNumber
    );
  };

  const handleToggleBookmark = (ayah: Ayah) => {
    if (!currentSurahId) return;
    const meta = ALL_SURAHS.find((s) => s.id === currentSurahId)!;

    if (isBookmarked(ayah.numberInSurah)) {
      setBookmarks((prev) =>
        prev.filter(
          (b) =>
            !(b.surahId === currentSurahId && b.ayahNumber === ayah.numberInSurah)
        )
      );
    } else {
      const newBookmark: Bookmark = {
        id: `${currentSurahId}_${ayah.numberInSurah}_${Date.now()}`,
        surahId: currentSurahId,
        ayahNumber: ayah.numberInSurah,
        surahNameArabic: meta.nameArabic,
        surahNameEnglish: meta.nameEnglish,
        ayahText: ayah.text,
        timestamp: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    }
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const currentMeta = currentSurahId
    ? ALL_SURAHS.find((s) => s.id === currentSurahId)
    : null;

  const activeRiwayah = RIWAYAT.find((r) => r.id === activeRiwayahId) || RIWAYAT[0];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF8F5] text-stone-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentSurahId={currentSurahId}
        onBackToSurahList={() => {
          setCurrentSurahId(null);
          setIsPlaying(false);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRiwayahModal={() => setIsRiwayahModalOpen(true)}
        onOpenTajweedLegend={() => setIsTajweedLegendOpen(true)}
        activeRiwayahId={activeRiwayahId}
        activeRiwayahNameArabic={activeRiwayah.nameArabic}
        activeRiwayahNameEnglish={activeRiwayah.nameEnglish}
        surahNameArabic={currentMeta?.nameArabic}
        surahNameEnglish={currentMeta?.nameEnglish}
        uiLang={uiLang}
        onToggleUiLang={() => setUiLang((l) => (l === 'ar' ? 'en' : 'ar'))}
        fontSize={fontSize}
        quranFont={quranFont}
        viewMode={viewMode}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentSurahId && currentMeta ? (
          <QuranReader
            surah={currentMeta}
            ayahs={ayahs}
            loading={loadingVerses}
            activeAyahNumber={currentAyahNumber}
            isPlaying={isPlaying}
            onPlayAyah={handlePlayAyah}
            onOpenTafsir={handleOpenTafsir}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={isBookmarked}
            onNavigateSurah={(id) => handleSelectSurah(id, 1)}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
            quranFont={quranFont}
            onChangeQuranFont={setQuranFont}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            showTranslation={showTranslation}
            onToggleShowTranslation={() => setShowTranslation(!showTranslation)}
            activeRiwayahId={activeRiwayahId}
            activeRiwayahNameArabic={activeRiwayah.nameArabic}
            activeRiwayahNameEnglish={activeRiwayah.nameEnglish}
            onOpenRiwayahModal={() => setIsRiwayahModalOpen(true)}
            tajweedEnabled={tajweedEnabled}
            onToggleTajweed={() => setTajweedEnabled(!tajweedEnabled)}
            onOpenTajweedLegend={() => setIsTajweedLegendOpen(true)}
            uiLang={uiLang}
          />
        ) : (
          <SurahList
            onSelectSurah={handleSelectSurah}
            onQuickPlaySurah={handleQuickPlaySurah}
            lastRead={lastRead}
            uiLang={uiLang}
            activeRiwayahId={activeRiwayahId}
            onSelectRiwayah={handleSelectRiwayah}
            onOpenRiwayahModalWithId={() => setIsRiwayahModalOpen(true)}
            onSelectReciter={setReciter}
            onOpenTajweedLegend={() => setIsTajweedLegendOpen(true)}
          />
        )}
      </main>

      {/* Persistent Audio Recitation Bar */}
      {currentSurahId && currentMeta && (
        <AudioPlayerBar
          surahId={currentSurahId}
          surahNameArabic={currentMeta.nameArabic}
          surahNameEnglish={currentMeta.nameEnglish}
          currentAyahNumber={currentAyahNumber}
          totalAyahs={currentMeta.ayahCount}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNextAyah={handleNextAyah}
          onPrevAyah={handlePrevAyah}
          reciter={reciter}
          onSelectReciter={setReciter}
          playbackRate={playbackRate}
          onChangePlaybackRate={setPlaybackRate}
          isRepeating={isRepeating}
          onToggleRepeat={() => setIsRepeating(!isRepeating)}
          autoPlayNext={autoPlayNext}
          onToggleAutoPlayNext={() => setAutoPlayNext(!autoPlayNext)}
          onAyahFinished={handleNextAyah}
          onNextSurah={handleNextSurah}
          onPrevSurah={handlePrevSurah}
          activeRiwayahId={activeRiwayahId}
          onOpenRiwayahModal={() => setIsRiwayahModalOpen(true)}
          uiLang={uiLang}
        />
      )}

      {/* Riwayah & Tajweed Usul Modal */}
      <RiwayahModal
        isOpen={isRiwayahModalOpen}
        onClose={() => setIsRiwayahModalOpen(false)}
        activeRiwayahId={activeRiwayahId}
        onSelectRiwayah={handleSelectRiwayah}
        onSelectReciter={setReciter}
        uiLang={uiLang}
      />

      {/* Tafsir (Exegesis) Modal: Al-Tafsir Al-Muyassar & Tafsir al-Tabari */}
      {currentMeta && (
        <TafsirModal
          isOpen={isTafsirOpen}
          onClose={() => setIsTafsirOpen(false)}
          surahId={currentMeta.id}
          surahNameArabic={currentMeta.nameArabic}
          surahNameEnglish={currentMeta.nameEnglish}
          ayah={tafsirAyah}
          totalAyahs={currentMeta.ayahCount}
          onNavigateAyah={handleNavigateTafsirAyah}
          uiLang={uiLang}
        />
      )}

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={handleRemoveBookmark}
        onJumpToAyah={(sId, aNum) => handleSelectSurah(sId, aNum)}
        lastRead={lastRead}
        uiLang={uiLang}
      />

      {/* Display Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        quranFont={quranFont}
        onChangeQuranFont={setQuranFont}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        showTranslation={showTranslation}
        onToggleShowTranslation={() => setShowTranslation(!showTranslation)}
        activeRiwayahId={activeRiwayahId}
        onOpenRiwayahModal={() => setIsRiwayahModalOpen(true)}
        tajweedEnabled={tajweedEnabled}
        onToggleTajweed={() => setTajweedEnabled(!tajweedEnabled)}
        onOpenTajweedLegend={() => setIsTajweedLegendOpen(true)}
        uiLang={uiLang}
      />

      {/* Search & Jump Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSurah={(sId, aNum) => handleSelectSurah(sId, aNum || 1)}
        uiLang={uiLang}
      />

      {/* Tajweed Legend & Rules Reference Modal */}
      <TajweedLegendModal
        isOpen={isTajweedLegendOpen}
        onClose={() => setIsTajweedLegendOpen(false)}
        activeRiwayahId={activeRiwayahId}
        uiLang={uiLang}
      />
    </div>
  );
}
