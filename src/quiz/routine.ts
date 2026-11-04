import { findViolations, isEligible, isExcluded, validateRoutine, type SlotEntry } from './rules';
import { scoreFor } from './scoring';
import { TAGGED_CATALOG } from './tagging';
import type { RecommendedProduct, Routine, RoutineSlot, SkinProfile, TaggedProduct } from './types';

/**
 * Fill order matters: sunscreen first (never skipped), then the shared steps, and the PM treatment
 * before the AM serum so the concern active lands at night and the morning serum takes the
 * antioxidant or soothing role.
 */
const FILL_ORDER: readonly RoutineSlot[] = [
  'sunscreen',
  'moisturizer',
  'toner',
  'cleanser',
  'firstCleanse',
  'pmTreatment',
  'amSerum',
  'weekly',
];

const AM_ORDER: readonly RoutineSlot[] = ['cleanser', 'toner', 'amSerum', 'moisturizer', 'sunscreen'];
const PM_ORDER: readonly RoutineSlot[] = ['firstCleanse', 'cleanser', 'toner', 'pmTreatment', 'moisturizer'];

interface Scored {
  item: TaggedProduct;
  score: number;
  max: number;
  reasons: RecommendedProduct['reasons'];
}

const eligibleCache = new WeakMap<readonly TaggedProduct[], Map<RoutineSlot, TaggedProduct[]>>();

/** Profile-independent candidates per slot, computed once per catalog. */
const eligibleFor = (catalog: readonly TaggedProduct[], slot: RoutineSlot): TaggedProduct[] => {
  let bySlot = eligibleCache.get(catalog);
  if (!bySlot) {
    bySlot = new Map();
    eligibleCache.set(catalog, bySlot);
  }
  let list = bySlot.get(slot);
  if (!list) {
    list = catalog.filter((t) => isEligible(t, slot));
    bySlot.set(slot, list);
  }
  return list;
};

/**
 * Deterministic order that does not depend on catalog order: score, then rating (missing rating
 * counts as lowest), then id with a plain comparison (locale-independent).
 */
const compareScored = (x: Scored, y: Scored): number => {
  if (y.score !== x.score) return y.score - x.score;
  const rx = x.item.product.rating ?? -1;
  const ry = y.item.product.rating ?? -1;
  if (ry !== rx) return ry - rx;
  const ix = x.item.product.id;
  const iy = y.item.product.id;
  return ix < iy ? -1 : ix > iy ? 1 : 0;
};

const toRecommended = (s: Scored, slot: RoutineSlot): RecommendedProduct => ({
  ...s.item.product,
  slot,
  // Honest percentage of the best score this profile could earn in this slot (no floor, no cap).
  matchPercentage: Math.round((100 * Math.min(Math.max(s.score, 0), s.max)) / s.max),
  reasons: s.reasons,
});

/**
 * Greedy, deterministic routine builder. Each slot takes its best-scoring eligible product that
 * keeps every safety and conflict rule satisfied given the slots already picked. Safety rules are
 * never relaxed: if no candidate passes, the slot is reported in `unfilled`.
 */
export const buildRoutine = (profile: SkinProfile, catalog: readonly TaggedProduct[] = TAGGED_CATALOG): Routine => {
  const picked = new Map<RoutineSlot, RecommendedProduct>();
  const entries: SlotEntry[] = [];

  for (const slot of FILL_ORDER) {
    const ranked: Scored[] = eligibleFor(catalog, slot)
      .filter((t) => !isExcluded(t, profile))
      .map((item) => ({ item, ...scoreFor(item, profile, slot) }))
      .sort(compareScored);

    const winner = ranked.find((s) => findViolations([...entries, { slot, item: s.item }], profile).length === 0);
    if (!winner) continue;
    entries.push({ slot, item: winner.item });
    picked.set(slot, toRecommended(winner, slot));
  }

  const assemble = (): Routine => {
    const collect = (order: readonly RoutineSlot[]): RecommendedProduct[] =>
      order.flatMap((slot) => picked.get(slot) ?? []);
    return {
      AM: collect(AM_ORDER),
      PM: collect(PM_ORDER),
      weekly: picked.get('weekly') ?? null,
      unfilled: FILL_ORDER.filter((slot) => !picked.has(slot)),
    };
  };

  // Defence in depth: the loop above already rejects violating candidates, so this should never
  // fire. If it does, drop the offending slots rather than show an unsafe routine. Logs ids only.
  for (const v of validateRoutine(assemble(), profile, catalog)) {
    console.warn('[skin-quiz] rule_violation', { rule: v.rule, slot: v.slot });
    picked.delete(v.slot);
  }
  return assemble();
};

/** Number of routine steps whose product has neither a skin-type nor a concern match. */
export const countUnmatchedSlots = (routine: Routine): number => {
  const bySlot = new Map<RoutineSlot, RecommendedProduct>();
  for (const p of [...routine.AM, ...routine.PM, ...(routine.weekly ? [routine.weekly] : [])]) bySlot.set(p.slot, p);
  let unmatched = 0;
  for (const p of bySlot.values()) {
    if (!p.reasons.some((r) => r.code === 'skinTypeFit' || r.code === 'targetsConcern')) unmatched += 1;
  }
  return unmatched;
};
