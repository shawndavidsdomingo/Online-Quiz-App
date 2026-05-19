import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchQuestions } from '../services/triviaApi';
import { shuffleAnswers, checkAnswer, determineQuestionType, computeScore, formatCategory } from '../utils/quizHelpers';
import OptionButton from '../components/OptionButton';
import FillBlankInput from '../components/FillBlankInput';

const TOTAL_QUESTIONS = 10;

export default function QuizScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const category   = route.params?.category   ?? '';
  const difficulty = route.params?.difficulty ?? 'medium';
  const timestamp  = route.params?.timestamp  ?? 0;

  const [questions, setQuestions]           = useState([]);
  const [shuffled, setShuffled]             = useState([]);
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fillAnswer, setFillAnswer]         = useState('');
  const [submitted, setSubmitted]           = useState(false);
  const [results, setResults]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [paused, setPaused]                 = useState(false);  // ← pause state

  useEffect(() => { loadQuestions(); }, [timestamp]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setFillAnswer('');
      setSubmitted(false);
      setResults([]);
      setPaused(false);

      console.log('QuizScreen params → category:', category, '| difficulty:', difficulty);
      const data = await fetchQuestions(TOTAL_QUESTIONS, difficulty, category);
      setQuestions(data);
      setShuffled(data.map(q => shuffleAnswers(q)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const questionType    = determineQuestionType(currentIndex);
  const isLastQuestion  = currentIndex === TOTAL_QUESTIONS - 1;

  const getUserAnswer = () =>
    questionType === 'multiple-choice' ? selectedAnswer : fillAnswer.trim();

  const hasAnswer = () =>
    questionType === 'multiple-choice'
      ? selectedAnswer !== null
      : fillAnswer.trim().length > 0;

  const handleSubmit = () => {
    const userAnswer = getUserAnswer();
    const correct    = checkAnswer(userAnswer, currentQuestion.correctAnswer);
    setSubmitted(true);
    setResults(prev => [...prev, {
      correct, userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      question: currentQuestion,
    }]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const allResults = [...results];
      const { score, total, percentage } = computeScore(allResults);
      navigation.replace('Result', { results: allResults, score, total, percentage, category, difficulty });
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setFillAnswer('');
      setSubmitted(false);
    }
  };

  const handleQuit = () => {
    setPaused(false);
    navigation.navigate('Tabs');
  };

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading questions...</Text>
        <Text style={styles.loadingMeta}>
          {formatCategory(category) || 'All Categories'} · {difficulty}
        </Text>
      </View>
    );
  }

  // ── Error ───────────────────────────────────────────────
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
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      {/* ── Pause Modal ──────────────────────────────────── */}
      <Modal visible={paused} transparent animationType="fade">
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseCard}>
            <Text style={styles.pauseIcon}>⏸️</Text>
            <Text style={styles.pauseTitle}>Quiz Paused</Text>
            <Text style={styles.pauseSub}>
              {currentIndex + 1} / {TOTAL_QUESTIONS} questions done
            </Text>
            <Text style={styles.pauseScore}>
              Score so far: {results.filter(r => r.correct).length} / {results.length}
            </Text>

            <TouchableOpacity style={styles.resumeBtn} onPress={() => setPaused(false)} activeOpacity={0.85}>
              <Text style={styles.resumeBtnText}>▶ Resume Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quitBtn} onPress={handleQuit} activeOpacity={0.85}>
              <Text style={styles.quitBtnText}>Quit Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>

        {/* ── Header ── */}
        <View style={styles.header}>
          {/* Pause button */}
          <TouchableOpacity onPress={() => setPaused(true)} style={styles.pauseBtn}>
            <Text style={styles.pauseBtnText}>⏸</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.questionCount}>{currentIndex + 1} / {TOTAL_QUESTIONS}</Text>
            <Text style={styles.categoryBadge}>
              {formatCategory(category) || 'All'} · {difficulty}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {
            width: `${((currentIndex + (submitted ? 1 : 0)) / TOTAL_QUESTIONS) * 100}%`
          }]} />
        </View>

        {/* Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>
            {questionType === 'fill-in-blank' ? '✏️ Fill in the Blank' : '🔘 Multiple Choice'}
          </Text>
        </View>

        {/* Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question.text}</Text>
        </View>

        {/* Answers */}
        <View style={styles.answersContainer}>
          {questionType === 'multiple-choice' ? (
            shuffled[currentIndex]?.map((option, idx) => (
              <OptionButton
                key={idx}
                label={option}
                selected={selectedAnswer === option}
                disabled={submitted}
                correct={submitted ? option === currentQuestion.correctAnswer : null}
                onPress={() => !submitted && setSelectedAnswer(option)}
              />
            ))
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

        {/* Feedback */}
        {submitted && (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={styles.feedbackIcon}>{isCorrect ? '🎉' : '😔'}</Text>
            <Text style={styles.feedbackText}>
              {isCorrect ? 'Correct!' : `Wrong! Answer: ${currentQuestion.correctAnswer}`}
            </Text>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.btnRow}>
          {!submitted && hasAnswer() && (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitBtnText}>Submit Answer</Text>
            </TouchableOpacity>
          )}
          {submitted && (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.nextBtnText}>
                {isLastQuestion ? '🏁 See Results' : 'Next Question →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  pauseBtn: { backgroundColor: '#1E293B', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  pauseBtnText: { fontSize: 18 },
  questionCount: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  categoryBadge: { fontSize: 12, color: '#6B7280', fontWeight: '600', marginTop: 2, textTransform: 'capitalize' },

  // Progress
  progressBar: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 3 },

  // Type badge
  typeBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(99,102,241,0.15)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(99,102,241,0.3)' },
  typeBadgeText: { color: '#818CF8', fontSize: 12, fontWeight: '700' },

  // Question
  questionCard: { backgroundColor: '#161925', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#222533' },
  questionText: { color: '#F1F5F9', fontSize: 17, fontWeight: '700', lineHeight: 26 },

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
  scoreInfo: { textAlign: 'center', color: '#6B7280', fontSize: 13, fontWeight: '600' },

  // Error / Loading
  errorIcon: { fontSize: 40, marginBottom: 12 },
  errorText: { color: '#EF4444', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
  retryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  loadingText: { color: '#6B7280', fontSize: 14, marginTop: 12 },
  loadingMeta: { color: '#374151', fontSize: 12, marginTop: 4, textTransform: 'capitalize' },

  // Pause Modal
  pauseOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  pauseCard: { width: '100%', maxWidth: 360, backgroundColor: '#161925', borderRadius: 28, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#222533' },
  pauseIcon: { fontSize: 48, marginBottom: 12 },
  pauseTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  pauseSub: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 4 },
  pauseScore: { fontSize: 15, color: '#9CA3AF', fontWeight: '600', marginBottom: 28 },
  resumeBtn: { backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#4338CA', marginBottom: 12 },
  resumeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  quitBtn: { backgroundColor: '#1E293B', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  quitBtnText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});