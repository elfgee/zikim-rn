import React, { FC } from "react"
import { StyleSheet, View } from "react-native"
import { Margin, Color } from "../types"
import { TextType, TextProps } from "../components/Text"
import { Icon } from "../components/icon"
import { Pressable } from "../components/Pressable"
import { revertMargin } from "../utils/style"
import { StaticPressableProps } from ".."
import { renderTextByProps } from "../utils/renderer"

export interface CheckboxProps extends Margin, StaticPressableProps {
	/** @default square */
	type?: "square" | "circle" | "mark"
	/** @default 20 */
	size: "20" | "28"
	text?: TextType
	checked: boolean
	/** @default false */
	disabled?: boolean
}

export const Checkbox: FC<CheckboxProps> = ({
	type = "square",
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
	const renderIcon = () => {
		switch (type) {
			case "square":
				return <SquareCheckIcon size={size} checked={checked} disabled={disabled} />
			case "mark":
				return <MarkCheckIcon checked={checked} />
			case "circle":
				return <CirceCheckIcon size={size} checked={checked} disabled={disabled} />
		}
	}

	return (
		<Pressable
			style={[styleSheet.root, revertMargin({ mt, mr, mb, ml }), style]}
			disabled={disabled}
			touchPadding={4}
			radius={4}
			{...props}>
			<View>{renderIcon()}</View>
			{text &&
				renderTextByProps(
					{
						color: disabled ? Color.gray80 : Color.gray30,
						size: "14",
						ml: type === "circle" ? 4 : 8,
						wrapStyle: [typeof text !== "string" && (text as TextProps).wrapStyle, styleSheet.flex1],
					},
					text
				)}
		</Pressable>
	)
}

const CirceCheckIcon: React.FC<CheckboxProps> = ({ size, checked, disabled }) => {
	if (checked) {
		return (
			<Icon
				shape={"CheckCircleSelect"}
				width={Number(size)}
				height={Number(size)}
				color={disabled ? Color.orange3 : Color.orange1}
			/>
		)
	}
	return (
		<Icon
			shape={"CheckCircle"}
			width={Number(size)}
			height={Number(size)}
			color={disabled ? Color.gray90 : Color.gray70}
			subcolor={disabled ? Color.gray99 : Color.white}
		/>
	)
}

const SquareCheckIcon: React.FC<CheckboxProps & { style?: undefined }> = ({ size, checked, disabled, ...props }) => {
	if (checked) {
		return (
			<Icon
				shape={"CheckSquareSelect"}
				width={Number(size)}
				height={Number(size)}
				color={disabled ? Color.orange3 : Color.orange1}
				disabled={disabled}
			/>
		)
	}
	return (
		<Icon
			shape={"CheckSquare"}
			width={Number(size)}
			height={Number(size)}
			color={disabled ? Color.gray90 : Color.gray70}
			subcolor={disabled ? Color.gray97 : Color.white}
			disabled={disabled}
		/>
	)
}

const MarkCheckIcon: FC<{ checked: boolean }> = ({ checked }) => {
	return <Icon shape="Check" width={20} height={20} color={checked ? Color.orange1 : Color.gray80} />
}

const styleSheet = StyleSheet.create({
	root: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", borderRadius: 2 },
	flex1: { flex: 1 },
})
