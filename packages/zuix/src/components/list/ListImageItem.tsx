import React, { FC } from "react"
import { StyleSheet, View, Platform } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { Pressable, StaticPressableProps } from "../../components/Pressable"
import { renderByProps, renderTextByProps } from "../../utils/renderer"
import { Image, ImageProps } from "../../components/Image"

const TAG_TEXT_PROPS: TextProps = { size: "12", weight: "medium", color: Color.gray50, mb: 8 }
const TITLE_PROPS: TextProps = { size: "14", weight: "bold" }
const SUBTITLE2_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray50 }
const SUBTITLE3_PROPS: TextProps = { size: "14", weight: "regular", color: Color.gray50, mt: 8 }

export const ListImageItem: FC<ListImageItemProps> = ({
	image,
	tagText,
	title = TITLE_PROPS,
	subtitle1,
	subtitle2,
	subtitle3,
	type = "card",
	size = "208",
	style,
	...props
}) => {
	const marginStyle = revertMargin(props)
	const isCard = type === "card"
	const textViewStyle = isCard ? s.cardTextView : undefined
	const sizeStyle = size === "208" ? s.w208 : s.w140
	const imageHeight = size === "208" ? 156 : 105
	return (
		<Pressable style={[isCard ? s.card : undefined, sizeStyle, marginStyle, style]} radius={4} {...props}>
			<View style={isCard && s.image}>
				{renderByProps(Image, {
					source: { uri: undefined },
					...image,
					width: size === "208" ? 208 : 140,
					height: imageHeight,
					radius: !isCard,
				} as ImageProps)}
			</View>
			<View style={[textViewStyle, size === "208" ? s.pt12 : s.pt8]}>
				{!!tagText && renderTextByProps(TAG_TEXT_PROPS, tagText)}
				{renderTextByProps(TITLE_PROPS, title)}
				{renderTextByProps(
					{ size: "14", weight: "regular", color: isCard ? undefined : Color.gray50 },
					subtitle1
				)}
				{renderTextByProps(SUBTITLE2_PROPS, subtitle2)}
				{renderTextByProps(SUBTITLE3_PROPS, subtitle3)}
			</View>
		</Pressable>
	)
}

export interface ListImageItemProps extends StaticPressableProps, Margin {
	image?: Pick<ImageProps, Exclude<keyof ImageProps, "width" | "height" | "radius">> | React.ReactElement
	tagText?: TextType
	title: TextType
	subtitle1?: TextType
	subtitle2?: TextType
	subtitle3?: TextType
	/** @default card */
	type?: "full" | "card"
	/** @default 208 */
	size?: "140" | "208"
}

const s = StyleSheet.create({
	// ios에서 shadow와 overflow hidden속성을 같이 쓰면, 그림자가 subtree로 전파되는 버그가 있어서, 이미지를 감싸를 레이어를 추가함. - https://github.com/facebook/react-native/issues/33969
	image: {
		overflow: "hidden",
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	},
	card:
		Platform.OS === "web"
			? {
					borderRadius: 4,
					backgroundColor: "#FFFFFF",
					boxShadow: "0px 2px 4px rgba(26, 26, 26, 0.12)",
			  }
			: {
					borderRadius: 4,
					backgroundColor: "#FFFFFF",
					boxShadow: "0px 2px 4px rgba(26, 26, 26, 0.12)",
					shadowColor: Color.gray10,
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.23,
					shadowRadius: 2.62,
					elevation: 4,
			  },
	cardTextView: {
		paddingLeft: 16,
		paddingRight: 16,
		paddingBottom: 16,
	},
	fullTextView: {
		marginTop: 8,
	},
	w140: {
		width: 140,
	},
	w208: {
		width: 208,
	},
	pt12: {
		paddingTop: 12,
	},
	pt8: {
		paddingTop: 8,
	},
})
