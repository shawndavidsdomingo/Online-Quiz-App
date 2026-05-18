import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { formatCategory } from '../utils/quizHelpers';

// Individual review card per question
function ReviewCard({ item, index }) {
  const isCorrect = item.correct;

  return (
    <View style={[styles.card, isCorrect ? styles.cardCorrect : styles.cardWrong]}>

      {/* Question number + result badge */}
      <View style={styles.cardHeader}>
        <Text style={styles.qNumber}>Q{index + 1}</Text>
        <View style={[styles.badge, isCorrect ? styles.badgeCorrect : styles.badgeWrong]}>
          <Text style={styles.badgeText}>{isCorrect ? '✓ Correct' : '✗ Wrong'}</Text>
        </View>
      </View>

      {/* Question text */}
      <Text style={styles.qText}>{item.question.question.text}</Text>

      {/* Answer comparison */}
      <View style={styles.answerRow}>
        <View style={styles.answerBox}>
          <Text style={styles.answerLabel}>Your answer</Text>
          <Text style={[styles.answerValue, isCorrect ? styles.answerCorrect : styles.answerWrong]}>
            {item.userAnswer || '(no answer)'}
          </Text>
        </View>

        {!isCorrect && (
          <View style={[styles.answerBox, styles.answerBoxRight]}>
            <Text style={styles.answerLabel}>Correct answer</Text>
            <Text style={[styles.answerValue, styles.answerCorrect]}>
              {item.correctAnswer}
            </Text>
          </View>
        )}
      </View>

      {/* Category + difficulty */}
      <Text style={styles.meta}>
        {formatCategory(item.question.category)} · {item.question.difficulty}
      </Text>

    </View>
  );
}

export default function ReviewScreen({ route, navigation }) {
  const { results } = route.params;

  const correctCount = results.filter(r => r.correct).length;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Review Answers</Text>
        <Text style={styles.summary}>{correctCount}/{results.length} correct</Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => <ReviewCard item={item} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  backBtn: { marginBottom: 8 },
  backText: { color: '#6366F1', fontSize: 15, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  summary: { fontSize: 14, color: '#6B7280', fontWeight: '600' },

  list: { padding: 16, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: '#161925',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
  },
  cardCorrect: { borderColor: 'rgba(16,185,129,0.3)' },
  cardWrong:   { borderColor: 'rgba(239,68,68,0.2)' },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  qNumber: { fontSize: 13, fontWeight: '800', color: '#4B5563' },

  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  badgeCorrect: { backgroundColor: 'rgba(16,185,129,0.15)' },
  badgeWrong:   { backgroundColor: 'rgba(239,68,68,0.1)' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#F1F5F9' },

  qText: { fontSize: 15, fontWeight: '700', color: '#F1F5F9', lineHeight: 22, marginBottom: 14 },

  answerRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  answerBox: { flex: 1 },
  answerBoxRight: { borderLeftWidth: 1, borderLeftColor: '#1E293B', paddingLeft: 12 },
  answerLabel: { fontSize: 11, color: '#4B5563', fontWeight: '700', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  answerValue: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  answerCorrect: { color: '#10B981' },
  answerWrong:   { color: '#EF4444' },

  meta: { fontSize: 12, color: '#374151', fontWeight: '600', textTransform: 'capitalize' },
});