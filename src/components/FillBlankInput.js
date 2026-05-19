import { View, TextInput, Text, StyleSheet } from 'react-native';

/**
 * FillBlankInput
 * Text input for fill-in-blank questions.
 *
 * Props:
 *   value       {string}
 *   onChangeText {function}
 *   disabled    {boolean} — after submit
 *   correct     {boolean|null} — null = not submitted yet
 *   correctAnswer {string} — shown after submit if wrong
 */
export default function FillBlankInput({ value, onChangeText, disabled, correct, correctAnswer }) {
  const getBorderColor = () => {
    if (!disabled || correct === null) return '#2D3142';
    return correct ? '#10B981' : '#EF4444';
  };

  const getBgColor = () => {
    if (!disabled || correct === null) return '#0F111A';
    if (correct) return 'rgba(16,185,129,0.1)';
    return 'rgba(239,68,68,0.1)';
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[
          styles.input,
          { borderColor: getBorderColor(), backgroundColor: getBgColor() },
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        placeholder="Type your answer here..."
        placeholderTextColor="#4B5563"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {disabled && !correct && correctAnswer && (
        <View style={styles.correctAnswerBox}>
          <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
          <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 12 },
  input: {
    width: '100%',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
  },
  correctAnswerBox: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  correctAnswerLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  correctAnswerText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '700',
  },
});