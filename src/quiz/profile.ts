import { QUESTIONS, isValidOption } from './questions';
import { err, ok, type Result } from './result';
import type {
  AcneLevel,
  Answers,
  Concern,
  Level,
  PersonaKey,
  QuestionId,
  QuizError,
  SkinProfile,
  SkinType,
  Strength,
} from './types';

const SKIN_TYPE: Record<Answers['oil'], SkinType> = {
  tight_flaky: 'Dry',
  comfortable: 'Normal',
  tzone: 'Combination',
  shiny_all: 'Oily',
};

const SENSITIVITY: Record<Answers['reactivity'], Level> = {
  very_easily: 'High',
  new_products: 'Medium',
  rarely: 'Low',
};

const ACNE: Record<Answers['breakouts'], AcneLevel> = {
  constant: 'Active',
  occasional: 'Occasional',
  rarely: 'None',
};

const STRENGTH_CEILING: Record<Answers['experience'], Strength> = {
  never: 'gentle',
  occasionally: 'moderate',
  regularly: 'strong',
};

const PERSONA: Record<Concern, PersonaKey> = {
  breakouts: 'clearPath',
  pores_texture: 'clearPath',
  dark_spots: 'glowSeeker',
  dullness: 'glowSeeker',
  fine_lines: 'youthGuardian',
  dryness_barrier: 'barrierBuilder',
  redness: 'sensitiveSoul',
};

const BASE_CONFIDENCE = 95;
const MIN_CONFIDENCE = 40;
const UNMATCHED_SLOT_PENALTY = 3;

/** Answer pairs that rarely go together, with the confidence they cost. */
const CONTRADICTIONS: ReadonlyArray<{ penalty: number; applies: (a: Answers) => boolean }> = [
  { penalty: 15, applies: (a) => a.oil === 'tight_flaky' && a.hydration === 'never_tight' },
  { penalty: 15, applies: (a) => a.primary === 'redness' && a.reactivity === 'rarely' },
  { penalty: 15, applies: (a) => a.primary === 'breakouts' && a.breakouts === 'rarely' },
  { penalty: 10, applies: (a) => a.primary === 'dryness_barrier' && a.oil === 'shiny_all' },
  // Plausible for dehydrated oily skin, so only a small penalty.
  { penalty: 5, applies: (a) => a.oil === 'shiny_all' && a.hydration === 'tight_fast' },
];

/**
 * Validates untrusted answers against the question allow-list and derives the skin profile.
 * Returns an error value (never throws) when an answer is missing or not an offered option.
 */
export const deriveProfile = (input: Readonly<Partial<Record<QuestionId, unknown>>>): Result<SkinProfile, QuizError> => {
  for (const question of QUESTIONS) {
    if (!Object.hasOwn(input, question.id) || input[question.id] === undefined) {
      return err({ code: 'incomplete', questionId: question.id });
    }
    if (!isValidOption(question.id, input[question.id])) {
      return err({ code: 'invalid_answer', questionId: question.id });
    }
  }
  // Every option id was validated above, so the narrowing is safe.
  const a = input as unknown as Answers;
  if (a.secondary === a.primary) return err({ code: 'invalid_answer', questionId: 'secondary' });

  const skinType = SKIN_TYPE[a.oil];
  const dehydrated =
    (a.hydration === 'tight_fast' || a.hydration === 'slightly_tight') && skinType !== 'Dry';

  return ok({
    skinType,
    dehydrated,
    sensitivity: SENSITIVITY[a.reactivity],
    acne: ACNE[a.breakouts],
    primary: a.primary,
    secondary: a.secondary === 'none' ? null : a.secondary,
    sunExposure: a.sun,
    strengthCeiling: STRENGTH_CEILING[a.experience],
    // "Prefer not to say" is treated like "yes": the safe default for retinoids.
    retinoidSafe: a.pregnancy === 'no',
  });
};

/** Concerns implied by other answers. They score at a reduced weight and are never shown as goals. */
export const impliedConcerns = (profile: SkinProfile): Concern[] => {
  const implied: Concern[] = [];
  if (profile.acne === 'Active') implied.push('breakouts');
  if (profile.sensitivity === 'High') implied.push('redness');
  return implied;
};

/** Every primary concern maps to exactly one persona, so there is no fall-through. */
export const personaFor = (profile: SkinProfile): PersonaKey => PERSONA[profile.primary];

/**
 * Confidence in whole percent, in [40, 95]. Starts high, loses points for contradictory answers
 * and for routine steps where the catalog had no skin-type or concern match.
 */
export const computeConfidence = (answers: Answers, unmatchedSlots = 0): number => {
  const contradictions = CONTRADICTIONS.reduce((sum, c) => (c.applies(answers) ? sum + c.penalty : sum), 0);
  const raw = BASE_CONFIDENCE - contradictions - UNMATCHED_SLOT_PENALTY * unmatchedSlots;
  return Math.round(Math.min(BASE_CONFIDENCE, Math.max(MIN_CONFIDENCE, raw)));
};
