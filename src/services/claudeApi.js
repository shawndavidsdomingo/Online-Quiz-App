// claudeApi.js — Anthropic Claude API
// TODO: M4 PR-04 (feat/api-claude-hint)
//       M4 PR-05 (feat/api-claude-explain)
//
// ⚠️  RULE: Claude is used ONLY for:
//   1. getHint()        → subtle hint during quiz (QuizScreen)
//   2. getExplanation() → answer explanation after quiz (ReviewScreen)
//
//   Quiz questions come ONLY from The Trivia API. Never use Claude for questions.

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 300;

async function callClaude(prompt) {
  // Implementation in M4 PRs
  throw new Error('callClaude — not yet implemented (PR-04)');
}

/**
 * getHint — called from QuizScreen "Need a Hint?" button
 * Does NOT reveal the answer. Deducts 0.5 from score for that question.
 * @param {string} questionText
 * @param {string[]} choices - all 4 answer options shown to user
 * @returns {Promise<string>}
 */
export async function getHint(questionText, choices) {
  const prompt =
    `Give a subtle hint for this quiz question WITHOUT revealing the answer.\n\n` +
    `Question: ${questionText}\n` +
    `Choices: ${choices.join(', ')}\n\n` +
    `Hint (1-2 sentences):`;
  return callClaude(prompt);
}

/**
 * getExplanation — called from ReviewScreen "Explain" button
 * @param {string} questionText
 * @param {string} correctAnswer
 * @param {string} userAnswer
 * @returns {Promise<string>}
 */
export async function getExplanation(questionText, correctAnswer, userAnswer) {
  const wasCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  const prompt =
    `Briefly explain why the correct answer is correct.\n\n` +
    `Question: ${questionText}\n` +
    `Correct answer: ${correctAnswer}\n` +
    `User answered: ${userAnswer} (${wasCorrect ? 'correct ✓' : 'incorrect ✗'})\n\n` +
    `Explanation (2-3 sentences):`;
  return callClaude(prompt);
}
