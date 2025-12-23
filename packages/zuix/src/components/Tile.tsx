import React, { FC } from "react"
import { StyleSheet, View } from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { Pressable, PressableProps } from "../components/Pressable"
import { TextType, TextProps } from "../components/Text"
import { renderTextByProps } from "../utils/renderer"

const TITLE_PROPS: TextProps = { size: "16", weight: "bold", color: Color.gray10 }
const SUBTITLE_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray50 }

export const Tile: FC<TileProps> = ({
	theme = "lineGray90",
	align = "center",
	status = "normal",
	top,
	left,
	title,
	subtitle,
	style,
	borderRadius = 4,
	...props
}) => {
	const marginStyle = revertMargin(props)
	const alignPaddingStyle = getAlignPaddingStyle(align, theme)
	const alignStyle = getAlignStyle(align)
	const rootColorStyle = getRootColorStyle(theme, status)
	const borderStyle = getBorderColorStyle(theme, status)
	const isHorizontal = align === "horizontal"
	const borderView = getBorderView(borderRadius)

	return (
		<Pressable
			style={[s.root, alignPaddingStyle, rootColorStyle, marginStyle, style]}
			radius={borderRadius}
			{...props}>
			{left && <View style={s.leftView}>{left}</View>}
			<View style={[s.verticalTileView, alignStyle]}>
				{top && <View style={s.topView}>{top}</View>}
				{renderTextByProps(
					{
						...TITLE_PROPS,
						color: convertColorStyle(status, Color.gray10),
						weight: isHorizontal ? "regular" : "bold",
						textAlign: align === "center" ? "center" : undefined,
					},
					title
				)}
				{renderTextByProps(
					{
						...SUBTITLE_PROPS,
						color: convertColorStyle(status, Color.gray50),
						textAlign: align === "center" ? "center" : undefined,
					},
					subtitle
				)}
			</View>
			<View style={[borderView, borderStyle]} />
		</Pressable>
	)
}

const getAlignPaddingStyle = (align: TileAlign, theme: TileTheme) => {
	const isNoneTheme = theme === "transparent"
	switch (align) {
		default:
		case "center":
			if (isNoneTheme) return s.noneThemeAlignCenterPadding
			return s.alignCenterPadding
		case "left":
			if (isNoneTheme) return s.noneThemeAlignLeftPadding
			return s.alignLeftPadding
		case "horizontal":
			if (isNoneTheme) return s.noneThemeAlignHorizontalPadding
			return s.alignHorizontalPadding
	}
}

const getAlignStyle = (align: TileAlign) => {
	switch (align) {
		default:
		case "center":
			return s.alignCenter
		case "left":
			return s.alignLeft
		case "horizontal":
			return s.alignHorizontal
	}
}

const getRootColorStyle = (theme: TileTheme, status: TileStatus) => {
	if (theme !== "transparent" && status === "disabled") return s.disabled
	switch (theme) {
		default:
		case "lineGray10":
			return s.lineGray10Theme
		case "lineGray90":
			return s.lineGray90Theme
		case "lineGray30":
			return s.lineGray30Theme
		case "linePrimary":
			return s.linePrimaryTheme
		case "gray":
			return s.grayTheme
		case "transparent":
			return s.noneTheme
	}
}

const getBorderColorStyle = (theme: TileTheme, status: TileStatus) => {
	if (theme !== "transparent" && status === "disabled") return s.disabledBorder
	switch (theme) {
		default:
		case "lineGray10":
			return s.lineGray10ThemeBorder
		case "lineGray90":
			return s.lineGray90ThemeBorder
		case "lineGray30":
			return s.lineGray30ThemeBorder
		case "linePrimary":
			return s.linePrimaryThemeBorder
		case "gray":
			return s.grayThemeBorder
		case "transparent":
			return s.noneThemeBorder
	}
}

const getBorderView = (tileBorderSize: TileBorderSize) => {
	switch (tileBorderSize) {
		default:
		case 4:
			return s.borderViewRadius4
		case 8:
			return s.borderViewRadius8
		case 12:
			return s.borderViewRadius12
	}
}

const convertColorStyle = (status: TileStatus, originColor: Color) => {
	if (status === "normal") return originColor
	return Color.gray80
}

export type TileTheme = "lineGray90" | "lineGray30" | "lineGray10" | "linePrimary" | "gray" | "transparent"
export type TileAlign = "center" | "left" | "horizontal"
export type TileStatus = "normal" | "disabled"
export type TileBorderSize = 4 | 8 | 12
export interface TileProps extends PressableProps, Margin {
	top?: React.ReactElement
	left?: React.ReactElement
	title: TextType
	subtitle?: TextType
	/** @default center */
	align?: TileAlign
	/** @default lineGray90 */
	theme?: TileTheme
	/** @default normal */
	status?: TileStatus
	/** @default 4 */
	borderRadius?: TileBorderSize
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	verticalTileView: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
	},
	alignCenterPadding: {
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: 20,
		paddingBottom: 16,
	},
	alignCenter: {
		alignItems: "center",
	},
	alignLeftPadding: {
		paddingLeft: 20,
		paddingRight: 16,
		paddingTop: 16,
		paddingBottom: 16,
	},
	alignLeft: {
		alignItems: "flex-start",
	},
	alignHorizontalPadding: {
		paddingLeft: 16,
		paddingRight: 16,
		paddingTop: 20,
		paddingBottom: 20,
		justifyContent: "flex-start",
	},
	alignHorizontal: {
		alignItems: "flex-start",
	},
	noneThemeAlignCenterPadding: {
		paddingTop: 15,
		paddingBottom: 7,
		paddingLeft: 0,
		paddingRight: 0,
	},
	noneThemeAlignLeftPadding: {
		paddingTop: 15,
		paddingBottom: 7,
		paddingLeft: 0,
		paddingRight: 0,
	},
	noneThemeAlignHorizontalPadding: {
		paddingTop: 11,
		paddingBottom: 11,
		paddingLeft: 0,
		paddingRight: 0,
	},
	leftView: {
		marginRight: 8,
	},
	topView: {
		marginBottom: 12,
	},
	disabled: { backgroundColor: Color.gray97 },
	lineGray90Theme: { backgroundColor: Color.white },
	lineGray30Theme: { backgroundColor: Color.white },
	lineGray10Theme: { backgroundColor: Color.white },
	linePrimaryTheme: { backgroundColor: Color.white },
	grayTheme: { backgroundColor: Color.gray97 },
	noneTheme: { backgroundColor: Color.transparent },
	disabledBorder: { borderWidth: 1, borderColor: Color.gray90 },
	lineGray90ThemeBorder: { borderWidth: 1, borderColor: Color.gray90 },
	lineGray30ThemeBorder: { borderWidth: 1, borderColor: Color.gray30 },
	lineGray10ThemeBorder: { borderWidth: 1.4, borderColor: Color.gray10 },
	linePrimaryThemeBorder: { borderWidth: 1.4, borderColor: Color.orange1 },
	grayThemeBorder: { borderWidth: 1, borderColor: Color.transparent },
	noneThemeBorder: { borderWidth: 1, borderColor: Color.transparent },
	borderViewRadius4: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4 },
	borderViewRadius8: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 8 },
	borderViewRadius12: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, borderRadius: 12 },
})
