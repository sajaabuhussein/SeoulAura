import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Heart,
  Info,
  Moon,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import type { Product, RecommendedProduct } from '../types';
import {
  ACTIVE_NAMES,
  CONCERN_NAMES,
  FORECAST,
  GENTLE_MODIFIER,
  NOTES,
  PERSONAS,
  QUESTIONS,
  SKIN_TYPE_NAMES,
  SLOT_LABELS,
  STRATEGY,
  TRANSLATIONS,
  WHY,
  acneLabel,
  confidenceLabel,
  evaluateQuiz,
  getOptions,
  levelLabel,
  renderReason,
  saveQuiz,
  toPlainProduct,
  type ActiveTag,
  type Answers,
  type Lang,
  type Level,
  type QuizOutcome,
  type RoutineSlot,
  type SkinType,
} from '../quiz';

type Phase = 'quiz' | 'calculating' | 'results' | 'error';
type RoutineTime = 'AM' | 'PM';
type Copy = (typeof TRANSLATIONS)[Lang];

const AM_SLOTS: readonly RoutineSlot[] = ['cleanser', 'toner', 'amSerum', 'moisturizer', 'sunscreen'];
const PM_SLOTS: readonly RoutineSlot[] = ['firstCleanse', 'cleanser', 'toner', 'pmTreatment', 'moisturizer'];
const CALCULATING_MS = 1500;
const MAX_KEY_ACTIVES = 3;

/** Oil level shown in the profile, derived from the skin type so it never contradicts it. */
const OIL_LEVEL: Record<SkinType, Level> = { Dry: 'Low', Normal: 'Medium', Combination: 'Medium', Oily: 'High' };

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal';

interface SkinQuizProps {
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistItems: Product[];
  /** Called once when a new analysis finishes. */
  onComplete: (outcome: QuizOutcome) => void;
  /** Outcome restored from saved answers, offered as "View previous results". */
  savedOutcome: QuizOutcome | null;
  /** Opens the shop; used by the empty-slot state. */
  onShop?: () => void;
}

const money = (value: number): string => `$${value.toFixed(2)}`;

/** Every distinct product of the routine (cleanser, toner and moisturizer are shared by AM and PM). */
const uniqueProducts = (outcome: QuizOutcome): RecommendedProduct[] => {
  const all = [...outcome.routine.AM, ...outcome.routine.PM, ...(outcome.routine.weekly ? [outcome.routine.weekly] : [])];
  return [...new Map(all.map((p) => [p.id, p])).values()];
};

/** The most frequently cited actives across the routine's reasons, in first-seen order on ties. */
const keyActives = (outcome: QuizOutcome): ActiveTag[] => {
  const counts = new Map<ActiveTag, number>();
  for (const product of uniqueProducts(outcome)) {
    for (const reason of product.reasons) {
      if (reason.code === 'targetsConcern') counts.set(reason.active, (counts.get(reason.active) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_KEY_ACTIVES)
    .map(([active]) => active);
};

const fill = (template: string, values: Record<string, string | number>): string =>
  Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, String(value)), template);

const getStorage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

interface ProductStepProps {
  product: RecommendedProduct;
  lang: Lang;
  t: Copy;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

const ProductStep = ({ product, lang, t, isWishlisted, onAddToCart, onProductClick, onToggleWishlist }: ProductStepProps) => {
  const plain = toPlainProduct(product);
  return (
    <div className="flex gap-3 sm:gap-4 rounded-2xl border border-charcoal/10 bg-white p-3 sm:p-4">
      <button
        type="button"
        onClick={() => onProductClick(plain)}
        aria-label={fill(t.viewProduct, { name: product.name })}
        className={`h-16 w-16 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-charcoal/5 bg-cream-white ${FOCUS}`}
      >
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
      </button>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-xs font-medium text-charcoal/70">{SLOT_LABELS[product.slot][lang]}</span>
          <span className="ms-auto rounded-full bg-rose-gold/15 px-2 py-0.5 text-xs font-medium text-charcoal">
            {product.matchPercentage}% {t.match}
          </span>
        </div>

        <div>
          <p className="text-xs text-charcoal/70">{product.brand}</p>
          <button
            type="button"
            onClick={() => onProductClick(plain)}
            className={`text-start text-sm sm:text-base font-medium leading-snug text-charcoal hover:underline ${FOCUS}`}
          >
            {product.name}
          </button>
        </div>

        <ul className="space-y-1">
          {product.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed text-charcoal/70">
              <Check aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-gold" />
              <span>{renderReason(reason, lang)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-medium text-charcoal">{money(product.price)}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onToggleWishlist(plain)}
              aria-pressed={isWishlisted}
              aria-label={fill(isWishlisted ? t.removeFromWishlist : t.addToWishlist, { name: product.name })}
              className={`grid h-10 w-10 place-items-center rounded-full border border-charcoal/15 transition-colors hover:bg-charcoal/5 ${FOCUS}`}
            >
              <Heart aria-hidden className={`h-4 w-4 ${isWishlisted ? 'fill-rose-gold text-rose-gold' : 'text-charcoal'}`} />
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(plain)}
              aria-label={fill(t.addProductToCart, { name: product.name })}
              className={`grid h-10 w-10 place-items-center rounded-full bg-charcoal text-white transition-colors hover:bg-charcoal/80 ${FOCUS}`}
            >
              <ShoppingBag aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Empty state for a step the catalog cannot fill safely. */
const UnfilledStep = ({ slot, lang, t, onShop }: { slot: RoutineSlot; lang: Lang; t: Copy; onShop?: () => void }) => (
  <div className="rounded-2xl border border-dashed border-charcoal/20 bg-white/60 p-4 space-y-1">
    <p className="text-xs font-medium text-charcoal/70">{SLOT_LABELS[slot][lang]}</p>
    <p className="text-sm text-charcoal/80">{t.noSafeMatch}</p>
    {onShop && (
      <button type="button" onClick={onShop} className={`text-sm font-medium text-charcoal underline underline-offset-4 ${FOCUS}`}>
        {t.shopForStep}
      </button>
    )}
  </div>
);

interface ResultsProps {
  outcome: QuizOutcome;
  lang: Lang;
  t: Copy;
  wishlistItems: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onShop?: () => void;
}

const Results = ({ outcome, lang, t, wishlistItems, onAddToCart, onProductClick, onToggleWishlist, onShop }: ResultsProps) => {
  const reduceMotion = useReducedMotion();
  const [time, setTime] = useState<RoutineTime>('AM');
  const { profile, routine, personaKey } = outcome;
  const persona = PERSONAS[personaKey];
  const actives = useMemo(() => keyActives(outcome), [outcome]);

  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: 'easeOut' as const } };

  const strategy =
    STRATEGY[personaKey][lang] + (profile.sensitivity === 'High' && personaKey !== 'sensitiveSoul' ? ` ${GENTLE_MODIFIER[lang]}` : '');
  const safetyNotes = outcome.notes.filter((n) => n === 'pregnancyRetinoidFree');
  const tipNotes = outcome.notes.filter((n) => n !== 'pregnancyRetinoidFree');

  const focus = [CONCERN_NAMES[profile.primary][lang], ...(profile.secondary ? [CONCERN_NAMES[profile.secondary][lang]] : [])].join(' + ');

  const profileRows: { label: string; value: string }[] = [
    { label: t.skinTypeRow, value: SKIN_TYPE_NAMES[profile.skinType][lang] },
    { label: t.sensitivity, value: levelLabel(profile.sensitivity, lang) },
    { label: t.oiliness, value: levelLabel(OIL_LEVEL[profile.skinType], lang) },
    { label: t.hydration, value: profile.dehydrated ? t.dehydratedYes : t.dehydratedNo },
    { label: t.acneRow, value: acneLabel(profile.acne, lang) },
  ];

  const slots = time === 'AM' ? AM_SLOTS : PM_SLOTS;
  const products = time === 'AM' ? routine.AM : routine.PM;
  const isWishlisted = (id: string) => wishlistItems.some((item) => item.id === id);
  const stepProps = { lang, t, onAddToCart, onProductClick, onToggleWishlist };

  return (
    <div className="space-y-8 pb-6">
      <motion.section {...enter(0)} aria-labelledby="persona-title" className="rounded-3xl border border-charcoal/10 bg-white p-5 sm:p-8 space-y-6">
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-charcoal/70">
            <Sparkles aria-hidden className="h-3.5 w-3.5 text-rose-gold" />
            {t.yourPersona}
          </p>
          <h2 id="persona-title" tabIndex={-1} className="outline-none text-3xl sm:text-4xl font-heading leading-tight">
            {persona.name[lang]}
          </h2>
          <p className="max-w-prose text-base leading-relaxed text-charcoal/70">{persona.description[lang]}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label={t.yourSkinProfile}>
          {profileRows.map((row) => (
            <div key={row.label} className="rounded-xl bg-cream-white px-3 py-2.5">
              <dt className="text-xs text-charcoal/70">{row.label}</dt>
              <dd className="text-sm font-medium text-charcoal">{row.value}</dd>
            </div>
          ))}
          <div className="col-span-2 rounded-xl bg-cream-white px-3 py-2.5 sm:col-span-3">
            <dt className="text-xs text-charcoal/70">{t.mainFocus}</dt>
            <dd className="block text-sm font-medium text-charcoal first-letter:uppercase">{focus}</dd>
          </div>
        </dl>
      </motion.section>

      <motion.section {...enter(0.08)} aria-labelledby="strategy-title" className="space-y-4">
        <h3 id="strategy-title" className="text-xl font-heading">
          {t.yourStrategy}
        </h3>
        <p className="max-w-prose text-sm leading-relaxed text-charcoal/80">{strategy}</p>
        <p className="max-w-prose text-sm leading-relaxed text-charcoal/70">{WHY[personaKey][lang]}</p>
        {actives.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-charcoal/70">{t.keyActives}</span>
            {actives.map((active) => (
              <span key={active} className="rounded-full border border-rose-gold/40 bg-rose-gold/10 px-3 py-1 text-xs font-medium text-charcoal">
                {ACTIVE_NAMES[active][lang]}
              </span>
            ))}
          </div>
        )}
        {safetyNotes.map((note) => (
          <div key={note} role="note" className="flex gap-3 rounded-xl border border-charcoal/10 bg-charcoal/[0.03] p-4">
            <ShieldCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-charcoal/70" />
            <p className="text-sm leading-relaxed text-charcoal/80">
              <span className="font-medium">{t.safetyCallout}. </span>
              {NOTES[note][lang]}
            </p>
          </div>
        ))}
      </motion.section>

      <motion.section {...enter(0.16)} aria-labelledby="routine-title" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h3 id="routine-title" className="text-xl font-heading">
              {t.routine}
            </h3>
            <p className="text-sm text-charcoal/70">{t.routineIntro}</p>
          </div>
          <div role="group" aria-label={t.routineSwitchLabel} className="inline-flex rounded-full bg-charcoal/5 p-1">
            {(['AM', 'PM'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={time === mode}
                onClick={() => setTime(mode)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${FOCUS} ${
                  time === mode ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/70 hover:text-charcoal'
                }`}
              >
                {mode === 'AM' ? <Sun aria-hidden className="h-4 w-4" /> : <Moon aria-hidden className="h-4 w-4" />}
                {mode === 'AM' ? t.am : t.pm}
              </button>
            ))}
          </div>
        </div>

        <ol className="space-y-0">
          {slots.map((slot, i) => {
            const product = products.find((p) => p.slot === slot);
            return (
              <li key={`${time}-${slot}`} className="relative pb-4 ps-11 last:pb-0 sm:ps-14">
                <span
                  aria-hidden
                  className="absolute start-0 top-3 grid h-8 w-8 place-items-center rounded-full bg-charcoal text-sm font-medium text-white"
                >
                  {i + 1}
                </span>
                {i < slots.length - 1 && <span aria-hidden className="absolute start-[15px] top-12 -bottom-1 w-px bg-charcoal/15" />}
                <span className="sr-only">{fill(t.stepNumber, { n: i + 1 })}</span>
                {product ? (
                  <ProductStep product={product} isWishlisted={isWishlisted(product.id)} {...stepProps} />
                ) : (
                  <UnfilledStep slot={slot} lang={lang} t={t} onShop={onShop} />
                )}
              </li>
            );
          })}
        </ol>
      </motion.section>

      <motion.section {...enter(0.2)} aria-labelledby="weekly-title" className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 id="weekly-title" className="text-xl font-heading">
            {t.weeklyTitle}
          </h3>
          <span className="text-sm text-charcoal/70">{t.weeklyFrequency}</span>
        </div>
        {routine.weekly ? (
          <ProductStep product={routine.weekly} isWishlisted={isWishlisted(routine.weekly.id)} {...stepProps} />
        ) : (
          <UnfilledStep slot="weekly" lang={lang} t={t} onShop={onShop} />
        )}
      </motion.section>

      <motion.section {...enter(0.24)} className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5 space-y-2">
          <h3 className="flex items-center gap-2 text-base font-heading">
            <Clock aria-hidden className="h-4 w-4 text-rose-gold" />
            {t.whatToExpect}
          </h3>
          <p className="text-sm leading-relaxed text-charcoal/80">{FORECAST[personaKey][lang]}</p>
        </div>
        <div className="rounded-2xl border border-charcoal/10 bg-white p-5 space-y-2">
          <p className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-charcoal">{confidenceLabel(outcome.confidence, lang)}</span>
            <span className="text-charcoal/70">{outcome.confidence}%</span>
          </p>
          <div
            role="progressbar"
            aria-label={t.analysisConfidence}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={outcome.confidence}
            className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10"
          >
            <div className="h-full rounded-full bg-rose-gold" style={{ width: `${outcome.confidence}%` }} />
          </div>
          <p className="text-xs text-charcoal/70">{t.basedOnData}</p>
        </div>
      </motion.section>

      {tipNotes.length > 0 && (
        <motion.section {...enter(0.28)} aria-labelledby="notes-title" className="space-y-2">
          <h3 id="notes-title" className="text-base font-heading">
            {t.notesTitle}
          </h3>
          <ul className="space-y-1.5">
            {tipNotes.map((note) => (
              <li key={note} className="flex items-start gap-2 text-sm leading-relaxed text-charcoal/70">
                <Check aria-hidden className="mt-1 h-3.5 w-3.5 shrink-0 text-rose-gold" />
                {NOTES[note][lang]}
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      <p className="flex items-start gap-1.5 text-xs leading-relaxed text-charcoal/70">
        <Info aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {t.infoDisclaimer}
      </p>
    </div>
  );
};

export const SkinQuiz = ({ onClose, onAddToCart, onProductClick, onToggleWishlist, wishlistItems, onComplete, savedOutcome, onShop }: SkinQuizProps) => {
  const [lang, setLang] = useState<Lang>('en');
  const [phase, setPhase] = useState<Phase>('quiz');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [outcome, setOutcome] = useState<QuizOutcome | null>(null);
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const fade = reduceMotion ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const rise = reduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 } };

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const question = QUESTIONS[step];

  // The timer lives in an effect so closing the quiz mid-analysis cancels it and onComplete never fires late.
  useEffect(() => {
    if (phase !== 'calculating') return;
    const timer = setTimeout(() => {
      const evaluated = evaluateQuiz(answers);
      if (evaluated.ok === false) {
        console.warn('[skin-quiz] evaluate_failed', { code: evaluated.error.code, questionId: evaluated.error.questionId });
        setPhase('error');
        return;
      }
      const storage = getStorage();
      if (storage) saveQuiz(storage, evaluated.value.answers, new Date().toISOString());
      setOutcome(evaluated.value);
      setPhase('results');
      onCompleteRef.current(evaluated.value);
    }, CALCULATING_MS);
    return () => clearTimeout(timer);
  }, [phase, answers]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = 0;
    // Keyboard and screen-reader users land on the new heading instead of a vanished button.
    container.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  }, [phase, step]);

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }) as Partial<Answers>);
    if (step + 1 < QUESTIONS.length) setStep(step + 1);
    else setPhase('calculating');
  };

  const handleBack = () => {
    if (step === 0) return;
    const previous = QUESTIONS[step - 1];
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[previous.id];
      return next;
    });
    setStep(step - 1);
  };

  const retake = () => {
    setAnswers({});
    setStep(0);
    setOutcome(null);
    setPhase('quiz');
  };

  const showPrevious = () => {
    if (!savedOutcome) return;
    setOutcome(savedOutcome);
    setPhase('results');
  };

  const addFullRoutine = () => {
    if (outcome) uniqueProducts(outcome).forEach((p) => onAddToCart(toPlainProduct(p)));
  };

  const routineProducts = outcome ? uniqueProducts(outcome) : [];
  const routineTotal = routineProducts.reduce((sum, p) => sum + Math.round(p.price * 100), 0) / 100;
  const countText = routineProducts.length === 1 ? t.productCountOne : fill(t.productCount, { count: routineProducts.length });

  const primaryButton = `rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-charcoal/80 ${FOCUS}`;
  const secondaryButton = `flex items-center justify-center gap-2 rounded-full border border-charcoal/20 px-5 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/5 ${FOCUS}`;

  return (
    <div className={`h-full flex flex-col ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} lang={lang}>
      <div className="h-16 shrink-0 border-b border-charcoal/5 bg-white px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden className="h-5 w-5 text-rose-gold" />
          <h1 className="text-lg font-heading">{t.quizTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(isRTL ? 'en' : 'ar')}
            aria-label={t.switchLanguage}
            className={`rounded-full px-3 py-2 text-sm text-charcoal/70 transition-colors hover:text-charcoal ${FOCUS}`}
          >
            {isRTL ? 'English' : 'العربية'}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className={`grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-charcoal/5 ${FOCUS}`}
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            {phase === 'calculating' && (
              <motion.div
                key="calc"
                role="status"
                {...fade}
                className="flex flex-col items-center justify-center space-y-4 py-24 text-center"
              >
                <RefreshCw aria-hidden className="h-12 w-12 motion-safe:animate-spin text-rose-gold" />
                <h2 tabIndex={-1} className="text-2xl font-heading outline-none">{t.calculating}</h2>
                <p className="text-charcoal/70">{t.calculatingSub}</p>
              </motion.div>
            )}

            {phase === 'error' && (
              <motion.div
                key="error"
                role="alert"
                {...fade}
                className="flex flex-col items-center justify-center space-y-4 py-24 text-center"
              >
                <AlertCircle aria-hidden className="h-12 w-12 text-rose-gold" />
                <h2 tabIndex={-1} className="text-2xl font-heading outline-none">{t.errorTitle}</h2>
                <p className="text-charcoal/70">{t.errorBody}</p>
                <button type="button" onClick={retake} className={primaryButton}>
                  {t.retry}
                </button>
              </motion.div>
            )}

            {phase === 'quiz' && (
              <motion.div key={`q-${question.id}`} {...rise} className="space-y-8 py-6 sm:py-10">
                <div className="space-y-3 text-center">
                  <div
                    role="progressbar"
                    aria-label={t.questionProgress}
                    aria-valuemin={1}
                    aria-valuemax={QUESTIONS.length}
                    aria-valuenow={step + 1}
                    className="mx-auto h-1 w-40 overflow-hidden rounded-full bg-charcoal/10"
                  >
                    <div className="h-full bg-rose-gold motion-safe:transition-all duration-300" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
                  </div>
                  <p className="text-sm text-charcoal/70">{fill(t.questionOf, { current: step + 1, total: QUESTIONS.length })}</p>
                  <h2 tabIndex={-1} className="text-2xl sm:text-4xl font-heading leading-tight outline-none">{question.text[lang]}</h2>
                </div>

                <div className="mx-auto grid max-w-xl gap-3">
                  {getOptions(question.id, answers).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleAnswer(option.id)}
                      className={`group flex items-center justify-between gap-3 rounded-xl border border-charcoal/10 bg-white p-5 text-start transition-all hover:border-rose-gold ${FOCUS}`}
                    >
                      <span className="font-medium">{option.text[lang]}</span>
                      <ChevronRight aria-hidden className={`h-4 w-4 shrink-0 text-charcoal/30 group-hover:text-charcoal ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  ))}
                </div>

                <div className="mx-auto flex max-w-xl items-center justify-between pt-2">
                  {step > 0 ? (
                    <button type="button" onClick={handleBack} className={`rounded-full px-3 py-2 text-sm font-medium text-charcoal/70 hover:text-charcoal ${FOCUS}`}>
                      {t.back}
                    </button>
                  ) : (
                    <span />
                  )}
                  {savedOutcome && (
                    <button type="button" onClick={showPrevious} className={`rounded-full px-3 py-2 text-sm font-medium text-charcoal underline underline-offset-4 ${FOCUS}`}>
                      {t.viewPrevious}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {phase === 'results' && outcome && (
              <motion.div key="results" {...fade}>
                <Results
                  outcome={outcome}
                  lang={lang}
                  t={t}
                  wishlistItems={wishlistItems}
                  onAddToCart={onAddToCart}
                  onProductClick={onProductClick}
                  onToggleWishlist={onToggleWishlist}
                  onShop={onShop}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {phase === 'results' && outcome && (
        <div className="shrink-0 border-t border-charcoal/10 bg-white/95 px-4 sm:px-6 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-charcoal/70">{t.routineTotal}</p>
              <p className="text-base font-medium text-charcoal">
                {money(routineTotal)} <span className="text-sm font-normal text-charcoal/70">· {countText}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={retake} className={secondaryButton}>
                <RotateCcw aria-hidden className="h-4 w-4" />
                {t.retakeQuiz}
              </button>
              <button type="button" onClick={addFullRoutine} className={`${primaryButton} flex flex-1 items-center justify-center gap-2 sm:flex-none`}>
                <Plus aria-hidden className="h-4 w-4" />
                {t.addFullRoutine}
              </button>
            </div>
          </div>
        </div>
      )}

      {phase !== 'results' && (
        <div className="shrink-0 border-t border-charcoal/5 bg-white px-4 py-3 text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-charcoal/70">
            <Info aria-hidden className="h-3.5 w-3.5 shrink-0" />
            {t.infoDisclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default SkinQuiz;
