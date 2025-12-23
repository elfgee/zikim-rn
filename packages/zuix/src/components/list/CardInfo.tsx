import React, { FC } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { renderTextByProps } from "../../utils/renderer"

const TITLE_PROPS: TextProps = { size: "22", weight: "bold", color: Color.gray10 }
const SUBTITLE_PROPS: TextProps = { size: "13", weight: "regular", color: Color.gray10, mb: 2 }
const SUBTEXT_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray50 }

export const CardInfo: FC<CardInfoProps> = ({ title, subtitle, subtext, style, ...props }) => {
	const marginStyle = revertMargin(props)
	return (
		<View style={[s.root, marginStyle, style]} {...props}>
			{renderTextByProps(SUBTITLE_PROPS, subtitle)}
			{renderTextByProps(TITLE_PROPS, title)}
			{renderTextByProps(SUBTEXT_PROPS, subtext)}
		</View>
	)
}

export interface CardInfoProps extends ViewProps, Margin {
	title: TextType
	subtitle: TextType
	subtext?: TextType
}

const s = StyleSheet.create({
	root: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 24,
		paddingBottom: 24,
		backgroundColor: Color.gray97,
		borderRadius: 12,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 28,
		marginBottom: 20,
		alignItems: "center",
		justifyContent: "center",
	},
})
