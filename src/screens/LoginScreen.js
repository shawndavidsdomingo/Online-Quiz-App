import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator, Alert, Platform
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');
WebBrowser.maybeCompleteAuthSession();

const CustomAppLogo = () => (
  <View style={styles.logoContainer}>
    <View style={[styles.logoCard, styles.logoCardBack]} />
    <View style={[styles.logoCard, styles.logoCardMiddle]} />
    <View style={[styles.logoCard, styles.logoCardFront]}>
      <View style={styles.logoInnerDot} />
    </View>
  </View>
);

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
        return;
      }

      // Mobile: open browser, catch redirect
      const redirectTo = Linking.createURL(''); // ← fixed: no slash
      console.log('redirectTo:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      console.log('result:', JSON.stringify(result));

      if (result.type === 'success') {
        const url = result.url;
        const hash = url.split('#')[1] ?? url.split('?')[1] ?? '';
        const p = new URLSearchParams(hash);
        const access_token  = p.get('access_token');
        const refresh_token = p.get('refresh_token');
        console.log('access_token found:', !!access_token);
        if (access_token) {
          await supabase.auth.setSession({ access_token, refresh_token: refresh_token ?? '' });
        }
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.decoratorCircle, styles.decorator1]} pointerEvents="none" />
      <View style={[styles.decoratorCircle, styles.decorator2]} pointerEvents="none" />
      <View style={[styles.decoratorCircle, styles.decorator3]} pointerEvents="none" />
      <View style={styles.mainContent}>
        <View style={styles.headerSection}>
          <CustomAppLogo />
          <Text style={styles.brandName}>QuizApp</Text>
          <Text style={styles.brandTagline}>Master new topics, one challenge at a time.</Text>
        </View>
        <View style={styles.authCard}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.subText}>Sign in to save your progress and compete on the leaderboard.</Text>
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.disabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator size="small" color="#4285F4" style={{ marginRight: 12 }} />
              : <View style={styles.gIcon}><Text style={styles.gIconText}>G</Text></View>
            }
            <Text style={styles.googleButtonText}>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footerNote}>Secure authentication powered by Google</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F111A', alignItems: 'center', justifyContent: 'center' },
  mainContent: { width: '100%', maxWidth: 360, paddingHorizontal: 24, alignItems: 'center', zIndex: 10 },
  decoratorCircle: { position: 'absolute', borderRadius: 999, opacity: 0.12, zIndex: 0 },
  decorator1: { width: width * 0.8, height: width * 0.8, backgroundColor: '#6366F1', top: -80, left: -60 },
  decorator2: { width: width * 0.6, height: width * 0.6, backgroundColor: '#F59E0B', bottom: -60, right: -40 },
  decorator3: { width: 120, height: 120, backgroundColor: '#10B981', top: '35%', right: -30 },
  logoContainer: { width: 100, height: 85, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  logoCard: { position: 'absolute', width: 50, height: 64, borderRadius: 14, borderWidth: 2 },
  logoCardBack: { backgroundColor: '#312E81', borderColor: '#4338CA', transform: [{ rotate: '-15deg' }, { translateX: -12 }], opacity: 0.5 },
  logoCardMiddle: { backgroundColor: '#1E1B4B', borderColor: '#4F46E5', transform: [{ rotate: '8deg' }, { translateX: 8 }, { translateY: -4 }], opacity: 0.8 },
  logoCardFront: { backgroundColor: '#6366F1', borderColor: '#818CF8', justifyContent: 'center', alignItems: 'center', elevation: 6 },
  logoInnerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  brandName: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 8 },
  brandTagline: { fontSize: 15, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 16 },
  authCard: { width: '100%', backgroundColor: '#161925', borderRadius: 28, paddingVertical: 36, paddingHorizontal: 24, alignItems: 'center', borderWidth: 1, borderColor: '#222533', marginBottom: 0 },
  welcomeText: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  googleButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, width: '100%', borderBottomWidth: 3, borderBottomColor: '#E5E7EB' },
  disabled: { opacity: 0.7 },
  gIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  gIconText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  googleButtonText: { color: '#1F2937', fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  footerNote: { marginTop: 28, fontSize: 12, fontWeight: '600', color: '#4B5563' },
});