import { View, Text, StyleSheet } from 'react-native';

// TODO: M2 PR-06 (feat/ui-history)
// FlatList of score_history from Supabase, sorted by completed_at desc
export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HistoryScreen</Text>
      <Text style={styles.sub}>feat/ui-history</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: '600', color: '#1E3A8A' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});
