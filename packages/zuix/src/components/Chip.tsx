import React, { FC } from "react"
import { StyleSheet } from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { Pressable, PressableProps } from "../components/Pressable"
import { TextType } from "../components/Text"
import { renderTextByProps } from "../utils/renderer"

export const Chip: FC<ChipProps> = ({
	theme = "lineGray90",
	size = "32",
	status = "normal",
	title,
	style,
	selectedTheme,
	...props
}) => {
	const marginStyle = revertMargin(props)
	const rootStyle = generateRootStyle(size)
	const textSize = generateTextStyle(size)
	const { view: viewColorStyle, text: textColorStyle } = getPalette(theme, size, status, selectedTheme)
	return (
		<Pressable
			radius={Math.floor(Number(size) / 2)}
			style={[s.root, rootStyle, viewColorStyle, marginStyle, style]}
			{...props}>
			{renderTextByProps(
				{
					color: textColorStyle,
					size: textSize,
					weight: "medium",
					numberOfLines: 1,
					allowFontScaling: false,
				},
				title
			)}
		</Pressable>
	)
}

export type ChipSelectedTheme = "gray30" | undefined
export type ChipTheme = "lineGray90" | "bgOrange2" | "lineGray30"
export type ChipSize = "32" | "36"
export type ChipStatus = "normal" | "selected"
export interface ChipProps extends PressableProps, Margin {
	title: TextType
	/** @default lineGray90 */
	theme?: ChipTheme
	/** @default 32 */
	size?: ChipSize
	/** @default normal */
	status?: ChipStatus
	/** @default undefined */
	selectedTheme?: ChipSelectedTheme
}

const s = StyleSheet.create({
	root: {
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "flex-start",
	},
	root32: {
		height: 32,
		paddingLeft: 12,
		paddingRight: 12,
		borderRadius: 16,
	},
	root36: {
		height: 36,
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 20,
	},

	lineGray90Normal: { backgroundColor: Color.white, borderColor: Color.gray90, borderWidth: 1 },
	lineGray90Selected: { backgroundColor: Color.white, borderColor: Color.orange1, borderWidth: 1.4 },
	lineGray90Size36Selected: { backgroundColor: Color.gray30, borderColor: Color.gray30, borderWidth: 1.4 },

	bgOrange2Normal: { backgroundColor: Color.orange2, borderColor: Color.orange2, borderWidth: 1 },
	bgOrange2Selected: { backgroundColor: Color.orange2, borderColor: Color.orange1, borderWidth: 1.4 },

	lineGray30Normal: { backgroundColor: Color.white, borderColor: Color.gray30, borderWidth: 1 },
	lineGray30Selected: { backgroundColor: Color.white, borderColor: Color.orange1, borderWidth: 1.4 },
})

const generateRootStyle = (size: ChipSize) => {
	switch (size) {
		default:
		case "32":
			return s.root32
		case "36":
			return s.root36
	}
}

const generateTextStyle = (size: ChipSize) => {
	switch (size) {
		default:
		case "32":
			return "13"
		case "36":
			return "14"
	}
}

const getPalette = (theme: ChipTheme, size: ChipSize, status: ChipStatus, selectedTheme?: ChipSelectedTheme) => {
	switch (theme) {
		default:
		case "lineGray90":
			if (status === "selected") {
				if (size === "36" || selectedTheme === "gray30")
					return { view: s.lineGray90Size36Selected, text: Color.white }
				return { view: s.lineGray90Selected, text: Color.orange1 }
			} else {
				return { view: s.lineGray90Normal, text: Color.gray10 }
			}
		case "bgOrange2":
			if (status === "selected") return { view: s.bgOrange2Selected, text: Color.orange1 }
			else return { view: s.bgOrange2Normal, text: Color.orange1 }
		case "lineGray30":
			if (status === "selected") return { view: s.lineGray30Selected, text: Color.orange1 }
			else return { view: s.lineGray30Normal, text: Color.gray10 }
	}
}
