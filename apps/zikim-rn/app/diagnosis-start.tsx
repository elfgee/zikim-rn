import React, { useMemo, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
// zuix2 exports (source: packages/zuix/src/index.ts -> components/index.ts)
import { Button, Checkbox, TextInput } from "@zigbang/zuix2"
import { Stack, useRouter } from "expo-router"

type ContractValue = "1y" | "2y" | "3y+" | null

// Graceful fallback: treat DS components as any to avoid type gaps in consuming app.
const ZButton: any = Button as any
const ZCheckbox: any = Checkbox as any
const ZTextInput: any = TextInput as any

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
					<ZButton
						key={opt.value}
						title={opt.label}
						size="44"
						theme={selected ? "primary" : "lineGray90"}
						status={disabled ? "disabled" : "normal"}
						onPress={() => onChange(opt.value)}
						style={styles.segmentButton}
					/>
				)
			})}
		</View>
	)
}

// 숫자 입력 필터 (digits only)
const onlyDigits = (v: string) => v.replace(/[^\d]/g, "")

export default function DiagnosisStartScreen() {
	const router = useRouter()
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
		<>
			<Stack.Screen options={{ title: "지킴 진단" }} />
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>
					{/* Top info (custom layout, no DS components) */}
					<View style={styles.hero}>
						<View style={styles.heroIcon} />
						<Text style={styles.heroTitle}>보증금 안전 진단</Text>
						<Text style={styles.heroDesc}>
							매물의 계약 안정성을 전문가가 분석하여{"\n"}
							안전한 계약을 도와드립니다
						</Text>
					</View>

					<View style={styles.infoCard}>
						<Text style={styles.infoCardTitle}>진단 리포트 포함 내용</Text>
						<View style={styles.infoList}>
							<InfoRow text="매물진단: 권리관계, 근저당, 전세가율 분석" />
							<InfoRow text="소유자 안정성: 집주인 신뢰도 확인" />
							<InfoRow text="시세 진단: 보증금 회수 위험도 평가" />
							<InfoRow text="대출/보험 진단: 보증보험 가입 가능 여부" />
							<InfoRow text="범죄/치안: 보안시설, 범죄발생율 분석" />
							<InfoRow text="생활/편의: 편의시설 분포, 정주여건 비교" />
							<InfoRow text="법적 보호 특약 조항" />
						</View>
					</View>

					<Text style={styles.midTitle}>매물 정보를 입력해주세요.</Text>

				<View style={styles.section}>
					<Text style={styles.label}>주소</Text>
					<ZTextInput
						value={address}
						onChangeText={setAddress}
						placeholder="서울시 강남구 역삼동 123-45"
						keyboardType="default"
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>면적</Text>
					<ZTextInput
						value={area}
						onChangeText={(v: string) => setArea(onlyDigits(v))}
						placeholder="84"
						keyboardType="numeric"
						postfix="m²"
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>보증금</Text>
					<ZTextInput
						value={deposit}
						onChangeText={(v: string) => setDeposit(onlyDigits(v))}
						placeholder="50000"
						keyboardType="numeric"
						postfix="만원"
					/>
				</View>

				<View style={styles.section}>
					<Text style={styles.label}>월세 (선택)</Text>
					<ZTextInput
						value={monthlyRent}
						onChangeText={(v: string) => setMonthlyRent(onlyDigits(v))}
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
					<Text style={styles.summaryLine}>진단 리포트 29,000원</Text>
					<Text style={styles.summarySub}>리포트 생성까지 최대 20분 소요</Text>
				</View>

				<View style={styles.section}>
					<ZCheckbox
						text="[필수] 개인정보 수집 및 이용 동의"
						checked={agreeRequired1}
						onPress={() => setAgreeRequired1((v) => !v)}
					/>
					<ZCheckbox
						text="[필수] 서비스 이용약관 동의"
						checked={agreeRequired2}
						onPress={() => setAgreeRequired2((v) => !v)}
						mt={8}
					/>
					<ZCheckbox
						text="[선택] 마케팅 정보 수신 동의"
						checked={agreeMarketing}
						onPress={() => setAgreeMarketing((v) => !v)}
						mt={8}
					/>
				</View>

					<ZButton
						title="진단 시작하기"
						size="44"
						theme="primary"
						status={ctaDisabled ? "disabled" : "normal"}
						onPress={() => {
							if (ctaDisabled) return
							router.push("/diagnosis/pay" as any)
						}}
					/>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}

function InfoRow({ text }: { text: string }) {
	return (
		<View style={styles.infoRow}>
			<Text style={styles.check}>✓</Text>
			<Text style={styles.infoRowText}>{text}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#FFF" },
	container: { padding: 20, gap: 16 },
	section: { gap: 8 },
	label: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
	summaryLine: { fontSize: 17, fontWeight: "700" },
	summarySub: { fontSize: 13, color: "#FF6905", marginTop: 2 },
	segmentRow: { flexDirection: "row", gap: 8 },
	segmentButton: { flex: 1 },
	disabled: { opacity: 0.5 },

	hero: { alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 8 },
	heroIcon: {
		width: 92,
		height: 92,
		borderRadius: 28,
		backgroundColor: "#111111",
	},
	heroTitle: { fontSize: 28, fontWeight: "800", color: "#111111" },
	heroDesc: { fontSize: 18, fontWeight: "400", color: "#666666", textAlign: "center", lineHeight: 26 },

	infoCard: {
		backgroundColor: "#F6F6F6",
		borderRadius: 18,
		padding: 18,
		gap: 14,
	},
	infoCardTitle: { fontSize: 20, fontWeight: "400", color: "#111111" },
	infoList: { gap: 12, paddingTop: 4 },
	infoRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
	check: { fontSize: 18, fontWeight: "400", color: "#111111", lineHeight: 22, marginTop: 2 },
	infoRowText: { flex: 1, fontSize: 14, fontWeight: "400", color: "#333333", lineHeight: 20 },

	midTitle: { fontSize: 18, fontWeight: "700", color: "#111111", marginTop: 8 },
})

