import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ShowcaseHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showcase</Text>

      <View style={styles.list}>
        <Link href="/showcase/button" style={styles.link}>
          Button
        </Link>
        <Link href="/showcase/text" style={styles.link}>
          Text
        </Link>
        <Link href="/showcase/chip" style={styles.link}>
          Chip
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  list: {
    gap: 12,
  },
  link: {
    fontSize: 16,
  },
});


