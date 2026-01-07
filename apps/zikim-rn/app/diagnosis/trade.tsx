import React, { useMemo } from "react"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Color, SegmentedControl, Text, TextField } from "@zigbang/zuix2"
import { Stack, useRouter } from "expo-router"
import { useDiagnosis } from "@/components/diagnosis/diagnosis-context"
import { formatWithComma, formatWonToKoreanText, onlyDigits } from "@/components/diagnosis/money"

const ZButton: any = Button as any
const ZSegment: any = SegmentedControl as any
const ZText: any = Text as any
const ZTextField: any = TextField as any

export default function DiagnosisTradeScreen() {
	const router = useRouter()
	const { draft, setDraft } = useDiagnosis()

	const purposeOptions = useMemo(
		() => [
			{ label: "전세", value: "jeonse" },
			{ label: "월세", value: "wolse" },
			{ label: "매매", value: "maemae" },
		],
		[]
	)

	const contractOptions = useMemo(
		() => [
			{ label: "1년", value: "1y" },
			{ label: "2년", value: "2y" },
			{ label: "직접 입력", value: "custom" },
		],
		[]
	)

	const requiredOk = useMemo(() => {
		if (draft.purpose === "maemae") {
			return draft.salePriceWon !== null && draft.salePriceWon > 0
		}
		// 전세/월세는 계약기간 필수
		const hasMoney =
			draft.purpose === "jeonse"
				? draft.depositWon !== null && draft.depositWon > 0
				: draft.depositWon !== null && draft.depositWon > 0 && draft.monthlyRentWon !== null && draft.monthlyRentWon > 0
		const hasPeriod =
			draft.contractPeriodType !== null &&
			(draft.contractPeriodType !== "custom" || (draft.contractPeriodYears !== null && draft.contractPeriodYears > 0))
		return hasMoney && hasPeriod
	}, [draft])

	return (
		<>
			<Stack.Screen options={{ title: "거래 정보 입력" }} />
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={styles.section}>
						<ZText size="14" weight="bold" color={Color.gray10}>
							거래 목적
						</ZText>
						<ZSegment
							options={purposeOptions}
							value={draft.purpose}
							onChange={(v: string) => {
								setDraft((prev) => ({
									...prev,
									purpose: v as any,
									// 거래 목적 변경 시 입력값 초기화(문서 요구)
									depositWon: null,
									monthlyRentWon: null,
									salePriceWon: null,
									contractPeriodType: null,
									contractPeriodYears: null,
								}))
							}}
						/>
					</View>

					{draft.purpose === "jeonse" ? (
						<MoneyField
							label="전세금"
							valueWon={draft.depositWon}
							onChangeWon={(won) => setDraft((p) => ({ ...p, depositWon: won }))}
						/>
					) : null}

					{draft.purpose === "wolse" ? (
						<>
							<MoneyField
								label="보증금"
								valueWon={draft.depositWon}
								onChangeWon={(won) => setDraft((p) => ({ ...p, depositWon: won }))}
							/>
							<MoneyField
								label="월세"
								valueWon={draft.monthlyRentWon}
								onChangeWon={(won) => setDraft((p) => ({ ...p, monthlyRentWon: won }))}
							/>
						</>
					) : null}

					{draft.purpose === "maemae" ? (
						<MoneyField
							label="매매금액"
							valueWon={draft.salePriceWon}
							onChangeWon={(won) => setDraft((p) => ({ ...p, salePriceWon: won }))}
						/>
					) : null}

					{draft.purpose !== "maemae" ? (
						<View style={styles.section}>
							<ZText size="14" weight="bold" color={Color.gray10}>
								계약 기간
							</ZText>
							<ZSegment
								options={contractOptions}
								value={draft.contractPeriodType}
								onChange={(v: string) => {
									setDraft((p) => ({
										...p,
										contractPeriodType: v as any,
										contractPeriodYears: v === "1y" ? 1 : v === "2y" ? 2 : p.contractPeriodYears,
									}))
								}}
							/>
							{draft.contractPeriodType === "custom" ? (
								<View style={{ marginTop: 10 }}>
									<ZTextField
										value={draft.contractPeriodYears ? String(draft.contractPeriodYears) : ""}
										onChangeText={(v: string) => {
											const n = Number(onlyDigits(v))
											setDraft((p) => ({ ...p, contractPeriodYears: Number.isFinite(n) ? n : null }))
										}}
										keyboardType="numeric"
										placeholder="예: 2"
										postfix="년"
										mt={0}
										mr={0}
										mb={0}
										ml={0}
									/>
								</View>
							) : null}
						</View>
					) : null}

					<View style={styles.cta}>
						<ZButton
							title="다음"
							size="44"
							theme="primary"
							status={requiredOk ? "normal" : "disabled"}
							onPress={() => {
								if (!requiredOk) return
								router.push("/diagnosis/address" as any)
							}}
						/>
						<ZButton title="취소" size="44" theme="lineGray90" onPress={() => router.back()} />
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}

function MoneyField({
	label,
	valueWon,
	onChangeWon,
}: {
	label: string
	valueWon: number | null
	onChangeWon: (won: number | null) => void
}) {
	const valueStr = valueWon ? String(valueWon) : ""
	const helper = valueWon ? `${formatWithComma(valueWon)}원 (${formatWonToKoreanText(valueWon)})` : ""
	return (
		<View style={styles.section}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				{label}
			</ZText>
			<ZTextField
				value={valueStr}
				onChangeText={(v: string) => {
					const digits = onlyDigits(v)
					const n = digits === "" ? null : Number(digits)
					onChangeWon(n !== null && Number.isFinite(n) ? n : null)
				}}
				keyboardType="numeric"
				placeholder="숫자만 입력"
				mt={0}
				mr={0}
				mb={0}
				ml={0}
			/>
			{helper ? (
				<ZText size="12" weight="regular" color={Color.gray40}>
					{helper}
				</ZText>
			) : null}
		</View>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Color.white as any },
	container: { padding: 16, gap: 18 },
	section: { gap: 10 },
	cta: { gap: 10, marginTop: 8 },
})

