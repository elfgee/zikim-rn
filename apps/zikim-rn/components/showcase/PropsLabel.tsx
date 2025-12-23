import { StyleSheet, Text } from "react-native";

export function PropsLabel({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
});


