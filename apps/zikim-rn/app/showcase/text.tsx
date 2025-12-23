import { Text, View } from "react-native";
import { PropsLabel } from "../../components/showcase/PropsLabel";
import { Section } from "../../components/showcase/Section";

export default function ShowcaseText() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Section title="Text">
        <Text>Text showcase (TODO)</Text>
        <PropsLabel text="(아직 구현 전)" />
      </Section>
    </View>
  );
}


