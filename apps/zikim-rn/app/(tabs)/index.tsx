import React from "react"
import { SafeAreaView, StyleSheet, View } from "react-native"
import { Button, Color, Text } from "@zigbang/zuix2"
import { useRouter } from "expo-router"

const ZButton: any = Button as any
const ZText: any = Text as any

export default function HomeScreen() {
	const router = useRouter()
	return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<View style={styles.hero}>
					<ZText size="22" weight="bold" color={Color.gray10}>
						직방 APP 게이트웨이(샘플)
					</ZText>
					<ZText size="14" weight="regular" color={Color.gray50}>
						거래 전 알아야 할 권리분석, 치안·안전, 생활편의를 한눈에 확인해요.
					</ZText>
				</View>

				<View style={styles.card}>
					<ZText size="18" weight="bold" color={Color.gray10}>
						지킴진단
					</ZText>
					<ZText size="13" weight="regular" color={Color.gray50}>
						거래 정보 입력 → 주소 검색 → 결제 → 발급 → 리포트 확인
					</ZText>
					<View style={{ marginTop: 12 }}>
						<ZButton title="지킴진단 시작" size="44" theme="primary" onPress={() => router.push("/diagnosis/trade" as any)} />
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Color.white as any },
	container: { padding: 16, gap: 14 },
	hero: { gap: 6 },
	card: { padding: 16, borderRadius: 12, backgroundColor: Color.gray99 as any },
})
