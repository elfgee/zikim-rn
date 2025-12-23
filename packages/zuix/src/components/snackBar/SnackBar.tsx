import React, { FC, useEffect, useRef, useState, useCallback } from "react"
import { FlexStyle, Platform, StyleSheet, View, Animated, Easing, ViewStyle, StyleProp } from "react-native"
import { Color } from "../../types"
import { Image, ImageProps } from "../../components/Image"
import { TextType } from "../../components/Text"
import { renderByProps, renderTextByProps } from "../../utils/renderer"
import { PartialWithout } from "../../types/global"

const FADE_DURATION = 200
const INITIAL_SCALE = 0.4
const FADE_OUT_DURATION = 2000
const SNACKBAR_BOTTOM = -76

export const SnackBar: FC<SnackBarProps> = ({
	title,
	subtitle,
	left,
	right,
	onClose,
	visible,
	duration,
	toBottomValue,
	style,
}) => {
	const [_visible, _setVisible] = useState(false)

	const timeout = useRef<NodeJS.Timeout | undefined>()
	const opacity = useRef(new Animated.Value(0)).current

	const fadeIn = useCallback(() => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: FADE_DURATION,
			useNativeDriver: true,
			easing: Easing.cubic,
		}).start(() => {
			_setVisible(true)
			if (timeout.current) clearTimeout(timeout.current)
			timeout.current = setTimeout(fadeOut, duration || FADE_OUT_DURATION) as unknown as NodeJS.Timeout
		})
	}, [duration])

	const fadeOut = useCallback(() => {
		Animated.timing(opacity, {
			toValue: 0,
			duration: FADE_DURATION,
			useNativeDriver: true,
			easing: Easing.cubic,
		}).start(() => {
			if (timeout.current) clearTimeout(timeout.current)
			_setVisible(false)
			onClose()
		})
	}, [])

	useEffect(() => {
		return () => {
			if (timeout.current) clearTimeout(timeout.current)
		}
	}, [])

	useEffect(() => {
		if (!visible && _visible) fadeOut()
		if (visible && !_visible) fadeIn()
	}, [visible])

	if (!visible && !_visible) return null
	return (
		<Animated.View
			style={[
				s.wrapper,
				{
					transform: [
						{ scale: opacity.interpolate({ inputRange: [0, 1], outputRange: [INITIAL_SCALE, 1] }) },
						{
							translateY: opacity.interpolate({
								inputRange: [0, 1],
								outputRange: [0, toBottomValue || SNACKBAR_BOTTOM],
							}),
						},
					],
					opacity,
				},
				style,
			]}>
			<View style={s.innerWrapper}>
				{left && renderByProps(Image, { width: 40, height: 40, radius: true, ...left } as ImageProps)}
				<View style={s.title}>
					{renderTextByProps({ size: "14", color: Color.white }, title)}
					{renderTextByProps({ size: "13", color: Color.white, weight: "regular" }, subtitle)}
				</View>
				{renderTextByProps(
					{ size: "13", color: Color.orange1, underline: false, wrapStyle: s.buttonText },
					right
				)}
			</View>
		</Animated.View>
	)
}

export interface SnackBarProps {
	title: TextType
	visible: boolean
	onClose: () => void
	subtitle?: TextType
	left?: PartialWithout<ImageProps, "source"> | React.ReactElement<typeof Image>
	right?: TextType
	duration?: number
	style?: StyleProp<ViewStyle>
	toBottomValue?: number
}

const s = StyleSheet.create({
	wrapper: {
		position: (Platform.OS === "web" ? "fixed" : "absolute") as FlexStyle["position"],
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10000,
		elevation: 999,
		paddingLeft: 20,
		paddingRight: 20,
		margin: "auto",
		alignItems: "center",
	},
	innerWrapper: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		maxWidth: 400,
		flexDirection: "row",
		padding: 12,
		backgroundColor: Color.gray30,
		borderRadius: 4,
	},
	title: {
		marginHorizontal: 8,
		flex: 1,
	},
	buttonText: {
		alignSelf: "center",
	},
})
