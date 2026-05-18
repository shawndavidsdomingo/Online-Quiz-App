import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Dimensions, KeyboardAvoidingView, Platform,
  Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator
} from 'react-native';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

// ─── 30-day rule ──────────────────────────────────────────────
function canChangeNickname(nickname_updated_at) {
  if (!nickname_updated_at) return { allowed: true, daysLeft: 0 };
  const diff = Date.now() - new Date(nickname_updated_at).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { allowed: days >= 30, daysLeft: Math.max(0, 30 - days) };
}

const CustomAppLogo = () => (
  <View style={styles.logoContainer}>
    <View style={[styles.logoCard, styles.logoCardBack]} />
    <View style={[styles.logoCard, styles.logoCardMiddle]} />
    <View style={[styles.logoCard, styles.logoCardFront]}>
      <View style={styles.logoInnerDot} />
    </View>
  </View>
);

export default function NicknameScreen() {
  const { currentUser, profile, refreshProfile } = useAuth();
  const [nickname, setNickname]   = useState('');
  const [error, setError]         = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [saving, setSaving]       = useState(false);

  const isFirstTime = !profile?.nickname || profile.nickname.trim() === '';
  const { allowed, daysLeft } = canChangeNickname(profile?.nickname_updated_at);

  // ── Blocked: has nickname but 30 days haven't passed ────
  if (!isFirstTime && !allowed) {
    return (
      <View style={styles.blockedContainer}>
        <Text style={styles.blockedIcon}>🔒</Text>
        <Text style={styles.blockedTitle}>Too Soon!</Text>
        <Text style={styles.blockedText}>
          You can change your nickname again in{' '}
          <Text style={styles.highlight}>{daysLeft} day{daysLeft !== 1 ? 's' : ''}</Text>.
        </Text>
        <Text style={styles.blockedSub}>
          Current: <Text style={styles.highlight}>{profile.nickname}</Text>
        </Text>
      </View>
    );
  }

  const handleSave = async () => {
    const trimmed = nickname.trim();

    if (trimmed.length < 2) { setError('At least 2 characters required.'); return; }
    if (trimmed.length > 20) { setError('Maximum 20 characters.'); return; }
    if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) { setError('Letters, numbers and spaces only.'); return; }
    if (!isFirstTime && !allowed) { setError(`Wait ${daysLeft} more days.`); return; }

    setError('');
    Keyboard.dismiss();
    setSaving(true);

    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({
          id:                  currentUser.id,
          email:               currentUser.email,
          nickname:            trimmed,
          nickname_updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (dbError) throw dbError;

      // Refresh profile in AuthContext
      // → profile.nickname is now set
      // → App.js re-renders → routes to AppTabs
      await refreshProfile();

    } catch (err) {
      Alert.alert('Error', err.message || 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={[styles.decorator, styles.dec1]} />
          <View style={[styles.decorator, styles.dec2]} />

          <View style={styles.content}>
            <View style={styles.header}>
              <CustomAppLogo />
              <Text style={styles.title}>
                {isFirstTime ? 'Claim Your Name' : 'Change Nickname'}
              </Text>
              <Text style={styles.subtitle}>
                What should we call you on the leaderboard?
              </Text>
            </View>

            <View style={styles.card}>
              <TextInput
                style={[
                  styles.input,
                  isFocused && styles.inputFocused,
                  !!error && styles.inputError,
                ]}
                placeholder="Enter nickname (2–20 chars)"
                placeholderTextColor="#6B7280"
                value={nickname}
                onChangeText={(t) => { setNickname(t); if (error) setError(''); }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={20}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={styles.errorText}>{error || ' '}</Text>

              <TouchableOpacity
                style={[styles.btn, saving && styles.btnDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.85}
              >
                {saving
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={styles.btnText}>Save Nickname</Text>
                }
              </TouchableOpacity>
            </View>

            <View style={styles.rule}>
              <Text style={styles.ruleIcon}>💡</Text>
              <Text style={styles.ruleText}>
                Choose wisely — nickname can only be changed once every{' '}
                <Text style={styles.highlight}>30 days</Text>.
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0F111A' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { width: '100%', maxWidth: 360, paddingHorizontal: 24, alignItems: 'center', zIndex: 10 },
  decorator: { position: 'absolute', borderRadius: 999, opacity: 0.12, zIndex: 0, pointerEvents: 'none' },
  dec1: { width: width * 0.9, height: width * 0.9, backgroundColor: '#10B981', top: -100, right: -80 },
  dec2: { width: width * 0.7, height: width * 0.7, backgroundColor: '#EC4899', bottom: -80, left: -50 },

  // Logo
  logoContainer: { width: 100, height: 85, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logoCard: { position: 'absolute', width: 50, height: 64, borderRadius: 14, borderWidth: 2 },
  logoCardBack: { backgroundColor: '#312E81', borderColor: '#4338CA', transform: [{ rotate: '-15deg' }, { translateX: -12 }], opacity: 0.5 },
  logoCardMiddle: { backgroundColor: '#1E1B4B', borderColor: '#4F46E5', transform: [{ rotate: '8deg' }, { translateX: 8 }, { translateY: -4 }], opacity: 0.8 },
  logoCardFront: { backgroundColor: '#6366F1', borderColor: '#818CF8', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  logoInnerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },

  // Header
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#9CA3AF', textAlign: 'center' },

  // Card
  card: { width: '100%', backgroundColor: '#161925', borderRadius: 24, paddingVertical: 28, paddingHorizontal: 20, alignItems: 'center', borderWidth: 1, borderColor: '#222533', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#0F111A', color: '#FFFFFF', fontSize: 16, fontWeight: '600', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, borderWidth: 2, borderColor: '#2D3142' },
  inputFocused: { borderColor: '#6366F1', backgroundColor: '#131521' },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: 8, marginLeft: 4, minHeight: 18, alignSelf: 'flex-start' },
  btn: { backgroundColor: '#6366F1', borderRadius: 16, paddingVertical: 16, width: '100%', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#4338CA', marginTop: 4 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  // Rule
  rule: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(55,65,81,0.4)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#374151' },
  ruleIcon: { fontSize: 16, marginRight: 10 },
  ruleText: { flex: 1, fontSize: 12, color: '#9CA3AF', lineHeight: 18 },
  highlight: { color: '#F59E0B', fontWeight: '700' },

  // Blocked
  blockedContainer: { flex: 1, backgroundColor: '#0F111A', alignItems: 'center', justifyContent: 'center', padding: 32 },
  blockedIcon: { fontSize: 48, marginBottom: 16 },
  blockedTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 12 },
  blockedText: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  blockedSub: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
});