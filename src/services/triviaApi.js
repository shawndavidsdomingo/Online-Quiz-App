// triviaApi.js — The Trivia API integration
// Endpoint: https://the-trivia-api.com/v2/questions
// No API key required.
//
// Official API response shape:
// {
//   id:               string
//   category:         "music" | "sport_and_leisure" | "film_and_tv" | "arts_and_literature"
//                     | "history" | "society_and_culture" | "science" | "geography"
//                     | "food_and_drink" | "general_knowledge"
//   tags:             string[]
//   difficulty:       "easy" | "medium" | "hard"
//   regions:          string[]
//   isNiche:          boolean
//   question:         { text: string }
//   correctAnswer:    string
//   incorrectAnswers: string[]   (always 3 items)
//   type:             "text_choice"
// }

const BASE_URL = 'https://the-trivia-api.com/v2/questions';

// ─── Official category slugs from API docs ────────────────────
export const CATEGORIES = {
  'All':                '',
  'Music':              'music',
  'Sport & Leisure':    'sport_and_leisure',
  'Film & TV':          'film_and_tv',
  'Arts & Literature':  'arts_and_literature',
  'History':            'history',
  'Society & Culture':  'society_and_culture',
  'Science':            'science',
  'Geography':          'geography',
  'Food & Drink':       'food_and_drink',
  'General Knowledge':  'general_knowledge',
};

// ─── Official difficulty values from API docs ─────────────────
export const DIFFICULTIES = ['easy', 'medium', 'hard'];

/**
 * fetchQuestions
 * @param {number} limit      - 1–50, default 10
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {string} category   - official slug or '' for all
 * @returns {Promise<Array>}  - validated question array
 */
export async function fetchQuestions(limit = 10, difficulty = 'medium', category = '') {
  try {
    const params = new URLSearchParams();
    params.append('limit', String(limit));

    if (difficulty && difficulty !== 'all') {
      params.append('difficulties', difficulty.toLowerCase());
    }

    if (category && category !== '') {
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

    // Validate required fields per API docs
    const valid = data.filter(q =>
      q.id &&
      q.question?.text &&
      q.correctAnswer &&
      Array.isArray(q.incorrectAnswers) &&
      q.incorrectAnswers.length === 3 &&
      q.type === 'text_choice'   // only handle text_choice type
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
 * Fetches 10 questions and logs all fields to console.
 */
export async function integrationTest() {
  console.log('=== Trivia API Integration Test ===');
  try {
    const questions = await fetchQuestions(10, 'medium', '');
    console.log(`✅ Fetched ${questions.length} questions`);
    questions.forEach((q, i) => {
      console.log(`\nQ${i + 1}: ${q.question.text}`);
      console.log(`   category:         ${q.category}`);
      console.log(`   difficulty:       ${q.difficulty}`);
      console.log(`   type:             ${q.type}`);
      console.log(`   isNiche:          ${q.isNiche}`);
      console.log(`   correctAnswer:    ${q.correctAnswer}`);
      console.log(`   incorrectAnswers: ${q.incorrectAnswers.join(' | ')}`);
    });
    console.log('\n=== Test PASSED ===');
    return true;
  } catch (err) {
    console.error('=== Test FAILED ===', err.message);
    return false;
  }
}