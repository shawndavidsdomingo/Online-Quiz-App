import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// M2 PR-01 (feat/ui-login)
// Google Sign-In button UI only — auth wiring: M4 PR-02 (feat/auth-google-oauth)
export default function LoginScreen({ navigation }) {
  const handleGoogleSignIn = () => {
    // TODO: M4 PR-02 — supabase.auth.signInWithOAuth({ provider: 'google' })
    console.log('Google Sign-In pressed');
  };

  return (
    <View style={styles.container}>

      {/* Logo + App Name */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🎯</Text>
        </View>
        <Text style={styles.appName}>QuizApp</Text>
        <Text style={styles.tagline}>Test your knowledge. Challenge yourself.</Text>
      </View>

      {/* Sign In Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome</Text>
        <Text style={styles.cardSub}>Sign in to start playing</Text>

        {/* Google Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.85}
        >
          <View style={styles.googleIconBox}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Only Google Sign-In is supported.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },

  // Card
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 32,
  },

  // Google Button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  googleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },

  // Note
  note: {
    marginTop: 20,
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
});