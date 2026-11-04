import { PRODUCTS } from '../data';
import type { Product } from '../types';
import type { ProductFormat, ProductTags, Strength, Tag, TaggedProduct } from './types';

/**
 * Ingredient keywords per tag. Each entry is a regex source matched case-insensitively with
 * non-alphanumeric boundaries against single ingredient entries. The bare word "acid" is never a
 * keyword: hyaluronic, tranexamic, azelaic, kojic and hypochlorous acid each have their own entry.
 */
const INGREDIENT_KEYWORDS: Record<Exclude<Tag, 'irritantSoft'>, readonly string[]> = {
  retinoid: ['retinol', 'retinal', 'hpr', 'retinyl', 'retinoate', 'retinoic', 'tretinoin'],
  bakuchiol: ['bakuchiol'],
  bha: ['bha', 'salicylic acid', 'betaine salicylate', 'willow bark'],
  aha: ['aha', 'glycolic acid'],
  pha: ['pha', 'gluconolactone'],
  vitaminC: ['vitamin c', 'ethyl ascorbic acid'],
  niacinamide: ['niacinamide'],
  txa: ['tranexamic acid', 'txa'],
  azelaic: ['azelaic acid'],
  kojic: ['kojic acid'],
  glutathione: ['glutathione'],
  soothing: [
    'centella',
    'cica',
    'madeca complex',
    'teca',
    'centellac-rx',
    'heartleaf',
    'panthenol',
    'allantoin',
    'ectoin',
    'mugwort',
    'aloe',
    'green tea',
    'hypochlorous acid',
    'portulaca oleracea',
  ],
  barrier: ['ceramides?', 'squalane', 'shea butter', 'panthenol', 'trehalose'],
  humectant: [
    'hyaluronic acid',
    'sodium hyaluronate',
    'hyalu',
    'glycerin',
    'betaine(?! salicylate)',
    'snail secretion filtrate',
    'snail mucin',
    'snow mushroom',
  ],
  peptide: ['peptides?', 'peptide complex', 'acetyl hexapeptide-8', 'matrixyl 3000', 'adenosine'],
  pdrn: ['pdrn', 'nad\\+', 'nmn', 'exosome'],
  collagen: ['collagen', 'elastin'],
  antiAcne: ['tea tree', 'zinc pca', 'propolis'],
  rice: ['rice extract', 'rice bran water'],
  clay: ['kaolin', 'bentonite', 'clays?'],
  spicule: ['reedle', 'spicule'],
};

/** Keywords matched on name + description in addition to ingredients. */
const TEXT_KEYWORDS: Partial<Record<Tag, readonly string[]>> = {
  retinoid: ['retinoid'],
  aha: ['aha', '4 acids'],
  vitaminC: ['vitamin c'],
  spicule: ['spicule', 'reedle'],
};

/** Ingredients that irritate reactive skin more often than others (soft penalty only). */
const IRRITANT_KEYWORDS: readonly string[] = ['tea tree oil', 'witch hazel', 'kojic acid', 'azelaic acid'];
const IRRITANT_NIACINAMIDE_PERCENT = 15;

/**
 * Strength by product id. Unknown retinoid/vitamin C products default to "strong" so a new catalog
 * entry can never be recommended to a beginner before someone has rated it (a test enforces coverage).
 */
export const RETINOID_STRENGTH: Readonly<Record<string, Strength>> = {
  'cosrx-retinol-01': 'gentle',
  'celimax-retinal': 'moderate',
  'cosrx-retinol-05-oil': 'strong',
  'epii-hpr-pro-shot': 'strong',
  'skin1004-retinol-boosting-shot': 'strong',
  'somebymi-retinol-serum': 'strong',
  'somebymi-retinol-trial-kit': 'strong',
  'numbuzin-eye-cream': 'strong',
  'somebymi-retinol-eye-cream': 'strong',
};

export const VITAMIN_C_STRENGTH: Readonly<Record<string, Strength>> = {
  'cosrx-vitamin-c-23-serum': 'strong',
  'medicube-age-r-vita-c-pro': 'strong',
  'cosrx-vit-c-13': 'moderate',
  'arencia-vitamin-c-booster': 'gentle',
  'dr-althea-vit-c': 'gentle',
  'dr-althea-gentle-vitamin-c': 'gentle',
  'eqqualberry-vitamin-cream': 'gentle',
  'eqqualberry-vitamin-serum': 'gentle',
  'medicube-glutathione': 'gentle',
  'medicube-c-capsule-cream': 'gentle',
  'skin1004-tone-brightening-gel-foam': 'gentle',
  'laneige-lip-mask': 'gentle',
};

const bounded = (sources: readonly string[]): RegExp =>
  new RegExp(`(?<![a-z0-9])(?:${sources.join('|')})(?![a-z0-9])`, 'i');

const INGREDIENT_PATTERNS = (Object.keys(INGREDIENT_KEYWORDS) as Array<keyof typeof INGREDIENT_KEYWORDS>).map(
  (tag) => ({ tag, pattern: bounded(INGREDIENT_KEYWORDS[tag]) }),
);
const TEXT_PATTERNS = (Object.keys(TEXT_KEYWORDS) as Tag[]).map((tag) => ({
  tag,
  pattern: bounded(TEXT_KEYWORDS[tag] ?? []),
}));
const IRRITANT_PATTERN = bounded(IRRITANT_KEYWORDS);
const NIACINAMIDE_PERCENT_PATTERN = /niacinamide\s*(\d+(?:\.\d+)?)\s*%/i;

/** First matching rule wins, so each product gets exactly one format. */
const detectFormat = (product: Product): ProductFormat => {
  const { name, category, ingredients } = product;
  if (ingredients.some((i) => /hydrocolloid/i.test(i))) return 'spotPatch';
  if (/trial kit/i.test(name)) return 'trialKit';
  if (/\beye\b/i.test(name)) return 'eye';
  if (/\blip\b/i.test(name)) return 'lip';
  if (category === 'Moisturizers' && /multi balm/i.test(name)) return 'balmStick';
  if (category === 'Sun Care' && /stick/i.test(name)) return 'sunStick';
  if (category === 'Cleansers' && /cleansing oil|cleansing balm/i.test(name)) return 'oilCleanser';
  if (/peel shot/i.test(name)) return 'peelShot';
  if (/\b(?:mist|spray)\b/i.test(name)) return 'mist';
  if (/\bpad\b/i.test(name)) return 'pad';
  if (category === 'Masks & Treatments') return 'mask';
  return 'standard';
};

/** Infers actives, format and strengths for one product from its catalog text. */
export const tagProduct = (product: Product): TaggedProduct => {
  const text = `${product.name} ${product.description ?? ''}`;
  const tags = new Set<Tag>();

  for (const { tag, pattern } of INGREDIENT_PATTERNS) {
    if (product.ingredients.some((i) => pattern.test(i))) tags.add(tag);
  }
  for (const { tag, pattern } of TEXT_PATTERNS) {
    if (pattern.test(text)) tags.add(tag);
  }

  let niacinamidePercent: number | null = null;
  for (const ingredient of product.ingredients) {
    const match = NIACINAMIDE_PERCENT_PATTERN.exec(ingredient);
    if (match) niacinamidePercent = Number(match[1]);
  }

  if (
    product.ingredients.some((i) => IRRITANT_PATTERN.test(i)) ||
    (niacinamidePercent !== null && niacinamidePercent >= IRRITANT_NIACINAMIDE_PERCENT)
  ) {
    tags.add('irritantSoft');
  }

  const format = detectFormat(product);
  const hasAcid = tags.has('aha') || tags.has('bha') || tags.has('pha');
  const info: ProductTags = {
    tags,
    format,
    retinoidStrength: tags.has('retinoid') ? (RETINOID_STRENGTH[product.id] ?? 'strong') : null,
    vitaminCStrength: tags.has('vitaminC') ? (VITAMIN_C_STRENGTH[product.id] ?? 'strong') : null,
    leaveOnExfoliant: hasAcid && product.category !== 'Cleansers' && !tags.has('clay'),
    niacinamidePercent,
  };
  return { product, ...info };
};

/** The whole catalog, tagged once at module load. */
export const TAGGED_CATALOG: readonly TaggedProduct[] = PRODUCTS.map(tagProduct);
