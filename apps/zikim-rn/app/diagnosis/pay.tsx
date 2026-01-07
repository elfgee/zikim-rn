import React, { useMemo, useState } from "react"
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Checkbox, Color, SegmentedControl, Text } from "@zigbang/zuix2"
import { Stack, useRouter } from "expo-router"
import { useDiagnosis } from "@/components/diagnosis/diagnosis-context"

const ZButton: any = Button as any
const ZCheckbox: any = Checkbox as any
const ZText: any = Text as any
const ZSegment: any = SegmentedControl as any

export default function DiagnosisPayScreen() {
	const router = useRouter()
	const { draft, setDraft } = useDiagnosis()

	const planOptions = useMemo(
		() => [
			{ label: "1회 (5,500원)", value: "once" },
			{ label: "5회 (22,000원)", value: "five" },
			...(draft.ticketRemaining > 0 ? [{ label: `이용권 사용 (잔여 ${draft.ticketRemaining}회)`, value: "ticket" }] : []),
		],
		[draft.ticketRemaining]
	)

	const [agree1, setAgree1] = useState(false)
	const [agree2, setAgree2] = useState(false)

	const payDisabled = useMemo(() => !draft.paymentPlan || !agree1 || !agree2, [draft.paymentPlan, agree1, agree2])

	const totalPriceLabel = useMemo(() => {
		if (draft.paymentPlan === "once") return "5,500원"
		if (draft.paymentPlan === "five") return "22,000원"
		if (draft.paymentPlan === "ticket") return "0원"
		return "-"
	}, [draft.paymentPlan])

	return (
		<>
			<Stack.Screen options={{ title: "결제" }} />
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={styles.card}>
						<ZText size="14" weight="bold" color={Color.gray10}>
							결제 옵션
						</ZText>
						<ZSegment
							options={planOptions}
							value={draft.paymentPlan}
							onChange={(v: string) => setDraft((p) => ({ ...p, paymentPlan: v as any }))}
						/>
						<View style={styles.summaryRow}>
							<ZText size="13" weight="regular" color={Color.gray40}>
								총 결제금액
							</ZText>
							<ZText size="13" weight="bold" color={Color.gray10}>
								{totalPriceLabel}
							</ZText>
						</View>
						<ZText size="12" weight="regular" color={Color.gray50}>
							이용권은 직방 타 서비스 이용 또는 마케팅 목적으로 무료 제공될 수 있어요.
						</ZText>
					</View>

					<View style={styles.section}>
						<ZCheckbox
							text="[필수] 서비스 이용약관 및 개인정보처리방침에 동의합니다."
							checked={agree1}
							onPress={() => setAgree1((v: boolean) => !v)}
							mt={0}
							mr={0}
							mb={0}
							ml={0}
						/>
						<ZCheckbox
							text="[필수] 결제 대행 서비스 약관에 동의합니다."
							checked={agree2}
							onPress={() => setAgree2((v: boolean) => !v)}
							mt={10}
							mr={0}
							mb={0}
							ml={0}
						/>
					</View>

					<View style={styles.ctaWrapper}>
						<ZButton
							title={draft.paymentPlan === "ticket" ? "이용권으로 발급하기" : `${totalPriceLabel} 결제하기`}
							size="44"
							theme="primary"
							status={payDisabled ? "disabled" : "normal"}
							onPress={() => {
								if (payDisabled) return
								if (draft.paymentPlan === "ticket") {
									setDraft((p) => ({ ...p, ticketRemaining: Math.max(0, p.ticketRemaining - 1) }))
									router.replace("/diagnosis/issuing" as any)
									return
								}
								Alert.alert("결제", "결제 모의 동작입니다.", [
									{
										text: "확인",
										onPress: () => router.replace("/diagnosis/issuing" as any),
									},
								])
							}}
						/>
						<ZButton title="뒤로" size="44" theme="lineGray90" onPress={() => router.back()} />
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Color.white as any },
	container: { padding: 16, gap: 16 },
	card: { padding: 16, borderRadius: 12, backgroundColor: Color.gray99 as any, gap: 10 },
	section: { gap: 10 },
	summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	ctaWrapper: { gap: 10, marginTop: 6 },
})

