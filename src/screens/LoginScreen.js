import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

// Custom Geometric Logo: Layered quiz cards / knowledge fragments
const CustomAppLogo = () => (
  <View style={styles.logoContainer}>
    <View style={[styles.logoCard, styles.logoCardBack]} />
    <View style={[styles.logoCard, styles.logoCardMiddle]} />
    <View style={[styles.logoCard, styles.logoCardFront]}>
      <View style={styles.logoInnerDot} />
    </View>
  </View>
);

// M2 PR-01 (feat/ui-login)
// Google Sign-In button UI only — temporary routing added for PR-02 UI testing
export default function LoginScreen({ navigation }) {
  const handleGoogleSignIn = () => {
    console.log('Google Sign-In pressed');
    // Temporarily routing to Nickname screen for UI verification
    navigation.navigate('Nickname');
  };

  return (
    <View style={styles.container}>
      {/* Playful Background Decorative Shapes */}
      <View style={[styles.decoratorCircle, styles.decorator1]} />
      <View style={[styles.decoratorCircle, styles.decorator2]} />
      <View style={[styles.decoratorCircle, styles.decorator3]} />

      <View style={styles.mainContent}>
        
        {/* Branding Header */}
        <View style={styles.headerSection}>
          <CustomAppLogo />
          <Text style={styles.brandName}>QuizApp</Text>
          <Text style={styles.brandTagline}>Master new topics, one challenge at a time.</Text>
        </View>

        {/* Interaction Card */}
        <View style={styles.authCard}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.subText}>Sign in to save your progress and compete on the leaderboard.</Text>

          {/* Authentic, Production-Grade Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.85}
          >
            {/* Official Google G Icon Asset */}
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }} 
              style={styles.googleIcon}
              // Note: Once you download a local google icon to your assets folder, swap uri for:
              // source={require('../assets/google-icon.png')}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Minimalist Footnote */}
        <Text style={styles.footerNote}>Secure authentication powered by Google</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F111A', // Midnight base
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
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#6366F1', // Playful Indigo
    top: -80,
    left: -60,
  },
  decorator2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#F59E0B', // Vibrant Amber
    bottom: -60,
    right: -40,
  },
  decorator3: {
    width: 120,
    height: 120,
    backgroundColor: '#10B981', // Emerald pop
    top: '35%',
    right: -30,
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

  // --- BRAND TYPOGRAPHY ---
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  brandTagline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // --- CARD LAYOUT ---
  authCard: {
    width: '100%',
    backgroundColor: '#161925',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222533',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },

  // --- REAL GOOGLE BUTTON ---
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    // Subtle tactile baseline
    borderBottomWidth: 3,
    borderBottomColor: '#E5E7EB',
  },
  googleIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  googleButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 22, // Keeps text flawlessly balanced opposite the icon width
  },

  // --- FOOTER ---
  footerNote: {
    marginTop: 28,
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    letterSpacing: 0.3,
  },
});