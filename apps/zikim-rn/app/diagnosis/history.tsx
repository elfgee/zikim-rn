import React, { useMemo, useState } from "react"
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Color, ListItem, Text } from "@zigbang/zuix2"
import { Stack, useRouter } from "expo-router"
import { useDiagnosis } from "@/components/diagnosis/diagnosis-context"

const ZButton: any = Button as any
const ZText: any = Text as any
const ZListItem: any = ListItem as any

type HistoryItem = {
	id: string
	issuedAt: string
	address: string
	purpose: "전세" | "월세" | "매매"
	status: "발급 완료" | "진행중" | "실패"
}

const MOCK_HISTORY: HistoryItem[] = [
	{ id: "r-1", issuedAt: "2026.01.06 12:12", address: "서울시 성동구 옥수동 561", purpose: "전세", status: "발급 완료" },
	{ id: "r-2", issuedAt: "2026.01.03 08:41", address: "서울시 강남구 역삼로 123", purpose: "월세", status: "진행중" },
]

export default function DiagnosisHistoryScreen() {
	const router = useRouter()
	const { setDraft } = useDiagnosis()
	const [empty, setEmpty] = useState(false)

	const items = useMemo(() => (empty ? [] : MOCK_HISTORY), [empty])

	return (
		<>
			<Stack.Screen options={{ title: "기존 발급 내역" }} />
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={styles.row}>
						<ZText size="12" weight="regular" color={Color.gray50}>
							최신순으로 표시됩니다.
						</ZText>
						<ZButton title={empty ? "샘플 보기" : "빈 상태"} size="32" theme="lineGray90" onPress={() => setEmpty((v) => !v)} />
					</View>

					{items.length === 0 ? (
						<View style={styles.emptyBox}>
							<ZText size="14" weight="bold" color={Color.gray10}>
								발급 내역이 없어요
							</ZText>
							<ZText size="13" weight="regular" color={Color.gray50}>
								새 리포트를 발급해보세요.
							</ZText>
							<ZButton title="새 리포트 발급하기" size="44" theme="primary" onPress={() => router.replace("/diagnosis/trade" as any)} />
						</View>
					) : (
						<View style={styles.list}>
							{items.map((it) => (
								<ZListItem
									key={it.id}
									title={{ children: it.address, weight: "bold", color: Color.gray10 }}
									description={{
										children: `${it.issuedAt} · ${it.purpose} · ${it.status}`,
										size: "12",
										color: Color.gray50,
									}}
									right={
										<Button title="공유" size="32" theme="lineGray90" onPress={() => Alert.alert("공유", "공유 모의 동작입니다.")} />
									}
									onPress={() => {
										setDraft((p) => ({
											...p,
											addressSelected: it.address,
											unitDong: null,
											unitHo: null,
										}))
										router.push("/diagnosis/report" as any)
									}}
								/>
							))}
						</View>
					)}

					<View style={styles.cta}>
						<ZButton title="뒤로" size="44" theme="lineGray90" onPress={() => router.back()} />
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Color.white as any },
	container: { padding: 16, gap: 14 },
	row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	list: { borderWidth: 1, borderColor: Color.gray90, borderRadius: 12, overflow: "hidden" },
	emptyBox: { padding: 16, gap: 10, borderRadius: 12, backgroundColor: Color.gray99 },
	cta: { marginTop: 8 },
})

