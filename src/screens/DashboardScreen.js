import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, ActivityIndicator, RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { CATEGORIES } from '../services/triviaApi';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { profile, signOut, currentUser }   = useAuth();
  const [selectedCategory, setCategory]     = useState('All');
  const [selectedDifficulty, setDifficulty] = useState('medium');
  const [stats, setStats]                   = useState({ total: 0, avg: 0 });
  const [loadingStats, setLoadingStats]     = useState(true);
  const [refreshing, setRefreshing]         = useState(false);

  const difficulties  = ['easy', 'medium', 'hard'];
  const categoryNames = Object.keys(CATEGORIES);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (!currentUser) return;
    try {
      if (isRefresh) setRefreshing(true);
      else setLoadingStats(true);

      const { data, error } = await supabase
        .from('score_history')
        .select('score, total')
        .eq('user_id', currentUser.id);

      if (error) throw error;

      const total = data?.length || 0;
      const avg   = total > 0
        ? Math.round(data.reduce((s, r) => s + (r.score / r.total) * 100, 0) / total)
        : 0;

      setStats({ total, avg });
    } catch (err) {
      console.warn('fetchStats error:', err.message);
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleStartQuiz = () => {
    const categorySlug = CATEGORIES[selectedCategory] ?? '';
    console.log('Starting quiz:', { category: categorySlug, difficulty: selectedDifficulty });

    // Navigate directly to QuizScreen — avoids nested navigator param issue
    navigation.navigate('Quiz', {
      category:   categorySlug,
      difficulty: selectedDifficulty,
      timestamp:  Date.now(),
    });
  };

  return (
    <ScrollView
      style={styles.scrollWrapper}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchStats(true)}
          tintColor="#6366F1"
          colors={['#6366F1']}
        />
      }
    >
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

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            {loadingStats
              ? <ActivityIndicator size="small" color="#6366F1" />
              : <Text style={styles.statValue}>{stats.total}</Text>
            }
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            {loadingStats
              ? <ActivityIndicator size="small" color="#6366F1" />
              : <Text style={styles.statValue}>{stats.avg}%</Text>
            }
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
                onPress={() => setCategory(cat)}
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
                onPress={() => setDifficulty(diff)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selectedDifficulty === diff && styles.pillTextActive]}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected config preview */}
          <View style={styles.previewRow}>
            <Text style={styles.previewText}>
              📋 {selectedCategory} · {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
            </Text>
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

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  nickname: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginTop: 2 },
  signOutBtn: { backgroundColor: '#1E293B', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  signOutText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#161925', width: '47%', borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: '#222533' },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600' },

  configCard: { backgroundColor: '#161925', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#222533' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 20 },
  filterLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  pill: { backgroundColor: '#0F111A', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 99, borderWidth: 2, borderColor: '#2D3142' },
  pillActive: { borderColor: '#6366F1', backgroundColor: 'rgba(99,102,241,0.15)' },
  pillText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#818CF8', fontWeight: '700' },

  previewRow: { backgroundColor: '#0F111A', borderRadius: 12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#2D3142' },
  previewText: { color: '#6B7280', fontSize: 13, fontWeight: '600', textAlign: 'center' },

  startBtn: { backgroundColor: '#10B981', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#059669' },
  startBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});