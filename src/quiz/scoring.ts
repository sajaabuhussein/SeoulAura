import { impliedConcerns } from './profile';
import type { ActiveTag, Concern, ReasonCode, RoutineSlot, SkinProfile, SkinType, TaggedProduct } from './types';

export interface ScoreResult {
  score: number;
  /** Highest score this profile could earn in this slot, so score / max is an honest percentage. */
  max: number;
  /** One or two reasons, never empty. */
  reasons: ReasonCode[];
}

type Period = 'AM' | 'PM' | 'weekly';

interface ActiveRule {
  tag: ActiveTag;
  /** The active only counts in this part of the routine. */
  only?: Period;
  /** Helpful but not a core treatment for the concern. */
  weak?: boolean;
}

const a = (tag: ActiveTag, only?: Period, weak?: boolean): ActiveRule => ({ tag, only, weak });

/** Ordered by how directly the active treats the concern; the first match is the one shown to the user. */
const CONCERN_ACTIVES: Record<Concern, readonly ActiveRule[]> = {
  breakouts: [a('bha'), a('azelaic'), a('niacinamide'), a('antiAcne'), a('soothing'), a('retinoid', 'PM')],
  pores_texture: [a('bha'), a('aha'), a('pha'), a('niacinamide'), a('retinoid'), a('clay', 'weekly')],
  dark_spots: [
    a('vitaminC', 'AM'),
    a('txa'),
    a('niacinamide'),
    a('kojic'),
    a('azelaic'),
    a('glutathione'),
    a('aha', 'PM'),
    a('retinoid'),
  ],
  dullness: [a('vitaminC'), a('aha'), a('pha'), a('niacinamide'), a('rice'), a('glutathione')],
  fine_lines: [
    a('retinoid'),
    a('bakuchiol'),
    a('peptide'),
    a('pdrn'),
    a('vitaminC', 'AM'),
    a('collagen', undefined, true),
  ],
  dryness_barrier: [a('barrier'), a('humectant'), a('pdrn')],
  redness: [a('soothing'), a('azelaic'), a('barrier')],
};

const PRIMARY_WEIGHT = 15;
const SECONDARY_WEIGHT = 8;
const IMPLIED_WEIGHT = 4;
const WEAK_SCALE = 0.3;

const EXACT_TYPE_POINTS = 10;
const ALL_TYPE_POINTS = 4;
const OPPOSITE_TYPE_POINTS = -6;
const CONDITION_POINTS = 8;
const ROLE_POINTS = 6;
// Evidence-based priority for the night treatment: retinoids for fine lines, BHA or azelaic for active breakouts.
const PRIORITY_POINTS = 6;
const MIST_TONER_PENALTY = 10;

const AM_ROLE_TAGS: readonly ActiveTag[] = ['vitaminC', 'niacinamide', 'txa', 'soothing', 'humectant'];

const periodOf = (slot: RoutineSlot): Period | null => {
  if (slot === 'amSerum' || slot === 'sunscreen') return 'AM';
  if (slot === 'pmTreatment') return 'PM';
  if (slot === 'weekly') return 'weekly';
  return null;
};

const hasRole = (slot: RoutineSlot): boolean => slot === 'amSerum' || slot === 'pmTreatment' || slot === 'weekly';

/** Best active of the product for the concern in this slot, or null. Strong matches beat weak ones. */
const matchConcern = (t: TaggedProduct, concern: Concern, slot: RoutineSlot): ActiveRule | null => {
  const period = periodOf(slot);
  let weakMatch: ActiveRule | null = null;
  for (const rule of CONCERN_ACTIVES[concern]) {
    if (!t.tags.has(rule.tag)) continue;
    if (rule.only !== undefined && rule.only !== period) continue;
    if (!rule.weak) return rule;
    weakMatch ??= rule;
  }
  return weakMatch;
};

/** Concerns to score, with their weights: primary, then secondary, then implied ones not already listed. */
const weightedConcerns = (profile: SkinProfile): Array<{ concern: Concern; weight: number }> => {
  const list = [{ concern: profile.primary, weight: PRIMARY_WEIGHT }];
  if (profile.secondary) list.push({ concern: profile.secondary, weight: SECONDARY_WEIGHT });
  for (const concern of impliedConcerns(profile)) {
    if (!list.some((w) => w.concern === concern)) list.push({ concern, weight: IMPLIED_WEIGHT });
  }
  return list;
};

/** Condition labels from the catalog's `skinType` vocabulary that apply to this user. */
const applicableConditions = (profile: SkinProfile): string[] => {
  const goals = [profile.primary, profile.secondary];
  const wants = (c: Concern): boolean => goals.includes(c);
  const labels: string[] = [];
  if (profile.sensitivity !== 'Low') labels.push('Sensitive');
  if (profile.acne !== 'None' || wants('breakouts')) labels.push('Acne-Prone');
  if (wants('fine_lines')) labels.push('Mature');
  if (wants('dullness') || wants('dark_spots')) labels.push('Dull');
  if (wants('pores_texture')) labels.push('Large Pores');
  if (profile.dehydrated || wants('dryness_barrier')) labels.push('Dehydrated');
  if (wants('redness') || profile.sensitivity === 'High') labels.push('Redness');
  return labels;
};

const OPPOSITE: Partial<Record<SkinType, SkinType>> = { Oily: 'Dry', Dry: 'Oily' };

interface TypeFit {
  points: number;
  reason: ReasonCode | null;
}

const typeFit = (t: TaggedProduct, profile: SkinProfile, conditions: readonly string[]): TypeFit => {
  const labels = t.product.skinType;
  const exact = labels.includes(profile.skinType);
  const forAll = labels.includes('All');
  let points = 0;
  let reason: ReasonCode | null = null;

  if (exact) {
    points += EXACT_TYPE_POINTS;
    reason = { code: 'skinTypeFit', skinType: profile.skinType, exact: true };
  } else if (forAll) {
    points += ALL_TYPE_POINTS;
    reason = { code: 'skinTypeFit', skinType: profile.skinType, exact: false };
  } else {
    const opposite = OPPOSITE[profile.skinType];
    if (opposite && labels.includes(opposite)) points += OPPOSITE_TYPE_POINTS;
  }
  points += CONDITION_POINTS * conditions.filter((c) => labels.includes(c)).length;
  return { points, reason };
};

const wantsRetinoidPriority = (profile: SkinProfile, slot: RoutineSlot): boolean =>
  slot === 'pmTreatment' && profile.primary === 'fine_lines' && profile.retinoidSafe && profile.sensitivity !== 'High';

const wantsAcnePriority = (profile: SkinProfile, slot: RoutineSlot): boolean =>
  slot === 'pmTreatment' && profile.sensitivity !== 'High' && (profile.acne === 'Active' || profile.primary === 'breakouts');

const priorityMax = (profile: SkinProfile, slot: RoutineSlot): number =>
  wantsRetinoidPriority(profile, slot) || wantsAcnePriority(profile, slot) ? PRIORITY_POINTS : 0;

const priorityBonus = (t: TaggedProduct, profile: SkinProfile, slot: RoutineSlot): number => {
  if (wantsRetinoidPriority(profile, slot) && t.tags.has('retinoid')) return PRIORITY_POINTS;
  if (wantsAcnePriority(profile, slot) && (t.tags.has('azelaic') || (t.tags.has('bha') && t.leaveOnExfoliant))) {
    return PRIORITY_POINTS;
  }
  return 0;
};

/**
 * Scores one eligible, non-excluded candidate for a slot. Pure and deterministic: the same inputs
 * always give the same score, so ties are resolved by the caller using stable keys.
 */
export const scoreFor = (t: TaggedProduct, profile: SkinProfile, slot: RoutineSlot): ScoreResult => {
  const conditions = applicableConditions(profile);
  const weights = weightedConcerns(profile);

  const fit = typeFit(t, profile, conditions);
  let score = fit.points;
  let max = EXACT_TYPE_POINTS + CONDITION_POINTS * conditions.length;

  let concernReason: ReasonCode | null = null;
  let primaryMatched = false;
  let secondaryMatched = false;
  for (const { concern, weight } of weights) {
    max += weight;
    const match = matchConcern(t, concern, slot);
    if (!match) continue;
    score += match.weak ? weight * WEAK_SCALE : weight;
    concernReason ??= { code: 'targetsConcern', concern, active: match.tag };
    if (concern === profile.primary) primaryMatched = true;
    if (concern === profile.secondary) secondaryMatched = true;
  }

  if (hasRole(slot)) {
    max += ROLE_POINTS;
    const roleFit =
      slot === 'amSerum'
        ? AM_ROLE_TAGS.some((tag) => t.tags.has(tag))
        : slot === 'pmTreatment'
          ? primaryMatched
          : primaryMatched || secondaryMatched;
    if (roleFit) score += ROLE_POINTS;
  }

  max += priorityMax(profile, slot);
  score += priorityBonus(t, profile, slot);

  if (t.tags.has('irritantSoft') && profile.sensitivity === 'High') score -= 5;
  if (profile.sensitivity === 'Medium' && t.retinoidStrength !== null && t.retinoidStrength === profile.strengthCeiling) {
    score -= 4;
  }
  if (slot === 'toner' && t.format === 'mist') score -= MIST_TONER_PENALTY;
  if (t.format === 'sunStick') score -= 8;

  return { score, max, reasons: buildReasons(t, profile, slot, concernReason, fit.reason) };
};

/** At most two reasons, most specific first. `slotRole` is always last so the list is never empty. */
const buildReasons = (
  t: TaggedProduct,
  profile: SkinProfile,
  slot: RoutineSlot,
  concernReason: ReasonCode | null,
  typeReason: ReasonCode | null,
): ReasonCode[] => {
  const candidates: Array<ReasonCode | null> = [
    !profile.retinoidSafe && slot === 'pmTreatment' ? { code: 'pregnancySafeChoice' } : null,
    concernReason,
    slot === 'sunscreen' ? { code: 'dailySpf', sun: profile.sunExposure } : null,
    slot === 'firstCleanse' ? { code: 'doubleCleanse' } : null,
    typeReason,
    profile.sensitivity !== 'Low' && (t.tags.has('soothing') || t.tags.has('barrier'))
      ? { code: 'gentleForSensitive' }
      : null,
    { code: 'slotRole', slot },
  ];
  return candidates.filter((r): r is ReasonCode => r !== null).slice(0, 2);
};
