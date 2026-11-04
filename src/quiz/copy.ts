import type {
  AcneLevel,
  ActiveTag,
  Bilingual,
  Concern,
  Lang,
  Level,
  NoteCode,
  PersonaKey,
  ReasonCode,
  RoutineSlot,
  SkinProfile,
  SkinType,
  SunExposure,
} from './types';

/** UI strings. Both languages must keep identical keys (a test enforces it). */
export const TRANSLATIONS = {
  en: {
    quizTitle: 'Skin Analysis',
    quizSubtitle: 'Get your personalized K-Beauty routine in 2 minutes',
    startQuiz: 'Start Analysis',
    next: 'Next',
    back: 'Back',
    calculating: 'Analyzing your skin profile...',
    calculatingSub: 'Matching your answers with safe, suitable products',
    analysisComplete: 'Analysis Complete',
    yourCuratedRoutine: 'Your Curated Routine',
    retakeQuiz: 'Retake Quiz',
    shopAll: 'Shop All Products',
    infoDisclaimer: 'Note: This analysis is for educational purposes. Always consult a dermatologist for medical concerns.',
    consultDermatologist: 'Consult a dermatologist for professional medical advice.',
    analysisConfidence: 'Analysis Confidence',
    basedOnData: 'Based on how consistent your answers are',
    confidenceHigh: 'High confidence',
    confidenceMedium: 'Medium confidence',
    confidenceLow: 'Low confidence',
    yourPersona: 'Your Skin Persona',
    recommendedStrategy: 'Recommended Strategy',
    whyItWorksTitle: 'Why this works for you',
    expectedForecast: 'Expected Forecast',
    sensitivity: 'Sensitivity',
    oilControl: 'Oil Control',
    hydration: 'Hydration',
    skinTypeRow: 'Skin type',
    acneRow: 'Breakouts',
    dehydratedYes: 'Dehydrated',
    dehydratedNo: 'Well hydrated',
    questionOf: 'Question {current} of {total}',
    resultsTitle: 'Your Skin Persona',
    confidence: 'Analysis Confidence',
    routine: 'Your Personalized Routine',
    am: 'Morning',
    pm: 'Evening',
    weeklyTitle: 'Weekly treatment',
    weeklyFrequency: '1 to 2 times per week',
    notesTitle: 'Good to know',
    noSafeMatch: 'No safe match in our catalog for this step',
    errorTitle: "We couldn't complete your analysis.",
    errorBody: 'Please retake the quiz.',
    retry: 'Retake Quiz',
    safetyNote: 'Safety Note',
    addToCart: 'Add Routine to Cart',
    resetQuiz: 'Retake Quiz',
    viewPrevious: 'View Previous Results',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    dry: 'Dry',
    oily: 'Oily',
    sensitive: 'Sensitive',
    combination: 'Combination',
    normal: 'Normal',
    step: 'Step',
    heroPick: 'Hero Pick',
    match: 'Match',
    close: 'Close',
    switchLanguage: 'Switch language',
    questionProgress: 'Quiz progress',
    yourSkinProfile: 'Your skin profile',
    oiliness: 'Oiliness',
    mainFocus: 'Main focus',
    yourStrategy: 'Your strategy',
    keyActives: 'Key actives',
    routineIntro: 'Follow the steps in order. Wait about a minute between layers.',
    routineSwitchLabel: 'Routine time of day',
    stepNumber: 'Step {n}',
    whatToExpect: 'What to expect',
    viewProduct: 'View {name}',
    addProductToCart: 'Add {name} to cart',
    addToWishlist: 'Save {name} to wishlist',
    removeFromWishlist: 'Remove {name} from wishlist',
    addFullRoutine: 'Add full routine to cart',
    routineTotal: 'Routine total',
    productCount: '{count} products',
    productCountOne: '1 product',
    shopForStep: 'Browse the shop',
    safetyCallout: 'Safety first',
    perWeek: 'per week',
  },
  ar: {
    quizTitle: 'تحليل البشرة',
    quizSubtitle: 'احصل على روتين K-Beauty المخصص لك في دقيقتين',
    startQuiz: 'ابدأ التحليل',
    next: 'التالي',
    back: 'السابق',
    calculating: 'جاري تحليل ملف بشرتك...',
    calculatingSub: 'نطابق إجاباتك مع منتجات آمنة ومناسبة',
    analysisComplete: 'اكتمل التحليل',
    yourCuratedRoutine: 'روتينك المنسق',
    retakeQuiz: 'إعادة الاختبار',
    shopAll: 'تسوق جميع المنتجات',
    infoDisclaimer: 'ملاحظة: هذا التحليل لأغراض تعليمية فقط. استشر دائمًا طبيب الأمراض الجلدية للمخاوف الطبية.',
    consultDermatologist: 'استشر طبيب جلدية للحصول على نصيحة طبية متخصصة.',
    analysisConfidence: 'ثقة التحليل',
    basedOnData: 'بناءً على مدى اتساق إجاباتك',
    confidenceHigh: 'ثقة عالية',
    confidenceMedium: 'ثقة متوسطة',
    confidenceLow: 'ثقة منخفضة',
    yourPersona: 'شخصية بشرتك',
    recommendedStrategy: 'الاستراتيجية الموصى بها',
    whyItWorksTitle: 'لماذا يناسبك هذا الروتين',
    expectedForecast: 'التوقعات المتوقعة',
    sensitivity: 'الحساسية',
    oilControl: 'التحكم بالزيوت',
    hydration: 'الترطيب',
    skinTypeRow: 'نوع البشرة',
    acneRow: 'البثور',
    dehydratedYes: 'تعاني من نقص الترطيب',
    dehydratedNo: 'رطبة بشكل جيد',
    questionOf: 'السؤال {current} من {total}',
    resultsTitle: 'شخصية بشرتك',
    confidence: 'دقة التحليل',
    routine: 'روتينك المخصص',
    am: 'الصباح',
    pm: 'المساء',
    weeklyTitle: 'علاج أسبوعي',
    weeklyFrequency: 'مرة إلى مرتين في الأسبوع',
    notesTitle: 'معلومات مفيدة',
    noSafeMatch: 'لا يوجد منتج آمن مناسب في كتالوجنا لهذه الخطوة',
    errorTitle: 'تعذر إكمال تحليلك.',
    errorBody: 'يرجى إعادة الاختبار.',
    retry: 'إعادة الاختبار',
    safetyNote: 'ملاحظة السلامة',
    addToCart: 'إضافة الروتين للسلة',
    resetQuiz: 'إعادة الاختبار',
    viewPrevious: 'عرض النتائج السابقة',
    high: 'عالي',
    medium: 'متوسط',
    low: 'منخفض',
    dry: 'جافة',
    oily: 'دهنية',
    sensitive: 'حساسة',
    combination: 'مختلطة',
    normal: 'عادية',
    step: 'خطوة',
    heroPick: 'اختيارنا الأفضل',
    match: 'تطابق',
    close: 'إغلاق',
    switchLanguage: 'تغيير اللغة',
    questionProgress: 'تقدم الاختبار',
    yourSkinProfile: 'ملف بشرتك',
    oiliness: 'الدهون',
    mainFocus: 'أولويتك',
    yourStrategy: 'استراتيجيتك',
    keyActives: 'أهم المكونات الفعالة',
    routineIntro: 'اتبع الخطوات بالترتيب، وانتظر دقيقة تقريبًا بين الطبقات.',
    routineSwitchLabel: 'وقت الروتين',
    stepNumber: 'الخطوة {n}',
    whatToExpect: 'ماذا تتوقع',
    viewProduct: 'عرض {name}',
    addProductToCart: 'أضف {name} إلى السلة',
    addToWishlist: 'احفظ {name} في المفضلة',
    removeFromWishlist: 'أزل {name} من المفضلة',
    addFullRoutine: 'أضف الروتين كاملًا إلى السلة',
    routineTotal: 'إجمالي الروتين',
    productCount: '{count} منتجات',
    productCountOne: 'منتج واحد',
    shopForStep: 'تصفح المتجر',
    safetyCallout: 'السلامة أولًا',
    perWeek: 'في الأسبوع',
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)['en'];

export const SKIN_TYPE_NAMES: Record<SkinType, Bilingual> = {
  Dry: { en: 'Dry', ar: 'جافة' },
  Normal: { en: 'Normal', ar: 'عادية' },
  Combination: { en: 'Combination', ar: 'مختلطة' },
  Oily: { en: 'Oily', ar: 'دهنية' },
};

/** Phrased to follow "to target" / "لمعالجة" in reason sentences. */
export const CONCERN_NAMES: Record<Concern, Bilingual> = {
  breakouts: { en: 'breakouts', ar: 'البثور' },
  dark_spots: { en: 'dark spots', ar: 'البقع الداكنة' },
  dullness: { en: 'dullness', ar: 'البهتان' },
  fine_lines: { en: 'fine lines', ar: 'الخطوط الدقيقة' },
  dryness_barrier: { en: 'dryness and a weak barrier', ar: 'الجفاف وضعف حاجز البشرة' },
  redness: { en: 'redness', ar: 'الاحمرار' },
  pores_texture: { en: 'visible pores and rough texture', ar: 'المسام الواضحة وخشونة الملمس' },
};

export const ACTIVE_NAMES: Record<ActiveTag, Bilingual> = {
  retinoid: { en: 'a retinoid', ar: 'ريتينويد' },
  bakuchiol: { en: 'bakuchiol', ar: 'الباكوتشيول' },
  bha: { en: 'salicylic acid (BHA)', ar: 'حمض الساليسيليك' },
  aha: { en: 'AHA exfoliating acids', ar: 'أحماض ألفا هيدروكسي المقشرة' },
  pha: { en: 'PHA gentle exfoliant', ar: 'مقشر لطيف من أحماض البولي هيدروكسي' },
  vitaminC: { en: 'vitamin C', ar: 'فيتامين سي' },
  niacinamide: { en: 'niacinamide', ar: 'النياسيناميد' },
  txa: { en: 'tranexamic acid', ar: 'حمض الترانيكساميك' },
  azelaic: { en: 'azelaic acid', ar: 'حمض الأزيليك' },
  kojic: { en: 'kojic acid', ar: 'حمض الكوجيك' },
  glutathione: { en: 'glutathione', ar: 'الجلوتاثيون' },
  soothing: { en: 'soothing centella and botanicals', ar: 'السنتيلا والمستخلصات النباتية المهدئة' },
  barrier: { en: 'ceramides and barrier-building lipids', ar: 'السيراميدات ودهون دعم الحاجز' },
  humectant: { en: 'hyaluronic acid and humectants', ar: 'حمض الهيالورونيك والمرطبات' },
  peptide: { en: 'peptides', ar: 'الببتيدات' },
  pdrn: { en: 'PDRN and skin-renewing complexes', ar: 'مركب PDRN ومكونات تجديد البشرة' },
  collagen: { en: 'collagen', ar: 'الكولاجين' },
  antiAcne: { en: 'tea tree and zinc', ar: 'شجرة الشاي والزنك' },
  rice: { en: 'rice extract', ar: 'مستخلص الأرز' },
  clay: { en: 'purifying clay', ar: 'الطين المنقي' },
  spicule: { en: 'micro-spicules', ar: 'الإبر المجهرية الدقيقة' },
};

export const SLOT_LABELS: Record<RoutineSlot, Bilingual> = {
  firstCleanse: { en: 'Oil or balm cleanser', ar: 'منظف زيتي أو بلسم' },
  cleanser: { en: 'Cleanser', ar: 'منظف' },
  toner: { en: 'Toner or essence', ar: 'تونر أو إسنس' },
  amSerum: { en: 'Serum', ar: 'سيروم' },
  pmTreatment: { en: 'Night treatment', ar: 'علاج ليلي' },
  moisturizer: { en: 'Moisturizer', ar: 'مرطب' },
  sunscreen: { en: 'Sunscreen', ar: 'واقي الشمس' },
  weekly: { en: 'Weekly treatment', ar: 'علاج أسبوعي' },
};

const SLOT_ROLE_REASONS: Record<RoutineSlot, Bilingual> = {
  firstCleanse: {
    en: 'Oil-based first cleanse lifts sunscreen, makeup and sebum',
    ar: 'التنظيف الأول الزيتي يزيل واقي الشمس والمكياج والزيوت',
  },
  cleanser: {
    en: 'Gentle cleanse that keeps your skin barrier intact',
    ar: 'تنظيف لطيف يحافظ على حاجز بشرتك',
  },
  toner: {
    en: 'Prepares skin and adds a light layer of hydration',
    ar: 'يهيئ البشرة ويضيف طبقة خفيفة من الترطيب',
  },
  amSerum: {
    en: 'Morning serum with antioxidant, soothing or hydrating support',
    ar: 'سيروم صباحي بدعم مضاد للأكسدة أو مهدئ أو مرطب',
  },
  pmTreatment: {
    en: 'Night treatment, when skin repairs and actives work best',
    ar: 'علاج ليلي، فالبشرة تتجدد ليلًا وتعمل المكونات الفعالة بأفضل شكل',
  },
  moisturizer: {
    en: 'Seals in moisture and supports your skin barrier',
    ar: 'يحبس الرطوبة ويدعم حاجز بشرتك',
  },
  sunscreen: {
    en: 'Daily UV protection is the most important step for tone and aging',
    ar: 'الحماية اليومية من الأشعة فوق البنفسجية أهم خطوة لتوحيد اللون ومقاومة التقدم في العمر',
  },
  weekly: {
    en: 'A weekly boost, best on a night you skip your night treatment',
    ar: 'دفعة أسبوعية، والأفضل استخدامها في ليلة لا تستخدم فيها العلاج الليلي',
  },
};

const SUN_REASONS: Record<SunExposure, Bilingual> = {
  high: {
    en: 'Broad-spectrum protection for your high daily sun exposure',
    ar: 'حماية واسعة الطيف لتعرضك العالي للشمس يوميًا',
  },
  moderate: {
    en: 'Broad-spectrum protection for your daily commute and errands',
    ar: 'حماية واسعة الطيف لتنقلاتك ومشاويرك اليومية',
  },
  low: {
    en: 'Daily UV protection, even on days spent mostly indoors',
    ar: 'حماية يومية من الأشعة فوق البنفسجية حتى في الأيام التي تقضيها في الداخل',
  },
};

/** Renders a language-neutral reason code as text, so the language toggle never needs a recompute. */
export const renderReason = (reason: ReasonCode, lang: Lang): string => {
  switch (reason.code) {
    case 'skinTypeFit': {
      const type = SKIN_TYPE_NAMES[reason.skinType][lang];
      if (lang === 'ar') {
        return reason.exact
          ? `مصممة خصيصًا لبشرة ${type}`
          : `مناسبة لجميع أنواع البشرة، ومنها بشرة ${type}`;
      }
      return reason.exact ? `Formulated for ${type.toLowerCase()} skin` : `Suits all skin types, including ${type.toLowerCase()} skin`;
    }
    case 'targetsConcern': {
      const concern = CONCERN_NAMES[reason.concern][lang];
      const active = ACTIVE_NAMES[reason.active][lang];
      return lang === 'ar' ? `يحتوي على ${active} لمعالجة ${concern}` : `Contains ${active} to target ${concern}`;
    }
    case 'gentleForSensitive':
      return lang === 'ar'
        ? 'تركيبة مهدئة ولطيفة على حاجز البشرة المتفاعلة'
        : 'Soothing, barrier-friendly formula for reactive skin';
    case 'slotRole':
      return SLOT_ROLE_REASONS[reason.slot][lang];
    case 'dailySpf':
      return SUN_REASONS[reason.sun][lang];
    case 'doubleCleanse':
      return lang === 'ar'
        ? 'يذيب الواقي والمكياج في الخطوة الأولى من التنظيف المزدوج'
        : 'Melts sunscreen and makeup in the first step of a double cleanse';
    case 'pregnancySafeChoice':
      return lang === 'ar'
        ? 'اختيار خالٍ من الريتينويد للحمل والرضاعة ومحاولة الحمل'
        : 'Retinoid-free choice for pregnancy, breastfeeding or trying to conceive';
  }
};

interface PersonaCopy {
  name: Bilingual;
  description: Bilingual;
}

export const PERSONAS: Record<PersonaKey, PersonaCopy> = {
  sensitiveSoul: {
    name: { en: 'The Sensitive Soul', ar: 'الروح الحساسة' },
    description: {
      en: 'Your skin is a delicate ecosystem that reacts quickly to environmental changes and harsh ingredients.',
      ar: 'بشرتك نظام بيئي دقيق يتفاعل بسرعة مع التغيرات البيئية والمكونات القاسية.',
    },
  },
  glowSeeker: {
    name: { en: 'The Glow Seeker', ar: 'الباحث عن النضارة' },
    description: {
      en: "You're dealing with some dullness or uneven tone and want a brighter, more even complexion.",
      ar: 'تتعامل مع بعض البهتان أو تفاوت اللون وتريد بشرة أكثر إشراقًا وتجانسًا.',
    },
  },
  clearPath: {
    name: { en: 'The Clear Path', ar: 'المسار الواضح' },
    description: {
      en: 'Breakouts, congestion and visible pores are your main hurdles. Your skin needs pore care without being stripped.',
      ar: 'البثور والاحتقان والمسام الواضحة هي عقباتك الرئيسية. تحتاج بشرتك إلى عناية بالمسام دون تجريدها.',
    },
  },
  youthGuardian: {
    name: { en: 'The Youth Guardian', ar: 'حارس الشباب' },
    description: {
      en: "You're focused on longevity. Your skin thrives on peptides, antioxidants and gentle cell renewal.",
      ar: 'أنت تركز على طول العمر. تزدهر بشرتك بالببتيدات ومضادات الأكسدة وتجديد الخلايا اللطيف.',
    },
  },
  barrierBuilder: {
    name: { en: 'The Barrier Builder', ar: 'بنّاء الحاجز' },
    description: {
      en: 'Your skin loses moisture easily and needs its protective barrier rebuilt before anything else.',
      ar: 'تفقد بشرتك الرطوبة بسهولة وتحتاج إلى إعادة بناء حاجزها الواقي قبل أي شيء آخر.',
    },
  },
};

export const STRATEGY: Record<PersonaKey, Bilingual> = {
  sensitiveSoul: {
    en: 'Focus on barrier repair and soothing botanicals like Heartleaf and Centella. Skip strong acids and retinoids for now.',
    ar: 'ركز على إصلاح الحاجز والمستخلصات المهدئة مثل Heartleaf و Centella. تجنب الأحماض القوية والريتينويدات في الوقت الحالي.',
  },
  glowSeeker: {
    en: 'Layer niacinamide and gentle brightening actives like vitamin C or tranexamic acid, and protect results with daily sunscreen.',
    ar: 'استخدم النياسيناميد ومكونات التفتيح اللطيفة مثل فيتامين سي أو حمض الترانيكساميك، وحافظ على النتائج بواقي الشمس يوميًا.',
  },
  clearPath: {
    en: 'Use a pore-clearing or calming active at night, with lightweight, oil-free hydration to keep skin balanced.',
    ar: 'استخدم مكونًا ينظف المسام أو يهدئ البشرة ليلًا، مع ترطيب خفيف خالٍ من الزيوت للحفاظ على التوازن.',
  },
  youthGuardian: {
    en: 'Support elasticity with peptides and antioxidants, protect with daily sunscreen, and add a retinoid at night only when it is right for you.',
    ar: 'ادعم المرونة بالببتيدات ومضادات الأكسدة، واحمِ بشرتك بواقي الشمس يوميًا، وأضف الريتينويد ليلًا فقط عندما يناسبك.',
  },
  barrierBuilder: {
    en: 'Rebuild the barrier with ceramides and humectants, layer hydration while skin is damp, and avoid stripping cleansers and strong exfoliants.',
    ar: 'أعد بناء الحاجز بالسيراميدات والمرطبات، وضع الترطيب على بشرة رطبة، وتجنب المنظفات القاسية والمقشرات القوية.',
  },
};

/** Appended to the strategy for highly reactive skin whose persona is not already the sensitive one. */
export const GENTLE_MODIFIER: Bilingual = {
  en: 'Because your skin reacts easily, this routine keeps actives gentle and avoids strong exfoliants.',
  ar: 'لأن بشرتك تتفاعل بسهولة، يعتمد هذا الروتين مكونات لطيفة ويتجنب المقشرات القوية.',
};

export const WHY: Record<PersonaKey, Bilingual> = {
  sensitiveSoul: {
    en: 'Soothing and barrier-supporting steps calm reactivity first, so every other product is better tolerated.',
    ar: 'خطوات التهدئة ودعم الحاجز تقلل التفاعل أولًا، فتتحمل بشرتك باقي المنتجات بشكل أفضل.',
  },
  glowSeeker: {
    en: 'Brightening actives fade discoloration over time, while sunscreen stops new spots from forming.',
    ar: 'مكونات التفتيح تخفف التصبغات مع الوقت، بينما يمنع واقي الشمس ظهور بقع جديدة.',
  },
  clearPath: {
    en: 'Clearing pores without over-drying keeps oil balanced, which reduces new breakouts over time.',
    ar: 'تنظيف المسام دون تجفيف زائد يوازن الزيوت ويقلل ظهور البثور الجديدة مع الوقت.',
  },
  youthGuardian: {
    en: 'Daily protection plus firming and renewing steps slow visible aging while keeping skin comfortable.',
    ar: 'الحماية اليومية مع خطوات الشد والتجديد تبطئ علامات التقدم في العمر وتبقي بشرتك مرتاحة.',
  },
  barrierBuilder: {
    en: 'A stronger barrier holds in water, so tightness and flaking ease and skin tolerates more.',
    ar: 'الحاجز الأقوى يحبس الماء، فيخف الشد والتقشر وتتحمل البشرة المزيد.',
  },
};

export const FORECAST: Record<PersonaKey, Bilingual> = {
  sensitiveSoul: {
    en: 'Redness and stinging usually calm within 2 to 4 weeks as your barrier recovers.',
    ar: 'يهدأ الاحمرار والوخز عادةً خلال 2 إلى 4 أسابيع مع تعافي الحاجز.',
  },
  glowSeeker: {
    en: 'Radiance improves in 2 to 4 weeks. Visible fading of dark spots takes 8 to 12 weeks of daily sunscreen.',
    ar: 'يتحسن الإشراق خلال 2 إلى 4 أسابيع. يحتاج تخفيف البقع الداكنة من 8 إلى 12 أسبوعًا مع واقي الشمس يوميًا.',
  },
  clearPath: {
    en: 'Oiliness settles in 2 to 4 weeks. Expect visibly clearer skin in 6 to 12 weeks.',
    ar: 'تستقر الزيوت خلال 2 إلى 4 أسابيع. توقع بشرة أنقى بوضوح خلال 6 إلى 12 أسبوعًا.',
  },
  youthGuardian: {
    en: 'Hydration and plumpness improve in 1 to 2 weeks. Fine lines soften gradually over 3 to 6 months of consistent use.',
    ar: 'يتحسن الترطيب والامتلاء خلال 1 إلى 2 أسبوع. تخف الخطوط الدقيقة تدريجيًا خلال 3 إلى 6 أشهر من الاستخدام المنتظم.',
  },
  barrierBuilder: {
    en: 'Tightness and flaking ease in 1 to 2 weeks, with a lasting barrier in about 4 weeks.',
    ar: 'يخف الشد والتقشر خلال 1 إلى 2 أسبوع، ويستقر الحاجز خلال نحو 4 أسابيع.',
  },
};

export const NOTES: Record<NoteCode, Bilingual> = {
  pregnancyRetinoidFree: {
    en: 'This routine avoids retinoids, bakuchiol and leave-on salicylic acid because you are pregnant, breastfeeding, trying to conceive or prefer not to say. Please check any product with your doctor.',
    ar: 'يتجنب هذا الروتين الريتينويدات والباكوتشيول وحمض الساليسيليك المتروك على البشرة لأنك حامل أو مرضعة أو تحاولين الحمل أو فضلت عدم الإجابة. يرجى استشارة طبيبك بشأن أي منتج.',
  },
  patchTest: {
    en: 'Patch test every new product on your inner arm or behind your ear for 24 hours before first use.',
    ar: 'جرّب كل منتج جديد على باطن الذراع أو خلف الأذن لمدة 24 ساعة قبل أول استخدام.',
  },
  reapplySpf: {
    en: 'With high sun exposure, reapply sunscreen every 2 hours while outdoors.',
    ar: 'مع التعرض العالي للشمس، أعد وضع واقي الشمس كل ساعتين أثناء التواجد في الخارج.',
  },
  introduceSlowly: {
    en: 'Introduce active products one at a time, 2 to 3 nights a week at first.',
    ar: 'أدخل المنتجات الفعالة واحدًا تلو الآخر، من 2 إلى 3 ليالٍ في الأسبوع في البداية.',
  },
};

const LEVEL_KEYS: Record<Level, 'low' | 'medium' | 'high'> = { Low: 'low', Medium: 'medium', High: 'high' };

/** Sensitivity level as display text. */
export const levelLabel = (level: Level, lang: Lang): string => TRANSLATIONS[lang][LEVEL_KEYS[level]];

const ACNE_NAMES: Record<AcneLevel, Bilingual> = {
  None: { en: 'Rare', ar: 'نادرة' },
  Occasional: { en: 'Occasional', ar: 'أحيانًا' },
  Active: { en: 'Frequent', ar: 'متكررة' },
};

export const acneLabel = (acne: AcneLevel, lang: Lang): string => ACNE_NAMES[acne][lang];

/** "High confidence" style label for a 40..95 confidence value. */
export const confidenceLabel = (confidence: number, lang: Lang): string => {
  const t = TRANSLATIONS[lang];
  if (confidence >= 80) return t.confidenceHigh;
  if (confidence >= 60) return t.confidenceMedium;
  return t.confidenceLow;
};

/**
 * Short skin summary, for example "Oily, Acne-Prone". Home shows it as
 * "Recommended for Your {summary} Skin", so the English form must read naturally there.
 */
export const summaryLabel = (profile: SkinProfile, lang: Lang): string => {
  const parts: string[] = [SKIN_TYPE_NAMES[profile.skinType][lang]];
  if (profile.sensitivity === 'High') parts.push(TRANSLATIONS[lang].sensitive);
  if (profile.acne === 'Active') parts.push(lang === 'ar' ? 'معرضة للبثور' : 'Acne-Prone');
  return parts.join(lang === 'ar' ? '، ' : ', ');
};
