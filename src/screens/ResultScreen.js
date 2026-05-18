import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ScoreCard from '../components/ScoreCard';
import { formatCategory } from '../utils/quizHelpers';

export default function ResultScreen({ route, navigation }) {
  const { results, score, total, percentage, category, difficulty } = route.params;

  const handleReview = () => {
    navigation.navigate('Review', { results });
  };

  const handleDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <Text style={styles.heading}>Quiz Complete!</Text>
      <Text style={styles.subheading}>
        {formatCategory(category) || 'All Categories'} · {difficulty}
      </Text>

      {/* Score Card */}
      <ScoreCard score={score} total={total} percentage={percentage} />

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{results.filter(r => r.correct).length}</Text>
          <Text style={styles.statLabel}>Correct ✓</Text>
        </View>
        <View style={[styles.statBox, styles.statDivider]}>
          <Text style={styles.statValue}>{results.filter(r => !r.correct).length}</Text>
          <Text style={styles.statLabel}>Wrong ✗</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.reviewBtn} onPress={handleReview} activeOpacity={0.85}>
        <Text style={styles.reviewBtnText}>📋 Review Answers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dashboardBtn} onPress={handleDashboard} activeOpacity={0.85}>
        <Text style={styles.dashboardBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },
  content: { padding: 24, paddingTop: 40, paddingBottom: 40, alignItems: 'center' },

  heading: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
  subheading: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 28, textTransform: 'capitalize' },

  // Stats row
  statsRow: { flexDirection: 'row', backgroundColor: '#161925', borderRadius: 20, borderWidth: 1, borderColor: '#222533', width: '100%', marginBottom: 24 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#222533' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600' },

  // Buttons
  reviewBtn: { backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#4338CA', marginBottom: 12 },
  reviewBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  dashboardBtn: { backgroundColor: '#1E293B', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  dashboardBtnText: { color: '#94A3B8', fontSize: 16, fontWeight: '700' },
});