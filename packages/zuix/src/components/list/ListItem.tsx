import React, { FC } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { Pressable, PressableProps } from "../../components/Pressable"
import { renderTextByProps } from "../../utils/renderer"

const TAG_TEXT_PROPS: TextProps = { size: "13", weight: "medium", color: Color.gray50, mb: 4 }
const TITLE_PROPS: TextProps = { size: "16", weight: "medium" }
const SUBTITLE1_PROPS: TextProps = { size: "14", weight: "regular" }
const SUBTITLE2_PROPS: TextProps = { size: "14", weight: "regular" }
const SUBTITLE3_PROPS: TextProps = { size: "13", weight: "regular", color: Color.gray50, mt: 4 }
const SUBTITLE4_PROPS: TextProps = { size: "13", weight: "regular", color: Color.gray50 }
const TEXT_BUTTON_PROPS: TextProps = { size: "14", weight: "medium", mt: 4, underline: true }

export const ListItem: FC<ListItemProps> = ({
	title = TITLE_PROPS,
	subtitle1,
	subtitle2,
	subtitle3,
	subtitle4,
	textButton,
	top,
	bottom,
	left,
	right,
	tagText,
	leftAlgin,
	style,
	mt = 16,
	mb = 16,
	ml = 20,
	mr = 20,
	subContent,
	onLayoutTitle,
	...props
}) => {
	const marginStyle = revertMargin({ mt, mr, mb, ml })
	return (
		<Pressable
			style={[s.root, marginStyle, style]}
			touchPadding={{ top: mt, right: mr, bottom: mb, left: ml }}
			{...props}>
			<View style={s.container}>
				{!!left && <View style={[s.leftView, getLeftAlginStyle(leftAlgin)]}>{left}</View>}
				<View style={s.textView} onLayout={onLayoutTitle}>
					{!!top && top}
					{tagText && renderTextByProps(TAG_TEXT_PROPS, tagText)}
					{renderTextByProps(TITLE_PROPS, title)}
					{subtitle1 && renderTextByProps(SUBTITLE1_PROPS, subtitle1)}
					{subtitle2 && renderTextByProps(SUBTITLE2_PROPS, subtitle2)}
					{subtitle3 && renderTextByProps(SUBTITLE3_PROPS, subtitle3)}
					{subtitle4 && renderTextByProps(SUBTITLE4_PROPS, subtitle4)}
					{textButton && renderTextByProps(TEXT_BUTTON_PROPS, textButton)}
					{subContent && subContent}
				</View>
				{!!right && <View style={s.rightView}>{right}</View>}
			</View>
			{bottom && bottom}
		</Pressable>
	)
}

const getLeftAlginStyle = (align: ListItemProps["leftAlgin"]) => {
	switch (align) {
		case "top":
			return s.alginTop
		case "center":
		default:
			return undefined
		case "bottom":
			return s.alignBottom
	}
}

export interface ListItemProps extends PressableProps, Margin {
	tagText?: TextType
	title: TextType
	subtitle1?: TextType
	subtitle2?: TextType
	subtitle3?: TextType
	subtitle4?: TextType
	textButton?: TextType
	subContent?: React.ReactElement
	top?: React.ReactElement
	bottom?: React.ReactElement
	right?: React.ReactElement
	left?: React.ReactElement
	leftAlgin?: "top" | "center" | "bottom"
	onLayoutTitle?: (event: LayoutChangeEvent) => void
}

const s = StyleSheet.create({
	root: {
		flexDirection: "column",
		alignItems: "center",
	},
	container: {
		width: "100%",
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
		justifyContent: "center",
	},
	rightView: {
		marginLeft: 12,
		alignSelf: "center",
	},
	textButtonView: {
		marginTop: 4,
	},
	alginTop: {
		alignSelf: "flex-start",
	},
	alignBottom: {
		alignSelf: "flex-end",
	},
})
