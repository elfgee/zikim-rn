import React, { FC, ReactElement } from "react"
import { StyleSheet, View, ViewProps } from "react-native"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { TextType } from "../components/Text"
import { renderTextByProps, renderByProps } from "../utils/renderer"
import { Icon } from "../components/icon/Icon"
import { IconProps } from "../components/icon/type"

export interface BadgeProps extends Margin, ViewProps {
	text: TextType
	/** @default pink1 */
	theme?: "pink1" | "blue1"
	/** Optional icon to display on the left side of the badge */
	icon?: IconProps
}

const getBadgeTextColor = (theme: BadgeProps["theme"]) => {
	switch (theme) {
		default:
		case "pink1":
			return "#FF20A6"
		case "blue1":
			return "#0651F1"
	}
}

export const Badge: FC<BadgeProps> = ({ theme = "pink1", style, text, icon, ...props }) => {
	const marginStyle = revertMargin(props)

	return (
		<View style={[styles.badge, getThemeBackgroundColor(theme), marginStyle, style]} {...props}>
			{icon && (
				<View style={styles.iconContainer}>
					{renderByProps(Icon, { width: 16, height: 16, color: getBadgeTextColor(theme), ...icon })}
				</View>
			)}
			{renderTextByProps({ color: getBadgeTextColor(theme), size: "11", allowFontScaling: false }, text)}
		</View>
	)
}

export type BadgeType = string | ReactElement<typeof Badge>

const getThemeBackgroundColor = (theme: BadgeProps["theme"] = "pink1") => {
	return (styles as any)[theme]
}

const styles = StyleSheet.create({
	badge: {
		borderRadius: 4,
		height: 20,
		paddingLeft: 2,
		paddingRight: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-start",
	},
	iconContainer: {
		marginRight: 2,
	},
	pink1: { backgroundColor: "#FFF5FB" },
	blue1: { backgroundColor: "#F0F7FF" },
})
