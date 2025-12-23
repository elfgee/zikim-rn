import React, { FC } from "react"
import { View, StyleSheet } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { Pressable, StaticPressableProps } from "../../components/Pressable"
import { renderTextByProps } from "../../utils/renderer"

const TAG_TEXT_PROPS: TextProps = { size: "13", weight: "medium", color: Color.blue1, mb: 4 }
const TITLE_PROPS: TextProps = { size: "16", weight: "bold", color: Color.gray10 }
const SUBTITLE1_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray30 }
const SUBTITLE2_PROPS: TextProps = { size: "13", weight: "regular", color: Color.gray50, mt: 4 }

export const ListCardItem: FC<ListCardItemProps> = ({
	title,
	subtitle1,
	subtitle2,
	tagText,
	right,
	status = "normal",
	style,
	...props
}) => {
	const marginStyle = revertMargin(props)
	const statusColorStyle = generateColorStyle(status)
	const disableStatus = status === "disabled"
	return (
		<Pressable
			style={[s.root, statusColorStyle, marginStyle, style]}
			disabled={disableStatus}
			radius={4}
			{...props}>
			<View style={s.textView}>
				{renderTextByProps({ ...TAG_TEXT_PROPS, color: convertColorStyle(status, Color.blue1) }, tagText)}
				{renderTextByProps({ ...TITLE_PROPS, color: convertColorStyle(status, Color.gray10) }, title)}
				{renderTextByProps({ ...SUBTITLE1_PROPS, color: convertColorStyle(status, Color.gray30) }, subtitle1)}
				{renderTextByProps({ ...SUBTITLE2_PROPS, color: convertColorStyle(status, Color.gray50) }, subtitle2)}
			</View>
			{!!right && <View style={s.rightView}>{right}</View>}
		</Pressable>
	)
}

const generateColorStyle = (status: ListCardItemProps["status"]) => {
	if (status === "disabled") return s.backgroundDisabledColor
	return s.backgroundNormalColor
}

const convertColorStyle = (status: ListCardItemProps["status"], originColor: Color) => {
	if (status === "disabled") return Color.gray70
	return originColor
}

export interface ListCardItemProps extends StaticPressableProps, Margin {
	title: TextType
	subtitle1?: TextType
	subtitle2?: TextType
	tagText?: TextType
	/** @default normal */
	status?: "normal" | "disabled"
	right?: React.ReactElement
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		marginTop: 8,
		marginBottom: 8,
		marginLeft: 20,
		marginRight: 20,
		padding: 15,
		alignItems: "center",
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
	backgroundNormalColor: {
		backgroundColor: Color.white,
		borderWidth: 1,
		borderColor: Color.gray90,
		borderRadius: 4,
	},
	backgroundDisabledColor: {
		backgroundColor: Color.gray97,
		borderWidth: 1,
		borderColor: Color.gray90,
		borderRadius: 4,
	},
})
