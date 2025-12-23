import React, { FC, ReactElement } from "react"
import { StyleSheet, View, ViewProps } from "react-native"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { TextType, TextProps } from "../components/Text"
import { renderTextByProps } from "../utils/renderer"
import { Gradient } from "../components/gradient/Gradient"

export interface TagProps extends Margin, ViewProps {
	text: TextType
	/** @default orange2 */
	theme?:
		| "orange1"
		| "orange2"
		| "red1"
		| "red2"
		| "blue1"
		| "blue2"
		| "blue5"
		| "gray70"
		| "gray95"
		| "gray10"
		| "white"
		| "grayOpacity60"
		| "navy1"
		| "navy2"
		| "bgGray95"
		| "hug"
		| "green2"
		| "green5"
		| "green6"
	/** @default large */
	size?: "large" | "medium" | "small" | "xsmall"
	/** @default 20 */
	tagRadius?: number
}

export const Tag: FC<TagProps> = ({ theme = "orange2", size = "large", tagRadius = 20, text, style, ...props }) => {
	const marginStyle = revertMargin(props)

	if (theme === "hug") {
		const locations = [0, 1]
		const colors = ["#DBE9F4", "#E0EFE1"]
		return (
			<View style={[styles.tag, getSizeStyle(size), marginStyle, style]} {...props}>
				<Gradient
					locations={locations}
					colors={colors}
					direction="right"
					style={{ zIndex: 1, borderRadius: 20 }}
				/>
				{renderTextByProps({ color: getTextColor(theme), size: getFontSize(size), style: { zIndex: 2 } }, text)}
			</View>
		)
	}

	return (
		<View
			style={[
				styles.tag,
				getSizeStyle(size),
				getThemeBackgroundColor(theme),
				{ borderRadius: tagRadius },
				marginStyle,
				style,
			]}
			{...props}>
			{renderTextByProps({ color: getTextColor(theme), size: getFontSize(size) }, text)}
		</View>
	)
}

export type TagType = string | ReactElement<typeof Tag>

const getFontSize = (size: TagProps["size"]): TextProps["size"] => {
	switch (size) {
		default:
		case "xsmall":
			return "10"
		case "small":
			return "11"
		case "medium":
			return "12"
		case "large":
			return "13"
	}
}

const getTextColor = (theme: TagProps["theme"]) => {
	switch (theme) {
		default:
		case "orange2":
			return Color.orange1
		case "blue2":
			return Color.blue1
		case "gray95":
			return Color.gray50
		case "red2":
			return Color.red1
		case "white":
			return Color.gray30
		case "orange1":
		case "red1":
		case "gray70":
		case "gray10":
		case "grayOpacity60":
		case "navy1":
		case "blue1":
		case "blue5":
		case "green5":
		case "green6":
			return Color.white
		case "bgGray95":
			return Color.gray10
		case "navy2":
			return Color.navy1
		case "hug":
			return Color.blue4
		case "green2":
			return Color.green1
	}
}

const getSizeStyle = (size: TagProps["size"]) => {
	switch (size) {
		default:
		case "large":
			return styles.sizeLarge
		case "medium":
			return styles.sizeMedium
		case "small":
			return styles.sizeSmall
		case "xsmall":
			return styles.sizeXsmall
	}
}

const getThemeBackgroundColor = (theme: TagProps["theme"] = "orange2") => {
	return (styles as any)[theme]
}

const styles = StyleSheet.create({
	tag: {
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-start",
	},
	orange1: { backgroundColor: Color.orange1 },
	orange2: { backgroundColor: Color.orange2 },
	red1: { backgroundColor: Color.red1 },
	red2: { backgroundColor: Color.red2 },
	blue1: { backgroundColor: Color.blue1 },
	blue2: { backgroundColor: Color.blue2 },
	blue5: { backgroundColor: Color.blue5 },
	gray95: { backgroundColor: Color.gray95 },
	gray70: { backgroundColor: Color.gray70 },
	gray10: { backgroundColor: Color.gray10 },
	white: { backgroundColor: Color.white },
	grayOpacity60: { backgroundColor: Color.grayOpacity60 },
	navy1: { backgroundColor: Color.navy1 },
	bgGray95: { backgroundColor: Color.gray95 },
	navy2: { backgroundColor: Color.navy2 },
	green2: { backgroundColor: Color.green2 },
	green5: { backgroundColor: Color.green5 },
	green6: { backgroundColor: Color.green6 },
	sizeLarge: { paddingTop: 6, paddingRight: 12, paddingBottom: 6, paddingLeft: 12 },
	sizeMedium: { paddingTop: 4, paddingRight: 8, paddingBottom: 4, paddingLeft: 8 },
	sizeSmall: { paddingTop: 2, paddingRight: 6, paddingBottom: 2, paddingLeft: 6 },
	sizeXsmall: { paddingTop: 2, paddingRight: 4, paddingBottom: 2, paddingLeft: 4 },
})
