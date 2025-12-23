import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Pressable } from "../../components/Pressable"
import { SVG } from "./svg"
import { IconProps } from "./type"
import { revertMargin } from "../../utils/style"

const DEFAULT_COLOR = "#1A1A1A"
const WHITE_COLOR = "#FFFFFF"

export const Icon: FC<IconProps> = ({
	width = 16,
	height = 16,
	style,
	color,
	subcolor,
	shape,
	containerStyle,
	radius,
	...props
}) => {
	if (!SVG[shape as keyof typeof SVG]) {
		return null
	}

	let svg = SVG[shape as keyof typeof SVG].replace(
		/^(<svg) /,
		`$1 style="width:100%;height:100%;pointer-events:none;"`
	)

	if (subcolor) {
		svg = svg.replace(new RegExp(WHITE_COLOR, "g"), subcolor)
	}
	if (color) {
		svg = svg.replace(new RegExp(DEFAULT_COLOR, "g"), color)
	}

	if (containerStyle) {
		return (
			<Pressable
				style={[s.center as ViewStyle, revertMargin(props), containerStyle]}
				touchPadding={0}
				radius={containerStyle.borderRadius}
				{...props}>
				<div style={{ width, height, ...(style as React.CSSProperties) }}>
					<div style={s.wrap} dangerouslySetInnerHTML={{ __html: svg }} />
				</div>
			</Pressable>
		)
	}
	return (
		<Pressable
			style={[{ width, height }, revertMargin(props), style]}
			touchPadding={radius! >= Number(width) / 2 ? 2 : 4}
			radius={radius}
			{...props}>
			<div style={s.wrap} dangerouslySetInnerHTML={{ __html: svg }} />
		</Pressable>
	)
}

const s = {
	center: {
		justifyContent: "center",
		alignItems: "center",
	},
	wrap: {
		flex: "1 1 0",
		minWidth: 0,
		minHeight: 0,
		display: "flex",
	},
}
