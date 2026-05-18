// quizHelpers.js — Quiz utility functions
// Works with The Trivia API response shape:
//   question.text, correctAnswer, incorrectAnswers (array of 3)

/**
 * shuffleAnswers
 * Combines correctAnswer + incorrectAnswers into a shuffled array of 4.
 * Uses Fisher-Yates shuffle.
 *
 * @param {object} question - raw Trivia API question object
 * @returns {string[]}      - shuffled array of 4 answer strings
 */
export function shuffleAnswers(question) {
  const answers = [question.correctAnswer, ...question.incorrectAnswers];

  // Fisher-Yates shuffle
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  return answers;
}

/**
 * checkAnswer
 * Case-insensitive, trimmed comparison.
 * Works for both multiple choice and fill-in-blank.
 *
 * @param {string} userAnswer
 * @param {string} correctAnswer
 * @returns {boolean}
 */
export function checkAnswer(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

/**
 * computeScore
 * Counts correct answers out of total.
 *
 * @param {Array<{ correct: boolean }>} results
 * @returns {{ score: number, total: number, percentage: number }}
 */
export function computeScore(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return { score: 0, total: 0, percentage: 0 };
  }

  const score      = results.filter(r => r.correct).length;
  const total      = results.length;
  const percentage = Math.round((score / total) * 100);

  return { score, total, percentage };
}

/**
 * determineQuestionType
 * ~30% of questions are fill-in-blank, rest are multiple-choice.
 * Uses question index to keep type consistent per question.
 *
 * @param {number} index - zero-based question index
 * @returns {'multiple-choice' | 'fill-in-blank'}
 */
export function determineQuestionType(index) {
  // Indices 0,3,6,9 → every 3rd question = fill-in-blank (~30%)
  return index % 3 === 2 ? 'fill-in-blank' : 'multiple-choice';
}

/**
 * validateNickname
 * 2–20 characters, alphanumeric and spaces only.
 *
 * @param {string} nickname
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateNickname(nickname) {
  const trimmed = (nickname || '').trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'Nickname must be at least 2 characters.' };
  }
  if (trimmed.length > 20) {
    return { valid: false, error: 'Nickname cannot exceed 20 characters.' };
  }
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
    return { valid: false, error: 'Letters, numbers and spaces only.' };
  }

  return { valid: true, error: null };
}

/**
 * formatCategory
 * Converts Trivia API category slug to display name.
 *
 * @param {string} category - e.g. 'film_and_tv'
 * @returns {string}        - e.g. 'Film & TV'
 */
export function formatCategory(category) {
  const map = {
    film_and_tv:      'Film & TV',
    science:          'Science',
    history:          'History',
    music:            'Music',
    technology:       'Technology',
    geography:        'Geography',
    food_and_drink:   'Food & Drink',
    sport_and_leisure:'Sports',
    arts_and_literature: 'Arts & Literature',
    society_and_culture: 'Society & Culture',
    general_knowledge:   'General Knowledge',
  };
  return map[category] || category;
}