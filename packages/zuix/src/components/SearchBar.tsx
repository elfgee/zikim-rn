import React, { forwardRef, useState } from "react"
import { StyleSheet, View, TextInput as RNTextInput, ViewProps } from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { TextInput, TextInputProps } from "../components/TextInput"

const SEARCHBAR_HEIGHT = 52
const SEARCHBAR_DEFAULT_TOP_PADDING = 6

export const SearchBar = forwardRef<RNTextInput, SearchBarProps>(
	({ left, right, divider = false, notchPadding = 0, backgroundColor, style, textInputProps, ...props }, ref) => {
		const [focused, setFocused] = useState(false)

		const marginStyle = revertMargin(props)
		const extendStyle = {
			height: SEARCHBAR_HEIGHT + notchPadding,
			paddingTop: SEARCHBAR_DEFAULT_TOP_PADDING + notchPadding,
		}

		return (
			<View style={[s.root, marginStyle, extendStyle, style]} {...props}>
				{left && <View style={s.leftView}>{left}</View>}
				<View style={s.textInputWrapper}>
					<TextInput
						ref={ref}
						allowFontScaling={false}
						multiline={false}
						textAlignVertical={"center"}
						{...textInputProps}
						style={[
							s.textInput,
							backgroundColor && { backgroundColor: backgroundColor },
							textInputProps?.style,
						]}
						onFocus={(e) => {
							setFocused(true)
							if (textInputProps?.onFocus) {
								textInputProps.onFocus(e)
							}
						}}
						onBlur={(e) => {
							if (focused) {
								setFocused(false)
							}
							if (textInputProps?.onBlur) {
								textInputProps.onBlur(e)
							}
						}}
					/>
				</View>
				{right && <View style={s.rightView}>{right}</View>}
				{divider && <View style={s.shadow} />}
			</View>
		)
	}
)

export interface SearchBarProps extends ViewProps, Margin {
	left?: React.ReactElement
	right?: React.ReactElement
	/** @default false */
	divider?: boolean
	/** @default 0 */
	notchPadding?: number
	textInputProps?: TextInputProps
	backgroundColor?: Color
}

const s = StyleSheet.create({
	root: {
		flexDirection: "row",
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: SEARCHBAR_DEFAULT_TOP_PADDING,
		paddingBottom: 6,
		height: SEARCHBAR_HEIGHT,
		zIndex: 1,
		backgroundColor: Color.white,
	},
	leftView: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 4,
	},
	textInputWrapper: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		justifyContent: "center",
		paddingLeft: 8,
		paddingRight: 8,
	},
	textInput: {
		paddingLeft: 6,
		paddingRight: 6,
		paddingTop: 12,
		paddingBottom: 12,
		height: 40,
		borderRadius: 4,
		backgroundColor: Color.gray97,
	},
	rightView: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginLeft: 4,
	},
	shadow: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Color.grayOpacity16,
		height: 0.5,
		zIndex: 1,
	},
})
