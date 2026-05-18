import React, { useState } from 'react';
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

export default function NicknameScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    // UI Validation
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
    
    // TODO: M4/M5 - Supabase profile update logic goes here
    console.log('Valid nickname saved:', trimmedName);
    
    // Mock navigation to Dashboard (PR-03)
    // navigation.navigate('DashboardScreen');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          {/* Playful Background Decorative Shapes */}
          <View style={[styles.decoratorCircle, styles.decorator1]} />
          <View style={[styles.decoratorCircle, styles.decorator2]} />

          <View style={styles.mainContent}>
            
            {/* Header / Avatar Placeholder */}
            <View style={styles.headerSection}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarEmoji}>👾</Text>
              </View>
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
                    if (error) setError(''); // Clear error on typing
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={20}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                
                {/* Dynamic Error Message Space */}
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
  container: {
    flex: 1,
    backgroundColor: '#0F111A', // Matches LoginScreen Midnight base
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
    backgroundColor: '#10B981', // Emerald top-right this time
    top: -100,
    right: -80,
  },
  decorator2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#EC4899', // Playful Pink bottom-left
    bottom: -80,
    left: -50,
  },

  // --- HEADER ---
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#1E1B4B',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarEmoji: {
    fontSize: 40,
    marginLeft: 4, // Visual center adjustment for some emojis
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
    backgroundColor: '#161925', // Matches LoginScreen Card
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
    borderColor: '#6366F1', // Indigo glow on focus
    backgroundColor: '#131521',
  },
  textInputError: {
    borderColor: '#EF4444', // Red border on error
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginLeft: 8,
    minHeight: 18, // Prevents layout shift when error appears
  },

  // --- PRIMARY BUTTON ---
  primaryButton: {
    backgroundColor: '#6366F1', // Primary Indigo
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    // Tactile baseline matching the Google button but colorful
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
    backgroundColor: 'rgba(55, 65, 81, 0.4)', // Subtle gray pill
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
    color: '#F59E0B', // Amber highlight
    fontWeight: '700',
  },
});