import React, { FC } from "react"
import { StyleSheet, View } from "react-native"

import { Color, Margin } from "../../types"
import { revertMargin } from "../../utils/style"
import { Pressable, StaticPressableProps } from "../../components/Pressable"
import { Text, TextType } from "../../components/Text"
import { renderTextByProps } from "../../utils/renderer"

export const FloatingButton: FC<FloatingButtonProps> = ({ badge, title, top, style, ...props }) => {
	const marginStyle = revertMargin(props)
	const badgeNumer: number | false = badge !== undefined && Math.min(badge, 99)

	return (
		<Pressable style={[s.root, marginStyle, style]} radius={100} {...props}>
			{top}
			{renderTextByProps(
				{ color: Color.white, size: "13", weight: "bold", mt: 3, allowFontScaling: false, numberOfLines: 1 },
				title
			)}

			{badge !== undefined && (
				<View style={s.badge}>
					<Text size={"13"} weight={"bold"} color={Color.orange1} allowFontScaling={false} numberOfLines={1}>
						{badgeNumer}
					</Text>
				</View>
			)}
		</Pressable>
	)
}

export interface FloatingButtonProps extends StaticPressableProps, Margin {
	top: React.ReactElement
	title: TextType
	badge?: number
}

const s = StyleSheet.create({
	root: {
		width: 72,
		height: 72,
		borderRadius: 100,
		backgroundColor: Color.orange1,
		paddingTop: 11,
		paddingBottom: 12,
		alignItems: "center",
	},
	badge: {
		position: "absolute",
		top: -2,
		right: -2,
		width: 24,
		height: 24,
		borderWidth: 2,
		borderRadius: 100,
		borderColor: Color.orange1,
		backgroundColor: Color.white,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1,
	},
})
