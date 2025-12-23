import React, { FC, useState } from "react"
import { Image as RNImage, ImageProps as RNImageProps, Platform, StyleSheet, View } from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { renderTextByProps } from "../utils/renderer"
import { TextProps, TextType } from "../components/Text"

const BADGE_PROPS: TextProps = {
	size: "10",
	textAlign: "center",
	weight: "bold",
	color: Color.orange1,
	allowFontScaling: false,
}

export const Profile: FC<ProfileProps> = ({ width, height, badge, style, source, isSquare = false, ...props }) => {
	const [imageError, setImageError] = useState(false)
	const marginStyle = revertMargin(props)
	const radiusStyle = isSquare ? s.squareBorder : { borderRadius: Math.round(width * 2) }
	return (
		<View style={[s.root, { width: width }, marginStyle, style]}>
			{(imageError || !source) && (
				<View>
					<RNImage
						style={[{ width, height }, radiusStyle]}
						source={{
							uri: "https://zuix2.zigbang.io/images/default_profile.png",
						}}
					/>
					<View style={[s.border, { width: width, height: height }, radiusStyle]} />
				</View>
			)}
			{!imageError && source && (
				<View>
					<RNImage
						style={[{ width, height }, radiusStyle]}
						{...props}
						source={source}
						onError={(e) => {
							props.onError?.(e)
							setImageError(true)
						}}
					/>
					<View style={[s.border, { width: width, height: height }, radiusStyle]} />
				</View>
			)}

			{!!badge &&
				renderTextByProps(BADGE_PROPS, badge, (first, second) => ({
					wrapStyle: [s.badge, s.badgeShadow, (second as TextProps)?.wrapStyle],
				}))}
		</View>
	)
}

export interface ProfileProps extends Omit<RNImageProps, "source">, Margin {
	width: number
	height: number
	source?: RNImageProps["source"]
	badge?: TextType
	isSquare?: boolean
}

const s = StyleSheet.create({
	root: {
		overflow: "visible",
		alignItems: "center",
	},
	border: {
		position: "absolute",
		borderColor: Color.grayOpacity08,
		borderWidth: 1,
	},
	squareBorder: {
		borderRadius: 8,
	},
	badge: {
		position: "relative",
		marginTop: -12,
		height: 20,
		backgroundColor: Color.white,
		borderRadius: 14,
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 5,
		paddingRight: 5,
	},
	badgeShadow:
		Platform.OS === "web"
			? {
					boxShadow: "0px 2px 2px rgba(26, 26, 26, 0.1)",
			  }
			: {
					shadowColor: Color.gray50,
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.23,
					shadowRadius: 2.62,
					elevation: 4,
			  },
})
