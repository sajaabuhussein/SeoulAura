import type { Product } from '../types';

/**
 * Strips quiz recommendation metadata (slot, match percentage, reason codes) from a product.
 * Reason codes reveal health answers such as pregnancy, so only catalog fields may reach the
 * cart, wishlist or any other persisted state.
 */
export const toPlainProduct = <T extends Product>(product: T): Product => {
  const { slot, matchPercentage, reasons, ...plain } = product as T & Record<string, unknown>;
  return plain as unknown as Product;
};
