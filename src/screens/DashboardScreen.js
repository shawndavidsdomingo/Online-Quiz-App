import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ route, navigation }) {
  // Grab the passed nickname, fallback to a placeholder if undefined
  const userNickname = route.params?.nickname || "QuizMaster👾"; 
  
  const totalQuizzes = 12;
  const avgScore = 84;

  // Category and Difficulty Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

  const categories = ['All', 'Tech', 'Science', 'History', 'Pop Culture'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleStartQuiz = () => {
    console.log('Starting quiz with filters:', { selectedCategory, selectedDifficulty });
    // Future PR-04 routing hook:
    // navigation.navigate('Quiz', { category: selectedCategory, difficulty: selectedDifficulty });
  };

  return (
    <ScrollView style={styles.scrollWrapper} contentContainerStyle={styles.container}>
      
      {/* Playful Background Decorative Shapes */}
      <View style={[styles.decoratorCircle, styles.decorator1]} />
      <View style={[styles.decoratorCircle, styles.decorator2]} />

      <View style={styles.mainContent}>
        
        {/* Playful Greeting Header */}
        <View style={styles.headerSection}>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.nicknameText}>{userNickname}</Text>
        </View>

        {/* Stats Grid Dashboard Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{totalQuizzes}</Text>
            <Text style={styles.statLabel}>Quizzes Played</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{avgScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>

        {/* Configuration Card / Selectors */}
        <View style={styles.configCard}>
          <Text style={styles.cardTitle}>Configure Arena</Text>
          
          {/* Category Selector Line */}
          <Text style={styles.filterLabel}>Select Category</Text>
          <View style={styles.pillContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.pill, selectedCategory === cat && styles.pillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Difficulty Selector Line */}
          <Text style={styles.filterLabel}>Select Difficulty</Text>
          <View style={styles.pillContainer}>
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[styles.pill, selectedDifficulty === diff && styles.pillActive]}
                onPress={() => setSelectedDifficulty(diff)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selectedDifficulty === diff && styles.pillTextActive]}>
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Heavy Tactile Start Action Button */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartQuiz}
            activeOpacity={0.85}
          >
            <Text style={styles.startButtonText}>🚀 Enter Quiz Arena</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollWrapper: {
    flex: 1,
    backgroundColor: '#0F111A', // Consistent Midnight base
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  mainContent: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 24,
    zIndex: 10,
  },

  // --- BACKGROUND GLOW ORBS ---
  decoratorCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  decorator1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#6366F1', // Playful Indigo
    top: -40,
    left: -40,
  },
  decorator2: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#F59E0B', // Vibrant Amber
    bottom: 20,
    right: -60,
  },

  // --- GREETING HEADER ---
  headerSection: {
    width: '100%',
    marginBottom: 28,
  },
  greetingText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  nicknameText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginTop: 4,
  },

  // --- STATS GRID ---
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#161925',
    width: '47%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222533',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // --- CONFIGURATION MANAGEMENT CARD ---
  configCard: {
    backgroundColor: '#161925',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#222533',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  filterLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    backgroundColor: '#0F111A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#2D3142',
  },
  pillActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  pillText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#818CF8',
    fontWeight: '700',
  },

  // --- LAUNCH ACTION BUTTON ---
  startButton: {
    backgroundColor: '#10B981', // Vibrant Emerald green for action triggers
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#059669', // Deep crisp edge baseline
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});