import React, { FC, useRef, useEffect, useState } from "react"
import { Animated, Easing, StyleSheet, View, ViewProps } from "react-native"

import { Margin, Color } from "../types"
import { revertMargin } from "../utils/style"
import { Text } from "../components/Text"

const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1)
const DOT_MOVE_DURATION = 400
const DOT_POSITION = 20
const DOT_SECOND_DELAY = 80
const DOT_THIRD_DELAY = 160

const TEXT_UPPEAR_DURATION = 800
const TEXT_TERM_DURATION = 400
const TEXT_DISAPPEAR_DURATION = 800
const TOTAL_TEXT_ANIMATION_DURATION = 2400

const makeDotAnimation = (value: Animated.Value) => {
	return [
		//* dot up
		Animated.timing(value, {
			toValue: 0,
			duration: DOT_MOVE_DURATION,
			easing: easeInOutCubic,
			useNativeDriver: true,
		}),
		//* dot down
		Animated.timing(value, {
			toValue: DOT_POSITION,
			duration: DOT_MOVE_DURATION,
			easing: easeInOutCubic,
			useNativeDriver: true,
		}),
	]
}

const makeDotLoop = (value: Animated.Value, value2: Animated.Value, value3: Animated.Value) =>
	Animated.loop(
		Animated.parallel([
			Animated.sequence([...makeDotAnimation(value)]),
			Animated.sequence([Animated.delay(DOT_SECOND_DELAY), ...makeDotAnimation(value2)]),
			Animated.sequence([Animated.delay(DOT_THIRD_DELAY), ...makeDotAnimation(value3)]),
		]),
		{ iterations: -1, resetBeforeIteration: true }
	)

export const Loading: FC<LoadingProps> = ({ style, texts, ...props }) => {
	const dot1Y = useRef(new Animated.Value(DOT_POSITION)).current
	const dot2Y = useRef(new Animated.Value(DOT_POSITION)).current
	const dot3Y = useRef(new Animated.Value(DOT_POSITION)).current

	const dotLoop = makeDotLoop(dot1Y, dot2Y, dot3Y)
	const opacityInterpolation = { inputRange: [0, DOT_POSITION], outputRange: [1, 0.2] }

	const dot1Opacity = dot1Y.interpolate(opacityInterpolation)
	const dot2Opacity = dot2Y.interpolate(opacityInterpolation)
	const dot3Opacity = dot3Y.interpolate(opacityInterpolation)

	useEffect(() => {
		dotLoop.start()
	}, [])

	return (
		<View style={[styles.alignCenter, revertMargin(props), style]}>
			<View style={styles.dots}>
				<Animated.View
					style={[
						styles.dot,
						styles.mr6,
						{
							transform: [{ translateY: dot1Y }],
							opacity: dot1Opacity,
						},
					]}
				/>
				<Animated.View
					style={[
						styles.dot,
						styles.mr6,
						{
							transform: [{ translateY: dot2Y }],
							opacity: dot2Opacity,
						},
					]}
				/>
				<Animated.View
					style={[
						styles.dot,
						{
							transform: [{ translateY: dot3Y }],
							opacity: dot3Opacity,
						},
					]}
				/>
			</View>
			{texts && <LoadingText texts={texts} />}
		</View>
	)
}

export interface LoadingProps extends ViewProps, Margin {
	texts?: string[]
}
/**
 * @link https://cloud.protopie.io/p/179abb9720/r/44cbf829
 */
const LoadingText: FC<{ texts: string[] }> = ({ texts }) => {
	const [outputIndex, setOutputIndex] = useState(0)

	const textOpacity = useRef(new Animated.Value(0)).current

	const textOpacityLoop = Animated.loop(
		Animated.sequence([
			Animated.timing(textOpacity, {
				toValue: 1,
				duration: TEXT_UPPEAR_DURATION,
				useNativeDriver: true,
				easing: easeInOutCubic,
			}),
			Animated.delay(TEXT_TERM_DURATION),
			Animated.timing(textOpacity, {
				toValue: 0,
				duration: TEXT_DISAPPEAR_DURATION,
				useNativeDriver: true,
				easing: easeInOutCubic,
			}),
			Animated.delay(TEXT_TERM_DURATION),
		]),
		{ iterations: -1, resetBeforeIteration: true }
	)
	useEffect(() => {
		textOpacityLoop.start()
	}, [])
	const textInterval = useRef<NodeJS.Timeout>()

	useEffect(() => {
		textInterval.current = setInterval(() => {
			if (texts.length - 1 === outputIndex) {
				setOutputIndex(0)
			} else {
				setOutputIndex((i) => i + 1)
			}
		}, TOTAL_TEXT_ANIMATION_DURATION) as unknown as NodeJS.Timeout
		return () => {
			if (textInterval.current) {
				clearInterval(textInterval.current)
			}
		}
	}, [outputIndex])
	return (
		<Animated.View style={[styles.mt16, { opacity: textOpacity }]}>
			<Text size={"13"} color={Color.gray70}>
				{texts[outputIndex]}
			</Text>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	alignCenter: {
		alignItems: "center",
	},
	dots: {
		width: 60,
		height: 30,
		flexDirection: "row",
		justifyContent: "center",
	},
	mr6: {
		marginRight: 6,
	},
	mt16: {
		marginTop: 16,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 10,
		backgroundColor: Color.orange1,
	},
})
