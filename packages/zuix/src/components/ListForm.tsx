import React, { ReactElement, forwardRef } from "react"
import { StyleSheet, View, TextInput as RNTextInput } from "react-native"
import { Button, ButtonProps } from "./button"
import { Icon, IconProps } from "./icon"
import { TextType } from "../components/Text"
import { renderByProps, renderTextByProps } from "../utils/renderer"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { TextInput, TextInputProps } from "./TextInput"
import { Pressable, PressableProps } from "../components/Pressable"

export const ListForm = ({ title, subtitle, titleLeft, titleRight, right, style, ...props }: ListFormProps) => {
	return (
		<Pressable style={[s.root, revertMargin(props), style]} {...props}>
			<View style={s.left}>
				{titleLeft && (
					<View style={s.titleLeft}>{renderByProps(Icon, { width: 20, height: 20, ...titleLeft })}</View>
				)}
				<View>
					{renderTextByProps({ size: "16", weight: "regular" }, title)}
					{renderTextByProps({ size: "13", weight: "regular", color: Color.gray50 }, subtitle)}
				</View>
				{titleRight && (
					<View style={s.titleRight}>
						{renderByProps(Button, { size: "28", theme: "lineGray90", ...titleRight })}
					</View>
				)}
			</View>
			{right && <View style={s.right}>{right}</View>}
		</Pressable>
	)
}

export const ListFormInput = forwardRef<RNTextInput | undefined, ListFormInputProps>(
	({ style, inputStyle, ...props }: ListFormInputProps, ref) => {
		return (
			<TextInput
				style={[s.inputWrap, style, revertMargin(props)]}
				inputStyle={[s.input, inputStyle]}
				autoHeight
				multiline
				ref={ref as React.ForwardedRef<RNTextInput | null>}
				{...props}
			/>
		)
	}
)

export interface ListFormProps extends PressableProps, Margin {
	title: TextType
	subtitle?: TextType
	titleLeft?: (IconProps & { shape: IconProps["shape"] }) | ReactElement
	titleRight?: ButtonProps | ReactElement
	right?: React.ReactElement
}

export interface ListFormInputProps extends TextInputProps, Margin {
	postfix?: string
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 12,
		marginHorizontal: 20,
	},
	left: {
		flexDirection: "row",
		alignItems: "center",
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: "auto",
		marginRight: 8,
	},
	titleLeft: {
		marginRight: 8,
	},
	titleRight: {
		marginLeft: 8,
	},
	right: {
		alignItems: "flex-end",
		flex: 1,
	},
	inputWrap: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "stretch",
	},
	input: {
		textAlign: "right",
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
		width: undefined,
		fontWeight: "500",
	},
	postfix: {
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: "auto",
		wordBreak: "keep-all",
	},
	text: {
		alignSelf: "flex-end",
	},
})
