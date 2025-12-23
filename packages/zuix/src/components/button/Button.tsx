import React, { FC } from "react"
import { StyleSheet, View } from "react-native"

import { Color, Margin } from "../../types"
import { revertMargin } from "../../utils/style"
import { Pressable, PressableProps } from "../../components/Pressable"
import { TextType } from "../../components/Text"
import { renderTextByProps } from "../../utils/renderer"
import { Gradient, GradientProps } from "../../components/gradient"

export type ButtonPropType = ButtonProps | React.ReactElement<typeof Button>

export const Button: FC<ButtonProps> = ({
	size = "44",
	theme = "primary",
	status = "normal",
	title,
	style,
	overlay,
	...props
}) => {
	const marginStyle = revertMargin(props)
	const rootStyle = generateRootStyle(size)
	const textBoldStyle = generateWeightStyle(size, theme)
	const textSize = generateTextStyle(size)
	const { view: viewColorStyle, text: textColorStyle } = getPalette(theme, size, status)
	const gradient = getGradient(theme)
	const disableStatus = status === "disabled"

	return (
		<Pressable
			radius={4}
			disabled={disableStatus}
			style={[s.root, rootStyle, viewColorStyle, marginStyle, style]}
			{...props}>
			{gradient && status !== "disabled" && <Gradient {...gradient} style={s.borderRadius4} />}
			{renderTextByProps(
				{
					color: textColorStyle as any,
					size: textSize,
					weight: textBoldStyle,
					numberOfLines: 1,
					allowFontScaling: false,
					style: s.zIndex1,
				},
				title
			)}
			<View style={[s.border, getBorderStyle({ theme, status })]} />
			{!!overlay && <View style={s.overlay}>{overlay}</View>}
		</Pressable>
	)
}

const generateWeightStyle = (size: ButtonSize, theme: ButtonTheme) => {
	if (size === "44" || theme === "lineGray10" || (size === "40" && theme === "grayOpacity08")) return "bold"
	return "medium"
}
const generateRootStyle = (size: ButtonSize) => {
	switch (size) {
		default:
		case "44":
			return s.root44
		case "40":
			return s.root40
		case "32":
			return s.root32
		case "28":
			return s.root28
		case "24":
			return s.root24
	}
}

const generateTextStyle = (size: ButtonSize) => {
	switch (size) {
		default:
		case "44":
			return "16"
		case "40":
		case "32":
			return "14"
		case "28":
			return "13"
		case "24":
			return "12"
	}
}

export type ButtonSize = "24" | "28" | "32" | "40" | "44"
export type ButtonTheme =
	| "primary"
	| "lineGray10"
	| "lineGray30"
	| "lineOrange"
	| "lineGray90"
	| "orange2"
	| "red1"
	| "grayOpacity08"
	| "bgOrange2"
	| "orange1G"
	| "transparent"
export type ButtonStatus = "normal" | "disabled"
export interface ButtonProps extends PressableProps, Margin {
	title: TextType
	/** @default "44" */
	size?: ButtonSize
	/** @default "primary" */
	theme?: ButtonTheme
	/** @default "normal" */
	status?: ButtonStatus
	overlay?: React.ReactNode
}

const s = StyleSheet.create({
	root: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
	root44: {
		minHeight: 44,
		paddingTop: 9,
		paddingBottom: 9,
		paddingLeft: 15,
		paddingRight: 15,
	},
	root40: {
		minHeight: 40,
		paddingTop: 9,
		paddingBottom: 9,
		paddingLeft: 15,
		paddingRight: 15,
	},
	root32: {
		minHeight: 32,
		paddingTop: 6,
		paddingBottom: 6,
		paddingLeft: 11,
		paddingRight: 11,
	},
	root28: {
		minHeight: 28,
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 7,
		paddingRight: 7,
	},
	root24: {
		minHeight: 24,
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 5,
		paddingRight: 5,
	},
	overlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
	border: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		borderRadius: 4,
	},
	zIndex1: { zIndex: 1 },
	borderRadius4: { borderRadius: 4 },

	primaryNormal: { backgroundColor: Color.orange1 },
	primaryDisabled1: { backgroundColor: Color.orange3 },
	primaryDisabled2: { backgroundColor: Color.gray97 },

	lineGray10Normal: { backgroundColor: Color.white },
	lineGray10Disabled: { backgroundColor: Color.gray97 },

	lineGray30Normal: { backgroundColor: Color.white },
	lineGray30Disabled: { backgroundColor: Color.gray97 },

	lineOrangeNormal: { backgroundColor: Color.white },
	lineOrangeDisabled: { backgroundColor: Color.white },

	lineGray90Normal: { backgroundColor: Color.white },
	lineGray90Disabled: { backgroundColor: Color.gray97 },

	orange2Normal: { backgroundColor: Color.orange2 },
	orange2Disabled: { backgroundColor: Color.orange2 },

	red1Normal: { backgroundColor: Color.red1 },
	red1Disabled: { backgroundColor: Color.red2 },

	grayOpacity08Normal: { backgroundColor: Color.grayOpacity08 },
	grayOpacity08Disabled: { backgroundColor: Color.grayOpacity08 },

	bgOrange2Normal: { backgroundColor: Color.orange2 },
	bgOrange2Disabled: { backgroundColor: Color.gray97 },

	orange1GNormal: { backgroundColor: Color.transparent },
	orange1GDisabled: { backgroundColor: Color.orange3 },

	transparentNormal: { backgroundColor: Color.transparent },
	transparentDisabled: { backgroundColor: Color.transparent },
})

const getBorderStyle = ({ theme, status }: { theme: ButtonTheme; status: ButtonProps["status"] }) => {
	const disabled = status === "disabled"
	switch (theme) {
		case "lineGray30":
			return disabled ? borderStyle.lineGray30Disabled : borderStyle.lineGray30Normal
		case "lineGray90":
			return disabled ? borderStyle.lineGray90Disabled : borderStyle.lineGray90Normal
		case "lineOrange":
			return disabled ? borderStyle.lineOrangeDisabled : borderStyle.lineOrangeNormal
		case "lineGray10":
			return disabled ? borderStyle.lineGray10Disabled : borderStyle.lineGray10Normal
		case "orange2":
			return disabled ? borderStyle.orange2Disabled : borderStyle.orange2Normal
		case "grayOpacity08":
			return disabled ? borderStyle.grayOpacity08Disabled : borderStyle.grayOpacity08Normal
		case "transparent":
			return undefined
		default:
			return
	}
}
const borderStyle = StyleSheet.create({
	lineGray10Normal: { borderColor: Color.gray10, borderWidth: 1.4 },
	lineGray10Disabled: { borderColor: Color.gray90, borderWidth: 1.4 },

	lineGray30Normal: { borderColor: Color.gray30, borderWidth: 1 },
	lineGray30Disabled: { borderColor: Color.gray90, borderWidth: 1 },

	lineOrangeNormal: { borderColor: Color.orange1, borderWidth: 1.4 },
	lineOrangeDisabled: { borderColor: Color.orange3, borderWidth: 1.4 },

	lineGray90Normal: { borderColor: Color.gray90, borderWidth: 1 },
	lineGray90Disabled: { borderColor: Color.gray95, borderWidth: 1 },

	orange2Normal: { borderColor: Color.orange1, borderWidth: 1.4 },
	orange2Disabled: { borderColor: Color.orange3, borderWidth: 1.4 },

	grayOpacity08Normal: { borderColor: Color.gray70, borderWidth: 1 },
	grayOpacity08Disabled: { borderColor: Color.gray30, borderWidth: 1 },
})

const getPalette = (theme: ButtonTheme, size: ButtonSize, status: ButtonStatus) => {
	switch (theme) {
		case "primary":
			if (status === "disabled") {
				if (size === "44" || size === "40") return { view: s.primaryDisabled1, text: Color.white }
				return { view: s.primaryDisabled2, text: Color.gray80 }
			} else {
				return { view: s.primaryNormal, text: Color.white }
			}
		case "lineGray10":
			if (status === "disabled") return { view: s.lineGray10Disabled, text: Color.gray80 }
			else return { view: s.lineGray10Normal, text: Color.gray10 }
		case "lineGray30":
			if (status === "disabled") return { view: s.lineGray30Disabled, text: Color.gray80 }
			else return { view: s.lineGray30Normal, text: Color.gray10 }
		case "lineOrange":
			if (status === "disabled") return { view: s.lineOrangeDisabled, text: Color.orange3 }
			else return { view: s.lineOrangeNormal, text: Color.orange1 }
		case "lineGray90":
			if (status === "disabled") return { view: s.lineGray90Disabled, text: Color.gray80 }
			else return { view: s.lineGray90Normal, text: Color.gray10 }
		case "orange2":
			if (status === "disabled") return { view: s.orange2Disabled, text: Color.orange3 }
			else return { view: s.orange2Normal, text: Color.orange1 }
		case "red1":
			if (status === "disabled") {
				if (size === "44" || size === "40") return { view: s.red1Disabled, text: Color.white }
				return { view: s.primaryDisabled2, text: Color.gray80 }
			} else {
				return { view: s.red1Normal, text: Color.white }
			}
		case "grayOpacity08":
			if (status === "disabled") return { view: s.grayOpacity08Disabled, text: Color.gray30 }
			else return { view: s.grayOpacity08Normal, text: Color.white }
		case "bgOrange2":
			if (status === "disabled") return { view: s.bgOrange2Disabled, text: Color.gray80 }
			else return { view: s.bgOrange2Normal, text: Color.orange1 }
		case "orange1G":
			if (status === "disabled") return { view: s.orange1GDisabled, text: Color.white }
			else return { view: s.orange1GNormal, text: Color.white }
		case "transparent":
			if (status === "disabled") return { view: s.transparentDisabled, text: Color.gray80 }
			else return { view: s.transparentNormal, text: Color.gray10 }
	}
}

const getGradient = (theme: ButtonTheme): GradientProps | undefined => {
	switch (theme) {
		case "orange1G":
			return {
				locations: [0, 1],
				colors: ["rgba(255, 105, 5, 1)", "rgba(233, 56, 46, 1)"],
				angle: 135,
			}
	}
}
