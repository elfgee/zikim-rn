import React, { FC } from "react"
import { View, ViewProps, StyleSheet } from "react-native"

import { TextType, TextProps } from "../components/Text"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { renderTextByProps } from "../utils/renderer"

const TITLE_PROPS: TextProps = { weight: "bold" }
const OPTION_TEXT_PROPS: TextProps = { size: "13", color: Color.gray30, weight: "regular" }
const TEXT_BUTTON_PROPS: TextProps = { size: "14", color: Color.gray50, weight: "regular", mt: 12, underline: true }

export const Title: FC<TitleProps> = ({ size, optionText, right, title, textButton, style, ...props }) => {
	const marginStyle = revertMargin(props)
	const rootPaddingStyle = getRootMarginStyle(size)
	const optionTextStyle = getOptionTextStyle(size)
	const gapSpacingStyle = getGapSpacingStyle(size)
	return (
		<View style={[rootPaddingStyle, marginStyle, style]} {...props}>
			<View style={s.textView}>
				<View style={s.flex1}>{renderTextByProps({ ...TITLE_PROPS, ...{ size: size } }, title)}</View>
				{!!right && <View style={s.rightView}>{right}</View>}
			</View>
			{optionText &&
				renderTextByProps({ ...OPTION_TEXT_PROPS, ...optionTextStyle, ...gapSpacingStyle }, optionText)}
			{textButton && renderTextByProps({ ...TEXT_BUTTON_PROPS, ...gapSpacingStyle }, textButton)}
		</View>
	)
}

const getRootMarginStyle = (size?: TitleSizes) => {
	switch (size) {
		default:
		case "14":
			return s.rootSize14
		case "18":
			return s.rootSize18
		case "24":
			return s.rootSize24
		case "26":
			return s.rootSize26
	}
}

const getGapSpacingStyle = (size?: TitleSizes): { mt: number } => {
	switch (size) {
		default:
		case "14":
			return { mt: 0 }
		case "18":
			return { mt: 0 }
		case "24":
			return { mt: 12 }
		case "26":
			return { mt: 12 }
	}
}

const getOptionTextStyle = (size?: TitleSizes): { size: "13" | "14" | "16" } => {
	switch (size) {
		default:
		case "14":
			return { size: "13" }
		case "18":
			return { size: "14" }
		case "24":
			return { size: "16" }
		case "26":
			return { size: "16" }
	}
}

export type TitleSizes = "14" | "18" | "24" | "26"
export interface TitleProps extends ViewProps, Margin {
	size?: TitleSizes
	optionText?: TextType
	right?: React.ReactElement
	title: TextType
	textButton?: TextType
}
const s = StyleSheet.create({
	rootSize14: {
		marginTop: 36,
		marginBottom: 12,
		marginLeft: 20,
		marginRight: 20,
	},
	rootSize18: {
		marginTop: 8,
		marginBottom: 8,
		marginLeft: 20,
		marginRight: 20,
	},
	rootSize24: {
		marginTop: 28,
		marginBottom: 28,
		marginLeft: 20,
		marginRight: 20,
	},
	rootSize26: {
		marginTop: 0,
		marginBottom: 28,
		marginLeft: 20,
		marginRight: 20,
	},
	textView: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	rightView: {
		marginLeft: 12,
	},
	flex1: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
	},
})
