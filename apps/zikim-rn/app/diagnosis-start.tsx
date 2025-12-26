import React, { useMemo, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
// zuix2 exports (source: packages/zuix/src/index.ts -> components/index.ts)
import { Button, Checkbox, TextInput } from "@zigbang/zuix2"

type ContractValue = "1y" | "2y" | "3y+" | null

// Inline-only SegmentedControl (DS 미지원이라 화면 내부에 한정)
function InlineSegment({
	value,
	onChange,
	disabled,
}: {
	value: ContractValue
	onChange: (v: ContractValue) => void
	disabled?: boolean
}) {
	const options = [
		{ label: "1년", value: "1y" as const },
		{ label: "2년", value: "2y" as const },
		{ label: "3년 이상", value: "3y+" as const },
	]
	return (
		<View style={[styles.segmentRow, disabled && styles.disabled]}>
			{options.map((opt) => {
				const selected = value === opt.value
				return (
					<Button
						key={opt.value}
						title={opt.label}
						size="44"
						theme={selected ? "primary" : "lineGray90"}
						status={disabled ? "disabled" : "normal"}
						onPress={() => onChange(opt.value)}
						style={styles.segmentButton}
					/>
				/>
			))}
		</View>
	)
}

// 숫자 입력 필터 (digits only)
const onlyDigits = (v: string) => v.replace(/[^\d]/g, "")

export default function DiagnosisStartScreen() {
	const [address, setAddress] = useState("")
	const [area, setArea] = useState("")
	const [deposit, setDeposit] = useState("")
	const [monthlyRent, setMonthlyRent] = useState("")
	const [contractPeriod, setContractPeriod] = useState<ContractValue>(null)
	const [agreeRequired1, setAgreeRequired1] = useState(false)
	const [agreeRequired2, setAgreeRequired2] = useState(false)
	const [agreeMarketing, setAgreeMarketing] = useState(false)

	const ctaDisabled = useMemo(
		() =>
			address.trim() === "" ||
			area === "" ||
			deposit === "" ||
			contractPeriod === null ||
			!agreeRequired1 ||
			!agreeRequired2,
		[address, area, deposit, contractPeriod, agreeRequired1, agreeRequired2]
	)

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>보증금 안전 진단</Text>

				<View style={styles.section}>
					<Text style={styles.label}>주소</Text>
					<TextInput
						value={address}
						onChangeText={setAddress}
						placeholder="서울시 강남구 역삼동 123-45"
						keyboardType="default"
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>면적</Text>
					<TextInput
						value={area}
						onChangeText={(v) => setArea(onlyDigits(v))}
						placeholder="84"
						keyboardType="numeric"
						postfix="m²"
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>보증금</Text>
					<TextInput
						value={deposit}
						onChangeText={(v) => setDeposit(onlyDigits(v))}
						placeholder="50000"
						keyboardType="numeric"
						postfix="만원"
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>월세 (선택)</Text>
					<TextInput
						value={monthlyRent}
						onChangeText={(v) => setMonthlyRent(onlyDigits(v))}
						placeholder="50"
						keyboardType="numeric"
						postfix="만원"
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>희망 계약 기간</Text>
					<InlineSegment value={contractPeriod} onChange={setContractPeriod} />
				</View>

				<View style={styles.section}>
					<Text style={styles.summaryTitle}>진단 리포트</Text>
					<Text style={styles.summaryPrice}>29,000</Text>
					<Text style={styles.summarySub}>리포트 생성까지 최대 20분 소요</Text>
				</View>

				<View style={styles.section}>
					<Checkbox
						text="[필수] 개인정보 수집 및 이용 동의"
						checked={agreeRequired1}
						onPress={() => setAgreeRequired1((v) => !v)}
					/>
					<Checkbox
						text="[필수] 서비스 이용약관 동의"
						checked={agreeRequired2}
						onPress={() => setAgreeRequired2((v) => !v)}
						mt={8}
					/>
					<Checkbox
						text="[선택] 마케팅 정보 수신 동의"
						checked={agreeMarketing}
						onPress={() => setAgreeMarketing((v) => !v)}
						mt={8}
					/>
				</View>

				<Button
					title="진단 시작하기"
					size="44"
					theme="primary"
					status={ctaDisabled ? "disabled" : "normal"}
					onPress={() => {
						// TODO: 다음 단계(결제/진단 요청)로 이동
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#FFF" },
	container: { padding: 20, gap: 16 },
	title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginVertical: 8 },
	section: { gap: 8 },
	label: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
	summaryTitle: { fontSize: 15, fontWeight: "700" },
	summaryPrice: { fontSize: 20, fontWeight: "800", marginTop: 4 },
	summarySub: { fontSize: 13, color: "#4D4D4D", marginTop: 2 },
	segmentRow: { flexDirection: "row", gap: 8 },
	segmentButton: { flex: 1 },
	disabled: { opacity: 0.5 },
})

