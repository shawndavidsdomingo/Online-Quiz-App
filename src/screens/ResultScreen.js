import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import ScoreCard from '../components/ScoreCard';
import { formatCategory } from '../utils/quizHelpers';

export default function ResultScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { results, score, total, percentage, category, difficulty } = route.params;
  const { currentUser } = useAuth();
  const [saving, setSaving]   = useState(true);
  const [saveError, setSaveError] = useState(null);

  // Save score to Supabase on mount
  useEffect(() => {
    saveScore();
  }, []);

  const saveScore = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.from('score_history').insert({
        user_id:      currentUser.id,
        score,
        total,
        category:     category || 'all',
        difficulty:   difficulty || 'medium',
        completed_at: new Date().toISOString(),
      });
      if (error) throw error;
    } catch (err) {
      console.warn('saveScore error:', err.message);
      setSaveError('Score could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>

      <Text style={styles.heading}>Quiz Complete!</Text>
      <Text style={styles.subheading}>
        {formatCategory(category) || 'All Categories'} · {difficulty}
      </Text>

      {/* Saving indicator */}
      {saving && (
        <View style={styles.savingRow}>
          <ActivityIndicator size="small" color="#6366F1" />
          <Text style={styles.savingText}>Saving score...</Text>
        </View>
      )}
      {saveError && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>⚠️ {saveError}</Text>
        </View>
      )}

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

      <TouchableOpacity
        style={styles.reviewBtn}
        onPress={() => navigation.navigate('Review', { results })}
        activeOpacity={0.85}
      >
        <Text style={styles.reviewBtnText}>📋 Review Answers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dashboardBtn}
        onPress={() => navigation.navigate('Tabs')}
        activeOpacity={0.85}
      >
        <Text style={styles.dashboardBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },
  content: { padding: 24, paddingTop: 40, paddingBottom: 40, alignItems: 'center' },

  heading: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.5 },
  subheading: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 20, textTransform: 'capitalize' },

  savingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  savingText: { color: '#6B7280', fontSize: 13 },
  errorRow: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },

  statsRow: { flexDirection: 'row', backgroundColor: '#161925', borderRadius: 20, borderWidth: 1, borderColor: '#222533', width: '100%', marginBottom: 24 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#222533' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600' },

  reviewBtn: { backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#4338CA', marginBottom: 12 },
  reviewBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  dashboardBtn: { backgroundColor: '#1E293B', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  dashboardBtnText: { color: '#94A3B8', fontSize: 16, fontWeight: '700' },
});