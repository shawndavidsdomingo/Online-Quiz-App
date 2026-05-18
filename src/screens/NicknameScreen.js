import { View, Text, StyleSheet } from 'react-native';

// TODO: M2 PR-02 (feat/ui-nickname) — TextInput + validation
// TODO: M4 PR-03 (feat/auth-nickname-gate) — 30-day rule + Supabase upsert
export default function NicknameScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NicknameScreen</Text>
      <Text style={styles.sub}>feat/ui-nickname</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: '600', color: '#1E3A8A' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});
