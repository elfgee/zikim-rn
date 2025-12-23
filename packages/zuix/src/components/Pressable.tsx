import React, { FC, useRef, useCallback, useMemo } from "react"
import {
	Platform,
	Pressable as RNPressable,
	PressableProps as RNPressableProps,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
	Insets,
	Animated,
	PressableStateCallbackType,
} from "react-native"
import { Color, Margin } from "../types"
import { revertMargin, revertTouchpaddingApp, revertTouchpaddingWeb } from "../utils/style"

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable)

const IS_WEB = Platform.OS === "web"
const SCALE_ANIMATED_DURATION = 80

export const Pressable: FC<PressableProps> = ({
	children,
	touchPadding,
	radius = 0,
	feedback = true,
	onPress,
	style,
	disabled,
	...props
}) => {
	const scaleValue = useRef(new Animated.Value(1)).current
	const pressing = useRef(false)
	const scaleInAnimaiting = useRef(false)

	const scaleAnimatable = useMemo(() => {
		return feedback && typeof feedback !== "boolean" && feedback.type === "scaleInOut"
	}, [feedback])

	const scaleInOut = useCallback(() => {
		Animated.timing(scaleValue, {
			toValue: 0.96,
			duration: SCALE_ANIMATED_DURATION,
			useNativeDriver: true,
		}).start(() => {
			scaleInAnimaiting.current = false
			//? Long Press가 아닐 경우
			if (!pressing.current) {
				scaleOut()
			}
		})
	}, [])

	const scaleOut = useCallback(() => {
		Animated.timing(scaleValue, {
			toValue: 1,
			duration: SCALE_ANIMATED_DURATION,
			useNativeDriver: true,
		}).start()
	}, [])

	return (
		<AnimatedPressable
			style={[
				onPress && IS_WEB ? s.userSelectNone : undefined,
				!onPress && s.unPressable,
				revertMargin(props),
				scaleAnimatable ? { transform: [{ scale: scaleValue }] } : undefined,
				style,
			]}
			className={IS_WEB ? revertTouchpaddingWeb(touchPadding) : undefined}
			onPress={onPress}
			hitSlop={touchPadding}
			disabled={disabled || !onPress}
			{...props}>
			{({ pressed }) => {
				if (scaleAnimatable) {
					if (pressed) {
						pressing.current = true
						scaleInAnimaiting.current = true
						scaleInOut()
					} else {
						pressing.current = false
						//? Long Press 인 경우
						if (!scaleInAnimaiting.current) {
							scaleOut()
						}
					}
				}

				return (
					<>
						{typeof children === "function"
							? (children as (state: PressableStateCallbackType) => React.ReactNode)({ pressed })
							: children}
						{feedback && !!onPress && pressed && (
							<View style={s.overlay} pointerEvents={"none"}>
								<View
									style={[
										s.overlayBackground,
										feedback &&
										typeof feedback !== "boolean" &&
										feedback.color === Color.whiteOpacity04
											? s.whiteOverlayBackground
											: undefined,
										{ borderRadius: radius },
										touchPadding ? revertTouchpaddingApp(touchPadding) : undefined,
									]}
								/>
							</View>
						)}
					</>
				)
			}}
		</AnimatedPressable>
	)
}

const s = StyleSheet.create({
	userSelectNone: { userSelect: "none" } as ViewStyle,
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		elevation: 100,
		backgroundColor: "transparent",
	},
	overlayBackground: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: Color.grayOpacity08,
	},
	whiteOverlayBackground: {
		backgroundColor: Color.whiteOpacity04,
	},
	unPressable: IS_WEB ? ({ cursor: "inherit" } as ViewStyle) : {},
})

type AnimatedPressableProps = RNPressableProps & React.RefAttributes<View>

export interface StaticPressableProps extends Omit<AnimatedPressableProps, "style"> {
	style?: StyleProp<ViewStyle>
}
export interface PressableProps extends Margin, StaticPressableProps {
	touchPadding?: number | Insets
	/** @default 0 */
	radius?: number
	/** @default true */
	feedback?:
		| {
				/** @default Color.grayOpacity08 */
				color?: Color.grayOpacity08 | Color.whiteOpacity04
				/** @default "none" */
				type?: "none" | "scaleInOut"
		  }
		| boolean
}
