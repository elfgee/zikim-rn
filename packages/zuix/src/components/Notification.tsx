import React, { FC } from "react"
import { View, StyleSheet } from "react-native"

import { TextType, TextProps } from "../components/Text"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { renderTextByProps } from "../utils/renderer"
import { Pressable, PressableProps } from "../components/Pressable"

const TEXT_PROPS: TextProps = { size: "14", weight: "medium", color: Color.gray10 }

export const Notification: FC<NotificationProps> = ({
	left,
	right,
	text,
	bg = Color.gray97,
	style,
	mt = 8,
	mr = 20,
	mb = 8,
	ml = 20,
	...props
}) => {
	const marginStyle = revertMargin({ mt, mr, mb, ml })
	const rootStyle = getRootStyle(bg)
	return (
		<Pressable style={[s.root, rootStyle, marginStyle, style]} radius={4} {...props}>
			{!!left && <View style={s.leftView}>{left}</View>}
			{renderTextByProps(TEXT_PROPS, text, (first, second) => ({
				style: [!!first && s.textView, typeof second !== "string" && second.style],
			}))}
			{!!right && <View style={s.rightView}>{right}</View>}
		</Pressable>
	)
}

const getRootStyle = (bg: NotificationBackgroundColor): object => {
	switch (bg) {
		case Color.orange2:
			return s.backgroundOrange2
		case Color.blue2:
			return s.backgroundBlue2
		case Color.red2:
			return s.backgroundRed2
		case Color.transparent:
			return s.tranparentView
		case Color.gray97:
		default:
			return s.backgroundGray97
	}
}

export type NotificationBackgroundColor = Color.gray97 | Color.orange2 | Color.blue2 | Color.red2 | Color.transparent
export interface NotificationProps extends PressableProps, Margin {
	left?: React.ReactElement
	right?: React.ReactElement
	text: TextType
	/** @default Color.gray97 */
	bg?: NotificationBackgroundColor
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		borderRadius: 4,
	},
	backgroundGray97: { backgroundColor: Color.gray97, borderColor: Color.gray95 },
	backgroundOrange2: { backgroundColor: Color.orange2 },
	backgroundBlue2: { backgroundColor: Color.blue2 },
	backgroundRed2: { backgroundColor: Color.red2 },
	tranparentView: {
		marginLeft: 20,
		marginTop: 12,
		marginBottom: 12,
		marginRight: 20,
		padding: 0,
		borderRadius: 0,
		backgroundColor: Color.transparent,
	},
	leftView: {
		marginRight: 8,
	},
	textView: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
	},
	rightView: {
		marginLeft: 8,
	},
})
