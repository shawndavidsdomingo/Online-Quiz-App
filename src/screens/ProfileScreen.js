import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator,
  Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

function canChangeNickname(nickname_updated_at) {
  if (!nickname_updated_at) return { allowed: true, daysLeft: 0 };
  const diff  = Date.now() - new Date(nickname_updated_at).getTime();
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { allowed: days >= 30, daysLeft: Math.max(0, 30 - days) };
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, profile, signOut, refreshProfile } = useAuth();

  const displayName = profile?.nickname?.trim()
    ? profile.nickname
    : (currentUser?.email ?? 'Player');

  const [nickname, setNickname]     = useState('');
  const [isFocused, setIsFocused]   = useState(false);
  const [error, setError]           = useState('');
  const [saving, setSaving]         = useState(false);

  const { allowed, daysLeft } = canChangeNickname(profile?.nickname_updated_at);

  const handleSave = async () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2)  { setError('At least 2 characters.'); return; }
    if (trimmed.length > 20) { setError('Maximum 20 characters.'); return; }
    if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) { setError('Letters, numbers and spaces only.'); return; }
    if (!allowed) { setError(`Wait ${daysLeft} more days to change nickname.`); return; }

    setError('');
    setSaving(true);
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ nickname: trimmed, nickname_updated_at: new Date().toISOString() })
        .eq('id', currentUser.id);

      if (dbError) throw dbError;
      await refreshProfile();
      setNickname('');
      Alert.alert('✅ Saved!', `Nickname set to "${trimmed}"`);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Avatar + Name */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{currentUser?.email}</Text>
        </View>

        {/* Nickname Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {profile?.nickname ? 'Change Nickname' : 'Set Nickname'}
          </Text>

          {profile?.nickname ? (
            <View style={styles.currentRow}>
              <Text style={styles.currentLabel}>Current:</Text>
              <Text style={styles.currentValue}>{profile.nickname}</Text>
            </View>
          ) : (
            <Text style={styles.noNickname}>
              You haven't set a nickname yet. Your email is shown as placeholder.
            </Text>
          )}

          {!allowed && (
            <View style={styles.lockBanner}>
              <Text style={styles.lockText}>
                🔒 You can change your nickname in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
              </Text>
            </View>
          )}

          {allowed && (
            <>
              <TextInput
                style={[
                  styles.input,
                  isFocused && styles.inputFocused,
                  !!error && styles.inputError,
                ]}
                placeholder="Enter new nickname (2–20 chars)"
                placeholderTextColor="#6B7280"
                value={nickname}
                onChangeText={(t) => { setNickname(t); if (error) setError(''); }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={20}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.85}
              >
                {saving
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={styles.saveBtnText}>Save Nickname</Text>
                }
              </TouchableOpacity>
            </>
          )}

          <Text style={styles.ruleText}>
            💡 Nickname can only be changed once every <Text style={styles.highlight}>30 days</Text>.
          </Text>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.85}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A' },
  content: { padding: 20, paddingBottom: 40 },

  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF' },

  // Avatar
  avatarCard: { backgroundColor: '#161925', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#222533', marginBottom: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  displayName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  email: { fontSize: 13, color: '#6B7280' },

  // Nickname card
  card: { backgroundColor: '#161925', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#222533', marginBottom: 20 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  currentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  currentLabel: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  currentValue: { fontSize: 15, color: '#818CF8', fontWeight: '700' },
  noNickname: { fontSize: 13, color: '#6B7280', lineHeight: 20, marginBottom: 16 },

  lockBanner: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  lockText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },

  input: { width: '100%', backgroundColor: '#0F111A', color: '#FFFFFF', fontSize: 15, fontWeight: '600', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 2, borderColor: '#2D3142', marginBottom: 8 },
  inputFocused: { borderColor: '#6366F1' },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginBottom: 8 },

  saveBtn: { backgroundColor: '#6366F1', borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: '#4338CA', marginBottom: 16 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },

  ruleText: { fontSize: 12, color: '#4B5563', lineHeight: 18 },
  highlight: { color: '#F59E0B', fontWeight: '700' },

  // Sign out
  signOutBtn: { backgroundColor: '#1E293B', borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  signOutText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
});