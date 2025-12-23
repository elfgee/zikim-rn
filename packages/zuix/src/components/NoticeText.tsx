import React, { FC } from "react"
import { View, ViewProps, StyleSheet } from "react-native"

import { TextProps, TextType } from "../components/Text"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { renderTextByProps } from "../utils/renderer"

const DOT_PROPS: TextProps = { size: "14", weight: "regular", mr: 4 }
const TEXT_PROPS: TextProps = { size: "14", weight: "regular" }

export const NoticeText: FC<NoticeTextProps> = ({ size = "14", dot = "•", text, style, ...props }) => {
	const marginStyle = revertMargin(props)
	const textColor = size === "14" ? Color.gray50 : Color.gray30
	return (
		<View style={[s.root, marginStyle, style]} {...props}>
			{renderTextByProps({ ...DOT_PROPS, size, color: textColor }, dot)}
			{renderTextByProps({ ...TEXT_PROPS, size, color: textColor }, text)}
		</View>
	)
}

export interface NoticeTextProps extends ViewProps, Margin {
	/** @default • */
	dot?: TextType
	text: TextType
	/** @default 14 */
	size?: "14" | "16"
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		marginTop: 4,
		marginRight: 20,
		marginBottom: 4,
		marginLeft: 20,
	},

	bullet: {
		marginRight: 4,
	},
})
