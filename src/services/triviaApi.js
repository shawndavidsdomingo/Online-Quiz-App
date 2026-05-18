// triviaApi.js — The Trivia API integration
// Endpoint: https://the-trivia-api.com/v2/questions
// No API key required.
//
// Raw API response shape (from example.json):
// {
//   id:               "622a1c347cc59eab6f94fbcc",
//   question:         { text: "Which of these quotes..." },
//   correctAnswer:    "\"I have nipples Greg...\"",
//   incorrectAnswers: ["answer1", "answer2", "answer3"],
//   category:         "film_and_tv",
//   difficulty:       "easy" | "medium" | "hard",
//   type:             "text_choice",
//   tags:             [...],
//   regions:          [],
//   isNiche:          false
// }

const BASE_URL = 'https://the-trivia-api.com/v2/questions';

// Trivia API category slugs
export const CATEGORIES = {
  'All':         '',
  'Science':     'science',
  'History':     'history',
  'Music':       'music',
  'Film & TV':   'film_and_tv',
  'Technology':  'technology',
  'Geography':   'geography',
  'Food':        'food_and_drink',
  'Sports':      'sport_and_leisure',
  'Arts':        'arts_and_literature',
};

/**
 * fetchQuestions
 * Fetches questions from The Trivia API.
 *
 * @param {number} limit      - Number of questions (1–50, default 10)
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' (default 'medium')
 * @param {string} category   - category slug or '' for all (default '')
 * @returns {Promise<Array>}  - Raw question array from the API
 */
export async function fetchQuestions(limit = 10, difficulty = 'medium', category = '') {
  try {
    const params = new URLSearchParams();
    params.append('limit', String(limit));

    if (difficulty && difficulty !== 'All') {
      params.append('difficulties', difficulty.toLowerCase());
    }

    if (category && category !== 'All' && category !== '') {
      params.append('categories', category);
    }

    const url = `${BASE_URL}?${params.toString()}`;
    console.log('Fetching trivia questions:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Trivia API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format from Trivia API');
    }

    // Validate all required fields are present
    const valid = data.filter(q =>
      q.id &&
      q.question?.text &&
      q.correctAnswer &&
      Array.isArray(q.incorrectAnswers) &&
      q.incorrectAnswers.length === 3
    );

    console.log(`Trivia API: ${data.length} fetched, ${valid.length} valid`);

    if (valid.length === 0) {
      throw new Error('No valid questions returned from Trivia API');
    }

    return valid;

  } catch (err) {
    console.error('fetchQuestions error:', err.message);
    throw err;
  }
}

/**
 * integrationTest
 * Fetches 10 questions and logs them to console.
 * Run from a screen to verify the API works.
 */
export async function integrationTest() {
  console.log('=== Trivia API Integration Test ===');
  try {
    const questions = await fetchQuestions(10, 'medium', '');
    console.log(`✅ Fetched ${questions.length} questions`);
    questions.forEach((q, i) => {
      console.log(`\nQ${i + 1}: ${q.question.text}`);
      console.log(`   ✓ Correct: ${q.correctAnswer}`);
      console.log(`   ✗ Wrong:   ${q.incorrectAnswers.join(' | ')}`);
      console.log(`   Category: ${q.category} | Difficulty: ${q.difficulty}`);
    });
    console.log('\n=== Test PASSED ===');
    return true;
  } catch (err) {
    console.error('=== Test FAILED ===', err.message);
    return false;
  }
}