// quizHelpers.js — Quiz utility functions
// TODO: M1 PR-04 (feat/trivia-api-service)
//
// Works with The Trivia API response shape:
//   question.text, correctAnswer, incorrectAnswers (array of 3)

/**
 * shuffleAnswers
 * Combines correctAnswer + incorrectAnswers[3] into a shuffled array of 4.
 * @param {object} question - raw Trivia API question object
 * @returns {string[]} shuffled array of 4 answer strings
 */
export function shuffleAnswers(question) {
  throw new Error('shuffleAnswers — not yet implemented (PR-04)');
}

/**
 * checkAnswer
 * Case-insensitive match for both multiple choice and fill-in-blank.
 * @param {string} userAnswer
 * @param {string} correctAnswer
 * @returns {boolean}
 */
export function checkAnswer(userAnswer, correctAnswer) {
  throw new Error('checkAnswer — not yet implemented (PR-04)');
}

/**
 * computeScore
 * Counts correct answers out of total questions.
 * @param {Array<{ correct: boolean }>} results
 * @returns {number}
 */
export function computeScore(results) {
  throw new Error('computeScore — not yet implemented (PR-04)');
}

/**
 * determineQuestionType
 * ~30% of questions are fill-in-blank, rest are multiple choice.
 * @param {number} index - zero-based question index
 * @returns {'multiple-choice' | 'fill-in-blank'}
 */
export function determineQuestionType(index) {
  throw new Error('determineQuestionType — not yet implemented (PR-04)');
}

/**
 * validateNickname
 * 2–20 characters, alphanumeric and spaces only.
 * @param {string} nickname
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateNickname(nickname) {
  throw new Error('validateNickname — not yet implemented (PR-04)');
}