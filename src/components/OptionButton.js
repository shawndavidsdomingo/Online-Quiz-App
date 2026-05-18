import { View, Text, StyleSheet } from 'react-native';

// TODO: M2 — implementation assigned per sprint deliverables
export default function OptionButton() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>OptionButton</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#E2E8F0', borderRadius: 8, margin: 6 },
  text: { fontSize: 13, color: '#475569' },
});
