// quizHelpers.js — Quiz utility functions
//
// Works with The Trivia API response shape:
//   question.text, correctAnswer, incorrectAnswers (array of 3), type: "text_choice"
//
// Official category slugs:
//   music | sport_and_leisure | film_and_tv | arts_and_literature | history
//   society_and_culture | science | geography | food_and_drink | general_knowledge
//
// Official difficulty values: easy | medium | hard

/**
 * shuffleAnswers
 * Combines correctAnswer + incorrectAnswers[3] into a shuffled array of 4.
 * Uses Fisher-Yates shuffle.
 *
 * @param {object} question - Trivia API question object
 * @returns {string[]}      - shuffled array of 4 answer strings
 */
export function shuffleAnswers(question) {
  const answers = [question.correctAnswer, ...question.incorrectAnswers];
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
}

/**
 * checkAnswer
 * Case-insensitive, trimmed comparison.
 * Works for both multiple-choice and fill-in-blank.
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
 * ~30% fill-in-blank (every 3rd question), rest multiple-choice.
 * All questions from the API are type "text_choice" — we decide
 * how to display them on our end.
 *
 * @param {number} index - zero-based
 * @returns {'multiple-choice' | 'fill-in-blank'}
 */
export function determineQuestionType(index) {
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
  if (trimmed.length < 2)  return { valid: false, error: 'At least 2 characters required.' };
  if (trimmed.length > 20) return { valid: false, error: 'Maximum 20 characters.' };
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) return { valid: false, error: 'Letters, numbers and spaces only.' };
  return { valid: true, error: null };
}

/**
 * formatCategory
 * Converts official API category slug to display name.
 *
 * @param {string} slug - e.g. 'film_and_tv'
 * @returns {string}    - e.g. 'Film & TV'
 */
export function formatCategory(slug) {
  const map = {
    music:                'Music',
    sport_and_leisure:    'Sport & Leisure',
    film_and_tv:          'Film & TV',
    arts_and_literature:  'Arts & Literature',
    history:              'History',
    society_and_culture:  'Society & Culture',
    science:              'Science',
    geography:            'Geography',
    food_and_drink:       'Food & Drink',
    general_knowledge:    'General Knowledge',
  };
  return map[slug] || slug;
}