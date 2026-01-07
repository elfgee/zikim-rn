import React from "react"
import { StyleSheet, View } from "react-native"
import { Color, Text } from "@zigbang/zuix2"

export type StatusTagType =
	| "양호"
	| "확인 필요"
	| "위험"
	| "가능성 높음"
	| "불가"
	| "해당 없음"
	| "확인 불가"

const ZText: any = Text as any

export function StatusTag({ status }: { status: StatusTagType }) {
	const theme = getTheme(status)
	return (
		<View style={[styles.root, { backgroundColor: theme.bg, borderColor: theme.bd }]}>
			<ZText size="11" weight="bold" color={theme.fg} allowFontScaling={false}>
				{status}
			</ZText>
		</View>
	)
}

function getTheme(status: StatusTagType) {
	switch (status) {
		case "양호":
		case "가능성 높음":
			return { bg: Color.green2, fg: Color.green1, bd: Color.green2 }
		case "불가":
			return { bg: Color.red2, fg: Color.red1, bd: Color.red2 }
		case "확인 필요":
		case "위험":
			// 문서상 '확인 필요'는 빨간색 사용 케이스가 명시됨(시세 진단 등)
			return { bg: Color.red2, fg: Color.red1, bd: Color.red2 }
		case "해당 없음":
		case "확인 불가":
		default:
			return { bg: Color.gray95, fg: Color.gray50, bd: Color.gray95 }
	}
}

const styles = StyleSheet.create({
	root: {
		alignSelf: "flex-start",
		borderRadius: 999,
		paddingHorizontal: 8,
		height: 22,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
	},
})

