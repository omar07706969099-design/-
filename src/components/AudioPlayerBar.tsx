import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown,
  Check,
  BookOpen,
  Scroll,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { Reciter, RiwayahId } from '../types/quran';
import { RECITERS, getAudioUrl } from '../data/reciters';
import { RIWAYAT } from '../data/riwayat';

interface AudioPlayerBarProps {
  surahId: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  currentAyahNumber: number;
  totalAyahs: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  reciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  isRepeating: boolean;
  onToggleRepeat: () => void;
  autoPlayNext: boolean;
  onToggleAutoPlayNext: () => void;
  onAyahFinished: () => void;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
  activeRiwayahId: RiwayahId;
  onOpenRiwayahModal: () => void;
  uiLang: 'ar' | 'en';
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  surahId,
  surahNameArabic,
  surahNameEnglish,
  currentAyahNumber,
  totalAyahs,
  isPlaying,
  onTogglePlay,
  onNextAyah,
  onPrevAyah,
  reciter,
  onSelectReciter,
  playbackRate,
  onChangePlaybackRate,
  isRepeating,
  onToggleRepeat,
  autoPlayNext,
  onToggleAutoPlayNext,
  onAyahFinished,
  onNextSurah,
  onPrevSurah,
  activeRiwayahId,
  onOpenRiwayahModal,
  uiLang,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showReciterMenu, setShowReciterMenu] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [reciterFilterRiwayah, setReciterFilterRiwayah] = useState<string>('all');
  const [audioError, setAudioError] = useState<boolean>(false);

  const isSurahAudio = reciter.audioType === 'surah';
  const currentAudioSrc = getAudioUrl(reciter, surahId, currentAyahNumber);

  // Sync audio source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(false);
    setProgress(0);
    setCurrentTime(0);

    audio.src = currentAudioSrc;
    audio.playbackRate = playbackRate;
    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Playback error or interaction required:', err);
      });
    }
  }, [currentAudioSrc]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Autoplay prevented:', err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (isRepeating) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.warn);
      }
    } else if (isSurahAudio) {
      if (autoPlayNext && onNextSurah) {
        onNextSurah();
      } else {
        onTogglePlay();
      }
    } else {
      if (autoPlayNext && currentAyahNumber < totalAyahs) {
        onAyahFinished();
      } else {
        onTogglePlay();
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  };

  const handleSkipSeconds = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filtered reciters list
  const filteredReciters = reciterFilterRiwayah === 'all'
    ? RECITERS
    : RECITERS.filter((r) => r.riwayahId === reciterFilterRiwayah);

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setAudioError(true)}
      />

      {/* Audio Error Alert & Retry Banner */}
      {audioError && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-45 bg-rose-900/95 text-rose-50 px-4 py-2 rounded-2xl shadow-xl border border-rose-700 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <span>
            {uiLang === 'ar'
              ? 'تعذر تحميل ملف التلاوة حالياً. يمكنك إعادة المحاولة أو اختيار قارئ آخر.'
              : 'Could not stream audio. You can retry or switch reciters.'}
          </span>
          <button
            id="audio-retry-load-btn"
            onClick={() => {
              setAudioError(false);
              if (audioRef.current) {
                audioRef.current.load();
                audioRef.current.play().catch(console.warn);
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer"
          >
            {uiLang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-md border-t border-stone-200/90 shadow-xl">
        {/* Progress scrub bar */}
        <div 
          onClick={handleSeek}
          className="w-full h-1.5 bg-stone-200 hover:h-2.5 transition-all cursor-pointer relative group"
          title={isSurahAudio ? (uiLang === 'ar' ? 'شريط تلاوة السورة' : 'Surah Recitation Progress') : (uiLang === 'ar' ? 'شريط تلاوة الآية' : 'Ayah Recitation Progress')}
        >
          <div 
            className="h-full bg-emerald-700 group-hover:bg-emerald-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 overflow-x-hidden">
          {/* Left: Surah & Reciter / Riwayah info */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-start min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-900 to-teal-950 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs border border-emerald-800/80">
                <BookOpen className="w-4 sm:w-5 h-4 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="font-amiri font-bold text-stone-900 text-sm sm:text-base truncate">
                    سورة {surahNameArabic}
                  </span>
                  <span className="text-[11px] sm:text-xs text-emerald-800 font-semibold font-sans truncate">
                    {isSurahAudio 
                      ? (uiLang === 'ar' ? 'تلاوة السورة' : 'Full Surah')
                      : (uiLang === 'ar' ? `الآية ${currentAyahNumber}/${totalAyahs}` : `v.${currentAyahNumber}/${totalAyahs}`)}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-sans flex items-center gap-1.5 truncate">
                  <span className="font-medium text-stone-700 truncate">
                    {uiLang === 'ar' ? reciter.nameArabic : reciter.nameEnglish}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="inline-flex items-center gap-1 px-1 py-0.2 rounded-md bg-stone-100 text-emerald-900 text-[10px] sm:text-[11px] font-semibold border border-stone-200 shrink-0">
                    <Scroll className="w-2.5 h-2.5 text-emerald-700" />
                    <span>{uiLang === 'ar' ? reciter.riwayahNameArabic : reciter.riwayahNameEnglish}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Time indicator */}
            <div className="text-[10px] sm:text-[11px] font-mono text-stone-600 bg-stone-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border border-stone-200/80 shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Center: Recitation Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {isSurahAudio ? (
              <>
                {/* Skip back 10 seconds */}
                <button
                  id="audio-skip-back-10s-btn"
                  onClick={() => handleSkipSeconds(-10)}
                  className="p-2 rounded-xl text-stone-600 hover:text-emerald-900 hover:bg-stone-100 transition-colors"
                  title={uiLang === 'ar' ? 'إرجاع 10 ثوانٍ' : 'Rewind 10s'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Previous Ayah */
              <button
                id="audio-prev-ayah-btn"
                disabled={currentAyahNumber <= 1}
                onClick={onPrevAyah}
                className="p-2 rounded-xl text-stone-600 hover:text-emerald-900 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={uiLang === 'ar' ? 'الآية السابقة' : 'Previous Ayah'}
              >
                <SkipForward className={`w-5 h-5 ${uiLang === 'en' ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Play/Pause Button */}
            <button
              id="audio-play-pause-btn"
              onClick={onTogglePlay}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 border border-emerald-700/80"
              title={isPlaying ? (uiLang === 'ar' ? 'إيقاف التلاوة' : 'Pause Recitation') : (uiLang === 'ar' ? 'تشغيل التلاوة' : 'Play Recitation')}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {isSurahAudio ? (
              <>
                {/* Skip forward 10 seconds */}
                <button
                  id="audio-skip-fwd-10s-btn"
                  onClick={() => handleSkipSeconds(10)}
                  className="p-2 rounded-xl text-stone-600 hover:text-emerald-900 hover:bg-stone-100 transition-colors"
                  title={uiLang === 'ar' ? 'تقديم 10 ثوانٍ' : 'Forward 10s'}
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </>
            ) : (
              /* Next Ayah */
              <button
                id="audio-next-ayah-btn"
                disabled={currentAyahNumber >= totalAyahs}
                onClick={onNextAyah}
                className="p-2 rounded-xl text-stone-600 hover:text-emerald-900 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title={uiLang === 'ar' ? 'الآية التالية' : 'Next Ayah'}
              >
                <SkipBack className={`w-5 h-5 ${uiLang === 'en' ? 'rotate-180' : ''}`} />
              </button>
            )}

            {/* Repeat Toggle */}
            <button
              id="audio-repeat-toggle-btn"
              onClick={onToggleRepeat}
              className={`p-2 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1 ${
                isRepeating
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
              title={isSurahAudio ? (uiLang === 'ar' ? 'إعادة السورة' : 'Repeat Surah') : (uiLang === 'ar' ? 'تكرار الآية للتثبيت والحفظ' : 'Repeat Verse')}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{uiLang === 'ar' ? 'تكرار' : 'Repeat'}</span>
            </button>

            {/* Continuous Recitation Toggle */}
            <button
              id="audio-continuous-toggle-btn"
              onClick={onToggleAutoPlayNext}
              className={`px-2.5 py-1.5 rounded-xl transition-colors text-xs font-semibold ${
                autoPlayNext
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
              }`}
              title={uiLang === 'ar' ? 'تلاوة متتالية' : 'Continuous Recitation'}
            >
              {uiLang === 'ar' ? 'تلاوة متتالية' : 'Continuous'}
            </button>
          </div>

          {/* Right: Reciter & Riwayah Selector, Speed, Volume */}
          <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-end">
            {/* Reciters Dropdown Trigger */}
            <div className="relative">
              <button
                id="reciter-selector-btn"
                onClick={() => {
                  setShowReciterMenu(!showReciterMenu);
                  setShowSpeedMenu(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-emerald-900 hover:border-emerald-300 text-xs font-medium transition-all shadow-2xs"
                title={uiLang === 'ar' ? 'اختيار القارئ والرواية' : 'Select Reciter & Narration'}
              >
                <span className="truncate max-w-[110px] sm:max-w-[150px]">
                  {uiLang === 'ar' ? reciter.nameArabic : reciter.nameEnglish}
                </span>
                {showReciterMenu ? (
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>

              {/* Reciters Menu Popup with Riwayah tabs */}
              {showReciterMenu && (
                <div 
                  id="reciter-dropdown-menu"
                  className="absolute bottom-full mb-2 right-0 sm:left-auto w-[calc(100vw-1.5rem)] max-w-sm max-h-96 overflow-hidden flex flex-col bg-white rounded-2xl shadow-xl border border-stone-200 z-50 text-stone-800"
                >
                  <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-600">
                      {uiLang === 'ar' ? 'اختر القارئ والرواية' : 'Select Reciter & Narration'}
                    </span>
                    <button
                      onClick={() => {
                        setShowReciterMenu(false);
                        onOpenRiwayahModal();
                      }}
                      className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 underline underline-offset-2"
                    >
                      <Scroll className="w-3 h-3" />
                      <span>{uiLang === 'ar' ? 'دليل الروايات' : 'Riwayat Guide'}</span>
                    </button>
                  </div>

                  {/* Filter tabs by Narration */}
                  <div className="flex items-center gap-1 p-2 overflow-x-auto border-b border-stone-100 bg-stone-50/50 text-[11px] scrollbar-none">
                    <button
                      onClick={() => setReciterFilterRiwayah('all')}
                      className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${
                        reciterFilterRiwayah === 'all'
                          ? 'bg-emerald-800 text-white font-bold'
                          : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {uiLang === 'ar' ? 'الكل' : 'All'}
                    </button>
                    {RIWAYAT.map((rw) => (
                      <button
                        key={rw.id}
                        onClick={() => setReciterFilterRiwayah(rw.id)}
                        className={`px-2 py-1 rounded-lg shrink-0 font-medium transition-colors ${
                          reciterFilterRiwayah === rw.id
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {rw.nameArabic.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Reciters List */}
                  <div className="overflow-y-auto p-1.5 space-y-1 flex-1 max-h-72">
                    {filteredReciters.map((r) => {
                      const isSelected = r.id === reciter.id;
                      return (
                        <button
                          key={r.id}
                          id={`select-reciter-${r.id}`}
                          onClick={() => {
                            onSelectReciter(r);
                            setShowReciterMenu(false);
                          }}
                          className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="font-semibold text-sm">
                                {uiLang === 'ar' ? r.nameArabic : r.nameEnglish}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center justify-end gap-1.5 mt-0.5">
                              <span className="text-emerald-800 font-medium">
                                {uiLang === 'ar' ? r.riwayahNameArabic : r.riwayahNameEnglish}
                              </span>
                              <span>•</span>
                              <span>
                                {r.audioType === 'ayah' ? (uiLang === 'ar' ? 'آية بآية' : 'Verse') : (uiLang === 'ar' ? 'سورة كاملة' : 'Full Surah')}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Playback Speed Trigger */}
            <div className="relative">
              <button
                id="speed-selector-btn"
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowReciterMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-emerald-900 text-xs font-semibold transition-all shadow-2xs"
                title={uiLang === 'ar' ? 'سرعة التلاوة' : 'Playback Speed'}
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div 
                  id="speed-dropdown-menu"
                  className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-lg border border-stone-200 p-1 z-50 flex flex-col gap-0.5"
                >
                  {[0.75, 1.0, 1.25].map((rate) => (
                    <button
                      key={rate}
                      id={`speed-rate-${rate}`}
                      onClick={() => {
                        onChangePlaybackRate(rate);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium text-center ${
                        playbackRate === rate
                          ? 'bg-emerald-100 text-emerald-900 font-bold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                id="audio-mute-toggle-btn"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-900 transition-colors"
                title={isMuted ? (uiLang === 'ar' ? 'تشغيل الصوت' : 'Unmute') : (uiLang === 'ar' ? 'كتم الصوت' : 'Mute')}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                id="audio-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-14 sm:w-16 h-1.5 accent-emerald-700 cursor-pointer"
                title={uiLang === 'ar' ? 'مستوى الصوت' : 'Volume'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
