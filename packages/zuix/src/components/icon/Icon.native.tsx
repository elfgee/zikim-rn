import React from "react"
import { View, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"
import { Pressable } from "../../components/Pressable"
import { SVG } from "./svg"

import { IconProps } from "./type"
import { revertMargin } from "../../utils/style"

const DEFAULT_COLOR = "#1A1A1A"
const WHITE_COLOR = "#FFFFFF"

export class Icon extends React.PureComponent<IconProps> {
	static defaultProps = {
		width: 16,
		height: 16,
	}

	render() {
		const { width, height, style, color, subcolor, shape, containerStyle, ...props } = this.props
		const setStyle = StyleSheet.flatten([{ width, height }, style])

		if (!SVG[shape as keyof typeof SVG]) {
			return null
		}
		let svg = SVG[shape as keyof typeof SVG]
		if (subcolor) {
			svg = svg.replace(new RegExp(WHITE_COLOR, "g"), subcolor)
		}
		if (color) {
			svg = svg.replace(new RegExp(DEFAULT_COLOR, "g"), color)
		}

		if (containerStyle) {
			return (
				<Pressable
					style={[styles.center, revertMargin(props), containerStyle]}
					touchPadding={0}
					radius={containerStyle.borderRadius}
					{...props}>
					<View style={setStyle}>
						<SvgXml xml={svg} width={"100%"} height={"100%"} />
					</View>
				</Pressable>
			)
		}

		return (
			<Pressable style={[setStyle, revertMargin(props)]} touchPadding={4} radius={style?.borderRadius} {...props}>
				<SvgXml xml={svg} width={"100%"} height={"100%"} />
			</Pressable>
		)
	}
}
const styles = StyleSheet.create({
	center: {
		justifyContent: "center",
		alignItems: "center",
	},
})
