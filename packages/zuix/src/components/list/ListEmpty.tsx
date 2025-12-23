import React, { FC } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { renderTextByProps } from "../../utils/renderer"

const TEXT_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray50 }

export const ListEmpty: FC<ListEmptyProps> = ({ text, style, ...props }) => {
	const marginStyle = revertMargin(props)
	return (
		<View style={[s.root, marginStyle, style]} {...props}>
			{renderTextByProps(TEXT_PROPS, text)}
		</View>
	)
}

export interface ListEmptyProps extends ViewProps, Margin {
	text: TextType
}

const s = StyleSheet.create({
	root: {
		marginTop: 12,
		marginBottom: 12,
		marginLeft: 20,
		marginRight: 20,
		paddingTop: 16,
		paddingBottom: 16,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: Color.gray97,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
})
