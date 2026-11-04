import type { Answers, Bilingual, Concern, QuestionId } from './types';

export interface QuestionOption {
  id: string;
  text: Bilingual;
}

export interface Question {
  id: QuestionId;
  text: Bilingual;
  options: readonly QuestionOption[];
}

const CONCERN_OPTIONS: Record<Concern, QuestionOption> = {
  breakouts: { id: 'breakouts', text: { en: 'Clear up acne and blemishes', ar: 'تصفية حب الشباب والشوائب' } },
  dark_spots: { id: 'dark_spots', text: { en: 'Fade dark spots and uneven tone', ar: 'تفتيح البقع الداكنة وتوحيد اللون' } },
  dullness: { id: 'dullness', text: { en: 'Boost glow and fight dullness', ar: 'زيادة الإشراق ومحاربة البهتان' } },
  fine_lines: { id: 'fine_lines', text: { en: 'Soften fine lines and wrinkles', ar: 'تخفيف الخطوط الدقيقة والتجاعيد' } },
  dryness_barrier: { id: 'dryness_barrier', text: { en: 'Deep hydration and barrier repair', ar: 'ترطيب عميق وإصلاح حاجز البشرة' } },
  redness: { id: 'redness', text: { en: 'Calm redness and irritation', ar: 'تهدئة الاحمرار والتهيج' } },
  pores_texture: { id: 'pores_texture', text: { en: 'Refine pores and rough texture', ar: 'تصغير المسام وتنعيم الملمس' } },
};

const CONCERN_ORDER: readonly Concern[] = [
  'breakouts',
  'dark_spots',
  'dullness',
  'fine_lines',
  'dryness_barrier',
  'redness',
  'pores_texture',
];

const NONE_OPTION: QuestionOption = { id: 'none', text: { en: 'Nothing else right now', ar: 'لا شيء آخر حاليًا' } };

/** The 9 questions, asked in this order to every user. No branching. */
export const QUESTIONS: readonly Question[] = [
  {
    id: 'oil',
    text: { en: 'How does your skin feel by midday?', ar: 'كيف تشعر بشرتك بحلول منتصف النهار؟' },
    options: [
      { id: 'tight_flaky', text: { en: 'Tight and flaky', ar: 'مشدودة ومتقشرة' } },
      { id: 'comfortable', text: { en: 'Comfortable and balanced', ar: 'مرتاحة ومتوازنة' } },
      { id: 'tzone', text: { en: 'Shiny only in the T-zone', ar: 'لامعة فقط في منطقة T' } },
      { id: 'shiny_all', text: { en: 'Shiny all over', ar: 'لامعة في كل مكان' } },
    ],
  },
  {
    id: 'hydration',
    text: {
      en: 'How does your skin feel 30 minutes after cleansing, before applying anything?',
      ar: 'كيف تشعر بشرتك بعد 30 دقيقة من التنظيف وقبل وضع أي منتج؟',
    },
    options: [
      { id: 'tight_fast', text: { en: 'Very tight, I need product right away', ar: 'مشدودة جدًا وأحتاج منتجًا فورًا' } },
      { id: 'slightly_tight', text: { en: 'Slightly tight', ar: 'مشدودة قليلًا' } },
      { id: 'comfortable', text: { en: 'Comfortable', ar: 'مرتاحة' } },
      { id: 'never_tight', text: { en: 'Never tight, can feel greasy', ar: 'لا تشعر بالشد أبدًا وقد تكون دهنية' } },
    ],
  },
  {
    id: 'reactivity',
    text: { en: 'Does your skin sting or turn red easily?', ar: 'هل تلسع بشرتك أو تحمر بسهولة؟' },
    options: [
      { id: 'very_easily', text: { en: 'Yes, very easily', ar: 'نعم، بسهولة تامة' } },
      { id: 'new_products', text: { en: 'Only with new products', ar: 'فقط مع المنتجات الجديدة' } },
      { id: 'rarely', text: { en: 'Rarely or never', ar: 'نادرًا أو أبدًا' } },
    ],
  },
  {
    id: 'breakouts',
    text: { en: 'How often do you experience breakouts?', ar: 'كم مرة تعاني من ظهور البثور؟' },
    options: [
      { id: 'constant', text: { en: 'Constantly (active acne)', ar: 'باستمرار (حب شباب نشط)' } },
      { id: 'occasional', text: { en: 'Occasionally (for example hormonal)', ar: 'أحيانًا (مثل البثور الهرمونية)' } },
      { id: 'rarely', text: { en: 'Rarely or never', ar: 'نادرًا أو أبدًا' } },
    ],
  },
  {
    id: 'primary',
    text: { en: 'What is your #1 skin goal right now?', ar: 'ما هو هدفك الأول لبشرتك الآن؟' },
    options: CONCERN_ORDER.map((c) => CONCERN_OPTIONS[c]),
  },
  {
    id: 'secondary',
    text: { en: 'Is there a second goal?', ar: 'هل لديك هدف ثانٍ؟' },
    options: [...CONCERN_ORDER.map((c) => CONCERN_OPTIONS[c]), NONE_OPTION],
  },
  {
    id: 'sun',
    text: { en: 'How much sun exposure do you get daily?', ar: 'ما مقدار التعرض للشمس الذي تحصل عليه يوميًا؟' },
    options: [
      { id: 'high', text: { en: 'High (outdoor activities)', ar: 'عالي (أنشطة خارجية)' } },
      { id: 'moderate', text: { en: 'Moderate (commuting)', ar: 'متوسط (التنقل)' } },
      { id: 'low', text: { en: 'Low (mostly indoors)', ar: 'منخفض (معظم الوقت في الداخل)' } },
    ],
  },
  {
    id: 'experience',
    text: {
      en: 'Have you used retinol or exfoliating acids (AHA/BHA) before?',
      ar: 'هل استخدمت الريتينول أو أحماض التقشير (AHA/BHA) من قبل؟',
    },
    options: [
      { id: 'never', text: { en: 'Never', ar: 'أبدًا' } },
      { id: 'occasionally', text: { en: 'Occasionally', ar: 'أحيانًا' } },
      { id: 'regularly', text: { en: 'Regularly', ar: 'بانتظام' } },
    ],
  },
  {
    id: 'pregnancy',
    text: {
      en: 'Are you pregnant, breastfeeding, or trying to conceive?',
      ar: 'هل أنتِ حامل أو مرضعة أو تحاولين الحمل؟',
    },
    options: [
      { id: 'yes', text: { en: 'Yes', ar: 'نعم' } },
      { id: 'no', text: { en: 'No', ar: 'لا' } },
      { id: 'prefer_not', text: { en: 'Prefer not to say', ar: 'أفضل عدم الإجابة' } },
    ],
  },
];

/** Options to show for a question. The secondary goal can never repeat the primary goal. */
export const getOptions = (questionId: QuestionId, answers: Partial<Answers>): readonly QuestionOption[] => {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return [];
  if (questionId === 'secondary') return question.options.filter((o) => o.id !== answers.primary);
  return question.options;
};

/** Allow-list check used on every untrusted answer (saved data included). */
export const isValidOption = (questionId: string, optionId: unknown): boolean => {
  if (typeof optionId !== 'string') return false;
  const question = QUESTIONS.find((q) => q.id === questionId);
  return question !== undefined && question.options.some((o) => o.id === optionId);
};
