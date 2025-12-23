import React, { FC } from "react"
import { View, StyleSheet } from "react-native"

import { TextType, TextProps } from "../components/Text"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { renderTextByProps } from "../utils/renderer"
import { Pressable, PressableProps } from "../components/Pressable"

const TEXT_PROPS: TextProps = { size: "18", weight: "bold", color: Color.gray10 }
const SUBTEXT_PROPS: TextProps = { size: "16", weight: "regular", color: Color.gray50, mt: 4 }
const TEXT_BUTTON_PROPS: TextProps = { size: "16", weight: "medium", color: Color.orange1, mt: 4 }

export const NotificationExtend: FC<NotificationExtendProps> = ({
	left,
	text,
	subtext,
	textButton,
	bg = Color.transparent,
	style,
	mt = 12,
	mr = 20,
	mb = 12,
	ml = 20,
	...props
}) => {
	const marginStyle = revertMargin({ mt, mr, mb, ml })
	const rootStyle = getRootStyle(bg)
	return (
		<Pressable
			style={[s.root, rootStyle, marginStyle, style]}
			touchPadding={bg === Color.transparent ? { top: mt, right: mr, bottom: mb, left: ml } : undefined}
			{...props}>
			{!!left && <View style={s.leftView}>{left}</View>}
			<View style={s.textView}>
				{renderTextByProps(TEXT_PROPS, text)}
				{subtext && renderTextByProps(SUBTEXT_PROPS, subtext)}
				{textButton &&
					renderTextByProps(TEXT_BUTTON_PROPS, textButton, (first, second) => ({
						mt: !!first && !!subtext ? 12 : 4,
						style: typeof second !== "string" && second.style,
					}))}
			</View>
		</Pressable>
	)
}

const getRootStyle = (bg: NotificationExtendBackgroundColor): object => {
	switch (bg) {
		case Color.transparent:
		default:
			return s.tranparentView
		case Color.white:
			return s.backgroundLine
		case Color.orange2:
			return s.backgroundOrange2
	}
}

export type NotificationExtendBackgroundColor = Color.orange2 | Color.white | Color.transparent
export interface NotificationExtendProps extends PressableProps, Margin {
	left?: React.ReactElement
	text: TextType
	subtext?: TextType
	textButton?: TextType
	/** @default Color.transparent */
	bg?: NotificationExtendBackgroundColor
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		borderWidth: 1,
	},
	backgroundLine: {
		backgroundColor: Color.white,
		borderColor: Color.gray90,
		paddingTop: 16,
		paddingBottom: 16,
		paddingLeft: 12,
		paddingRight: 12,
		borderRadius: 4,
		borderWidth: 1,
	},
	backgroundOrange2: {
		backgroundColor: Color.orange2,
		borderColor: Color.orange3,
		paddingTop: 16,
		paddingBottom: 16,
		paddingLeft: 12,
		paddingRight: 12,
		borderRadius: 4,
		borderWidth: 1,
	},
	tranparentView: {
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 0,
		paddingRight: 0,
		borderWidth: 0,
		borderRadius: 0,
		backgroundColor: Color.transparent,
		borderColor: Color.transparent,
	},
	leftView: {
		marginRight: 16,
	},
	textView: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
	},
	textButtonView: {
		marginTop: 12,
	},
})
