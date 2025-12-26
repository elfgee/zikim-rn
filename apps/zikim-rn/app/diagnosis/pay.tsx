import React, { useMemo, useState } from "react"
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { Button, Checkbox, ListSelectItem, RadioButton } from "@zigbang/zuix2"
import { Stack, useRouter } from "expo-router"
import { HeaderBackButton } from "@react-navigation/elements"

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
		<>
			<Stack.Screen
				options={{
					title: "결제",
					headerLeft: () => (
						<HeaderBackButton
							onPress={() => {
								router.replace("/diagnosis-start" as any)
							}}
						/>
					),
				}}
			/>
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>

				{/* Item info */}
				<View style={styles.card}>
					<View style={styles.itemRow}>
						<View style={styles.thumb} />
						<View style={styles.itemTextWrap}>
							<Text style={styles.itemType}>아파트</Text>
							<Text style={styles.itemName}>레미안옥수리버젠</Text>
							<Text style={styles.itemPrice}>84m² / 보증금 5억 / 월세 50만</Text>
							<Text style={styles.itemAddr}>서울시 성동구 옥수동 561</Text>
						</View>
					</View>
				</View>

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
					<RadioButton text="직방 페이" checked disabled mt={0} mr={0} mb={0} ml={0} style={undefined} />
				</View>

				{/* Card selection */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>카드 선택</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.cardRow}
					>
						<Pressable
							style={[styles.cardChoice, card === "shinhan" && styles.cardChoiceSelectedShinhan]}
							onPress={() => setCard("shinhan")}>
							<Text style={[styles.cardChoiceText, card === "shinhan" && styles.cardChoiceTextSelected]}>
								신한카드
							</Text>
							<Text style={[styles.cardChoiceSub, card === "shinhan" && styles.cardChoiceTextSelected]}>
								4221 55** **** 8123
							</Text>
						</Pressable>
						<Pressable
							style={[styles.cardChoice, card === "woori" && styles.cardChoiceSelectedWoori]}
							onPress={() => setCard("woori")}>
							<Text style={[styles.cardChoiceText, card === "woori" && styles.cardChoiceTextSelected]}>
								우리카드
							</Text>
							<Text style={[styles.cardChoiceSub, card === "woori" && styles.cardChoiceTextSelected]}>
								5387 1234
							</Text>
						</Pressable>
					</ScrollView>
				</View>

				{/* Installment */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>할부 선택</Text>
					<ListSelectItem
						title={installment}
						subtitle=""
						left={undefined}
						right={undefined}
						style={undefined}
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
						mr={0}
						mb={0}
						ml={0}
						style={undefined}
					/>
					<Checkbox
						text="[필수] 결제 대행 서비스 약관에 동의합니다."
						checked={agree2}
						onPress={() => setAgree2((v: boolean) => !v)}
						mt={8}
						mr={0}
						mb={0}
						ml={0}
						style={undefined}
					/>
					<Checkbox
						text="[선택] 마케팅 정보 수신에 동의합니다."
						checked={agree3}
						onPress={() => setAgree3((v: boolean) => !v)}
						mt={8}
						mr={0}
						mb={0}
						ml={0}
						style={undefined}
					/>
				</View>

				{/* CTA */}
				<View style={styles.ctaWrapper}>
					<Button
						title="29,900원 결제하기"
						size="44"
						theme="primary"
						status={payDisabled ? "disabled" : "normal"}
						style={undefined}
						overlay={undefined}
						onPress={handlePay}
					/>
					<Button title="뒤로" size="44" theme="lineGray90" style={undefined} overlay={undefined} onPress={() => router.back()} />
				</View>
				</ScrollView>
			</SafeAreaView>
		</>
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
	cardRow: { gap: 12, paddingRight: 12 },
	ctaWrapper: { gap: 8 },
	cardChoice: {
		width: 260,
		aspectRatio: 8 / 5,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E6E6E6",
		backgroundColor: "#F8F8F8",
		gap: 4,
		justifyContent: "flex-end",
	},
	cardChoiceSelectedShinhan: {
		backgroundColor: "#1C47FA",
		borderColor: "#1C47FA",
	},
	cardChoiceSelectedWoori: {
		backgroundColor: "#0EAAE8",
		borderColor: "#0EAAE8",
	},
	cardChoiceText: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },
	cardChoiceTextSelected: { color: "#FFFFFF" },
	cardChoiceSub: { fontSize: 13, color: "#555" },
	itemRow: { flexDirection: "row", gap: 12, alignItems: "center" },
	itemTextWrap: { flex: 1, gap: 4 },
	itemType: { fontSize: 12, color: "#4D4D4D" },
	itemName: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
	itemAddr: { fontSize: 14, color: "#4D4D4D" },
	itemPrice: { fontSize: 14, fontWeight: "600", color: "#1A1A1A" },
	thumb: { width: 90, height: 90, borderRadius: 12, backgroundColor: "#E6E6E6" },
})

