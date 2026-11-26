import type { QuizState } from "@/lib/types";

/**
 * Closing the result screen returns to the urgency step.
 * Quiz answers stay the same — result visibility is UI-only.
 */
export function backFromResult(state: QuizState): QuizState {
  return state;
}
