import { StyleSheet, Text, View } from "react-native";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    gap: 12,
  },
});


