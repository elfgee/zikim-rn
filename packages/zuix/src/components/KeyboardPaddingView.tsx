import React, { ComponentProps, FC, useEffect, useRef } from "react"
import {
	Animated,
	Keyboard,
	KeyboardEventListener,
	LayoutChangeEvent,
	LayoutRectangle,
	Platform,
	Dimensions,
} from "react-native"

const windowHeight = Dimensions.get("window").height
export const KeyboardPaddingView: FC<KeyboardPaddingViewProps> = ({
	children,
	keyboardVerticalOffset = 0,
	style,
	onLayout,
	...props
}) => {
	const frame = useRef<LayoutRectangle | null>(null)
	const subscriptions = useRef<ReturnType<typeof Keyboard.addListener>[]>([])
	const viewH = useRef(new Animated.Value(0)).current

	const handleLayout = (e: LayoutChangeEvent) => {
		frame.current = e.nativeEvent.layout
		onLayout?.(e)
	}
	useEffect(() => {
		const onKeyboardChange: KeyboardEventListener = (e) => {
			const { duration, endCoordinates } = e
			if (!frame.current) return
			const height = Math.max(windowHeight - endCoordinates.screenY - keyboardVerticalOffset, 0)

			Animated.timing(viewH, { toValue: height, duration, useNativeDriver: false }).start()
		}

		const onKeyboardHide: KeyboardEventListener = (e) => {
			const { duration } = e
			Animated.timing(viewH, { toValue: 0, duration, useNativeDriver: false }).start()
		}
		if (Platform.OS === "ios") {
			subscriptions.current = [Keyboard.addListener("keyboardWillChangeFrame", onKeyboardChange)]
		} else {
			subscriptions.current = [
				Keyboard.addListener("keyboardDidHide", onKeyboardHide),
				Keyboard.addListener("keyboardDidShow", onKeyboardChange),
			]
		}
		return () => {
			subscriptions.current.forEach((fn) => fn.remove())
		}
	}, [keyboardVerticalOffset])
	return (
		<Animated.View onLayout={handleLayout} style={[style, { paddingBottom: viewH }]} {...props}>
			{children}
		</Animated.View>
	)
}

interface KeyboardPaddingViewProps extends ComponentProps<typeof Animated.View> {
	/* @default 0 */
	keyboardVerticalOffset?: number
}
