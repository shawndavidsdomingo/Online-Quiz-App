import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { formatCategory } from '../utils/quizHelpers';

// ─── History Item Card ────────────────────────────────────────
function HistoryCard({ item }) {
  const percentage = Math.round((item.score / item.total) * 100);

  const getColor = () => {
    if (percentage >= 70) return '#10B981';
    if (percentage >= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getStars = () => {
    if (percentage >= 90) return '⭐⭐⭐';
    if (percentage >= 60) return '⭐⭐';
    if (percentage >= 30) return '⭐';
    return '💀';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }) + ' · ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardStars}>{getStars()}</Text>
        <View>
          <Text style={styles.cardCategory}>
            {formatCategory(item.category) || 'All Categories'}
          </Text>
          <Text style={styles.cardDifficulty}>
            {item.difficulty?.charAt(0).toUpperCase() + item.difficulty?.slice(1)}
          </Text>
          <Text style={styles.cardDate}>{formatDate(item.completed_at)}</Text>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={[styles.cardScore, { color: getColor() }]}>
          {item.score}<Text style={styles.cardTotal}>/{item.total}</Text>
        </Text>
        <Text style={[styles.cardPct, { color: getColor() }]}>{percentage}%</Text>
      </View>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>No history yet!</Text>
      <Text style={styles.emptyText}>
        Complete a quiz to see your results here.
      </Text>
    </View>
  );
}

// ─── HistoryScreen ────────────────────────────────────────────
export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState(null);

  const fetchHistory = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('score_history')
        .select('id, score, total, category, difficulty, completed_at')
        .eq('user_id', currentUser.id)
        .order('completed_at', { ascending: false });

      if (dbError) throw dbError;
      setHistory(data || []);

    } catch (err) {
      console.error('fetchHistory error:', err.message);
      setError('Could not load history. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) fetchHistory();
  }, [currentUser]);

  // ── Summary stats ──────────────────────────────────────────
  const totalPlayed = history.length;
  const avgScore = totalPlayed > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.score / h.total) * 100, 0) / totalPlayed)
    : 0;
  const bestScore = totalPlayed > 0
    ? Math.max(...history.map(h => Math.round((h.score / h.total) * 100)))
    : 0;

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Quiz History</Text>
        <Text style={styles.subtitle}>{totalPlayed} quiz{totalPlayed !== 1 ? 'zes' : ''} played</Text>
      </View>

      {/* Error banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Summary row — only shown if has history */}
      {totalPlayed > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{totalPlayed}</Text>
            <Text style={styles.summaryLabel}>Played</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryDivider]}>
            <Text style={styles.summaryValue}>{avgScore}%</Text>
            <Text style={styles.summaryLabel}>Average</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{bestScore}%</Text>
            <Text style={styles.summaryLabel}>Best</Text>
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard item={item} />}
        contentContainerStyle={[
          styles.list,
          history.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchHistory(true)}
            tintColor="#6366F1"
            colors={['#6366F1']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },
  centered: { flex: 1, backgroundColor: '#0F111A', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#6B7280', fontSize: 14, marginTop: 12 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginBottom: 2 },
  subtitle: { fontSize: 13, color: '#6B7280', fontWeight: '600' },

  // Error
  errorBanner: { backgroundColor: 'rgba(239,68,68,0.1)', paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(239,68,68,0.2)' },
  errorText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },

  // Summary
  summaryRow: { flexDirection: 'row', backgroundColor: '#161925', marginHorizontal: 16, marginTop: 16, borderRadius: 16, borderWidth: 1, borderColor: '#222533' },
  summaryBox: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  summaryDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#222533' },
  summaryValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 2 },
  summaryLabel: { fontSize: 11, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },

  // List
  list: { padding: 16, paddingBottom: 40 },
  listEmpty: { flex: 1 },

  // Card
  card: {
    backgroundColor: '#161925',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222533',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardStars: { fontSize: 24 },
  cardCategory: { fontSize: 15, fontWeight: '700', color: '#F1F5F9', marginBottom: 2 },
  cardDifficulty: { fontSize: 12, color: '#6B7280', fontWeight: '600', textTransform: 'capitalize', marginBottom: 2 },
  cardDate: { fontSize: 11, color: '#374151', fontWeight: '500' },
  cardRight: { alignItems: 'flex-end', minWidth: 64 },
  cardScore: { fontSize: 26, fontWeight: '900', lineHeight: 30 },
  cardTotal: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
  cardPct: { fontSize: 13, fontWeight: '700' },

  // Empty
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});