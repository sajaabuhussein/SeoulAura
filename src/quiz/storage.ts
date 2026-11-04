import { QUESTIONS, isValidOption } from './questions';
import { err, ok, type Result } from './result';
import type { Answers } from './types';

/** Current key. Only answers are stored, so the routine always reflects the current catalog. */
export const STORAGE_KEY = 'seoul_aura_skin_quiz';
export const SCHEMA_VERSION = 2;

/** The subset of the Web Storage API used here, so tests can pass a fake. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Key written by the pre-v2 quiz. Its random-based result cannot be read by the current code. */
export const LEGACY_STORAGE_KEY = 'skin_quiz_result';

/** Best-effort cleanup of the legacy value; storage failures are ignored. */
const removeLegacyKey = (storage: StorageLike): void => {
  try {
    storage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Orphaned legacy data is harmless.
  }
};

export type LoadError ='corrupt' | 'version' | 'invalid' | 'incomplete';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Parses and validates a stored value. Storage content is untrusted: anything unexpected is rejected. */
const parseAnswers = (raw: string): Result<Answers, LoadError> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return err('corrupt');
  }
  if (!isPlainObject(parsed) || !isPlainObject(parsed.answers)) return err('corrupt');
  if (parsed.v !== SCHEMA_VERSION) return err('version');

  const stored = parsed.answers;
  const knownIds = new Set<string>(QUESTIONS.map((q) => q.id));
  // Allow-list on keys (rejects "__proto__" and friends) and on every option id.
  for (const key of Object.keys(stored)) {
    if (!knownIds.has(key) || !isValidOption(key, stored[key])) return err('invalid');
  }

  const answers: Record<string, string> = {};
  for (const question of QUESTIONS) {
    if (!Object.hasOwn(stored, question.id)) return err('incomplete');
    answers[question.id] = stored[question.id] as string;
  }
  if (answers.secondary === answers.primary) return err('invalid');
  return ok(answers as unknown as Answers);
};

/**
 * Loads saved quiz answers. `ok(null)` means nothing is saved (or storage is unavailable).
 * Any invalid value is removed so it cannot cause the same failure on the next load.
 */
export const loadQuiz = (storage: StorageLike): Result<Answers | null, LoadError> => {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return ok(null);
  }
  removeLegacyKey(storage);
  if (raw === null) return ok(null);

  const result = parseAnswers(raw);
  if (result.ok === false) {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing more can be done; the quiz still starts fresh.
    }
    return result;
  }
  return ok(result.value);
};

/** Saves answers. A failure (private mode, quota) is non-fatal: the quiz works, it just isn't remembered. */
export const saveQuiz = (storage: StorageLike, answers: Answers, completedAt: string): Result<void, 'save_failed'> => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ v: SCHEMA_VERSION, answers, completedAt }));
    return ok(undefined);
  } catch (e) {
    // Error name only: never the message or any answer (health data stays out of logs).
    console.warn('[skin-quiz] save_failed', { reason: e instanceof Error ? e.name : 'unknown' });
    return err('save_failed');
  }
};
