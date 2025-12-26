import { Button } from "@zigbang/zuix2";
import { ScrollView, StyleSheet, View } from "react-native";
import { PropsLabel } from "../../components/showcase/PropsLabel";
import { Section } from "../../components/showcase/Section";

export default function ShowcaseButton() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Section title="Primary">
        <ButtonRow label='theme="primary" status="normal" size="44"'>
          <Button title="Primary 44" theme="primary" status="normal" size="44" />
        </ButtonRow>
        <ButtonRow label='theme="primary" status="disabled" size="44"'>
          <Button title="Primary 44" theme="primary" status="disabled" size="44" />
        </ButtonRow>

        <ButtonRow label='theme="primary" status="normal" size="40"'>
          <Button title="Primary 40" theme="primary" status="normal" size="40" />
        </ButtonRow>
        <ButtonRow label='theme="primary" status="disabled" size="40"'>
          <Button title="Primary 40" theme="primary" status="disabled" size="40" />
        </ButtonRow>

        <ButtonRow label='theme="primary" status="normal" size="32"'>
          <Button title="Primary 32" theme="primary" status="normal" size="32" />
        </ButtonRow>
        <ButtonRow label='theme="primary" status="disabled" size="32"'>
          <Button title="Primary 32" theme="primary" status="disabled" size="32" />
        </ButtonRow>
      </Section>

      <Section title="Line">
        <ButtonRow label='theme="lineGray10" status="normal" size="44"'>
          <Button title="lineGray10" theme="lineGray10" status="normal" size="44" />
        </ButtonRow>
        <ButtonRow label='theme="lineGray30" status="normal" size="44"'>
          <Button title="lineGray30" theme="lineGray30" status="normal" size="44" />
        </ButtonRow>
        <ButtonRow label='theme="lineGray90" status="normal" size="44"'>
          <Button title="lineGray90" theme="lineGray90" status="normal" size="44" />
        </ButtonRow>
        <ButtonRow label='theme="lineOrange" status="normal" size="44"'>
          <Button title="lineOrange" theme="lineOrange" status="normal" size="44" />
        </ButtonRow>
      </Section>

      <Section title="Filled">
        <ButtonRow label='theme="orange2" status="normal" size="44"'>
          <Button title="orange2" theme="orange2" status="normal" size="44" />
        </ButtonRow>
        <ButtonRow label='theme="red1" status="normal" size="44"'>
          <Button title="red1" theme="red1" status="normal" size="44" />
        </ButtonRow>
        <ButtonRow label='theme="grayOpacity08" status="normal" size="44"'>
          <Button title="grayOpacity08" theme="grayOpacity08" status="normal" size="44" />
        </ButtonRow>
      </Section>

      <Section title="Special">
        <ButtonRow label='theme="orange1G" status="normal" size="44"'>
          <Button title="orange1G" theme="orange1G" status="normal" size="44" />
        </ButtonRow>
        <ButtonRow label='theme="transparent" status="normal" size="44"'>
          <Button title="transparent" theme="transparent" status="normal" size="44" />
        </ButtonRow>
      </Section>
    </ScrollView>
  );
}

function ButtonRow({
  children,
  label,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      {children}
      <PropsLabel text={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  row: {
    gap: 6,
    alignItems: "flex-start",
  },
});


