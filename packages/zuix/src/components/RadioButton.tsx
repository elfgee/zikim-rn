import React, { FC } from "react"
import { StyleSheet, View } from "react-native"
import { Margin, Color } from "../types"
import { TextType } from "../components/Text"
import { Pressable } from "../components/Pressable"
import { revertMargin } from "../utils/style"
import { StaticPressableProps } from ".."
import { renderTextByProps } from "../utils/renderer"

export interface RadioButtonProps extends Margin, StaticPressableProps {
	/** @default 20 */
	size?: "20" | "28"
	text?: TextType
	checked: boolean
	/** @default false */
	disabled?: boolean
}

export const RadioButton: FC<RadioButtonProps> = ({
	size = "20",
	checked,
	disabled = false,
	text,
	style,
	mt,
	mr,
	mb,
	ml,
	...props
}) => {
	const getBgStyle = () => {
		if (checked) {
			if (disabled) {
				return styles.bgOrange3
			}
			return styles.bgOrange1
		}
		if (disabled) {
			return styles.normalDisabledBg
		}
		return styles.normalBg
	}

	const renderIcon = () => {
		return (
			<View
				style={[
					styles.radioBg,
					!checked ? (disabled ? styles.normalDisabledBg : styles.normalBg) : undefined,
					{ width: Number(size), height: Number(size) },
					getBgStyle(),
				]}>
				{checked && <InnerRound size={size} />}
			</View>
		)
	}
	return (
		<Pressable
			disabled={disabled}
			radius={4}
			touchPadding={4}
			style={[styles.root, revertMargin({ mt, mr, mb, ml }), style]}
			{...props}>
			{renderIcon()}
			{text && renderTextByProps({ color: disabled ? Color.gray80 : Color.gray30, size: "14", ml: 8 }, text)}
		</Pressable>
	)
}

const InnerRound: React.FC<{ size: RadioButtonProps["size"] }> = ({ size }) => {
	switch (size) {
		case "28":
			return <View style={styles.size28InnerRound} />
		case "20":
		default:
			return <View style={styles.size20InnerRound} />
	}
}

const styles = StyleSheet.create({
	root: { flexDirection: "row", alignItems: "center" },
	radioBg: { borderRadius: 28, alignItems: "center", justifyContent: "center" },
	normalBg: { borderWidth: 1, borderColor: Color.gray70, backgroundColor: Color.white },
	normalDisabledBg: { borderWidth: 1, borderColor: Color.gray90, backgroundColor: Color.gray97 },
	bgOrange3: { backgroundColor: Color.orange3 },
	bgOrange1: { backgroundColor: Color.orange1 },
	size20InnerRound: { width: 8, height: 8, borderRadius: 4, backgroundColor: Color.gray99 },
	size28InnerRound: { width: 11.2, height: 11.2, borderRadius: 6, backgroundColor: Color.gray99 },
})
