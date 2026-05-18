import { View, Text, StyleSheet } from 'react-native';

// TODO: M2 PR-01 (feat/ui-login) — Google Sign-In button
// TODO: M4 PR-02 (feat/auth-google-oauth) — wire supabase.auth.signInWithOAuth
export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoginScreen</Text>
      <Text style={styles.sub}>feat/ui-login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: '600', color: '#1E3A8A' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});
