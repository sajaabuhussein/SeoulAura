import { computeConfidence, deriveProfile, personaFor } from './profile';
import { QUESTIONS } from './questions';
import { err, ok, type Result } from './result';
import { buildRoutine, countUnmatchedSlots } from './routine';
import { indexById } from './rules';
import { TAGGED_CATALOG } from './tagging';
import type { Answers, NoteCode, QuestionId, QuizError, QuizOutcome, Routine, SkinProfile } from './types';

export * from './copy';
export * from './plain';
export * from './questions';
export * from './result';
export * from './storage';
export type * from './types';

const taggedById = indexById(TAGGED_CATALOG);

/** Whether the routine contains any active that needs a slow introduction. */
const hasStrongActive = (routine: Routine): boolean =>
  [...routine.AM, ...routine.PM, ...(routine.weekly ? [routine.weekly] : [])].some((p) => {
    const t = taggedById.get(p.id);
    return t !== undefined && (t.tags.has('retinoid') || t.leaveOnExfoliant || t.format === 'peelShot' || t.tags.has('spicule'));
  });

const notesFor = (profile: SkinProfile, routine: Routine): NoteCode[] => {
  const notes: NoteCode[] = [];
  if (!profile.retinoidSafe) notes.push('pregnancyRetinoidFree');
  if (profile.sensitivity !== 'Low') notes.push('patchTest');
  if (hasStrongActive(routine)) notes.push('introduceSlowly');
  if (profile.sunExposure === 'high') notes.push('reapplySpf');
  return notes;
};

/**
 * Validates the answers and builds the full outcome (profile, persona, routine, confidence, notes).
 * Pure and deterministic. Invalid or incomplete answers come back as an error value.
 */
export const evaluateQuiz = (input: Readonly<Partial<Record<QuestionId, unknown>>>): Result<QuizOutcome, QuizError> => {
  const derived = deriveProfile(input);
  if (derived.ok === false) return err(derived.error);

  const profile = derived.value;
  // deriveProfile validated every answer; copy only the known keys so stray input never travels on.
  const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, input[q.id]])) as unknown as Answers;
  const routine = buildRoutine(profile);
  return ok({
    answers,
    profile,
    confidence: computeConfidence(answers, countUnmatchedSlots(routine)),
    personaKey: personaFor(profile),
    routine,
    notes: notesFor(profile, routine),
  });
};
