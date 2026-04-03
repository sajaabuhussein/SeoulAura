import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  User,
  ShoppingBag,
  Heart,
  Plus,
  Check,
  Clock,
  Activity,
  Droplets,
  Sun,
  Moon,
  Wind,
  Coffee,
  Stethoscope,
  RefreshCw
} from 'lucide-react';
import { Product, QuizResult, RecommendedProduct, SkinType, SkinConcern, LifestyleFactor } from '../types';
import { PRODUCTS } from '../data';

interface Question {
  id: number;
  text: { en: string; ar: string };
  category: 'type' | 'concern' | 'lifestyle' | 'depth';
  options: {
    text: { en: string; ar: string };
    scores: {
      types?: Partial<Record<SkinType, number>>;
      concerns?: Partial<Record<SkinConcern, number>>;
      profile?: {
        sensitivity?: number;
        oil?: number;
        hydration?: number;
      };
      lifestyle?: Partial<Record<LifestyleFactor, number>>;
    };
    next?: number; // Adaptive flow
  }[];
}

const WEIGHTS = {
  TYPE_MATCH: 10,
  CONCERN_MATCH: 15,
  INGREDIENT_MATCH: 5,
  SAFETY_PENALTY: -50,
  LIFESTYLE_BONUS: 3,
};

const TRANSLATIONS = {
  en: {
    quizTitle: "Skin Analysis",
    quizSubtitle: "Get your personalized K-Beauty routine in 2 minutes",
    startQuiz: "Start Analysis",
    next: "Next",
    back: "Back",
    calculating: "Analyzing your skin profile...",
    analysisComplete: "Analysis Complete",
    yourCuratedRoutine: "Your Curated Routine",
    retakeQuiz: "Retake Quiz",
    shopAll: "Shop All Products",
    infoDisclaimer: "Note: This analysis is for educational purposes. Always consult a dermatologist for medical concerns.",
    analysisConfidence: "Analysis Confidence",
    basedOnData: "Based on your responses",
    yourPersona: "Your Skin Persona",
    recommendedStrategy: "Recommended Strategy",
    expectedForecast: "Expected Forecast",
    sensitivity: "Sensitivity",
    oilControl: "Oil Control",
    hydration: "Hydration",
    safetyLevel: "Safety Level",
    questionOf: "Question {current} of {total}",
    resultsTitle: "Your Skin Persona",
    confidence: "Analysis Confidence",
    routine: "Your Personalized Routine",
    am: "Morning",
    pm: "Evening",
    whyItWorks: "Why this works for you",
    safetyNote: "Safety Note",
    addToCart: "Add Routine to Cart",
    resetQuiz: "Retake Quiz",
    viewPrevious: "View Previous Results",
    high: "High",
    medium: "Medium",
    low: "Low",
    dry: "Dry",
    oily: "Oily",
    sensitive: "Sensitive",
    combination: "Combination",
    normal: "Normal",
    step: "Step",
    heroPick: "Hero Pick",
    match: "Match",
  },
  ar: {
    quizTitle: "تحليل البشرة",
    quizSubtitle: "احصل على روتين K-Beauty المخصص لك في دقيقتين",
    startQuiz: "ابدأ التحليل",
    next: "التالي",
    back: "السابق",
    calculating: "جاري تحليل ملف بشرتك...",
    analysisComplete: "اكتمل التحليل",
    yourCuratedRoutine: "روتينك المنسق",
    retakeQuiz: "إعادة الاختبار",
    shopAll: "تسوق جميع المنتجات",
    infoDisclaimer: "ملاحظة: هذا التحليل لأغراض تعليمية فقط. استشر دائمًا طبيب الأمراض الجلدية للمخاوف الطبية.",
    analysisConfidence: "ثقة التحليل",
    basedOnData: "بناءً على ردودك",
    yourPersona: "شخصية بشرتك",
    recommendedStrategy: "الاستراتيجية الموصى بها",
    expectedForecast: "التوقعات المتوقعة",
    sensitivity: "الحساسية",
    oilControl: "التحكم بالزيوت",
    hydration: "الترطيب",
    safetyLevel: "مستوى الأمان",
    questionOf: "السؤال {current} من {total}",
    resultsTitle: "شخصية بشرتك",
    confidence: "دقة التحليل",
    routine: "روتينك المخصص",
    am: "الصباح",
    pm: "المساء",
    whyItWorks: "لماذا يناسبك هذا الروتين",
    safetyNote: "ملاحظة السلامة",
    addToCart: "إضافة الروتين للسلة",
    resetQuiz: "إعادة الاختبار",
    viewPrevious: "عرض النتائج السابقة",
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    dry: "جافة",
    oily: "دهنية",
    sensitive: "حساسة",
    combination: "مختلطة",
    normal: "عادية",
    step: "خطوة",
    heroPick: "اختيارنا الأفضل",
    match: "تطابق",
  }
};

const SKIN_PERSONAS = {
  'The Sensitive Soul': {
    en: {
      name: "The Sensitive Soul",
      description: "Your skin is a delicate ecosystem that reacts quickly to environmental changes and harsh ingredients.",
      strategy: "Focus on barrier repair and soothing botanicals like Heartleaf and Centella. Avoid high-strength acids for now.",
    },
    ar: {
      name: "الروح الحساسة",
      description: "بشرتك نظام بيئي دقيق يتفاعل بسرعة مع التغيرات البيئية والمكونات القاسية.",
      strategy: "ركز على إصلاح الحاجز والمواد النباتية المهدئة مثل Heartleaf و Centella. تجنب الأحماض القوية في الوقت الحالي.",
    }
  },
  'The Glow Seeker': {
    en: {
      name: "The Glow Seeker",
      description: "You're dealing with some dullness or uneven tone, but your skin is resilient enough for active brightening.",
      strategy: "Incorporate Niacinamide and Vitamin C to boost radiance and even out hyperpigmentation.",
    },
    ar: {
      name: "الباحث عن النضارة",
      description: "أنت تتعامل مع بعض البهتان أو تفاوت اللون، لكن بشرتك مرنة بما يكفي للتفتيح النشط.",
      strategy: "استخدم النياسيناميد وفيتامين سي لتعزيز الإشراق وتوحيد فرط التصبغ.",
    }
  },
  'The Clear Path': {
    en: {
      name: "The Clear Path",
      description: "Congestion and excess oil are your main hurdles. Your skin needs deep pore care without being stripped.",
      strategy: "Use BHA (Salicylic Acid) to clear pores and lightweight, oil-free hydration to maintain balance.",
    },
    ar: {
      name: "المسار الواضح",
      description: "الاحتقان والزيوت الزائدة هي العقبات الرئيسية لديك. تحتاج بشرتك إلى عناية عميقة بالمسام دون تجريدها.",
      strategy: "استخدم BHA (حمض الساليسيليك) تنظيف المسام وترطيب خفيف خالٍ من الزيوت للحفاظ على التوازن.",
    }
  },
  'The Youth Guardian': {
    en: {
      name: "The Youth Guardian",
      description: "You're focused on longevity. Your skin thrives on peptides, collagen, and gentle cell renewal.",
      strategy: "Prioritize Retinoids (or Bakuchiol) and Peptides to support elasticity and prevent fine lines.",
    },
    ar: {
      name: "حارس الشباب",
      description: "أنت تركز على طول العمر. تزدهر بشرتك بالببتيدات والكولاجين وتجديد الخلايا اللطيف.",
      strategy: "أعط الأولوية للريتينويدات (أو الباكوتشيول) والببتيدات لدعم المرونة ومنع الخطوط الدقيقة.",
    }
  }
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'type',
    text: {
      en: "How does your skin feel by midday?",
      ar: "كيف تشعر بشرتك بحلول منتصف النهار؟"
    },
    options: [
      {
        text: { en: "Tight and flaky", ar: "مشدودة ومتقشرة" },
        scores: { types: { Dry: 10 }, profile: { oil: -5, hydration: -5 } },
        next: 2
      },
      {
        text: { en: "Shiny all over", ar: "لامعة في كل مكان" },
        scores: { types: { Oily: 10 }, profile: { oil: 10, hydration: 2 } },
        next: 3 // Skip to oily-specific depth
      },
      {
        text: { en: "Shiny only in the T-zone", ar: "لامعة فقط في منطقة T" },
        scores: { types: { Combination: 10 }, profile: { oil: 5, hydration: 0 } },
        next: 2
      },
      {
        text: { en: "Comfortable and balanced", ar: "مرتاحة ومتوازنة" },
        scores: { types: { Normal: 10 }, profile: { oil: 0, hydration: 5 } },
        next: 2
      }
    ]
  },
  {
    id: 2,
    category: 'depth',
    text: {
      en: "Do you experience redness or stinging often?",
      ar: "هل تعاني من احمرار أو وخز في كثير من الأحيان؟"
    },
    options: [
      {
        text: { en: "Yes, very easily", ar: "نعم، بسهولة تامة" },
        scores: { types: { Sensitive: 10 }, profile: { sensitivity: 10 } },
        next: 4
      },
      {
        text: { en: "Only with new products", ar: "فقط مع المنتجات الجديدة" },
        scores: { types: { Sensitive: 5 }, profile: { sensitivity: 5 } },
        next: 4
      },
      {
        text: { en: "Rarely or never", ar: "نادرًا أو أبدًا" },
        scores: { profile: { sensitivity: 0 } },
        next: 4
      }
    ]
  },
  {
    id: 3,
    category: 'depth',
    text: {
      en: "How often do you experience breakouts?",
      ar: "كم مرة تعاني من ظهور البثور؟"
    },
    options: [
      {
        text: { en: "Constantly (Active Acne)", ar: "باستمرار (حب شباب نشط)" },
        scores: { types: { Acne: 10 }, concerns: { Acne: 10 }, profile: { oil: 5 } },
        next: 4
      },
      {
        text: { en: "Occasionally (Hormonal)", ar: "أحيانًا (هرموني)" },
        scores: { types: { Acne: 5 }, concerns: { Acne: 5 } },
        next: 4
      },
      {
        text: { en: "Rarely", ar: "نادرًا" },
        scores: { profile: { oil: 2 } },
        next: 4
      }
    ]
  },
  {
    id: 4,
    category: 'concern',
    text: {
      en: "What is your #1 skin goal right now?",
      ar: "ما هو هدفك الأول لبشرتك الآن؟"
    },
    options: [
      {
        text: { en: "Clear up acne/blemishes", ar: "تصفية حب الشباب/الشوائب" },
        scores: { concerns: { Acne: 15 } },
        next: 5
      },
      {
        text: { en: "Brighten dark spots/dullness", ar: "تفتيح البقع الداكنة/الباهتة" },
        scores: { concerns: { Dullness: 15 } },
        next: 5
      },
      {
        text: { en: "Reduce fine lines/wrinkles", ar: "تقليل الخطوط الدقيقة/التجاعيد" },
        scores: { concerns: { Aging: 15 } },
        next: 5
      },
      {
        text: { en: "Deep hydration/repair", ar: "ترطيب عميق/إصلاح" },
        scores: { concerns: { Dryness: 15 }, profile: { hydration: 10 } },
        next: 5
      }
    ]
  },
  {
    id: 5,
    category: 'lifestyle',
    text: {
      en: "How much sun exposure do you get daily?",
      ar: "ما مقدار التعرض للشمس الذي تحصل عليه يوميًا؟"
    },
    options: [
      {
        text: { en: "High (Outdoor activities)", ar: "عالي (أنشطة خارجية)" },
        scores: { lifestyle: { SunExposure: 10 }, profile: { sensitivity: 2 } },
        next: 6
      },
      {
        text: { en: "Moderate (Commuting)", ar: "متوسط (التنقل)" },
        scores: { lifestyle: { SunExposure: 5 } },
        next: 6
      },
      {
        text: { en: "Low (Mostly indoors)", ar: "منخفض (معظم الوقت في الداخل)" },
        scores: { lifestyle: { SunExposure: 0 } },
        next: 6
      }
    ]
  },
  {
    id: 6,
    category: 'lifestyle',
    text: {
      en: "How would you describe your stress levels?",
      ar: "كيف تصف مستويات التوتر لديك؟"
    },
    options: [
      {
        text: { en: "High/Frequent", ar: "عالية/متكررة" },
        scores: { lifestyle: { Stress: 10 }, profile: { sensitivity: 3 } },
        next: undefined // End of quiz
      },
      {
        text: { en: "Moderate", ar: "متوسطة" },
        scores: { lifestyle: { Stress: 5 } },
        next: undefined
      },
      {
        text: { en: "Low/Managed", ar: "منخفضة/مسيطر عليها" },
        scores: { lifestyle: { Stress: 0 } },
        next: undefined
      }
    ]
  }
];

interface SkinQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
  onComplete?: (result: string) => void;
}

const ROUTINE_STEPS = {
  AM: ['Cleansers', 'Serums & Ampoules', 'Moisturizers', 'Sun Care'],
  PM: ['Cleansers', 'Serums & Ampoules', 'Moisturizers']
};

export const SkinQuiz = ({ isOpen, onClose, onAddToCart, onProductClick, onToggleWishlist, wishlistItems, onComplete }: SkinQuizProps) => {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [answers, setAnswers] = useState<{ questionId: number; optionIndex: number }[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<{ AM: RecommendedProduct[]; PM: RecommendedProduct[] }>({ AM: [], PM: [] });
  const [showResults, setShowResults] = useState(false);
  const [previousResult, setPreviousResult] = useState<QuizResult | null>(() => {
    const saved = localStorage.getItem('skin_quiz_result');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeRoutineTab, setActiveRoutineTab] = useState<'AM' | 'PM'>('AM');

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    if (isOpen && !result) {
      setCurrentQuestionId(1);
      setAnswers([]);
      setIsCalculating(false);
      setShowResults(false);
    }
  }, [isOpen, result]);

  const calculateResult = (): QuizResult => {
    const typeScores: Record<SkinType, number> = {
      Dry: 0, Oily: 0, Combination: 0, Normal: 0, Sensitive: 0, Acne: 0, Aging: 0, Dullness: 0
    };
    const concernScores: Record<SkinConcern, number> = {
      Acne: 0, Aging: 0, Dullness: 0, Dryness: 0, Redness: 0, Pores: 0, Texture: 0, Barrier: 0, Pigmentation: 0, Dehydration: 0
    };

    let sensitivity = 0;
    let oil = 0;
    let hydration = 0;
    const lifestyle: Partial<Record<LifestyleFactor, number>> = {};

    answers.forEach(answer => {
      const question = QUESTIONS.find(q => q.id === answer.questionId);
      const option = question?.options[answer.optionIndex];

      if (option?.scores.types) {
        Object.entries(option.scores.types).forEach(([type, score]) => {
          typeScores[type as SkinType] += score;
        });
      }
      if (option?.scores.concerns) {
        Object.entries(option.scores.concerns).forEach(([concern, score]) => {
          concernScores[concern as SkinConcern] += score;
        });
      }
      if (option?.scores.profile) {
        sensitivity += option.scores.profile.sensitivity || 0;
        oil += option.scores.profile.oil || 0;
        hydration += option.scores.profile.hydration || 0;
      }
      if (option?.scores.lifestyle) {
        Object.entries(option.scores.lifestyle).forEach(([factor, score]) => {
          lifestyle[factor as LifestyleFactor] = score;
        });
      }
    });

    const sortedTypes = Object.entries(typeScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1]);

    const primaryType = sortedTypes.length > 0 ? (sortedTypes[0][0] as SkinType) : 'Normal';

    const topConcerns = Object.entries(concernScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([concern]) => concern as SkinConcern);

    // Determine Persona based on highest relevant score
    const personaScores = {
      'The Sensitive Soul': sensitivity * 1.5, // Weight sensitivity slightly higher
      'The Clear Path': Math.max(concernScores.Acne, oil),
      'The Youth Guardian': concernScores.Aging,
      'The Glow Seeker': concernScores.Dullness
    };

    const personaKey = (Object.entries(personaScores)
      .sort((a, b) => b[1] - a[1])[0][0]) as keyof typeof SKIN_PERSONAS;

    const persona = SKIN_PERSONAS[personaKey][lang];

    const result: QuizResult = {
      skinType: primaryType,
      concerns: topConcerns,
      profile: {
        sensitivity: sensitivity > 7 ? 'High' : sensitivity > 3 ? 'Medium' : 'Low',
        oil: oil > 7 ? 'High' : oil > 3 ? 'Medium' : 'Low',
        hydration: hydration > 7 ? 'High' : hydration > 3 ? 'Medium' : 'Low',
      },
      lifestyleFactors: lifestyle,
      confidence: 85 + Math.min(answers.length * 2, 10),
      persona: {
        name: persona.name,
        tagline: persona.description.split('.')[0] + '.'
      },
      strategy: persona.strategy,
      explanation: persona.description,
      whyItWorks: "Based on your specific combination of " + primaryType.toLowerCase() + " skin and " + (topConcerns[0]?.toLowerCase() || "general") + " concerns.",
      forecast: "With consistent use, you should see improved barrier function in 2 weeks and clearer tone in 4-6 weeks.",
      complexity: topConcerns.length > 2 ? 'Advanced' : 'Simple',
      safety: sensitivity > 5 ? 'High' : 'Standard',
      timestamp: new Date().toISOString()
    };

    return result;
  };

  const getRecommendedProducts = (result: QuizResult): RecommendedProduct[] => {
    const scoredProducts = PRODUCTS.map(product => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Skin Type Match
      if (product.skinType.includes(result.skinType)) {
        score += WEIGHTS.TYPE_MATCH;
        reasons.push(lang === 'en' ? `Perfect for ${result.skinType} skin.` : `مثالي للبشرة ${result.skinType}.`);
      }

      // 2. Concern Match
      const matchingConcerns = product.benefits?.filter(benefit =>
        result.concerns.some(c => c.toLowerCase().includes(benefit.toLowerCase()))
      );
      if (matchingConcerns && matchingConcerns.length > 0) {
        score += WEIGHTS.CONCERN_MATCH * matchingConcerns.length;
        reasons.push(lang === 'en'
          ? `Targets your concern of ${matchingConcerns[0]}.`
          : `يستهدف اهتمامك بـ ${matchingConcerns[0]}.`);
      }

      // 3. Ingredient & Strategy Match
      const strategyKeywords = result.strategy.toLowerCase();
      const hasIngredientMatch = product.actives?.some(a => strategyKeywords.includes(a.toLowerCase())) ||
                                product.ingredients?.some(i => strategyKeywords.includes(i.toLowerCase()));

      if (hasIngredientMatch) {
        score += WEIGHTS.INGREDIENT_MATCH * 2;
        reasons.push(lang === 'en' ? "Contains ingredients recommended for your profile." : "يحتوي على مكونات موصى بها لملف بشرتك.");
      }

      // 4. Lifestyle Bonus
      if (result.lifestyleFactors?.SunExposure && result.lifestyleFactors.SunExposure > 5 && product.category === 'Sun Care') {
        score += WEIGHTS.LIFESTYLE_BONUS * 3;
        reasons.push(lang === 'en' ? "Essential protection for your active lifestyle." : "حماية أساسية لنمط حياتك النشط.");
      }

      // 5. Safety Check (Sensitivity)
      if (result.profile?.sensitivity === 'High' && product.actives?.some(a => ['retinol', 'aha', 'bha'].includes(a.toLowerCase()))) {
        score += WEIGHTS.SAFETY_PENALTY;
        reasons.push(lang === 'en' ? "Note: Contains strong actives, use with caution." : "ملاحظة: يحتوي على مواد فعالة قوية، استخدمه بحذر.");
      }

      return {
        ...product,
        reasons: reasons.slice(0, 2),
        matchPercentage: Math.min(Math.max(Math.floor((score / 40) * 100), 60), 98),
        isHero: score > 30,
        randomSort: Math.random()
      } as RecommendedProduct & { randomSort: number };
    });

    // Define the routine steps we want to fill
    const routineCategories = [
      ['Cleansers'],
      ['Toners & Essences'],
      ['Serums & Ampoules'],
      ['Moisturizers'],
      ['Sun Care']
    ];

    const routine: RecommendedProduct[] = [];

    routineCategories.forEach(categories => {
      const bestInCategory = scoredProducts
        .filter(p => categories.includes(p.category))
        .sort((a, b) => {
          if (b.matchPercentage !== a.matchPercentage) {
            return (b.matchPercentage || 0) - (a.matchPercentage || 0);
          }
          return b.randomSort - a.randomSort;
        })[0];

      if (bestInCategory) {
        const { randomSort, ...product } = bestInCategory;
        routine.push(product);
      }
    });

    return routine;
  };

  const handleAnswer = (optionIndex: number) => {
    const currentQuestion = QUESTIONS.find(q => q.id === currentQuestionId);
    if (!currentQuestion) return;

    const newAnswers = [...answers, { questionId: currentQuestionId, optionIndex }];
    setAnswers(newAnswers);

    const nextId = currentQuestion.options[optionIndex].next;
    if (nextId) {
      setCurrentQuestionId(nextId);
    } else {
      setIsCalculating(true);
      setTimeout(() => {
        const result = calculateResult();
        setResult(result);
        setPreviousResult(result); // Update previousResult state
        setRecommendedProducts(getRecommendedProducts(result));
        setShowResults(true);
        setIsCalculating(false);
        if (onComplete) onComplete(`${result.skinType}${result.concerns.length > 0 ? ` + ${result.concerns.join(', ')}` : ''}`);
        localStorage.setItem('skin_quiz_result', JSON.stringify(result));
      }, 1500);
    }
  };

  const routine = React.useMemo(() => {
    if (!result || recommendedProducts.length === 0) return [];

    const cleanser = recommendedProducts.find(p => p.category === 'Cleansers');
    const toner = recommendedProducts.find(p => p.category === 'Toners & Essences');
    const serum = recommendedProducts.find(p => p.category === 'Serums & Ampoules');
    const moisturizer = recommendedProducts.find(p => p.category === 'Moisturizers');
    const sunCare = recommendedProducts.find(p => p.category === 'Sun Care');

    if (activeRoutineTab === 'AM') {
      return [cleanser, toner, serum, sunCare || moisturizer].filter(Boolean) as RecommendedProduct[];
    } else {
      return [cleanser, toner, serum, moisturizer].filter(Boolean) as RecommendedProduct[];
    }
  }, [recommendedProducts, result, activeRoutineTab]);

  return (
    <div className={`h-full flex flex-col ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="h-16 border-b border-charcoal/5 flex items-center justify-between px-6 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-gold" />
          <h1 className="text-lg font-heading">{t.quizTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors">
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {isCalculating ? (
              <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <RefreshCw className="w-12 h-12 text-rose-gold animate-spin" />
                <h3 className="text-2xl font-heading">{t.calculating}</h3>
                <p className="text-charcoal/60">{t.calculatingSub}</p>
              </motion.div>
            ) : !showResults ? (
              <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 py-10">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl md:text-4xl font-heading">{QUESTIONS.find(q => q.id === currentQuestionId)?.text[lang]}</h2>
                  <p className="text-charcoal/40 text-sm">{t.questionOf.replace('{current}', (answers.length + 1).toString()).replace('{total}', '6+')}</p>
                </div>
                <div className="grid gap-3 max-w-xl mx-auto">
                  {QUESTIONS.find(q => q.id === currentQuestionId)?.options.map((opt, i) => (
                    <button key={i} onClick={() => handleAnswer(i)} className="p-5 bg-white border border-charcoal/5 rounded-xl text-left hover:border-rose-gold transition-all flex justify-between items-center group">
                      <span className="font-medium">{opt.text[lang]}</span>
                      <ChevronRight className={`w-4 h-4 text-charcoal/20 group-hover:text-rose-gold ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center max-w-xl mx-auto pt-4">
                  {answers.length > 0 ? (
                    <button onClick={() => {
                      const lastAnswer = answers[answers.length - 1];
                      setCurrentQuestionId(lastAnswer.questionId);
                      setAnswers(answers.slice(0, -1));
                    }} className="text-xs font-bold uppercase tracking-widest text-charcoal/40 hover:text-charcoal transition-colors">
                      {isRTL ? 'السابق' : 'Back'}
                    </button>
                  ) : <div />}
                  {previousResult && (
                    <button onClick={() => {
                      setResult(previousResult);
                      setRecommendedProducts(getRecommendedProducts(previousResult));
                      setShowResults(true);
                    }} className="text-xs font-bold uppercase tracking-widest text-rose-gold hover:underline">
                      {t.viewPrevious}
                    </button>
                  )}
                  <div />
                </div>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 py-6">
                {/* Confidence Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-charcoal/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-rose-50 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{t.analysisConfidence}</h3>
                        <p className="text-xs text-gray-500">{t.basedOnData}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-rose-300">{result?.confidence}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result?.confidence}%` }}
                      className="bg-rose-200 h-2 rounded-full"
                    />
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-charcoal/5 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-gold">{t.yourPersona}</span>
                        <h3 className="text-2xl font-heading">
                          {result?.persona?.name}
                        </h3>
                        <p className="text-[10px] text-rose-gold font-medium mt-1 flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" />
                          {lang === 'en' ? 'Consult a dermatologist for professional medical advice.' : 'استشر طبيب جلدية للحصول على نصيحة طبية متخصصة.'}
                        </p>
                      </div>

                      <div className="bg-charcoal/5 p-4 rounded-xl">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60 mb-2">{t.recommendedStrategy}</h4>
                        <p className="text-xs leading-relaxed">{result?.strategy}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-charcoal/5">
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/40">{t.hydration}</span>
                          <span className="font-bold">{result?.profile?.hydration}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/40">{t.sensitivity}</span>
                          <span className="font-bold">{result?.profile?.sensitivity}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/40">{t.oilControl}</span>
                          <span className="font-bold">{result?.profile?.oil}</span>
                        </div>
                      </div>
                      <button onClick={() => {
                        setResult(null);
                        setShowResults(false);
                      }} className="w-full py-3 text-[10px] font-bold uppercase tracking-widest border border-charcoal/10 rounded-lg hover:bg-charcoal hover:text-white transition-all">
                        {t.resetQuiz}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="flex gap-4 border-b border-charcoal/5">
                      {['AM', 'PM'].map(mode => (
                        <button key={mode} onClick={() => setActiveRoutineTab(mode as any)} className={`pb-3 text-xs font-bold uppercase tracking-widest relative ${activeRoutineTab === mode ? 'text-charcoal' : 'text-charcoal/30'}`}>
                          {t[mode.toLowerCase() as keyof typeof t]}
                          {activeRoutineTab === mode && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-gold" />}
                        </button>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {routine.map((product, i) => (
                        <div key={i} className="bg-white border border-charcoal/5 rounded-xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
                          <div className="aspect-square relative overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                            <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-[8px] font-bold uppercase">
                              {t.step} {i + 1}: {product.category}
                            </div>
                            <div className="absolute top-2 right-2 bg-rose-gold text-white px-2 py-1 rounded text-[8px] font-bold uppercase flex items-center gap-1">
                              <Sparkles className="w-2 h-2" />
                              {product.matchPercentage}% {t.match}
                            </div>
                          </div>
                          <div className="p-4 space-y-3 flex-1">
                            <div>
                              <span className="text-[8px] font-bold uppercase text-rose-gold">{product.brand}</span>
                              <h4 className="text-sm font-bold line-clamp-1">{product.name}</h4>
                            </div>

                            <div className="space-y-1">
                              {product.reasons?.map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[10px] text-charcoal/60">
                                  <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                                  <span>{reason}</span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-3 flex justify-between items-center border-t border-charcoal/5">
                              <span className="font-bold text-sm">${product.price}</span>
                              <div className="flex gap-2">
                                <button onClick={() => onToggleWishlist(product)} className="p-1.5 border border-charcoal/10 rounded-full hover:bg-charcoal/5 transition-colors">
                                  <Heart className={`w-3 h-3 ${wishlistItems.some(item => item.id === product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                                </button>
                                <button onClick={() => onAddToCart(product)} className="p-1.5 bg-charcoal text-white rounded-full hover:bg-rose-gold transition-colors">
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 border-t border-charcoal/5 bg-white text-center">
        <p className="text-[10px] text-charcoal/40 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          {t.infoDisclaimer}
        </p>
      </div>
    </div>
  );
};

export default SkinQuiz;
