import React, { useMemo, useState } from "react"
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { Button, Checkbox, ListItem, ListSelectItem, RadioButton } from "@zigbang/zuix2"
import { useRouter } from "expo-router"

export default function DiagnosisPayScreen() {
	const router = useRouter()

	// mock data
	const [card, setCard] = useState<"shinhan" | "woori" | null>("shinhan")
	const [installment, setInstallment] = useState<"일시불" | "2개월">("일시불")
	const [agree1, setAgree1] = useState(false)
	const [agree2, setAgree2] = useState(false)
	const [agree3, setAgree3] = useState(false)

	const payDisabled = useMemo(() => !agree1 || !agree2 || !card, [agree1, agree2, card])

	const handlePay = () => {
		if (payDisabled) return
		Alert.alert("결제", "결제 모의 동작입니다.")
	}

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>결제</Text>

				{/* Item info */}
				<ListItem
					left={<View style={styles.thumb} />}
					title="서울시 강남구 역삼동 | 84m²"
					subtitle1="아파트"
					subtitle2="보증금 5억 / 월세 50만"
					style={styles.card}
				/>

				{/* Summary */}
				<View style={styles.card}>
					<View style={styles.row}>
						<Text style={styles.label}>지킴진단 리포트</Text>
						<Text style={styles.value}>29,900원</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>할인</Text>
						<Text style={styles.value}>-0원</Text>
					</View>
					<View style={styles.rowTotal}>
						<Text style={[styles.label, styles.bold]}>총 결제금액</Text>
						<Text style={[styles.value, styles.bold]}>29,900원</Text>
					</View>
				</View>

				{/* Payment method */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>결제 수단</Text>
					<RadioButton text="직방 페이" checked disabled />
				</View>

				{/* Card selection */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>카드 선택</Text>
					<View style={styles.cardRow}>
						<Pressable
							style={[styles.cardChoice, card === "shinhan" && styles.cardChoiceSelected]}
							onPress={() => setCard("shinhan")}>
							<Text style={[styles.cardChoiceText, card === "shinhan" && styles.cardChoiceTextSelected]}>
								신한카드
							</Text>
							<Text style={[styles.cardChoiceSub, card === "shinhan" && styles.cardChoiceTextSelected]}>
								4221 55** **** 8123
							</Text>
						</Pressable>
						<Pressable
							style={[styles.cardChoice, card === "woori" && styles.cardChoiceSelected]}
							onPress={() => setCard("woori")}>
							<Text style={[styles.cardChoiceText, card === "woori" && styles.cardChoiceTextSelected]}>
								우리카드
							</Text>
							<Text style={[styles.cardChoiceSub, card === "woori" && styles.cardChoiceTextSelected]}>
								5387 1234
							</Text>
						</Pressable>
					</View>
				</View>

				{/* Installment */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>할부 선택</Text>
					<ListSelectItem
						title={installment}
						onPress={() => setInstallment(installment === "일시불" ? "2개월" : "일시불")}
						mt={8}
						mb={8}
					/>
				</View>

				{/* Agreements */}
				<View style={styles.section}>
					<Checkbox
						text="[필수] 서비스 이용약관 및 개인정보처리방침에 동의합니다."
						checked={agree1}
						onPress={() => setAgree1((v: boolean) => !v)}
						mt={4}
					/>
					<Checkbox
						text="[필수] 결제 대행 서비스 약관에 동의합니다."
						checked={agree2}
						onPress={() => setAgree2((v: boolean) => !v)}
						mt={8}
					/>
					<Checkbox
						text="[선택] 마케팅 정보 수신에 동의합니다."
						checked={agree3}
						onPress={() => setAgree3((v: boolean) => !v)}
						mt={8}
					/>
				</View>

				{/* CTA */}
				<View style={styles.ctaWrapper}>
					<Button
						title="29,900원 결제하기"
						size="44"
						theme="primary"
						status={payDisabled ? "disabled" : "normal"}
						onPress={handlePay}
					/>
					<Button title="뒤로" size="44" theme="lineGray90" onPress={() => router.back()} />
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#FFF" },
	container: { padding: 20, gap: 16 },
	title: { fontSize: 20, fontWeight: "700" },
	card: { padding: 16, borderRadius: 12, backgroundColor: "#F8F8F8", gap: 8 },
	row: { flexDirection: "row", justifyContent: "space-between" },
	rowTotal: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
	label: { fontSize: 14, color: "#333" },
	value: { fontSize: 14, color: "#333" },
	bold: { fontWeight: "700" },
	section: { gap: 8 },
	sectionTitle: { fontSize: 15, fontWeight: "700" },
	cardRow: { gap: 8 },
	thumb: { width: 48, height: 48, borderRadius: 8, backgroundColor: "#E6E6E6" },
	ctaWrapper: { gap: 8 },
	cardChoice: {
		padding: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E6E6E6",
		backgroundColor: "#F8F8F8",
		gap: 4,
	},
	cardChoiceSelected: {
		backgroundColor: "#1A1A1A",
		borderColor: "#1A1A1A",
	},
	cardChoiceText: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },
	cardChoiceTextSelected: { color: "#FFFFFF" },
	cardChoiceSub: { fontSize: 13, color: "#555" },
})

