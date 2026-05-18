import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * OptionButton
 * Multiple-choice answer option.
 *
 * Props:
 *   label     {string}  — answer text
 *   selected  {boolean} — currently selected
 *   disabled  {boolean} — after submit
 *   correct   {boolean|null} — null = not submitted yet
 *   onPress   {function}
 */
export default function OptionButton({ label, selected, disabled, correct, onPress }) {
  const getStyle = () => {
    if (disabled && correct === true)  return [styles.btn, styles.correct];
    if (disabled && correct === false && selected) return [styles.btn, styles.wrong];
    if (selected) return [styles.btn, styles.selected];
    return [styles.btn];
  };

  const getTextStyle = () => {
    if (disabled && correct === true)  return [styles.txt, styles.txtCorrect];
    if (disabled && correct === false && selected) return [styles.txt, styles.txtWrong];
    if (selected) return [styles.txt, styles.txtSelected];
    return [styles.txt];
  };

  const getIndicator = () => {
    if (disabled && correct === true)  return '✓';
    if (disabled && correct === false && selected) return '✗';
    return null;
  };

  return (
    <TouchableOpacity
      style={getStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()} numberOfLines={3}>{label}</Text>
      {getIndicator() && (
        <Text style={[styles.indicator, correct ? styles.indicatorCorrect : styles.indicatorWrong]}>
          {getIndicator()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#161925',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2D3142',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selected: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99,102,241,0.15)',
  },
  correct: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16,185,129,0.15)',
  },
  wrong: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  txt: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  txtSelected: { color: '#818CF8' },
  txtCorrect:  { color: '#10B981' },
  txtWrong:    { color: '#EF4444' },
  indicator: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  indicatorCorrect: { color: '#10B981' },
  indicatorWrong:   { color: '#EF4444' },
});