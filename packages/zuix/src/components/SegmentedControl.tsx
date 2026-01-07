import React from "react"
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"

export type SegmentedOption = { label: string; value: string }

export interface SegmentedControlProps extends Margin {
	options: SegmentedOption[]
	value: string | null
	onChange: (value: string) => void
	disabled?: boolean
	style?: ViewStyle | ViewStyle[]
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
	options,
	value,
	onChange,
	disabled,
	style,
	...margin
}) => {
	return (
		<View style={[styles.container, disabled && styles.disabled, revertMargin(margin), style]}>
			{options.map((opt) => {
				const selected = opt.value === value
				return (
					<Pressable
						key={opt.value}
						accessibilityRole="button"
						disabled={disabled}
						style={({ pressed }) => [
							styles.segment,
							selected && styles.segmentSelected,
							pressed && !disabled && styles.segmentPressed,
						]}
						onPress={() => onChange(opt.value)}
					>
						<Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
					</Pressable>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 8,
	},
	disabled: { opacity: 0.5 },
	segment: {
		flex: 1,
		minHeight: 44,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Color.gray90,
		backgroundColor: Color.white,
		alignItems: "center",
		justifyContent: "center",
	},
	segmentSelected: {
		backgroundColor: Color.gray10,
		borderColor: Color.gray10,
	},
	segmentPressed: {
		opacity: 0.85,
	},
	label: {
		fontSize: 15,
		color: Color.gray10,
		fontWeight: "500",
	},
	labelSelected: {
		color: Color.white,
		fontWeight: "700",
	},
})


