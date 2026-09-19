import React from 'react';
import { RiwayahId } from '../types/quran';

export type TajweedRuleType =
  | 'madd_lazim'       // 6 counts - Compulsory (Dark Red)
  | 'madd_muttasil'    // 4-5 or 6 counts - Connected (Crimson)
  | 'madd_munfasil'    // 2-4-5 or 6 counts - Detached (Orange/Coral)
  | 'madd_badal'       // 2-4-6 in Warsh (Coral/Amber)
  | 'ghunnah'          // 2 counts - Noon/Meem Mushaddadah (Emerald Green)
  | 'ikhfa'            // Nun Sakinah/Tanwin before 15 letters (Emerald Green)
  | 'idgham_ghunnah'   // Nun Sakinah/Tanwin into Y-N-M-W (Forest Green)
  | 'idgham_no_ghunnah'// Nun Sakinah/Tanwin into L-R (Slate Gray)
  | 'iqlab'            // Nun Sakinah/Tanwin before Ba (Amber/Yellow)
  | 'qalqalah'         // Q-T-B-J-D sakin (Sky Blue / Cyan)
  | 'silent'           // Unvoiced letters / Alif Wasl / Solar Lam (Muted Gray)
  | 'naql_warsh'       // Vowel transfer in Warsh (Indigo/Violet)
  | 'taghleedh_lam'    // Emphatic Lam in Warsh (Deep Navy Blue)
  | 'tarqeeq_ra'       // Soft Ra in Warsh (Teal)
  | 'idgham_kabir'     // Susi assimilation of two moving letters (Teal Green)
  | 'sakt_khalaf'      // Gentle pause in Khalaf (Gold / Highlight)
  | 'normal';

export interface TajweedSegment {
  text: string;
  rule: TajweedRuleType;
  labelArabic: string;
  labelEnglish: string;
  colorClass: string;
  bgClass?: string;
}

// Color palette matching King Fahd Complex & Dar Al-Ma'rifah Tajweed standards
export const TAJWEED_COLORS: Record<TajweedRuleType, { color: string; labelAr: string; labelEn: string; descAr: string; descEn: string }> = {
  madd_lazim: {
    color: 'text-red-700 font-bold',
    labelAr: 'المد اللازم (6 حركات)',
    labelEn: 'Compulsory Madd (6 counts)',
    descAr: 'يمد مداً مشبعاً 6 حركات وجوباً لاتصال المد بالسكون الأصلي أو الشدة في نفس الكلمة.',
    descEn: 'Prolonged for 6 counts due to adjacent permanent sukun or shaddah.',
  },
  madd_muttasil: {
    color: 'text-rose-600 font-bold',
    labelAr: 'المد المتصل (4-5 حركات / 6 لورش وحمزة)',
    labelEn: 'Connected Madd (4-5 or 6 counts)',
    descAr: 'اجتماع حرف المد والهمز في كلمة واحدة.',
    descEn: 'Madd letter followed by hamzah within the same word.',
  },
  madd_munfasil: {
    color: 'text-orange-600 font-medium',
    labelAr: 'المد المنفصل والصلة الكبرى',
    labelEn: 'Detached Madd (2, 4-5 counts)',
    descAr: 'حرف المد في آخر الكلمة والهمز في أول الكلمة التالية.',
    descEn: 'Madd letter at the end of word and hamzah at the beginning of the next.',
  },
  madd_badal: {
    color: 'text-amber-700 font-medium',
    labelAr: 'مد البدل (في ورش 2 أو 4 أو 6 حركات)',
    labelEn: 'Badal Madd (Warsh 2, 4, 6 counts)',
    descAr: 'تقدم الهمز على حرف المد كـ (ءامنوا، أوتوا، إيماناً).',
    descEn: 'Preceding hamzah before madd letter.',
  },
  ghunnah: {
    color: 'text-emerald-700 font-bold',
    labelAr: 'الغنة المشددة (حركتان)',
    labelEn: 'Ghunnah (2 counts - Nun/Meem Mushaddadah)',
    descAr: 'صوت رخيم يخرج من الخيشوم في النون والميم المشددتين.',
    descEn: 'Nasalization for 2 counts in doubled Noon and Meem.',
  },
  ikhfa: {
    color: 'text-emerald-600 font-medium',
    labelAr: 'الإخفاء الحقيقي والشفوي',
    labelEn: 'Ikhfa (Concealment with Ghunnah)',
    descAr: 'النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام مع بقاء الغنة عند حروف الإخفاء الـ15.',
    descEn: 'Pronouncing noon sakin/tanwin between clear and merged state with ghunnah.',
  },
  idgham_ghunnah: {
    color: 'text-teal-700 font-medium',
    labelAr: 'الإدغام بغنة (ينمو)',
    labelEn: 'Idgham with Ghunnah',
    descAr: 'إدخال النون الساكنة أو التنوين في أحرف (ي، ن، م، و) مع الغنة.',
    descEn: 'Merging noon sakin/tanwin into Y, N, M, W with nasalization.',
  },
  idgham_no_ghunnah: {
    color: 'text-stone-400 font-normal',
    labelAr: 'إدغام بغير غنة (ر، ل)',
    labelEn: 'Idgham without Ghunnah',
    descAr: 'إدغام كامل للنون والتنوين في اللام والراء دون غنة.',
    descEn: 'Complete merging into Lam and Ra without nasalization.',
  },
  iqlab: {
    color: 'text-amber-600 font-bold',
    labelAr: 'الإقلاب (قلب النون ميماً عند الباء)',
    labelEn: 'Iqlab (Conversion to Meem)',
    descAr: 'قلب النون الساكنة أو التنوين ميماً مخفاة بغنة عند ملاقاة الباء.',
    descEn: 'Converting noon sakin/tanwin to meem before Ba with ghunnah.',
  },
  qalqalah: {
    color: 'text-sky-700 font-bold',
    labelAr: 'القلقلة (قطب جد عند السكون)',
    labelEn: 'Qalqalah (Echoing / Bouncing)',
    descAr: 'اضطراب مخرج الحرف عند النطق به ساكناً حتى يُسمع له نبرة قوية.',
    descEn: 'Vibration/echoing on Q, T, B, J, D when sakin.',
  },
  silent: {
    color: 'text-stone-400 opacity-80',
    labelAr: 'حرف لا يُلفظ (همزة وصل / ألف تفريق / لام شمسية)',
    labelEn: 'Unvoiced / Silent Letter',
    descAr: 'حروف تُكتب في الرسم العثماني ولا تُنطق وصلاً.',
    descEn: 'Written in Uthmani orthography but silent during continuous recitation.',
  },
  naql_warsh: {
    color: 'text-indigo-700 font-bold',
    labelAr: 'النقل (خاص برواية ورش)',
    labelEn: 'Naql (Vowel transfer in Warsh)',
    descAr: 'نقل حركة الهمزة إلى الساكن الصحيح قبلها مع إسقاط الهمزة كـ (قَدَ اَفْلَحَ، مَنَ اٰمَنَ).',
    descEn: 'Transferring hamzah vowel to preceding consonant and dropping hamzah.',
  },
  taghleedh_lam: {
    color: 'text-blue-900 font-bold',
    labelAr: 'تغليظ اللام (خاص بورش)',
    labelEn: 'Emphatic Lam (Warsh)',
    descAr: 'تغليظ اللام المفتوحة إذا سبقت بـ (ص، ط، ظ) مفتوحة أو ساكنة (الصَّلَوٰةَ، طَلَّقَ).',
    descEn: 'Heavy emphatic Lam after open/sakin Sad, Ta, or Dha.',
  },
  tarqeeq_ra: {
    color: 'text-cyan-700 font-medium',
    labelAr: 'ترقيق الراء (خاص بورش)',
    labelEn: 'Soft Ra (Warsh Tarqeeq)',
    descAr: 'ترقيق الراء المفتوحة والمضمومة إذا سبقتها كسرة لازمة أو ياء ساكنة.',
    descEn: 'Soft pronunciation of Ra preceded by permanent kasra or yaa.',
  },
  idgham_kabir: {
    color: 'text-teal-800 font-bold',
    labelAr: 'الإدغام الكبير (خاص بالسوسي)',
    labelEn: 'Al-Idgham Al-Kabir (Al-Susi)',
    descAr: 'إدغام الحرفين المتحركين المتماثلين أو المتقاربين وصلاً.',
    descEn: 'Merging two adjacent moving identical or proximate letters.',
  },
  sakt_khalaf: {
    color: 'text-purple-700 font-bold',
    labelAr: 'السكت اللطيف (خاص بخلف عن حمزة)',
    labelEn: 'Sakt (Gentle Pause in Khalaf)',
    descAr: 'قطع الصوت زمناً يسيراً من غير تنفس مع قصد استئناف القراءة.',
    descEn: 'Brief vocal pause without taking breath before hamzah.',
  },
  normal: {
    color: 'text-stone-900',
    labelAr: 'أصل الحرف',
    labelEn: 'Standard Letter',
    descAr: 'حرف مستوفٍ للحركات العادية دون حكم تجويدي استثنائي.',
    descEn: 'Standard vocalized letter without special tajweed rule.',
  },
};

const IKHFA_LETTERS = new Set(['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ']);
const IDGHAM_GHUNNAH_LETTERS = new Set(['ي', 'ن', 'م', 'و']);
const IDGHAM_NO_GHUNNAH_LETTERS = new Set(['ل', 'ر']);
const QALQALAH_LETTERS = new Set(['ق', 'ط', 'ب', 'ج', 'د']);
const SOLAR_LETTERS = new Set(['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن']);

/**
 * Remove tashkeel/diacritics from a single character for base matching
 */
function cleanChar(c: string): string {
  return c.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}

/**
 * High-accuracy tokenizer that parses Quranic Ayah text into Tajweed segments
 * according to the active Riwayah (Narration).
 */
export function parseTajweedAyah(text: string, riwayahId: RiwayahId = 'hafs'): TajweedSegment[] {
  if (!text) return [];

  const segments: TajweedSegment[] = [];
  const words = text.split(/(\s+)/);

  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    if (/^\s+$/.test(word)) {
      segments.push({
        text: word,
        rule: 'normal',
        labelArabic: '',
        labelEnglish: '',
        colorClass: 'text-stone-900',
      });
      continue;
    }

    const nextWord = w + 2 < words.length ? words[w + 2] : '';
    const wordSegments = parseTajweedWord(word, nextWord, riwayahId);
    segments.push(...wordSegments);
  }

  return segments;
}

/**
 * Parses an individual Quranic word, checking Riwayah-specific rules and intra-word Tajweed.
 */
function parseTajweedWord(word: string, nextWord: string, riwayah: RiwayahId): TajweedSegment[] {
  const result: TajweedSegment[] = [];
  let i = 0;
  const len = word.length;

  // Riwayah Specific checks on the whole word:
  // 1. Susi Idgham Kabir check (e.g. الرَّحِيمِّالِكِ or adjacent vowels)
  if (riwayah === 'soosi' && (word.includes('ِّ') || word.includes('َّ'))) {
    if (word.startsWith('ٱلرَّحِيمّ') || word.includes('خَلَقَّ') || word.includes('جَعَلَّ')) {
      return [{
        text: word,
        rule: 'idgham_kabir',
        labelArabic: TAJWEED_COLORS.idgham_kabir.labelAr,
        labelEnglish: TAJWEED_COLORS.idgham_kabir.labelEn,
        colorClass: TAJWEED_COLORS.idgham_kabir.color,
      }];
    }
  }

  // 2. Warsh Naql Check (e.g. {قَدَ اَفْلَحَ}، {مَنَ اٰمَنَ}، {قُلَ اَعُوذُ}، {الَارْضِ})
  if (riwayah === 'warsh') {
    if (word.startsWith('الَارْ') || word.startsWith('الِانْ') || word.includes('َ اَفْ') || word.includes('َ اٰمَ')) {
      return [{
        text: word,
        rule: 'naql_warsh',
        labelArabic: TAJWEED_COLORS.naql_warsh.labelAr,
        labelEnglish: TAJWEED_COLORS.naql_warsh.labelEn,
        colorClass: TAJWEED_COLORS.naql_warsh.color,
      }];
    }
  }

  // 3. Khalaf Sakt Check (marked with small seen ۜ or pause)
  if (riwayah === 'khalaf' && word.includes('\u06DC')) {
    return [{
      text: word,
      rule: 'sakt_khalaf',
      labelArabic: TAJWEED_COLORS.sakt_khalaf.labelAr,
      labelEnglish: TAJWEED_COLORS.sakt_khalaf.labelEn,
      colorClass: TAJWEED_COLORS.sakt_khalaf.color,
    }];
  }

  while (i < len) {
    const char = word[i];
    const nextChar = i + 1 < len ? word[i + 1] : '';
    const thirdChar = i + 2 < len ? word[i + 2] : '';

    // A. Madd Checks (المدود)
    // Maddah sign: \u0653 ( ٓ ) or \u06E4 ( ۤ )
    if (char === '\u0653' || char === '\u06E4' || (nextChar && (nextChar === '\u0653' || nextChar === '\u06E4'))) {
      // Determine if within word or followed by hamzah
      const isMunfasil = i >= len - 2 && nextWord && (nextWord.startsWith('ء') || nextWord.startsWith('إ') || nextWord.startsWith('أ') || nextWord.startsWith('ا'));
      const isLazim = word.slice(i).includes('\u0651') || word.includes('ضَّآ') || word.includes('دَآ') || word.includes('طَـٰٓمَّ');

      let rule: TajweedRuleType = 'madd_muttasil';
      if (isLazim) {
        rule = 'madd_lazim';
      } else if (isMunfasil) {
        rule = (riwayah === 'warsh' || riwayah === 'khalaf') ? 'madd_muttasil' : 'madd_munfasil';
      } else {
        // Connected Madd is 6 counts in Warsh and Khalaf
        rule = 'madd_muttasil';
      }

      // Collect the madd segment (the madd letter + sign)
      let maddChunk = char;
      i++;
      while (i < len && /[\u064B-\u065F\u0670\u0653\u06E4]/.test(word[i])) {
        maddChunk += word[i];
        i++;
      }

      result.push({
        text: maddChunk,
        rule,
        labelArabic: TAJWEED_COLORS[rule].labelAr,
        labelEnglish: TAJWEED_COLORS[rule].labelEn,
        colorClass: TAJWEED_COLORS[rule].color,
      });
      continue;
    }

    // B. Warsh: Taghleedh al-Lam (تغليظ اللام في الصَّلَوٰةَ، طَلَّقَ، ظَلَمَ)
    if (riwayah === 'warsh' && (char === 'ص' || char === 'ط' || char === 'ظ') && word.includes('ل')) {
      const rest = word.slice(i);
      if (rest.includes('لَ') || rest.includes('لَٰ') || rest.includes('لَّ')) {
        result.push({
          text: word.slice(i),
          rule: 'taghleedh_lam',
          labelArabic: TAJWEED_COLORS.taghleedh_lam.labelAr,
          labelEnglish: TAJWEED_COLORS.taghleedh_lam.labelEn,
          colorClass: TAJWEED_COLORS.taghleedh_lam.color,
        });
        break;
      }
    }

    // C. Warsh: Tarqeeq ar-Ra (ترقيق الراء المفتوحة/المضمومة بعد كسرة أو ياء)
    if (riwayah === 'warsh' && char === 'ر') {
      const prev = i > 0 ? word[i - 1] : '';
      const prevPrev = i > 1 ? word[i - 2] : '';
      if (prev === '\u0650' || prev === 'ي' || prevPrev === '\u0650' || word.includes('ِ' + char)) {
        let raChunk = char;
        i++;
        while (i < len && /[\u064B-\u065F\u0670]/.test(word[i])) {
          raChunk += word[i];
          i++;
        }
        result.push({
          text: raChunk,
          rule: 'tarqeeq_ra',
          labelArabic: TAJWEED_COLORS.tarqeeq_ra.labelAr,
          labelEnglish: TAJWEED_COLORS.tarqeeq_ra.labelEn,
          colorClass: TAJWEED_COLORS.tarqeeq_ra.color,
        });
        continue;
      }
    }

    // D. Ghunnah in doubled Nun / Meem (نّ / مّ)
    if ((char === 'ن' || char === 'م') && (nextChar === '\u0651' || thirdChar === '\u0651')) {
      let ghunnahChunk = char;
      i++;
      while (i < len && (word[i] === '\u0651' || /[\u064B-\u0650\u0670]/.test(word[i]))) {
        ghunnahChunk += word[i];
        i++;
      }
      result.push({
        text: ghunnahChunk,
        rule: 'ghunnah',
        labelArabic: TAJWEED_COLORS.ghunnah.labelAr,
        labelEnglish: TAJWEED_COLORS.ghunnah.labelEn,
        colorClass: TAJWEED_COLORS.ghunnah.color,
      });
      continue;
    }

    // E. Iqlab: Small Meem \u06E2 ( ۢ ) or Nun before Ba
    if (char === '\u06E2' || (char === 'ن' && (nextChar === '\u06E2' || thirdChar === '\u06E2' || (word.includes('ۢ') && word.includes('ب'))))) {
      let iqlabChunk = char;
      i++;
      while (i < len && (word[i] === '\u06E2' || /[\u064B-\u065F]/.test(word[i]))) {
        iqlabChunk += word[i];
        i++;
      }
      result.push({
        text: iqlabChunk,
        rule: 'iqlab',
        labelArabic: TAJWEED_COLORS.iqlab.labelAr,
        labelEnglish: TAJWEED_COLORS.iqlab.labelEn,
        colorClass: TAJWEED_COLORS.iqlab.color,
      });
      continue;
    }

    // F. Qalqalah: Q, T, B, J, D when Sakin (سكون ْ \u0652 or jazm \u06E1)
    if (QALQALAH_LETTERS.has(char)) {
      const hasSukun = nextChar === '\u0652' || nextChar === '\u06E1';
      const isEndWord = i === len - 1 || (i === len - 2 && /[\u064B-\u0652]/.test(nextChar));
      if (hasSukun || isEndWord) {
        let qalqalahChunk = char;
        i++;
        if (i < len && (word[i] === '\u0652' || word[i] === '\u06E1')) {
          qalqalahChunk += word[i];
          i++;
        }
        result.push({
          text: qalqalahChunk,
          rule: 'qalqalah',
          labelArabic: TAJWEED_COLORS.qalqalah.labelAr,
          labelEnglish: TAJWEED_COLORS.qalqalah.labelEn,
          colorClass: TAJWEED_COLORS.qalqalah.color,
        });
        continue;
      }
    }

    // G. Nun Sakinah & Tanwin followed by Ikhfa or Idgham
    // Check Tanwin at word end: Fathatan \u064B, Dammatan \u064C, Kasratan \u064D
    if (char === '\u064B' || char === '\u064C' || char === '\u064D') {
      const nextWordClean = cleanChar(nextWord.trim());
      const firstLetterNext = nextWordClean.charAt(0);

      if (firstLetterNext && IKHFA_LETTERS.has(firstLetterNext)) {
        result.push({
          text: char,
          rule: 'ikhfa',
          labelArabic: TAJWEED_COLORS.ikhfa.labelAr,
          labelEnglish: TAJWEED_COLORS.ikhfa.labelEn,
          colorClass: TAJWEED_COLORS.ikhfa.color,
        });
        i++;
        continue;
      } else if (firstLetterNext && IDGHAM_GHUNNAH_LETTERS.has(firstLetterNext)) {
        // Khalaf exception on Yaa and Waw
        if (riwayah === 'khalaf' && (firstLetterNext === 'ي' || firstLetterNext === 'و')) {
          result.push({
            text: char,
            rule: 'idgham_no_ghunnah',
            labelArabic: TAJWEED_COLORS.idgham_no_ghunnah.labelAr,
            labelEnglish: TAJWEED_COLORS.idgham_no_ghunnah.labelEn,
            colorClass: TAJWEED_COLORS.idgham_no_ghunnah.color,
          });
        } else {
          result.push({
            text: char,
            rule: 'idgham_ghunnah',
            labelArabic: TAJWEED_COLORS.idgham_ghunnah.labelAr,
            labelEnglish: TAJWEED_COLORS.idgham_ghunnah.labelEn,
            colorClass: TAJWEED_COLORS.idgham_ghunnah.color,
          });
        }
        i++;
        continue;
      } else if (firstLetterNext && IDGHAM_NO_GHUNNAH_LETTERS.has(firstLetterNext)) {
        result.push({
          text: char,
          rule: 'idgham_no_ghunnah',
          labelArabic: TAJWEED_COLORS.idgham_no_ghunnah.labelAr,
          labelEnglish: TAJWEED_COLORS.idgham_no_ghunnah.labelEn,
          colorClass: TAJWEED_COLORS.idgham_no_ghunnah.color,
        });
        i++;
        continue;
      }
    }

    // Nun Sakinah within word or at end
    if (char === 'ن') {
      const isSakin = nextChar === '\u0652' || nextChar === '\u06E1' || (!/[\u064E\u064F\u0650\u0651]/.test(nextChar) && i === len - 1);
      if (isSakin) {
        let followingLetter = '';
        // Look ahead in word or next word
        if (i + 1 < len && !/[\u0652\u06E1]/.test(nextChar)) {
          followingLetter = cleanChar(nextChar);
        } else if (i + 2 < len) {
          followingLetter = cleanChar(word[i + 2]);
        } else if (nextWord) {
          followingLetter = cleanChar(nextWord.trim()).charAt(0);
        }

        if (followingLetter && IKHFA_LETTERS.has(followingLetter)) {
          let nunChunk = char;
          i++;
          if (i < len && (word[i] === '\u0652' || word[i] === '\u06E1')) {
            nunChunk += word[i];
            i++;
          }
          result.push({
            text: nunChunk,
            rule: 'ikhfa',
            labelArabic: TAJWEED_COLORS.ikhfa.labelAr,
            labelEnglish: TAJWEED_COLORS.ikhfa.labelEn,
            colorClass: TAJWEED_COLORS.ikhfa.color,
          });
          continue;
        } else if (followingLetter && IDGHAM_GHUNNAH_LETTERS.has(followingLetter)) {
          let nunChunk = char;
          i++;
          if (i < len && (word[i] === '\u0652' || word[i] === '\u06E1')) {
            nunChunk += word[i];
            i++;
          }
          const rule: TajweedRuleType = (riwayah === 'khalaf' && (followingLetter === 'ي' || followingLetter === 'و')) ? 'idgham_no_ghunnah' : 'idgham_ghunnah';
          result.push({
            text: nunChunk,
            rule,
            labelArabic: TAJWEED_COLORS[rule].labelAr,
            labelEnglish: TAJWEED_COLORS[rule].labelEn,
            colorClass: TAJWEED_COLORS[rule].color,
          });
          continue;
        }
      }
    }

    // H. Silent Letters (همزة الوصل ٱ، اللام الشمسية، ألف التفريق اْ)
    if (char === '\u0671') { // Alif Wasl
      result.push({
        text: char,
        rule: 'silent',
        labelArabic: TAJWEED_COLORS.silent.labelAr,
        labelEnglish: TAJWEED_COLORS.silent.labelEn,
        colorClass: TAJWEED_COLORS.silent.color,
      });
      i++;
      continue;
    }

    // Lam Shamsiyyah: (ال + solar letter with shaddah)
    if (char === 'ل' && (i === 1 || i === 0) && (word.startsWith('ٱل') || word.startsWith('ال'))) {
      const afterLam = word.slice(i + 1);
      const cleanAfter = cleanChar(afterLam);
      if (cleanAfter.length > 0 && SOLAR_LETTERS.has(cleanAfter[0]) && afterLam.includes('\u0651')) {
        result.push({
          text: char,
          rule: 'silent',
          labelArabic: 'اللام الشمسية المدغمة (لا تُلفظ)',
          labelEnglish: 'Silent Solar Lam',
          colorClass: TAJWEED_COLORS.silent.color,
        });
        i++;
        continue;
      }
    }

    // Silent plural Alif at end of word: قالواْ
    if (char === 'ا' && (nextChar === '\u06DF' || nextChar === '\u0652') && i >= len - 2) {
      result.push({
        text: char + (nextChar || ''),
        rule: 'silent',
        labelArabic: 'ألف التفريق (لا تُلفظ)',
        labelEnglish: 'Silent Plural Alif',
        colorClass: TAJWEED_COLORS.silent.color,
      });
      i += 2;
      continue;
    }

    // Standard vocalized letter
    let normalChunk = char;
    i++;
    while (i < len && /[\u064B-\u065F\u0670]/.test(word[i]) && word[i] !== '\u0653' && word[i] !== '\u06E4' && word[i] !== '\u06E2') {
      normalChunk += word[i];
      i++;
    }

    result.push({
      text: normalChunk,
      rule: 'normal',
      labelArabic: '',
      labelEnglish: '',
      colorClass: TAJWEED_COLORS.normal.color,
    });
  }

  return result;
}

interface TajweedAyahRendererProps {
  text: string;
  riwayahId: RiwayahId;
  enabled?: boolean;
}

/**
 * Visual Tajweed React Component that renders Quranic text color-coded
 * according to the active Riwayah with accessible tooltips.
 */
export const TajweedAyahRenderer: React.FC<TajweedAyahRendererProps> = ({
  text,
  riwayahId,
  enabled = true,
}) => {
  if (!enabled) {
    return <span>{text}</span>;
  }

  const segments = parseTajweedAyah(text, riwayahId);

  return (
    <span className="inline-tajweed-verse">
      {segments.map((seg, idx) => {
        if (seg.rule === 'normal' || !seg.labelArabic) {
          return <span key={idx}>{seg.text}</span>;
        }

        return (
          <span
            key={idx}
            className={`${seg.colorClass} transition-colors duration-150 rounded-xs select-text cursor-help hover:underline decoration-stone-300 decoration-dotted`}
            title={`${seg.labelArabic} - ${seg.labelEnglish}`}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
};
