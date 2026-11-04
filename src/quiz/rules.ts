import { TAGGED_CATALOG } from './tagging';
import type { ProductFormat, Routine, RoutineSlot, SkinProfile, TaggedProduct } from './types';

/** Face-routine slots, in step order. */
export const AM_SLOTS: readonly RoutineSlot[] = ['cleanser', 'toner', 'amSerum', 'moisturizer', 'sunscreen'];
export const PM_SLOTS: readonly RoutineSlot[] = ['firstCleanse', 'cleanser', 'toner', 'pmTreatment', 'moisturizer'];

const CATEGORY: Record<RoutineSlot, string> = {
  firstCleanse: 'Cleansers',
  cleanser: 'Cleansers',
  toner: 'Toners & Essences',
  amSerum: 'Serums & Ampoules',
  pmTreatment: 'Serums & Ampoules',
  moisturizer: 'Moisturizers',
  sunscreen: 'Sun Care',
  weekly: 'Masks & Treatments',
};

/** Not face-routine products (eye, lip, spot treatments, kits, travel sticks): never recommended. */
const NEVER_ELIGIBLE: ReadonlySet<ProductFormat> = new Set(['eye', 'lip', 'spotPatch', 'trialKit', 'balmStick']);

export type RuleId = 'eligibility' | 'exclusion' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6';

/** Carries only ids, never answers, so it is safe to log. */
export interface RuleViolation {
  rule: RuleId;
  slot: RoutineSlot;
  productId: string;
}

export interface SlotEntry {
  slot: RoutineSlot;
  item: TaggedProduct;
}

/** Shared slots (toner, moisturizer) are used morning and night, so they stay free of strong actives. */
const isNeutral = (t: TaggedProduct): boolean =>
  !t.tags.has('aha') && !t.tags.has('bha') && !t.tags.has('pha') && !t.tags.has('retinoid') && !t.tags.has('vitaminC');

const isAcidExfoliant = (t: TaggedProduct): boolean =>
  t.tags.has('aha') || t.tags.has('bha') || t.tags.has('pha') || t.format === 'peelShot';

const isLeaveOnAhaBha = (t: TaggedProduct): boolean => t.leaveOnExfoliant && (t.tags.has('aha') || t.tags.has('bha'));

/** Profile-independent check: may this product ever fill this slot? */
export const isEligible = (t: TaggedProduct, slot: RoutineSlot): boolean => {
  if (NEVER_ELIGIBLE.has(t.format)) return false;
  if (t.product.category !== CATEGORY[slot]) return false;
  switch (slot) {
    case 'firstCleanse':
      return t.format === 'oilCleanser';
    case 'cleanser':
      // Vitamin C is AM-only and this cleanser is also used at night.
      return t.format !== 'oilCleanser' && !t.tags.has('vitaminC');
    case 'toner':
      return isNeutral(t);
    case 'amSerum':
      return !t.tags.has('retinoid') && !t.leaveOnExfoliant && t.format !== 'peelShot' && !t.tags.has('spicule');
    case 'pmTreatment':
      return !t.tags.has('vitaminC');
    case 'moisturizer':
      return isNeutral(t);
    case 'sunscreen':
      return true;
    case 'weekly':
      return t.format === 'mask' || t.format === 'pad';
  }
};

/** Hard safety exclusions for this user. Never relaxed to fill a slot. */
export const isExcluded = (t: TaggedProduct, profile: SkinProfile): boolean => {
  if (profile.sensitivity === 'High') {
    if (
      t.tags.has('retinoid') ||
      isLeaveOnAhaBha(t) ||
      t.format === 'peelShot' ||
      t.tags.has('spicule') ||
      t.vitaminCStrength === 'strong' ||
      (t.product.category === 'Cleansers' && t.tags.has('bha')) ||
      (t.format === 'pad' && (t.tags.has('aha') || t.tags.has('bha') || t.tags.has('pha')))
    ) {
      return true;
    }
  }
  if (!profile.retinoidSafe) {
    // Retinoids, bakuchiol (too little pregnancy data) and leave-on salicylic acid. Wash-off BHA is allowed.
    if (t.tags.has('retinoid') || t.tags.has('bakuchiol') || (t.leaveOnExfoliant && t.tags.has('bha'))) return true;
  }
  if (profile.strengthCeiling === 'gentle') {
    if (
      t.retinoidStrength === 'moderate' ||
      t.retinoidStrength === 'strong' ||
      t.vitaminCStrength === 'strong' ||
      t.format === 'peelShot' ||
      t.tags.has('spicule')
    ) {
      return true;
    }
  }
  if (profile.strengthCeiling === 'moderate' && t.retinoidStrength === 'strong') return true;
  return false;
};

/**
 * Checks eligibility, exclusions and conflict rules R1-R4 and R6 over a set of picked products.
 * R5 (sunscreen last) is positional, so it is checked in `validateRoutine`.
 * This is the single implementation: the builder uses it to accept candidates, the validator to audit.
 */
export const findViolations = (entries: readonly SlotEntry[], profile: SkinProfile): RuleViolation[] => {
  const violations: RuleViolation[] = [];
  const add = (rule: RuleId, e: SlotEntry): void => {
    violations.push({ rule, slot: e.slot, productId: e.item.product.id });
  };

  const seen = new Map<string, RoutineSlot>();
  let dailyExfoliants = 0;
  let pmTreatment: SlotEntry | undefined;
  let weekly: SlotEntry | undefined;

  for (const e of entries) {
    if (!isEligible(e.item, e.slot)) add('eligibility', e);
    if (isExcluded(e.item, profile)) add('exclusion', e);
    if (AM_SLOTS.includes(e.slot) && e.item.tags.has('retinoid')) add('R1', e);
    if (PM_SLOTS.includes(e.slot) && e.item.tags.has('vitaminC')) add('R2', e);

    if (e.slot !== 'weekly' && isLeaveOnAhaBha(e.item)) {
      dailyExfoliants += 1;
      if (dailyExfoliants > 1) add('R3', e);
    }
    if (e.slot === 'pmTreatment') pmTreatment = e;
    if (e.slot === 'weekly') weekly = e;

    const prior = seen.get(e.item.product.id);
    if (prior !== undefined && prior !== e.slot) add('R6', e);
    seen.set(e.item.product.id, e.slot);
  }

  if (
    pmTreatment &&
    weekly &&
    (pmTreatment.item.tags.has('retinoid') || isAcidExfoliant(pmTreatment.item)) &&
    isAcidExfoliant(weekly.item)
  ) {
    add('R4', weekly);
  }
  return violations;
};

const lookupCache = new WeakMap<readonly TaggedProduct[], Map<string, TaggedProduct>>();

/** Product lookup by id, cached per catalog instance. */
export const indexById = (catalog: readonly TaggedProduct[]): Map<string, TaggedProduct> => {
  let map = lookupCache.get(catalog);
  if (!map) {
    map = new Map(catalog.map((t) => [t.product.id, t]));
    lookupCache.set(catalog, map);
  }
  return map;
};

/** Re-checks a finished routine against every rule. Returns [] when the routine is safe and consistent. */
export const validateRoutine = (
  routine: Routine,
  profile: SkinProfile,
  catalog: readonly TaggedProduct[] = TAGGED_CATALOG,
): RuleViolation[] => {
  const byId = indexById(catalog);
  const violations: RuleViolation[] = [];
  const entries: SlotEntry[] = [];
  const chosen = new Map<RoutineSlot, string>();

  const all = [...routine.AM, ...routine.PM, ...(routine.weekly ? [routine.weekly] : [])];
  for (const rp of all) {
    const item = byId.get(rp.id);
    if (!item) {
      violations.push({ rule: 'eligibility', slot: rp.slot, productId: rp.id });
      continue;
    }
    const prior = chosen.get(rp.slot);
    if (prior === undefined) {
      chosen.set(rp.slot, rp.id);
      entries.push({ slot: rp.slot, item });
    } else if (prior !== rp.id) {
      // A shared slot must hold the same product in the morning and at night.
      violations.push({ rule: 'R6', slot: rp.slot, productId: rp.id });
    }
  }

  const lastAm = routine.AM[routine.AM.length - 1];
  const sunscreen = routine.AM.find((p) => p.slot === 'sunscreen');
  if (sunscreen && lastAm !== sunscreen) {
    violations.push({ rule: 'R5', slot: 'sunscreen', productId: sunscreen.id });
  }

  return [...violations, ...findViolations(entries, profile)];
};
