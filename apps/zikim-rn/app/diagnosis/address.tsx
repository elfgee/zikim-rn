import React, { useMemo, useState } from "react"
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Color, ListItem, Selector, Text, TextField } from "@zigbang/zuix2"
import { Stack, useRouter } from "expo-router"
import { useDiagnosis } from "@/components/diagnosis/diagnosis-context"

const ZButton: any = Button as any
const ZText: any = Text as any
const ZTextField: any = TextField as any
const ZListItem: any = ListItem as any
const ZSelector: any = Selector as any

type AddressResult = {
	id: string
	road: string
	requiresUnit: boolean
}

const MOCK_ADDRESSES: AddressResult[] = [
	{ id: "a1", road: "서울시 강남구 역삼로 123", requiresUnit: true },
	{ id: "a2", road: "서울시 성동구 옥수동 561", requiresUnit: true },
	{ id: "a3", road: "서울시 마포구 월드컵북로 400", requiresUnit: false },
	{ id: "a4", road: "서울시 송파구 올림픽로 300", requiresUnit: true },
]

export default function DiagnosisAddressScreen() {
	const router = useRouter()
	const { draft, setDraft } = useDiagnosis()
	const [networkError, setNetworkError] = useState(false)

	const results = useMemo(() => {
		const q = draft.addressQuery.trim()
		if (!q) return MOCK_ADDRESSES
		return MOCK_ADDRESSES.filter((a) => a.road.includes(q))
	}, [draft.addressQuery])

	const selected = useMemo(() => {
		if (!draft.addressSelected) return null
		return MOCK_ADDRESSES.find((a) => a.road === draft.addressSelected) || null
	}, [draft.addressSelected])

	const canContinue = useMemo(() => {
		if (!draft.addressSelected) return false
		if (!selected?.requiresUnit) return true
		return Boolean(draft.unitDong) && Boolean(draft.unitHo)
	}, [draft.addressSelected, draft.unitDong, draft.unitHo, selected?.requiresUnit])

	return (
		<>
			<Stack.Screen options={{ title: "주소 검색" }} />
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={styles.row}>
						<View style={{ flex: 1 }}>
							<ZTextField
								value={draft.addressQuery}
								onChangeText={(v: string) =>
									setDraft((p) => ({
										...p,
										addressQuery: v,
									}))
								}
								placeholder="도로명으로 검색"
								mt={0}
								mr={0}
								mb={0}
								ml={0}
							/>
						</View>
						<ZButton
							title={networkError ? "재시도" : "오류 테스트"}
							size="44"
							theme="lineGray90"
							onPress={() => setNetworkError((v) => !v)}
						/>
					</View>

					<View style={styles.section}>
						<View style={styles.sectionHeader}>
							<ZText size="14" weight="bold" color={Color.gray10}>
								검색 결과
							</ZText>
							<ZButton
								title="기존 발급 내역"
								size="32"
								theme="transparent"
								onPress={() => router.push("/diagnosis/history" as any)}
							/>
						</View>

						{networkError ? (
							<View style={styles.messageBox}>
								<ZText size="13" weight="regular" color={Color.red1}>
									네트워크 오류가 발생했습니다. 다시 시도해주세요.
								</ZText>
								<ZButton title="재시도" size="44" theme="primary" onPress={() => setNetworkError(false)} />
							</View>
						) : results.length === 0 ? (
							<View style={styles.messageBox}>
								<ZText size="13" weight="regular" color={Color.gray40}>
									검색 결과가 없어요. 검색어를 수정해보세요.
								</ZText>
							</View>
						) : (
							<View style={styles.list}>
								{results.map((r) => {
									const isSelected = draft.addressSelected === r.road
									return (
										<ZListItem
											key={r.id}
											title={{
												children: r.road,
												weight: isSelected ? "bold" : "regular",
												color: isSelected ? Color.orange1 : Color.gray10,
											}}
											description={
												r.requiresUnit
													? { children: "동/호 선택 필요", size: "12", color: Color.gray50 }
													: { children: "동/호 없음", size: "12", color: Color.gray50 }
											}
											onPress={() => {
												setDraft((p) => ({
													...p,
													addressSelected: r.road,
													unitDong: null,
													unitHo: null,
												}))
											}}
										/>
									)
								})}
							</View>
						)}
					</View>

					{selected?.requiresUnit ? (
						<View style={styles.section}>
							<ZText size="14" weight="bold" color={Color.gray10}>
								동/호 선택
							</ZText>
							<ZText size="12" weight="regular" color={Color.gray50}>
								선택한 주소에 동/호 정보가 있어요. 같은 화면에서 선택해주세요.
							</ZText>

							<ZSelector
								itemGroup={[
									[
										{ value: "101", label: "101동" },
										{ value: "102", label: "102동" },
										{ value: "103", label: "103동" },
									],
									[
										{ value: "201", label: "201호" },
										{ value: "301", label: "301호" },
										{ value: "401", label: "401호" },
									],
								]}
								onChangeGroup={[
									(item: any) => setDraft((p) => ({ ...p, unitDong: String(item.value) })),
									(item: any) => setDraft((p) => ({ ...p, unitHo: String(item.value) })),
								]}
							/>
						</View>
					) : null}

					<View style={styles.cta}>
						<ZButton
							title="다음"
							size="44"
							theme="primary"
							status={canContinue ? "normal" : "disabled"}
							onPress={() => {
								if (!canContinue) {
									Alert.alert("안내", "주소를 선택하고 필요한 경우 동/호까지 선택해주세요.")
									return
								}
								router.push("/diagnosis/pay" as any)
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
	row: { flexDirection: "row", gap: 10, alignItems: "center" },
	section: { gap: 10 },
	sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	list: { borderWidth: 1, borderColor: Color.gray90, borderRadius: 12, overflow: "hidden" },
	messageBox: { padding: 14, borderRadius: 12, backgroundColor: Color.gray99 },
	cta: { gap: 10, marginTop: 8 },
})

