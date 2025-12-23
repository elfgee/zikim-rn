import React, { useState, forwardRef } from "react"
import { StyleSheet, View, TextInput as RNTextInput } from "react-native"

import { Margin, Color } from "../types"
import { revertMargin } from "../utils/style"
import { TextInput, TextInputProps } from "../components/TextInput"
import { TextType } from "../components/Text"
import { renderTextByProps } from "../utils/renderer"

export interface TextFieldProps extends Margin, TextInputProps {
	title?: TextType
	right?: React.ReactElement
	/** @default normal */
	status?: "disabled" | "error" | "readonly" | "normal"
	errorText?: TextType
	textInputLeft?: React.ReactElement
	textInputRight?: React.ReactElement
	placeholder?: string
	value?: string
	multiline?: boolean | undefined
	/** @default 111 */
	inputHeight?: number
	/** @default 8 */
	mt?: number | undefined
	/** @default 20 */
	mr?: number | undefined
	/** @default 8 */
	mb?: number | undefined
	/** @default 20 */
	ml?: number | undefined
}

export const TextField = forwardRef<RNTextInput, TextFieldProps>(
	(
		{
			title,
			right,
			status = "normal",
			errorText,
			textInputLeft,
			textInputRight,
			inputHeight = 111,
			mt = 8,
			mr = 20,
			mb = 8,
			ml = 20,
			style,
			multiline,
			...props
		},
		ref
	) => {
		const [focused, setFocused] = useState(false)
		return (
			<View style={[revertMargin({ mt, mr, mb, ml }), style]}>
				<View
					style={[
						...getWrapperStyle(focused, !!title),
						status === "error" ? styles.borderColorRed : undefined,
						status === "readonly" || status === "disabled" ? styles.bgColor95 : undefined,
						multiline ? { paddingBottom: 1 } : undefined,
					]}>
					<View style={styles.left}>
						<View style={styles.titleWrapper}>
							{!!title && renderTextByProps({ size: "14", weight: "bold", color: Color.gray50 }, title)}
						</View>
						<TextInput
							allowFontScaling={false}
							style={styles.paddingVertical2}
							inputStyle={multiline && { height: inputHeight }}
							disabled={status === "disabled"}
							readonly={status === "readonly"}
							left={textInputLeft}
							right={textInputRight}
							ref={ref}
							multiline={multiline}
							scrollEnabled={true}
							textAlignVertical={"top"}
							{...props}
							onFocus={(e) => {
								if (status === "disabled") {
									return
								}
								if (status === "normal" || status === "error") {
									setFocused(true)
								}
								if (props.onFocus) {
									props.onFocus(e)
								}
							}}
							onBlur={(e) => {
								if (focused) {
									setFocused(false)
								}
								if (props.onBlur) {
									props.onBlur(e)
								}
							}}
						/>
					</View>
					{!!right && <View style={styles.ml12}>{right}</View>}
				</View>
				{!!errorText &&
					renderTextByProps({ color: Color.red1, mt: 8, size: "14", weight: "regular" }, errorText)}
			</View>
		)
	}
)

const getWrapperStyle = (focused: boolean, hasTitle: boolean) => {
	if (focused) {
		return [styles.focusedCard, hasTitle ? styles.paddingVertical115 : undefined]
	}
	return [styles.card, hasTitle ? styles.paddingVertical12 : undefined]
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		//? padding 10 12 지만 보더 고려하여 1씩 줄임
		paddingTop: 9,
		paddingRight: 11,
		paddingBottom: 9,
		paddingLeft: 11,
		borderWidth: 1,
		borderColor: Color.gray90,
		borderRadius: 4,
	},
	paddingVertical12: {
		paddingTop: 12,
		paddingBottom: 12,
	},
	focusedCard: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 8.5,
		paddingRight: 10.5,
		paddingBottom: 8.5,
		paddingLeft: 10.5,
		borderWidth: 1.5,
		borderColor: Color.gray10,
		borderRadius: 4,
	},
	paddingVertical115: {
		paddingTop: 11.5,
		paddingBottom: 11.5,
	},
	titleWrapper: {
		flexDirection: "row",
		flexGrow: 1,
		justifyContent: "space-between",
		alignItems: "center",
	},
	paddingVertical2: { paddingTop: 2, paddingBottom: 2 },
	left: {
		flex: 1,
	},
	ml12: {
		marginLeft: 12,
	},
	borderColorRed: {
		borderColor: Color.red1,
	},
	bgColor95: {
		backgroundColor: Color.gray95,
	},
})
