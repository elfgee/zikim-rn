import { Color } from "@zigbang/zuix2";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PropsLabel } from "../../components/showcase/PropsLabel";
import { Section } from "../../components/showcase/Section";

type Swatch = { name: string; value: string };

const SWATCHES: Swatch[] = Object.entries(Color as Record<string, string>)
  .filter(([, v]) => typeof v === "string")
  .map(([k, v]) => ({ name: k, value: v }))
  .slice(0, 20);

export default function TokensPage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Section title="Colors">
        <PropsLabel text="ZUIX Color 토큰 일부(최대 20개) 미리보기" />

        <View style={styles.grid}>
          {SWATCHES.map(({ name, value }) => {
            const textColor = getReadableTextColor(value);
            return (
              <View key={name} style={styles.card}>
                <View style={[styles.swatch, { backgroundColor: value }]} />
                <Text style={[styles.name, { color: textColor }]}>{name}</Text>
                <Text style={[styles.value, { color: textColor }]}>{value}</Text>
              </View>
            );
          })}
        </View>
      </Section>
    </ScrollView>
  );
}

function getReadableTextColor(bg: string) {
  const rgb = parseToRgb(bg);
  if (!rgb) return "#111";
  const { r, g, b, a } = rgb;
  // If mostly transparent, default to dark text.
  if (a !== undefined && a < 0.3) return "#111";
  // Perceived luminance.
  const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return l > 0.7 ? "#111" : "#FFF";
}

function parseToRgb(input: string): { r: number; g: number; b: number; a?: number } | null {
  const v = input.trim().toLowerCase();
  if (v === "transparent") return { r: 255, g: 255, b: 255, a: 0 };
  if (v.startsWith("#")) {
    const hex = v.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r, g, b };
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b };
    }
    return null;
  }
  const m = v.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*([0-9.]+)\s*)?\)$/);
  if (m) {
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    const a = m[4] !== undefined ? Number(m[4]) : undefined;
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    if (a !== undefined && Number.isNaN(a)) return null;
    return { r, g, b, a };
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: 160,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.15)",
  },
  swatch: {
    height: 72,
  },
  name: {
    paddingTop: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    paddingBottom: 12,
    paddingHorizontal: 12,
    fontSize: 12,
    opacity: 0.8,
  },
});




