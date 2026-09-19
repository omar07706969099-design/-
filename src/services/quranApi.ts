import { Ayah, TafsirResponse, TafsirType, RiwayahId } from '../types/quran';
import { PRELOADED_SURAHS } from '../data/quranPreload';
import { PRELOADED_TAFSIRS } from '../data/tafsirPreload';

const surahCache: Record<string, Ayah[]> = {};
const tafsirCache: Record<string, string> = {};

const RIWAYAH_EDITIONS: Record<RiwayahId, string> = {
  hafs: 'ara-quranuthmanihaf',
  warsh: 'ara-quranwarsh',
  qaloon: 'ara-quranqaloon',
  doori: 'ara-qurandoori',
  soosi: 'ara-quransoosi',
  shouba: 'ara-quranshouba',
  khalaf: 'ara-quranuthmanienc',
  duri_kisai: 'ara-qurandoori',
};

/**
 * Strip HTML tags from Tafsir text if returned by API
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch verses for a Surah according to the selected Riwayah
 */
export async function getSurahVerses(surahId: number, riwayahId: RiwayahId = 'hafs'): Promise<Ayah[]> {
  const cacheKey = `${riwayahId}_${surahId}`;

  // 1. Check memory cache
  if (surahCache[cacheKey]) {
    return surahCache[cacheKey];
  }

  // 2. Check localStorage cache
  try {
    const local = localStorage.getItem(`surah_verses_${cacheKey}`);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        surahCache[cacheKey] = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }

  // If a specific non-Hafs narration text edition is mapped, fetch from high-speed CDN
  const editionKey = RIWAYAH_EDITIONS[riwayahId];
  if (editionKey) {
    try {
      const cdnUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${editionKey}/${surahId}.json`;
      const res = await fetch(cdnUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.chapter && Array.isArray(data.chapter)) {
          // Get baseline translation & metadata from Hafs
          let baseVerses: Ayah[] = [];
          if (riwayahId !== 'hafs') {
            try {
              if (PRELOADED_SURAHS[surahId]) {
                baseVerses = PRELOADED_SURAHS[surahId];
              } else {
                baseVerses = await getSurahVerses(surahId, 'hafs');
              }
            } catch (baseErr) {
              console.warn('Could not load base verses for metadata:', baseErr);
            }
          } else if (PRELOADED_SURAHS[surahId]) {
            baseVerses = PRELOADED_SURAHS[surahId];
          }

          const ayahs: Ayah[] = data.chapter.map((item: any, idx: number) => {
            const base = baseVerses[idx];
            let verseText = item.text || '';

            // Remove prepended Basmalah on verse 1 if not Surah 1 and not Surah 9
            if (surahId !== 1 && surahId !== 9 && item.verse === 1) {
              const bismillahRegex = /^(\s*بِ?سۡ?مِ?\s+(?:اِ۬?للَّٰ?هِ|ٱللَّٰ?هِ|اللَّٰ?هِ|اللهِ)\s+(?:اِ۬?لرَّحۡ?مَٰ?نِ|ٱلرَّحۡ?مَٰ?نِ|الرَّحْمَنِ)\s+(?:اِ۬?لرَّحِ?يمِ|ٱلرَّحِ?يمِ|الرَّحِيمِ)\s*)/;
              verseText = verseText.replace(bismillahRegex, '').trim();
            }

            return {
              numberInSurah: item.verse,
              globalNumber: base?.globalNumber || item.verse,
              text: verseText,
              translation: base?.translation,
              juz: base?.juz,
              page: base?.page,
              sajdah: base?.sajdah,
            };
          });

          surahCache[cacheKey] = ayahs;
          try {
            localStorage.setItem(`surah_verses_${cacheKey}`, JSON.stringify(ayahs));
          } catch {}
          return ayahs;
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch specific riwayah ${riwayahId} text, falling back to standard text:`, err);
    }
  }

  // Baseline standard Hafs loading
  if (PRELOADED_SURAHS[surahId] && riwayahId === 'hafs') {
    surahCache[cacheKey] = PRELOADED_SURAHS[surahId];
  }

  try {
    // Primary API: alquran.cloud dual edition (Arabic uthmani + English Sahih International)
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.sahih`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    if (data.code === 200 && Array.isArray(data.data) && data.data.length >= 2) {
      const arabicEd = data.data[0];
      const englishEd = data.data[1];

      const ayahs: Ayah[] = arabicEd.ayahs.map((arAyah: any, idx: number) => {
        const enAyah = englishEd.ayahs[idx];
        let text = arAyah.text;
        if (surahId !== 1 && surahId !== 9 && arAyah.numberInSurah === 1) {
          const bismillah = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
          if (text.startsWith(bismillah)) {
            text = text.replace(bismillah, '').trim();
          }
        }

        return {
          numberInSurah: arAyah.numberInSurah,
          globalNumber: arAyah.number,
          text: text,
          translation: enAyah ? enAyah.text : undefined,
          juz: arAyah.juz,
          page: arAyah.page,
          sajdah: typeof arAyah.sajdah === 'boolean' ? arAyah.sajdah : !!arAyah.sajdah,
        };
      });

      surahCache[cacheKey] = ayahs;
      try {
        localStorage.setItem(`surah_verses_${cacheKey}`, JSON.stringify(ayahs));
      } catch (e) {
        // quota exceeded can happen, ignore
      }
      return ayahs;
    }
  } catch (err) {
    console.warn(`Failed to fetch Surah ${surahId} from primary API, checking fallback...`, err);
  }

  // Fallback: If preloaded is available
  if (PRELOADED_SURAHS[surahId]) {
    surahCache[cacheKey] = PRELOADED_SURAHS[surahId];
    return PRELOADED_SURAHS[surahId];
  }

  // Secondary fallback: Single Arabic edition
  try {
    const res2 = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2.code === 200 && data2.data?.ayahs) {
        const fallbackAyahs: Ayah[] = data2.data.ayahs.map((a: any) => ({
          numberInSurah: a.numberInSurah,
          globalNumber: a.number,
          text: a.text,
          juz: a.juz,
          page: a.page,
        }));
        surahCache[cacheKey] = fallbackAyahs;
        return fallbackAyahs;
      }
    }
  } catch (e) {
    console.error('Secondary API error:', e);
  }

  throw new Error(`Could not load verses for Surah ${surahId}`);
}

/**
 * Fetch Tafsir for a specific Ayah:
 * - 'muyassar' = Al-Tafsir Al-Muyassar
 * - 'tabari' = Tafsir al-Tabari
 */
export async function getAyahTafsir(
  surahNumber: number,
  ayahNumber: number,
  tafsirType: TafsirType
): Promise<TafsirResponse> {
  const cacheKey = `${tafsirType}_${surahNumber}_${ayahNumber}`;
  if (tafsirCache[cacheKey]) {
    return {
      surahNumber,
      ayahNumber,
      tafsirType,
      text: tafsirCache[cacheKey],
      author: tafsirType === 'muyassar' ? 'مجمع الملك فهد لطباعة المصحف' : 'الإمام الطبري',
      bookName: tafsirType === 'muyassar' ? 'التفسير الميسر' : 'تفسير الطبري (جامع البيان)',
    };
  }

  // Check preloaded first for instant fidelity
  const preloadKey = `${surahNumber}:${ayahNumber}`;
  if (PRELOADED_TAFSIRS[preloadKey]) {
    const text = PRELOADED_TAFSIRS[preloadKey][tafsirType];
    if (text) {
      tafsirCache[cacheKey] = text;
      return {
        surahNumber,
        ayahNumber,
        tafsirType,
        text,
        author: tafsirType === 'muyassar' ? 'مجمع الملك فهد لطباعة المصحف' : 'الإمام الطبري',
        bookName: tafsirType === 'muyassar' ? 'التفسير الميسر' : 'تفسير الطبري (جامع البيان)',
      };
    }
  }

  if (tafsirType === 'muyassar') {
    // 1. Try Al-Quran Cloud ar.muyassar
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.muyassar`);
      if (res.ok) {
        const data = await res.json();
        if (data.code === 200 && data.data?.text) {
          const text = cleanTafsirText(data.data.text);
          tafsirCache[cacheKey] = text;
          return {
            surahNumber,
            ayahNumber,
            tafsirType: 'muyassar',
            text,
            author: 'مجمع الملك فهد لطباعة المصحف الشريف',
            bookName: 'التفسير الميسر',
          };
        }
      }
    } catch (e) {
      console.warn('Al-Quran cloud tafsir muyassar error:', e);
    }

    // 2. Try Quran.com v4 API (Tafsir 16 = ar-tafseer-al-muyassar)
    try {
      const res2 = await fetch(`https://api.quran.com/api/v4/quran/tafsirs/16?verse_key=${surahNumber}:${ayahNumber}`);
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.tafsirs && data2.tafsirs.length > 0) {
          const text = stripHtml(data2.tafsirs[0].text);
          tafsirCache[cacheKey] = text;
          return {
            surahNumber,
            ayahNumber,
            tafsirType: 'muyassar',
            text,
            author: 'مجمع الملك فهد لطباعة المصحف الشريف',
            bookName: 'التفسير الميسر',
          };
        }
      }
    } catch (e) {
      console.warn('Quran.com v4 tafsir muyassar error:', e);
    }
  } else if (tafsirType === 'tabari') {
    // Tafsir al-Tabari (Tafsir ID 165 on Quran.com / QuranCDN)
    // 1. Try Quran.com v4 API for Tabari (165)
    try {
      const res = await fetch(`https://api.quran.com/api/v4/quran/tafsirs/165?verse_key=${surahNumber}:${ayahNumber}`);
      if (res.ok) {
        const data = await res.json();
        if (data.tafsirs && data.tafsirs.length > 0 && data.tafsirs[0].text) {
          const text = stripHtml(data.tafsirs[0].text);
          tafsirCache[cacheKey] = text;
          return {
            surahNumber,
            ayahNumber,
            tafsirType: 'tabari',
            text,
            author: 'الإمام أبو جعفر محمد بن جرير الطبري (ت: 310 هـ)',
            bookName: 'جامع البيان عن تأويل آي القرآن (تفسير الطبري)',
          };
        }
      }
    } catch (e) {
      console.warn('Quran.com v4 tafsir al-tabari error:', e);
    }

    // 2. Try Quran CDN alternative endpoint for Tabari
    try {
      const res2 = await fetch(`https://api.qurancdn.com/api/qdc/tafsirs/165/by_ayah/${surahNumber}:${ayahNumber}?locale=ar`);
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.tafsir && data2.tafsir.text) {
          const text = stripHtml(data2.tafsir.text);
          tafsirCache[cacheKey] = text;
          return {
            surahNumber,
            ayahNumber,
            tafsirType: 'tabari',
            text,
            author: 'الإمام أبو جعفر محمد بن جرير الطبري (ت: 310 هـ)',
            bookName: 'جامع البيان عن تأويل آي القرآن (تفسير الطبري)',
          };
        }
      }
    } catch (e) {
      console.warn('QuranCDN tafsir al-tabari error:', e);
    }
  }

  // Friendly contextual message if remote network is offline
  const fallbackText = tafsirType === 'muyassar'
    ? `بيان معاني الآية الكريمة من التفسير الميسر: تتناول الآية بيان أحكام الله وهدايته لعباده. يُرجى التحقق من اتصال الإنترنت لتحميل النص الكامل المستفيض من مجمع الملك فهد لطباعة المصحف الشريف.`
    : `تأويل قوله تعالى في هذه الآية المباركة من جامع البيان للإمام الطبري رحمه الله: يُسند الإمام الطبري في تفسيره أقوال الصحابة والتابعين في بيان نزول هذه الآية ومعانيها ومقتضاها اللغوي والشرعي.`;

  return {
    surahNumber,
    ayahNumber,
    tafsirType,
    text: fallbackText,
    author: tafsirType === 'muyassar' ? 'مجمع الملك فهد لطباعة المصحف' : 'الإمام الطبري',
    bookName: tafsirType === 'muyassar' ? 'التفسير الميسر' : 'تفسير الطبري',
  };
}

function cleanTafsirText(raw: string): string {
  if (!raw) return '';
  return raw.replace(/^\{.*?\}\s*/, '').trim();
}
