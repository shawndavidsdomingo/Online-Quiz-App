import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { fetchQuestions } from '../services/triviaApi';
import { shuffleAnswers, checkAnswer, determineQuestionType, computeScore, formatCategory } from '../utils/quizHelpers';
import OptionButton from '../components/OptionButton';
import FillBlankInput from '../components/FillBlankInput';

const TOTAL_QUESTIONS = 10;

export default function QuizScreen({ route, navigation }) {
  const category   = route.params?.category   || '';
  const difficulty = route.params?.difficulty || 'medium';

  const [questions, setQuestions]       = useState([]);
  const [shuffled, setShuffled]         = useState([]); // shuffled answers per question
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // MC selection
  const [fillAnswer, setFillAnswer]     = useState('');       // fill-in-blank input
  const [submitted, setSubmitted]       = useState(false);    // has current Q been submitted
  const [results, setResults]           = useState([]);       // { correct, userAnswer, question }
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  // ── Load questions ──────────────────────────────────────
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchQuestions(TOTAL_QUESTIONS, difficulty, category);
      const shuffledAnswers = data.map(q => shuffleAnswers(q));
      setQuestions(data);
      setShuffled(shuffledAnswers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const questionType    = currentIndex !== null ? determineQuestionType(currentIndex) : 'multiple-choice';
  const isLastQuestion  = currentIndex === TOTAL_QUESTIONS - 1;

  // ── Get user's current answer ────────────────────────────
  const getUserAnswer = () => {
    return questionType === 'multiple-choice' ? selectedAnswer : fillAnswer.trim();
  };

  // ── Check if answer is selected/typed ───────────────────
  const hasAnswer = () => {
    if (questionType === 'multiple-choice') return selectedAnswer !== null;
    return fillAnswer.trim().length > 0;
  };

  // ── Submit current answer ────────────────────────────────
  const handleSubmit = () => {
    const userAnswer = getUserAnswer();
    const correct    = checkAnswer(userAnswer, currentQuestion.correctAnswer);

    setSubmitted(true);
    setResults(prev => [...prev, {
      correct,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      question:      currentQuestion,
    }]);
  };

  // ── Next question / finish ───────────────────────────────
  const handleNext = () => {
    if (isLastQuestion) {
      // Go to ResultScreen with results
      const { score, total, percentage } = computeScore([...results]);
      navigation.replace('Result', {
        results: [...results],
        score,
        total,
        percentage,
        category,
        difficulty,
      });
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setFillAnswer('');
      setSubmitted(false);
    }
  };

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  // ── Error state ──────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadQuestions}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentQuestion) return null;

  const isCorrect = submitted
    ? checkAnswer(getUserAnswer(), currentQuestion.correctAnswer)
    : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressInfo}>
            <Text style={styles.questionCount}>
              {currentIndex + 1} / {TOTAL_QUESTIONS}
            </Text>
            <Text style={styles.categoryBadge}>
              {formatCategory(category) || 'All Categories'} · {difficulty}
            </Text>
          </View>
        </View>

        {/* ── Progress Bar ── */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + (submitted ? 1 : 0)) / TOTAL_QUESTIONS) * 100}%` },
            ]}
          />
        </View>

        {/* ── Question Type Badge ── */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {questionType === 'fill-in-blank' ? '✏️ Fill in the Blank' : '🔘 Multiple Choice'}
          </Text>
        </View>

        {/* ── Question Text ── */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question.text}</Text>
        </View>

        {/* ── Answer Options ── */}
        <View style={styles.answersContainer}>
          {questionType === 'multiple-choice' ? (
            shuffled[currentIndex]?.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isThisCorrect = submitted
                ? option === currentQuestion.correctAnswer
                : null;
              const showWrong = submitted && isSelected && !isThisCorrect;

              return (
                <OptionButton
                  key={idx}
                  label={option}
                  selected={isSelected}
                  disabled={submitted}
                  correct={isThisCorrect}
                  onPress={() => !submitted && setSelectedAnswer(option)}
                />
              );
            })
          ) : (
            <FillBlankInput
              value={fillAnswer}
              onChangeText={setFillAnswer}
              disabled={submitted}
              correct={isCorrect}
              correctAnswer={submitted ? currentQuestion.correctAnswer : null}
            />
          )}
        </View>

        {/* ── Feedback ── */}
        {submitted && (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={styles.feedbackIcon}>{isCorrect ? '🎉' : '😔'}</Text>
            <Text style={styles.feedbackText}>
              {isCorrect ? 'Correct!' : `Wrong! Answer: ${currentQuestion.correctAnswer}`}
            </Text>
          </View>
        )}

        {/* ── Buttons ── */}
        <View style={styles.btnRow}>
          {/* Submit — shown when answer selected but not submitted */}
          {!submitted && hasAnswer() && (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Submit Answer</Text>
            </TouchableOpacity>
          )}

          {/* Next / Finish — shown after submission */}
          {submitted && (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>
                {isLastQuestion ? '🏁 See Results' : 'Next Question →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Score so far */}
        {results.length > 0 && (
          <Text style={styles.scoreInfo}>
            Score so far: {results.filter(r => r.correct).length} / {results.length}
          </Text>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, backgroundColor: '#0F111A', alignItems: 'center', justifyContent: 'center', padding: 24 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { padding: 8, marginRight: 12 },
  backText: { color: '#6B7280', fontSize: 18, fontWeight: '700' },
  progressInfo: { flex: 1 },
  questionCount: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  categoryBadge: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginTop: 2 },

  // Progress bar
  progressBar: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 3 },

  // Type badge
  typeBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(99,102,241,0.15)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(99,102,241,0.3)' },
  typeBadgeText: { color: '#818CF8', fontSize: 12, fontWeight: '700' },

  // Question
  questionCard: { backgroundColor: '#161925', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#222533' },
  questionText: { color: '#F1F5F9', fontSize: 17, fontWeight: '700', lineHeight: 26 },

  // Answers
  answersContainer: { marginBottom: 16 },

  // Feedback
  feedback: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 16, gap: 10 },
  feedbackCorrect: { backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  feedbackWrong: { backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  feedbackIcon: { fontSize: 20 },
  feedbackText: { color: '#F1F5F9', fontSize: 14, fontWeight: '600', flex: 1 },

  // Buttons
  btnRow: { marginBottom: 16 },
  submitBtn: { backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#4338CA' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  nextBtn: { backgroundColor: '#10B981', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#059669' },
  nextBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // Score
  scoreInfo: { textAlign: 'center', color: '#6B7280', fontSize: 13, fontWeight: '600' },

  // Error
  errorIcon: { fontSize: 40, marginBottom: 12 },
  errorText: { color: '#EF4444', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
  retryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Loading
  loadingText: { color: '#6B7280', fontSize: 14, marginTop: 12 },
});