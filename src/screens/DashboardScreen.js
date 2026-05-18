import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, ActivityIndicator
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, integrationTest } from '../services/triviaApi';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { profile, signOut }          = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [testRunning, setTestRunning] = useState(false);

  const difficulties  = ['easy', 'medium', 'hard'];
  const categoryNames = Object.keys(CATEGORIES);

  // ── Integration test on mount (PR-04) ───────────────────
  useEffect(() => {
    console.log('DashboardScreen mounted — running Trivia API integration test...');
    runTest();
  }, []);

  const runTest = async () => {
    setTestRunning(true);
    await integrationTest();
    setTestRunning(false);
  };

  const handleStartQuiz = () => {
    // TODO: M2 PR-04 — navigate to QuizScreen with params
    const categorySlug = CATEGORIES[selectedCategory] || '';
    console.log('Starting quiz:', { category: categorySlug, difficulty: selectedDifficulty });
    navigation.navigate('QuizTab', {
      screen: 'Quiz',
      params: { category: categorySlug, difficulty: selectedDifficulty },
    });
  };

  return (
    <ScrollView style={styles.scrollWrapper} contentContainerStyle={styles.container}>
      <View style={[styles.decorator, styles.dec1]} />
      <View style={[styles.decorator, styles.dec2]} />

      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.nickname}>{profile?.nickname || 'Player'} 👾</Text>
          </View>
          <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* API Test Badge */}
        {testRunning && (
          <View style={styles.testBadge}>
            <ActivityIndicator size="small" color="#10B981" />
            <Text style={styles.testText}>Testing Trivia API...</Text>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>0%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>

        {/* Config Card */}
        <View style={styles.configCard}>
          <Text style={styles.cardTitle}>Configure Quiz</Text>

          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.pillRow}>
            {categoryNames.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, selectedCategory === cat && styles.pillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>Difficulty</Text>
          <View style={styles.pillRow}>
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[styles.pill, selectedDifficulty === diff && styles.pillActive]}
                onPress={() => setSelectedDifficulty(diff)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selectedDifficulty === diff && styles.pillTextActive]}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleStartQuiz} activeOpacity={0.85}>
            <Text style={styles.startBtnText}>🚀 Start Quiz</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: { flex: 1, backgroundColor: '#0F111A' },
  container: { alignItems: 'center', paddingVertical: 40 },
  content: { width: '100%', maxWidth: 400, paddingHorizontal: 24, zIndex: 10 },
  decorator: { position: 'absolute', borderRadius: 999, opacity: 0.1, zIndex: 0, pointerEvents: 'none' },
  dec1: { width: width * 0.8, height: width * 0.8, backgroundColor: '#6366F1', top: -40, left: -40 },
  dec2: { width: width * 0.8, height: width * 0.8, backgroundColor: '#F59E0B', bottom: 20, right: -60 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  nickname: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginTop: 2 },
  signOutBtn: { backgroundColor: '#1E293B', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  signOutText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },

  // Test badge
  testBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  testText: { color: '#10B981', fontSize: 13, fontWeight: '600' },

  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#161925', width: '47%', borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: '#222533' },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600' },

  // Config card
  configCard: { backgroundColor: '#161925', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#222533' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 20 },
  filterLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  pill: { backgroundColor: '#0F111A', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 99, borderWidth: 2, borderColor: '#2D3142' },
  pillActive: { borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.15)' },
  pillText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#818CF8', fontWeight: '700' },

  // Start button
  startBtn: { backgroundColor: '#10B981', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#059669', marginTop: 4 },
  startBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});