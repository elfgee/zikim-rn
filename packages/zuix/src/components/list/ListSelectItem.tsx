import React, { FC } from "react"
import { StyleSheet, View } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { Pressable, PressableProps } from "../../components/Pressable"
import { renderTextByProps } from "../../utils/renderer"

const TITLE_PROPS: TextProps = { size: "16", weight: "medium", color: Color.gray10 }
const SUBTITLE_PROPS: TextProps = { size: "13", weight: "regular", color: Color.gray50 }

export const ListSelectItem: FC<ListSelectItemProps> = ({
	title,
	subtitle,
	left,
	right,
	style,
	mt = 12,
	mr = 20,
	mb = 12,
	ml = 20,
	...props
}) => {
	const marginStyle = revertMargin({ mt, mr, mb, ml })
	return (
		<Pressable
			style={[s.root, marginStyle, style]}
			touchPadding={{ top: mt, right: mr, bottom: mb, left: ml }}
			{...props}>
			{!!left && <View style={s.leftView}>{left}</View>}
			<View style={s.textView}>
				{renderTextByProps(TITLE_PROPS, title)}
				{renderTextByProps(SUBTITLE_PROPS, subtitle)}
			</View>
			{!!right && <View style={s.rightView}>{right}</View>}
		</Pressable>
	)
}

export interface ListSelectItemProps extends PressableProps, Margin {
	title: TextType
	subtitle?: TextType
	left?: React.ReactElement
	right?: React.ReactElement
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
	},
	leftView: {
		marginRight: 12,
	},
	textView: {
		flexDirection: "column",
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
	},
	rightView: {
		marginLeft: 12,
	},
})
