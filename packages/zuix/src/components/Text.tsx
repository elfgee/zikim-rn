import React, { FC } from "react"
import {
	Platform,
	StyleSheet,
	Text as RNText,
	TextStyle,
	TextProps as RNTextProps,
	View,
	StyleProp,
	ViewStyle,
} from "react-native"

import { Color, FontSize, FontWeight, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { Pressable } from "../components/Pressable"

export interface TextProps extends RNTextProps, Margin {
	/** @default 11 */
	size?: `${FontSize}` | undefined
	/** @default medium */
	weight?: FontWeight
	/** @default Color.gray10 */
	color?: Color | string
	lineHeight?: number
	left?: React.ReactNode
	right?: React.ReactNode
	/** @default false */
	underline?: boolean
	/** @default left */
	textAlign?: "left" | "center" | "right"
	wrapStyle?: StyleProp<ViewStyle>
}

export type TextType = string | TextProps | React.ReactComponentElement<typeof Text>

const defaultFontStyle = {
	size: "11",
	fontWeight: "medium",
	color: Color.gray10,
} as const

export const Text: FC<TextProps> = ({
	size = defaultFontStyle.size,
	lineHeight,
	weight = defaultFontStyle.fontWeight,
	color = defaultFontStyle.color,
	left,
	right,
	underline = false,
	children,
	onPress,
	textAlign = "left",
	wrapStyle,
	...props
}) => {
	const fontStyle = [
		fontSet[size],
		fontWeight[weight],
		fontAlign[textAlign],
		styles.textWrap,
		styles.wordBreak,
		onPress ? styles.underline : undefined,
		underline ? styles.underline : styles.noneUnderline,
		lineHeight ? { lineHeight } : undefined,
		fontColor[color] ?? { color },
	] as TextStyle[]

	const marginStyle = revertMargin(props)
	const singleLineStyle = props.numberOfLines && props.numberOfLines === 1 ? styles.noWrap : {}

	const renderText = () => {
		if (!!left || !!right) {
			return (
				<View
					style={[styles.textRoot, !onPress && marginStyle, wrapperAlign[textAlign], !onPress && wrapStyle]}>
					{left}
					<RNText
						maxFontSizeMultiplier={1.5}
						{...props}
						style={[
							styles.whiteSpace,
							singleLineStyle,
							left ? styles.leftMargin : undefined,
							right ? styles.rightMargin : undefined,
							...fontStyle,
							props.style,
						]}>
						{children}
					</RNText>
					{right}
				</View>
			)
		}
		return (
			<RNText
				maxFontSizeMultiplier={1.5}
				{...props}
				style={[
					styles.whiteSpace,
					singleLineStyle,
					...fontStyle,
					!onPress && marginStyle,
					!onPress && wrapStyle,
					props.style,
				]}>
				{children}
			</RNText>
		)
	}

	if (onPress) {
		return (
			<View style={[styles.textRoot, marginStyle, wrapStyle, wrapperAlign[textAlign]]}>
				<Pressable onPress={onPress} style={styles.textRoot} touchPadding={4} radius={4} accessible={false}>
					{renderText()}
				</Pressable>
			</View>
		)
	}
	return renderText()
}

const styles = StyleSheet.create({
	textRoot: { flexDirection: "row", alignItems: "center" },
	underline: { textDecorationLine: "underline" },
	noneUnderline: { textDecorationLine: "none" },
	textWrap: { flexWrap: "wrap", flexShrink: 1, fontFamily: "Pretendard" },
	noWrap: Platform.OS === "web" ? ({ whiteSpace: "nowrap" } as TextStyle) : {},
	whiteSpace: Platform.OS === "web" ? ({ whiteSpace: "pre-wrap" } as TextStyle) : {},
	wordBreak: Platform.OS === "web" ? ({ wordBreak: "break-all" } as TextStyle) : {},
	leftMargin: { marginLeft: 4 },
	rightMargin: { marginRight: 4 },
})

const fontWeight = StyleSheet.create({
	regular: { fontWeight: "400" },
	medium: { fontWeight: "500" },
	bold: { fontWeight: "700" },
})

const wrapperAlign = StyleSheet.create({
	left: { justifyContent: "flex-start" },
	center: { justifyContent: "center" },
	right: { justifyContent: "flex-end" },
})

const fontAlign = StyleSheet.create({
	left: { textAlign: "left" },
	center: { textAlign: "center" },
	right: { textAlign: "right" },
})

const fontSet = StyleSheet.create<{
	[key: number]: TextStyle
}>({
	8: {
		fontSize: 8,
		lineHeight: 10,
	},
	10: {
		fontSize: 10,
		lineHeight: 12,
	},
	11: {
		fontSize: 11,
		lineHeight: 14,
	},
	12: {
		fontSize: 12,
		lineHeight: 16,
	},
	13: {
		fontSize: 13,
		lineHeight: 18,
	},
	14: {
		fontSize: 14,
		lineHeight: 20,
	},
	16: {
		fontSize: 16,
		lineHeight: 24,
	},
	18: {
		fontSize: 18,
		lineHeight: 28,
	},
	20: {
		fontSize: 20,
		lineHeight: 30,
	},
	22: {
		fontSize: 22,
		lineHeight: 32,
	},
	24: {
		fontSize: 24,
		lineHeight: 36,
	},
	26: {
		fontSize: 26,
		lineHeight: 40,
	},
})

const _fontColor: {
	[key: string]: TextStyle
} = {}
Object.keys(Color).forEach((color) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	_fontColor[Color[color]] = { color: Color[color] }
})

const fontColor = StyleSheet.create(_fontColor)
