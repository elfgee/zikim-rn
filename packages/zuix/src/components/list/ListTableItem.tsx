import React, { FC } from "react"
import { StyleSheet, View } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { renderTextByProps } from "../../utils/renderer"
import { Pressable, StaticPressableProps } from "../../components/Pressable"

const TITLE_PROPS: TextProps = { size: "16", weight: "regular", color: Color.gray30 }
const SUBTITLE_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray50 }
const TEXT_PROPS: TextProps = { size: "16", weight: "medium", color: Color.gray10, textAlign: "right" }
const SUBTEXT_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray10, textAlign: "right" }

export const ListTableItem: FC<ListTableItemProps> = ({
	title,
	subtitle,
	subtitleAlign = "vertical",
	text,
	subtext,
	textAreaAlign = "right",
	ratio = "20",
	right,
	style,
	mt = 8,
	mb = 8,
	ml = 20,
	mr = 20,
	...props
}) => {
	const marginStyle = revertMargin({ mt, mr, mb, ml })
	const titleViewStyle = generateTitleViewStyle(subtitleAlign)
	const textViewStyle = generateTextViewStyle(textAreaAlign)
	const twinViewRatio = calculateRatio(ratio)
	return (
		<Pressable
			style={[s.root, marginStyle, style]}
			touchPadding={{ top: mt, right: mr, bottom: mb, left: ml }}
			{...props}>
			<View style={[titleViewStyle.view, twinViewRatio.left]}>
				{renderTextByProps(TITLE_PROPS, title)}
				{renderTextByProps({ ...SUBTITLE_PROPS, ...titleViewStyle.text }, subtitle)}
			</View>
			<View style={[s.textView, textViewStyle, twinViewRatio.right]}>
				<View style={s.textViewChild}>
					{renderTextByProps(TEXT_PROPS, text)}
					{renderTextByProps(SUBTEXT_PROPS, subtext)}
				</View>
				{!!right && <View style={s.rightView}>{right}</View>}
			</View>
		</Pressable>
	)
}

const generateTitleViewStyle = (subtitleAlign: NonNullable<ListTableItemProps["subtitleAlign"]>) => {
	if (subtitleAlign === "horizontal") return { view: s.typeHorizontal, text: { mr: 12 } }
	return { view: s.typeVertical, text: {} }
}

const generateTextViewStyle = (textAreaAlign: NonNullable<ListTableItemProps["textAreaAlign"]>) => {
	if (textAreaAlign === "left") return s.typeLeft
	return s.typeRight
}

const calculateRatio = (ratio: ListTableItemRatio) => {
	if (Number(ratio) > 100) return { left: s.ratio5, right: s.ratio5 }
	switch (ratio) {
		case "20":
			return { left: s.ratio2, right: s.ratio8 }
		case "30":
			return { left: s.ratio3, right: s.ratio7 }
		case "40":
			return { left: s.ratio4, right: s.ratio6 }
		case "50":
			return { left: s.ratio5, right: s.ratio5 }
		case "60":
			return { left: s.ratio6, right: s.ratio4 }
		case "70":
			return { left: s.ratio7, right: s.ratio3 }
		case "80":
			return { left: s.ratio8, right: s.ratio2 }
		case "0":
			return { left: s.ratio0, right: s.ratio1 }
		default:
			return { left: { flex: ratio }, right: { flex: 100 - ratio } }
	}
}

export type ListTableItemRatio = "20" | "30" | "40" | "50" | "60" | "70" | "80" | "0" | number
export interface ListTableItemProps extends StaticPressableProps, Margin {
	title?: TextType
	subtitle?: TextType
	/** @default vertical */
	subtitleAlign?: "vertical" | "horizontal"
	text?: TextType
	subtext?: TextType
	/** @default right */
	textAreaAlign?: "left" | "right"
	/** @default 20 */
	ratio?: ListTableItemRatio
	right?: React.ReactElement
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
	},
	typeVertical: {
		flexDirection: "column",
		justifyContent: "center",
	},
	typeHorizontal: {
		flexDirection: "row-reverse",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	textView: {
		flexDirection: "row",
		alignItems: "center",
		paddingLeft: 8,
	},
	textViewChild: {
		flexDirection: "column",
		flexShrink: 1,
	},
	rightView: {
		marginLeft: 8,
	},
	typeRight: {
		justifyContent: "flex-end",
	},
	typeLeft: {
		justifyContent: "flex-start",
	},
	ratio1: { flex: 1 },
	ratio2: { flex: 2 },
	ratio3: { flex: 3 },
	ratio4: { flex: 4 },
	ratio5: { flex: 5 },
	ratio6: { flex: 6 },
	ratio7: { flex: 7 },
	ratio8: { flex: 8 },
	ratio0: { flex: 0, display: "none" },
})
