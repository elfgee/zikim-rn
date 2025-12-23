import React, { FC } from "react"
import { View, StyleSheet, PressableProps, StyleProp, ViewStyle } from "react-native"
import { Margin, Color } from "../types"
import { revertMargin } from "../utils/style"
import { Icon } from "../components/icon"
import { Pressable } from "../components/Pressable"
import { renderTextByProps } from "../utils/renderer"

export interface StepperProps extends Margin {
	/** @default 20 */
	mr?: number | undefined
	/** @default 20 */
	ml?: number | undefined
	onPressMinus?: PressableProps["onPress"]
	onPressPlus?: PressableProps["onPress"]
	value?: string
	defaultValue?: string
	minusButtonDisabled?: null | boolean
	plusButtonDisabled?: null | boolean
	style?: StyleProp<ViewStyle>
}

export const Stepper: FC<StepperProps> = ({ mr = 20, ml = 20, style, onPressMinus, onPressPlus, ...props }) => {
	return (
		<View style={[styles.root, revertMargin({ mr, mt: props.mt, mb: props.mb, ml }), style]}>
			<Pressable style={styles.button} onPress={onPressMinus} radius={4} disabled={props.minusButtonDisabled}>
				<Icon
					shape="Minus"
					width={16}
					height={16}
					color={props.minusButtonDisabled ? Color.gray80 : undefined}
				/>
			</Pressable>
			<View style={styles.inputWrapper}>
				{renderTextByProps(
					{
						textAlign: "center",
						weight: "medium",
						size: "16",
						color: Color.gray10,
						lineHeight: 24,
					},
					props.value || props.defaultValue || ""
				)}
			</View>
			<Pressable style={styles.button} onPress={onPressPlus} radius={4} disabled={props.plusButtonDisabled}>
				<Icon shape="Plus" width={16} height={16} color={props.plusButtonDisabled ? Color.gray80 : undefined} />
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
		maxHeight: 48,
		borderRadius: 4,
		borderWidth: 1,
		padding: 0.5,
		borderColor: Color.gray90,
		minWidth: 132, // button 56 * 2, text 20
	},
	inputWrapper: {
		flexGrow: 1,
		flexShrink: 1,
		height: 48,
		alignItems: "center",
		justifyContent: "center",
	},
	inputBox: {
		height: 20,
		justifyContent: "center",
	},
	button: {
		justifyContent: "center",
		alignItems: "center",
		flexShrink: 0,
		width: 56,
		height: 48,
		borderRadius: 4,
	},
})
