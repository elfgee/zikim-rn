import React, { FC } from "react"
import { StyleSheet, View, Platform } from "react-native"

import { Color, Margin } from "../../types"
import { TextProps, TextType } from "../../components/Text"
import { revertMargin } from "../../utils/style"
import { Pressable, StaticPressableProps } from "../../components/Pressable"
import { renderTextByProps, renderByProps } from "../../utils/renderer"
import { Image, ImageProps } from "../../components/Image"
import { Icon, IconProps } from "../../components/icon"
import { Gradient, GradientProps } from "../../components/gradient"

import { Animations as ZuixAnimations } from "../../libs/animations"

const TITLE_PROPS: TextProps = { size: "16", weight: "bold", color: Color.white }
const SUBTITLE1_PROPS: TextProps = { size: "13", weight: "bold", color: Color.white, mt: 2 }
const SUBTITLE2_PROPS: TextProps = { size: "13", weight: "regular", color: Color.white }
const SUBTITLE3_PROPS: TextProps = { size: "13", weight: "regular", color: Color.white }
const SUBTEXT_PROPS: TextProps = { size: "13", weight: "medium", color: Color.white, mt: 4 }

const TOP_GRADIENT: GradientProps = {
	locations: [0.5, 0.65, 1],
	colors: ["rgba(26, 26, 26, 0)", "rgba(26, 26, 26, 0.3)", "rgba(26, 26, 26, 0.6)"],
	direction: "bottom",
}
const BOTTOM_GRADIENT: GradientProps = {
	locations: [0, 0.4],
	colors: ["rgba(26, 26, 26, 0.4)", "rgba(26, 26, 26, 0)"],
	direction: "bottom",
}
const ANIMATION_DURATION = 4000

export const Thumbnail: FC<ThumbnailProps> = ({
	image,
	title,
	subtitle1,
	subtitle2,
	subtitle3,
	subtext,
	icon,
	type = "full",
	style,
	children,
	...props
}) => {
	const marginStyle = revertMargin(props)
	const isFullType = type === "full"
	const textViewStyle = isFullType ? s.fullTypeTextView : s.halfTypeTextView

	const textFullTypeStyle = {
		color: isFullType ? Color.white : Color.gray10,
		style: isFullType && s.shadow,
	}

	const alternativeAspectRatioStyle = Platform.OS === "web" ? s.paddingBottom166percent : s.aspectRatio0dot6

	return (
		<Pressable style={[s.rootView, alternativeAspectRatioStyle, marginStyle, style]} {...props}>
			<View style={[s.imageView, isFullType ? s.imageExpandRadius : s.bottom104]}>
				{(image as ThumbnailImagePropType).animating !== undefined ? (
					<ZuixAnimations.Parallax
						animating={!!(image as ThumbnailImagePropType).animating}
						widthRatio={1.5}
						duration={ANIMATION_DURATION}>
						{renderImage(image)}
					</ZuixAnimations.Parallax>
				) : (
					renderImage(image)
				)}
			</View>

			{isFullType && <Gradient {...TOP_GRADIENT} />}
			{(!!subtext || icon) && (
				<>
					<Gradient {...BOTTOM_GRADIENT} />
					<View style={s.topView}>
						<View style={s.flex1}>
							{renderTextByProps(SUBTEXT_PROPS, subtext, (_, second) => ({
								style: [typeof second !== "string" && second.style, s.shadow],
								mr: icon ? 8 : 0,
							}))}
						</View>
						{icon && renderIcon(icon)}
					</View>
				</>
			)}
			<View style={[s.textView, textViewStyle]}>
				{renderTextByProps(
					{
						...TITLE_PROPS,
						...textFullTypeStyle,
						lineHeight: isFullType ? 24 : 18,
					},
					title
				)}
				{renderTextByProps(
					{
						...SUBTITLE1_PROPS,
						...textFullTypeStyle,
						mt: isFullType ? 2 : 4,
					},
					subtitle1
				)}
				{renderTextByProps(
					{
						...SUBTITLE2_PROPS,
						...textFullTypeStyle,
					},
					subtitle2
				)}
				{renderTextByProps(
					{
						...SUBTITLE3_PROPS,
						...textFullTypeStyle,
					},
					subtitle3
				)}
			</View>
			{!!children && <View style={s.overlay}>{children as React.ReactNode}</View>}

			{!isFullType && <View style={s.border} pointerEvents={"none"} />}
		</Pressable>
	)
}

const renderImage = (image: ThumbnailImageType) => {
	if (React.isValidElement(image)) return image
	return renderByProps(Image, {
		width: "100%",
		height: "100%",
		...image,
	})
}

const renderIcon = (icon: ThumbnailIconType) => {
	if (React.isValidElement(icon)) return icon
	return renderByProps(Icon, {
		width: 28,
		height: 28,
		...icon,
	})
}

type ThumbnailImagePropType = Pick<ImageProps, "source" | "children" | "resizeMode"> & { animating?: boolean }
type ThumbnailImageType = ThumbnailImagePropType | React.ReactElement
type ThumbnailIconType = IconProps | React.ReactElement
export interface ThumbnailProps extends StaticPressableProps, Margin {
	image: ThumbnailImageType
	title: TextType
	subtitle1?: TextType
	subtitle2?: TextType
	subtitle3?: TextType
	subtext?: TextType
	icon?: ThumbnailIconType
	/** @default full */
	type?: "full" | "half"
}

const s = StyleSheet.create({
	rootView: {
		flexBasis: "auto",
		borderRadius: 4,
		backgroundColor: Color.white,
		width: "100%",
		overflow: "hidden",
	},
	topView: {
		position: "absolute",
		left: 12,
		right: 12,
		top: 8,
		flexDirection: "row",
	},
	imageView: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		overflow: "hidden",
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	},
	imageExpandRadius: {
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
	},
	textView: {
		position: "absolute",
		bottom: 0,
		left: 12,
		right: 12,
	},
	fullTypeTextView: {
		height: "100%",
		paddingBottom: 12,
		justifyContent: "flex-end",
	},
	halfTypeTextView: {
		height: 104,
		paddingTop: 5,
		paddingBottom: 5,
		justifyContent: "center",
	},
	shadow: {
		textShadowColor: "rgba(0, 0, 0, 0.5)",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 4,
	},
	border: {
		zIndex: 1,
		position: "absolute",
		width: "100%",
		height: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Color.grayOpacity08,
	},
	flex1: { flex: 1 },
	bottom104: { bottom: 104 },
	paddingBottom166percent: { paddingBottom: "166%" },
	aspectRatio0dot6: { aspectRatio: 0.6 },
	overlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
})
