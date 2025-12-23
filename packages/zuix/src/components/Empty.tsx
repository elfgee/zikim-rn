import React, { FC } from "react"
import { View, ViewProps, StyleSheet } from "react-native"

import { TextType, TextProps } from "../components/Text"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { renderTextByProps } from "../utils/renderer"

const TITLE_PROPS: TextProps = { size: "18", weight: "bold", color: Color.gray10, textAlign: "center" }
const SUBTITLE_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray30, mt: 4, textAlign: "center" }

export const Empty: FC<EmptyProps> = ({ title, subtitle, top, bottom, style, ...props }) => {
	const marginStyle = revertMargin(props)
	return (
		<View style={[s.root, marginStyle, style]} {...props}>
			{!!top && <View style={s.topView}>{top}</View>}
			{renderTextByProps(TITLE_PROPS, title)}
			{renderTextByProps(SUBTITLE_PROPS, subtitle)}
			{!!bottom && <View style={s.bottomView}>{bottom}</View>}
		</View>
	)
}

export interface EmptyProps extends ViewProps, Margin {
	title: TextType
	subtitle?: TextType
	top?: React.ReactElement
	bottom?: React.ReactElement
}

const s = StyleSheet.create({
	root: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 20,
		paddingRight: 20,
	},
	topView: {
		marginBottom: 20,
	},
	bottomView: {
		marginTop: 20,
	},
})
