/**
 * Minimal Result type: domain code returns failures as values instead of throwing.
 * The project is not in strict mode, so narrow with `result.ok === false` (`!result.ok` does not narrow).
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
