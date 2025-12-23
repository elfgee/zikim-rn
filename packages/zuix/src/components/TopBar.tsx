import React, { FC, useState, useMemo } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { TextType } from "../components/Text"
import { renderTextByProps } from "../utils/renderer"

const TOOLBAR_HEIGHT = 52
const TOOLBAR_DEFAULT_TOP_PADDING = 6
const ITEM_MIN_WIDTH = 72
const SIDE_MARGIN_GAP_WITH_CENTER_TYPE = 8
const SIDE_MARGIN_GAP_WITH_LEFT_TYPE = 12

export const TopBar: FC<TopBarProps> = ({
	left,
	right,
	title,
	divider = false,
	bg = Color.white,
	notchPadding = 0,
	titleAlign = "center",
	style,
	...props
}) => {
	const marginStyle = revertMargin(props)
	const [leftWidth, setLeftWidth] = useState(0)
	const [rightWidth, setRightWidth] = useState(0)
	const backgroundStyle = bg === Color.white ? s.backgroundWhite : s.backgroundTransparent
	const actualWidth = useMemo(
		() => getSideWidth(leftWidth, rightWidth, left, right),
		[leftWidth, rightWidth, left, right]
	)
	const extendStyle = {
		height: TOOLBAR_HEIGHT + notchPadding,
		paddingTop: TOOLBAR_DEFAULT_TOP_PADDING + notchPadding,
	}
	const isTitleCenter = titleAlign === "center"
	const gap = isTitleCenter ? SIDE_MARGIN_GAP_WITH_CENTER_TYPE : SIDE_MARGIN_GAP_WITH_LEFT_TYPE

	return (
		<View style={[s.root, backgroundStyle, marginStyle, extendStyle, style]} {...props}>
			<View
				style={[
					s.leftView,
					isTitleCenter && actualWidth > 0 ? { width: actualWidth } : undefined,
					s[`mr${gap}`],
				]}
				onLayout={(event) => {
					const { width } = event.nativeEvent.layout
					setLeftWidth(width)
				}}>
				{left}
			</View>
			<View style={s.titleView}>
				{renderTextByProps(
					{
						style: s[`${titleAlign}Title`],
						numberOfLines: isTitleCenter ? 2 : 1,
						size: "14",
						weight: "bold",
						allowFontScaling: false,
						ellipsizeMode: "tail",
					},
					title
				)}
			</View>
			<View
				style={[
					s.rightView,
					isTitleCenter && actualWidth > 0 ? { width: actualWidth } : undefined,
					s[`ml${gap}`],
				]}
				onLayout={(event) => {
					const { width } = event.nativeEvent.layout
					setRightWidth(width)
				}}>
				{renderRight(right)}
			</View>
			{divider && <View style={s.shadow} />}
		</View>
	)
}

const renderRight = (right: TopBarProps["right"]) => {
	if (right?.type === React.Fragment) {
		return right.props.children.map((child: JSX.Element, index: number) =>
			React.cloneElement(child, {
				...child.props,
				mr: right.props.children.length - 1 === index ? 0 : 8,
				key: index,
			})
		)
	}
	return right
}

const getSideWidth = (leftWidth: number, rightWidth: number, left?: React.ReactElement, right?: React.ReactElement) => {
	let maxWidth = 0
	if (left && right) {
		if (leftWidth > 0 && rightWidth > 0) {
			maxWidth = Math.max(leftWidth, rightWidth)
		} else {
			return 0
		}
	} else if (left && !right) {
		maxWidth = leftWidth
	} else if (right && !left) {
		maxWidth = rightWidth
	} else {
		maxWidth = ITEM_MIN_WIDTH
	}
	return Math.max(ITEM_MIN_WIDTH, maxWidth)
}

export interface TopBarProps extends ViewProps, Margin {
	left?: React.ReactElement
	title?: TextType
	right?: React.ReactElement
	/** @default false */
	divider?: boolean
	/** @default Color.white */
	bg?: Color.white | Color.transparent
	/** @default 0 */
	notchPadding?: number
	/** @default center */
	titleAlign?: "left" | "center"
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: TOOLBAR_DEFAULT_TOP_PADDING,
		paddingBottom: 6,
		height: TOOLBAR_HEIGHT,
		zIndex: 1,
	},
	backgroundWhite: { backgroundColor: Color.white },
	backgroundTransparent: { backgroundColor: Color.transparent },
	leftView: {
		flexDirection: "row",
		alignItems: "center",
	},
	titleView: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		justifyContent: "center",
	},
	centerTitle: {
		textAlign: "center",
	},
	leftTitle: {
		textAlign: "left",
	},
	rightView: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	shadow: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Color.grayOpacity16,
		height: 0.5,
		zIndex: 1,
	},
	mr8: {
		marginRight: 8,
	},
	mr12: {
		marginRight: 12,
	},
	ml8: {
		marginLeft: 8,
	},
	ml12: {
		marginLeft: 12,
	},
})
