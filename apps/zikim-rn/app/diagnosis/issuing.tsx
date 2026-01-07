import React, { useEffect, useMemo, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Color, Loading, Text } from "@zigbang/zuix2"
import { Stack, useRouter } from "expo-router"

const ZButton: any = Button as any
const ZText: any = Text as any
const ZLoading: any = Loading as any

type IssueState = "progress" | "slow" | "done" | "fail"

export default function DiagnosisIssuingScreen() {
	const router = useRouter()
	const [state, setState] = useState<IssueState>("progress")

	useEffect(() => {
		// 모의: 3초 후 완료
		const t1 = setTimeout(() => setState("done"), 3000)
		// 모의: 1.5초 후 '평소보다 오래...' 상태로 변경했다가 완료되도록 할 수도 있음
		const t2 = setTimeout(() => setState((s) => (s === "progress" ? "slow" : s)), 1500)
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
		}
	}, [])

	const title = useMemo(() => {
		if (state === "done") return "리포트 발급이 완료되었습니다!"
		if (state === "fail") return "리포트 발급에 실패했습니다"
		return "리포트를 발급하고 있어요"
	}, [state])

	const desc = useMemo(() => {
		if (state === "slow") return "발급이 평소보다 오래 걸리고 있어요. 잠시만 더 기다려주세요."
		if (state === "fail") return "이용권은 차감되지 않았습니다."
		if (state === "done") return "리포트 보기로 이동할게요."
		return "약 30초 정도 소요됩니다. 화면을 벗어나도 발급 완료 시 알려드릴게요."
	}, [state])

	return (
		<>
			<Stack.Screen options={{ title: "발급 진행중" }} />
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={styles.card}>
						<View style={{ alignItems: "center", gap: 10 }}>
							{state === "progress" || state === "slow" ? <ZLoading /> : null}
							<ZText size="18" weight="bold" color={Color.gray10} textAlign="center">
								{title}
							</ZText>
							<ZText size="13" weight="regular" color={state === "fail" ? Color.red1 : Color.gray50} textAlign="center">
								{desc}
							</ZText>
						</View>
					</View>

					<View style={styles.cta}>
						{state === "done" ? (
							<ZButton title="리포트 보기" size="44" theme="primary" onPress={() => router.replace("/diagnosis/report" as any)} />
						) : null}

						{state === "fail" ? (
							<>
								<ZButton title="재시도" size="44" theme="primary" onPress={() => setState("progress")} />
								<ZButton title="고객센터 문의" size="44" theme="lineGray90" onPress={() => {}} />
							</>
						) : null}

						<View style={{ flexDirection: "row", gap: 10 }}>
							<ZButton title="완료 상태 테스트" size="44" theme="lineGray90" onPress={() => setState("done")} style={{ flex: 1 }} />
							<ZButton title="실패 테스트" size="44" theme="lineGray90" onPress={() => setState("fail")} style={{ flex: 1 }} />
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Color.white as any },
	container: { padding: 16, gap: 14 },
	card: { padding: 18, borderRadius: 12, backgroundColor: Color.gray99 as any },
	cta: { gap: 10, marginTop: 6 },
})

