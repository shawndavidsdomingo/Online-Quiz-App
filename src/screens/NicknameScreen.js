import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

const { width } = Dimensions.get('window');

// Reusable Custom Geometric Logo System matching LoginScreen
const CustomAppLogo = () => (
  <View style={styles.logoContainer}>
    <View style={[styles.logoCard, styles.logoCardBack]} />
    <View style={[styles.logoCard, styles.logoCardMiddle]} />
    <View style={[styles.logoCard, styles.logoCardFront]}>
      <View style={styles.logoInnerDot} />
    </View>
  </View>
);

export default function NicknameScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { session } = useAuth();
  const handleSave = async () => {
  const trimmedName = nickname.trim();

  if (trimmedName.length < 2) {
    setError('Nickname must be at least 2 characters.');
    return;
  }

  if (trimmedName.length > 20) {
    setError('Nickname cannot exceed 20 characters.');
    return;
  }

  setError('');
  Keyboard.dismiss();

  // Check 30-day rule
  const { data: existing } = await supabase
    .from('profiles')
    .select('nickname_updated_at')
    .eq('id', session.user.id)
    .single();

  if (existing?.nickname_updated_at) {
    const lastUpdated = new Date(existing.nickname_updated_at);
    const daysSince = (Date.now() - lastUpdated) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) {
      setError('You can only change your nickname once every 30 days.');
      return;
    }
  }

  // Upsert profile
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: session.user.id,
      email: session.user.email,
      nickname: trimmedName,
      nickname_updated_at: new Date().toISOString(),
    });

  if (upsertError) {
    setError('Failed to save nickname. Please try again.');
    return;
  }

  navigation.navigate('Dashboard', { nickname: trimmedName });
};

  return (
    <KeyboardAvoidingView 
      // FIX: Setting background color here guarantees no whitespace leaks when view shifts
      style={styles.avoidingWrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* Playful Background Decorative Shapes */}
          <View style={[styles.decoratorCircle, styles.decorator1]} />
          <View style={[styles.decoratorCircle, styles.decorator2]} />

          <View style={styles.mainContent}>
            
            {/* Header Section with Identity Logo */}
            <View style={styles.headerSection}>
              <CustomAppLogo />
              <Text style={styles.title}>Claim Your Name</Text>
              <Text style={styles.subtitle}>What should we call you on the leaderboard?</Text>
            </View>

            {/* Interaction Card */}
            <View style={styles.interactionCard}>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    isFocused && styles.textInputFocused,
                    error ? styles.textInputError : null
                  ]}
                  placeholder="Enter nickname (2-20 chars)"
                  placeholderTextColor="#6B7280"
                  value={nickname}
                  onChangeText={(text) => {
                    setNickname(text);
                    if (error) setError('');
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={20}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                
                <Text style={styles.errorText}>{error ? error : ' '}</Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Save Nickname</Text>
              </TouchableOpacity>
              
            </View>

            {/* 30-Day Rule Explanation */}
            <View style={styles.ruleContainer}>
              <Text style={styles.ruleIcon}>💡</Text>
              <Text style={styles.ruleText}>
                Choose wisely! You can only change your nickname once every <Text style={styles.ruleHighlight}>30 days</Text>.
              </Text>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  avoidingWrapper: {
    flex: 1,
    backgroundColor: '#0F111A', // Locked base background color
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 10,
  },

  // --- PLAYFUL BACKGROUND CIRCLES ---
  decoratorCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
  },
  decorator1: {
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#10B981',
    top: -100,
    right: -80,
  },
  decorator2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#EC4899',
    bottom: -80,
    left: -50,
  },

  // --- CUSTOM GEOMETRIC LOGO SYSTEM ---
  logoContainer: {
    width: 100,
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCard: {
    position: 'absolute',
    width: 50,
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
  },
  logoCardBack: {
    backgroundColor: '#312E81',
    borderColor: '#4338CA',
    transform: [{ rotate: '-15deg' }, { translateX: -12 }],
    opacity: 0.5,
  },
  logoCardMiddle: {
    backgroundColor: '#1E1B4B',
    borderColor: '#4F46E5',
    transform: [{ rotate: '8deg' }, { translateX: 8 }, { translateY: -4 }],
    opacity: 0.8,
  },
  logoCardFront: {
    backgroundColor: '#6366F1', 
    borderColor: '#818CF8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  logoInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },

  // --- HEADER ---
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // --- INTERACTION CARD ---
  interactionCard: {
    width: '100%',
    backgroundColor: '#161925',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222533',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#0F111A',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#2D3142',
  },
  textInputFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#131521',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginLeft: 8,
    minHeight: 18,
  },

  // --- PRIMARY BUTTON ---
  primaryButton: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#4338CA', 
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // --- RULES SECTION ---
  ruleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 65, 81, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  ruleIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  ruleText: {
    flex: 1,
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
    fontWeight: '500',
  },
  ruleHighlight: {
    color: '#F59E0B',
    fontWeight: '700',
  },
});