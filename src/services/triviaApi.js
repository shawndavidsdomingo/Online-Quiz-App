// triviaApi.js — The Trivia API integration
// TODO: M1 PR-04 (feat/trivia-api-service)
//
// Endpoint: https://the-trivia-api.com/v2/questions
// No API key required.
//
// Real response shape (from example.json):
// {
//   id: "622a1c347cc59eab6f94fbcc",
//   question: { text: "Which of these quotes is from the film 'Meet the Parents'?" },
//   correctAnswer: "\"I have nipples Greg. Could you milk me?\"",
//   incorrectAnswers: ["answer1", "answer2", "answer3"],
//   category: "film_and_tv",
//   difficulty: "medium",
//   type: "text_choice"
// }

const BASE_URL = 'https://the-trivia-api.com/v2/questions';

/**
 * fetchQuestions
 * @param {number} limit      - Number of questions (max 50, default 10)
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {string} category   - optional category filter
 * @returns {Promise<Array>}  - raw question array from the API
 */
export async function fetchQuestions(limit = 10, difficulty = 'medium', category = '') {
  // Implementation in PR-04
  throw new Error('fetchQuestions — not yet implemented (PR-04)');
}
