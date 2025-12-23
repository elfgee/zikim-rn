import React, { useRef, useEffect, FC } from "react"
import { View, StyleSheet, Animated } from "react-native"
import { Margin, Color } from "../types/index"
import { Pressable, StaticPressableProps } from "../components/Pressable"
import { revertMargin } from "../utils/style"

interface SwitchProps extends Margin, StaticPressableProps {
	/** @default false */
	checked: boolean
	/** @default false */
	disabled?: boolean
	/** @default orange */
	theme: "orange" | "navy"
}

const ANIMATION_DURATION = 300
const ANIMATION_MOVEMENT_VALUE = 20
export const Switch: FC<SwitchProps> = ({ checked = false, disabled = false, theme = "orange", style, ...props }) => {
	const panX = useRef(new Animated.Value(checked ? 20 : 0)).current

	const translateX = panX.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [0, 0, 1],
	})

	const moveToRight = Animated.timing(panX, {
		toValue: ANIMATION_MOVEMENT_VALUE,
		duration: ANIMATION_DURATION,
		useNativeDriver: true,
	})

	const moveToLeft = Animated.timing(panX, {
		toValue: 0,
		duration: ANIMATION_DURATION,
		useNativeDriver: true,
	})

	useEffect(() => {
		if (checked) {
			moveToRight.start()
		} else {
			moveToLeft.start()
		}
	}, [checked])

	return (
		<Pressable
			style={[styles.background, getBackgroundColor({ checked, disabled, theme }), revertMargin(props), style]}
			radius={16}
			touchPadding={4}
			disabled={disabled}
			{...props}>
			<View style={[styles.ballWrapper]}>
				<Animated.View
					style={[
						disabled ? styles.disabledBall : styles.ball,
						{
							transform: [{ translateX: translateX }],
						},
					]}
				/>
			</View>
		</Pressable>
	)
}

const getBackgroundColor = ({ checked, disabled, theme }: SwitchProps) => {
	if (disabled) {
		if (!checked) {
			return { backgroundColor: Color.gray97 }
		}
		return { backgroundColor: Color[`${theme}3`] }
	}
	if (!checked) {
		return { backgroundColor: Color.gray80 }
	}
	return { backgroundColor: Color[`${theme}1`] }
}

const styles = StyleSheet.create({
	background: {
		width: 48,
		height: 28,
		borderRadius: 16,
	},
	ballWrapper: {
		padding: 2,
	},
	ball: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: Color.white,
	},
	disabledBall: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: Color.gray99,
	},
})
