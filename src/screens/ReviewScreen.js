import { View, Text, StyleSheet } from 'react-native';

// TODO: M2 PR-05 (feat/ui-result-review)
// FlatList of all questions — correct/incorrect color coded
// Claude API used ONLY for getExplanation() per question card
export default function ReviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReviewScreen</Text>
      <Text style={styles.sub}>feat/ui-result-review</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: '600', color: '#1E3A8A' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});
