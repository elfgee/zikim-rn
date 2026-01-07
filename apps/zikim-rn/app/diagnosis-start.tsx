import React, { useEffect } from "react"
import { Stack, useRouter } from "expo-router"

/**
 * 기존 `/diagnosis-start`는 문서 기준 플로우로 대체되었습니다.
 * - 게이트웨이: `/(tabs)` 홈
 * - 거래정보 입력: `/diagnosis/trade`
 */
export default function DiagnosisStartScreen() {
	const router = useRouter()
	useEffect(() => {
		router.replace("/diagnosis/trade" as any)
	}, [router])

	return <Stack.Screen options={{ title: "지킴진단" }} />
}

