import React, { FC } from "react"
import { Image as RNImage, ImageProps as RNImageProps, StyleSheet, View } from "react-native"
import { renderTextByProps } from "../utils/renderer"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { Icon } from "../components/icon"
import { Pressable, StaticPressableProps } from "../components/Pressable"
import { TextType } from "../components/Text"

export const ProfileCard: FC<ProfileCardProps> = ({
	ratingText,
	title,
	titleInfo,
	subtitle,
	source,
	style,
	...props
}) => {
	const marginStyle = revertMargin(props)

	return (
		<Pressable style={[s.root, marginStyle, style]} {...props} radius={4}>
			<View style={s.profileWrap}>
				<View style={s.left}>
					{renderTitleInfo(titleInfo)}
					{ratingText &&
						renderTextByProps(
							{
								left: <Icon shape={"StarSolid"} color={Color.orange1} />,
								size: "16",
								weight: "bold",
							},
							ratingText
						)}
					{renderTextByProps({ right: <Icon shape={"ArrowRight"} />, size: "20", weight: "bold" }, title)}
					{renderTextByProps({ size: "14", weight: "regular", color: Color.gray50 }, subtitle)}
				</View>
				<RNImage source={source} style={s.right} />
			</View>
		</Pressable>
	)
}

const renderTitleInfo = (titleInfo?: React.ReactElement) => {
	if (!titleInfo) {
		return null
	}
	return titleInfo
}

export interface ProfileCardProps extends StaticPressableProps, Margin {
	ratingText?: TextType
	title: TextType
	titleInfo?: React.ReactElement
	subtitle: TextType
	source: RNImageProps["source"]
}

const s = StyleSheet.create({
	root: {
		backgroundColor: Color.white,
		borderColor: Color.gray90,
		borderWidth: 1,
		borderStyle: "solid",
		borderRadius: 4,
		height: 146,
		position: "relative",
		alignItems: "center",
		marginLeft: 20,
		marginRight: 20,
		paddingLeft: 20,
		paddingRight: 20,
		marginTop: 8,
		marginBottom: 8,
	},
	profileWrap: {
		width: "100%",
		maxWidth: 380,
		height: "100%",

		justifyContent: "center",
	},
	left: {
		position: "relative",
		zIndex: 1,
	},
	right: {
		width: 128,
		height: 146,
		position: "absolute",
		right: 0,
	},
})
