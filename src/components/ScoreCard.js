import { View, Text, StyleSheet } from 'react-native';

/**
 * ScoreCard
 * Displays final score with star rating and performance message.
 *
 * Props:
 *   score      {number} — correct answers
 *   total      {number} — total questions
 *   percentage {number} — 0–100
 */
export default function ScoreCard({ score, total, percentage }) {
  const getStars = () => {
    if (percentage >= 90) return '⭐⭐⭐';
    if (percentage >= 60) return '⭐⭐';
    if (percentage >= 30) return '⭐';
    return '💀';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 50) return 'Not bad!';
    if (percentage >= 30) return 'Keep practicing!';
    return 'Better luck next time!';
  };

  const getScoreColor = () => {
    if (percentage >= 70) return '#10B981';
    if (percentage >= 40) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.stars}>{getStars()}</Text>
      <Text style={[styles.score, { color: getScoreColor() }]}>
        {score}<Text style={styles.scoreDivider}>/{total}</Text>
      </Text>
      <Text style={styles.percentage}>{percentage}%</Text>
      <Text style={styles.message}>{getMessage()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161925',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222533',
    width: '100%',
    marginBottom: 24,
  },
  stars: { fontSize: 36, marginBottom: 16 },
  score: {
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 80,
  },
  scoreDivider: {
    fontSize: 36,
    fontWeight: '600',
    color: '#4B5563',
  },
  percentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
  },
  message: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: -0.3,
  },
});