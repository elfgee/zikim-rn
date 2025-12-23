import React, { FC, useEffect, useRef, useState, useCallback } from "react"
import { StyleSheet, View, Platform, FlexStyle, Animated } from "react-native"

import { Color } from "../../types"
import { TextType } from "../../components/Text"
import { renderTextByProps } from "../../utils/renderer"
import { Icon, IconProps } from "../icon"

export const SnackBarVertical: FC<SnackBarVerticalProps> = ({ title, top, onClose, visible, duration }) => {
	const [_visible, _setVisible] = useState(false)

	const timeout = useRef<NodeJS.Timeout | undefined>()
	const opacity = useRef(new Animated.Value(0)).current

	const fadeIn = useCallback(() => {
		Animated.timing(opacity, { toValue: 1, duration: ANI_DURATION, useNativeDriver: true }).start(() => {
			_setVisible(true)
			if (timeout.current) clearTimeout(timeout.current)
			timeout.current = setTimeout(fadeOut, duration || FADE_OUT_DURATION) as unknown as NodeJS.Timeout
		})
	}, [duration])

	const fadeOut = useCallback(() => {
		Animated.timing(opacity, { toValue: 0, duration: ANI_DURATION, useNativeDriver: true }).start(() => {
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
		if (visible && !_visible) fadeIn()
		if (!visible && _visible) fadeOut()
	}, [visible])

	if (!visible && !_visible) return null
	return (
		<View style={s.root} pointerEvents="none">
			<Animated.View
				style={[
					{
						transform: [
							{ scale: opacity.interpolate({ inputRange: [0, 1], outputRange: [INITIAL_SCALE, 1] }) },
						],
						opacity,
					},
				]}>
				<View style={s.wrap}>
					<View style={s.top}>{top && <Icon width={40} height={40} {...top} />}</View>
					<View style={s.title}>
						{renderTextByProps({ size: "14", color: Color.white, style: s.textAlign }, title)}
					</View>
				</View>
			</Animated.View>
		</View>
	)
}

export interface SnackBarVerticalProps {
	title: TextType
	visible: boolean
	onClose: () => void
	top?: IconProps
	duration?: number
}

const ANI_DURATION = 200
const FADE_OUT_DURATION = 2000
const INITIAL_SCALE = 0.4

const s = StyleSheet.create({
	root: {
		position: (Platform.OS === "web" ? "fixed" : "absolute") as FlexStyle["position"],
		bottom: 0,
		top: 0,
		left: 0,
		right: 0,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 10000,
		elevation: 999,
	},
	wrap: {
		minWidth: 142,
		paddingHorizontal: 12,
		paddingVertical: 16,
		marginHorizontal: 20,
		backgroundColor: Color.gray30,
		borderRadius: 4,
	},
	top: {
		alignItems: "center",
	},
	title: {
		marginTop: 8,
	},
	textAlign: {
		textAlign: "center",
	},
})
