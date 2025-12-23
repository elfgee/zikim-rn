import React from "react"
import { useEffect, useRef, useState } from "react"
import { Animated, Easing, View, ViewProps, StyleSheet } from "react-native"
import { notUndefinedOrNull } from "../../../utils/util"

export interface ParallaxProps extends ViewProps {
	animating: boolean
	/** width대비 애니메이션 이동 값 */
	widthRatio: number
	width?: number | `${number}%`
	height?: number | `${number}%`
	duration: number
}

export const Parallax: React.FC<ParallaxProps> = ({
	children,
	animating,
	width,
	height,
	widthRatio,
	duration,
	...props
}) => {
	const [containerWidth, setContainerWidth] = useState(width ? getPercentageNumber(width) : 0)
	const transformX = useRef(new Animated.Value(0.5) as Animated.Value & { _value: number }).current

	const movingWidth = Math.round((containerWidth * (widthRatio - 1)) / 2)

	const transformAnimationStyle = {
		transform: [
			{
				translateX: transformX.interpolate({
					inputRange: [-1, -0.5, 0, 0.5, 1],
					outputRange: [-movingWidth, 0, movingWidth, 0, -movingWidth],
				}),
			},
		],
	}

	const createAnimation = () => {
		Animated.sequence(
			[
				transformX._value < 0
					? Animated.timing(transformX, {
							toValue: 0,
							duration: duration * Math.abs(transformX._value),
							easing: Easing.linear,
							useNativeDriver: true,
					  })
					: undefined,
				Animated.timing(transformX, {
					toValue: 1,
					duration: transformX._value <= 0 ? duration : duration * (1 - transformX._value),
					easing: Easing.linear,
					useNativeDriver: true,
				}),
				Animated.timing(transformX, {
					toValue: -1,
					duration: 0,
					useNativeDriver: true,
				}),
			].filter(notUndefinedOrNull)
		).start(({ finished }) => {
			if (finished) {
				transformX.setValue(-1)
				createAnimation()
			}
		})
	}
	useEffect(() => {
		if (!animating) {
			transformX.stopAnimation((value) => {
				transformX.setValue(value)
			})
		} else {
			createAnimation()
		}
	}, [animating])

	return (
		<View
			{...props}
			style={[styles.conatiner, { width, height }, props.style]}
			onLayout={
				!props.onLayout && width
					? undefined
					: (e) => {
							props.onLayout?.(e)
							if (!width) {
								setContainerWidth(e.nativeEvent.layout.width)
							}
					  }
			}>
			<Animated.View
				style={[
					styles.animatedView,
					transformAnimationStyle,
					{
						width: Math.round(containerWidth * widthRatio),
					},
				]}>
				{children}
			</Animated.View>
		</View>
	)
}

const getPercentageNumber = (width: number | `${number}%`) => {
	if (typeof width === "number") {
		return width
	}
	return Number(width.replace("%", "")) / 100
}

const styles = StyleSheet.create({
	conatiner: { flexGrow: 1, alignItems: "center", overflow: "hidden" },
	animatedView: {
		height: "100%",
		alignItems: "center",
	},
})
