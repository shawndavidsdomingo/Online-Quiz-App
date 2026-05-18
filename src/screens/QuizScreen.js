import { View, Text, StyleSheet } from 'react-native';

// TODO: M2 PR-04 (feat/ui-quiz)
// Questions fetched from The Trivia API: https://the-trivia-api.com/v2/questions
// API response shape (from example.json):
//   question.text   — the question string
//   correctAnswer   — string
//   incorrectAnswers — array of 3 strings
//   category, difficulty, type
// Claude API used ONLY for getHint() — NOT for generating questions
export default function QuizScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QuizScreen</Text>
      <Text style={styles.sub}>feat/ui-quiz</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: '600', color: '#1E3A8A' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});
