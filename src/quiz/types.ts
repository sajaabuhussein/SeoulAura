import type { Product } from '../types';

export type Lang = 'en' | 'ar';
export type Bilingual = Record<Lang, string>;

export type Concern =
  | 'breakouts'
  | 'dark_spots'
  | 'dullness'
  | 'fine_lines'
  | 'dryness_barrier'
  | 'redness'
  | 'pores_texture';

export type QuestionId =
  | 'oil'
  | 'hydration'
  | 'reactivity'
  | 'breakouts'
  | 'primary'
  | 'secondary'
  | 'sun'
  | 'experience'
  | 'pregnancy';

/** One chosen option id per question. Values are validated against QUESTIONS before use. */
export interface Answers {
  oil: 'tight_flaky' | 'comfortable' | 'tzone' | 'shiny_all';
  hydration: 'tight_fast' | 'slightly_tight' | 'comfortable' | 'never_tight';
  reactivity: 'very_easily' | 'new_products' | 'rarely';
  breakouts: 'constant' | 'occasional' | 'rarely';
  primary: Concern;
  secondary: Concern | 'none';
  sun: 'high' | 'moderate' | 'low';
  experience: 'never' | 'occasionally' | 'regularly';
  pregnancy: 'yes' | 'no' | 'prefer_not';
}

export type SkinType = 'Dry' | 'Normal' | 'Combination' | 'Oily';
export type Level = 'Low' | 'Medium' | 'High';
export type AcneLevel = 'None' | 'Occasional' | 'Active';
export type Strength = 'gentle' | 'moderate' | 'strong';
export type SunExposure = 'high' | 'moderate' | 'low';

export interface SkinProfile {
  skinType: SkinType;
  dehydrated: boolean;
  sensitivity: Level;
  acne: AcneLevel;
  primary: Concern;
  secondary: Concern | null;
  sunExposure: SunExposure;
  /** Highest active strength the user's experience allows. */
  strengthCeiling: Strength;
  /** False when pregnant, breastfeeding, trying, or unwilling to say. */
  retinoidSafe: boolean;
}

export type QuizError = { code: 'incomplete' | 'invalid_answer'; questionId: QuestionId };

export type Tag =
  | 'retinoid'
  | 'bakuchiol'
  | 'bha'
  | 'aha'
  | 'pha'
  | 'vitaminC'
  | 'niacinamide'
  | 'txa'
  | 'azelaic'
  | 'kojic'
  | 'glutathione'
  | 'soothing'
  | 'barrier'
  | 'humectant'
  | 'peptide'
  | 'pdrn'
  | 'collagen'
  | 'antiAcne'
  | 'rice'
  | 'clay'
  | 'spicule'
  | 'irritantSoft';

/** Tags that describe a treatment active (everything except the caution flag). */
export type ActiveTag = Exclude<Tag, 'irritantSoft'>;

export type ProductFormat =
  | 'eye'
  | 'lip'
  | 'spotPatch'
  | 'trialKit'
  | 'sunStick'
  | 'balmStick'
  | 'oilCleanser'
  | 'mist'
  | 'pad'
  | 'peelShot'
  | 'mask'
  | 'standard';

/** Everything the rules and scoring need to know about a product, inferred from catalog text. */
export interface ProductTags {
  tags: ReadonlySet<Tag>;
  format: ProductFormat;
  retinoidStrength: Strength | null;
  vitaminCStrength: Strength | null;
  /** Acid exfoliant that stays on the skin (not a cleanser, not a rinse-off clay mask). */
  leaveOnExfoliant: boolean;
  /** Niacinamide percentage when the catalog states one. */
  niacinamidePercent: number | null;
}

export type TaggedProduct = ProductTags & { product: Product };

export type RoutineSlot =
  | 'firstCleanse'
  | 'cleanser'
  | 'toner'
  | 'amSerum'
  | 'pmTreatment'
  | 'moisturizer'
  | 'sunscreen'
  | 'weekly';

export type ReasonCode =
  | { code: 'skinTypeFit'; skinType: SkinType; exact: boolean }
  | { code: 'targetsConcern'; concern: Concern; active: ActiveTag }
  | { code: 'gentleForSensitive' }
  | { code: 'slotRole'; slot: RoutineSlot }
  | { code: 'dailySpf'; sun: SunExposure }
  | { code: 'doubleCleanse' }
  | { code: 'pregnancySafeChoice' };

export type RecommendedProduct = Product & {
  slot: RoutineSlot;
  matchPercentage: number;
  reasons: ReasonCode[];
};

export interface Routine {
  AM: RecommendedProduct[];
  PM: RecommendedProduct[];
  weekly: RecommendedProduct | null;
  unfilled: RoutineSlot[];
}

export type PersonaKey =
  | 'clearPath'
  | 'glowSeeker'
  | 'youthGuardian'
  | 'barrierBuilder'
  | 'sensitiveSoul';

export type NoteCode = 'pregnancyRetinoidFree' | 'patchTest' | 'reapplySpf' | 'introduceSlowly';

export interface QuizOutcome {
  answers: Answers;
  profile: SkinProfile;
  confidence: number;
  personaKey: PersonaKey;
  routine: Routine;
  notes: NoteCode[];
}
