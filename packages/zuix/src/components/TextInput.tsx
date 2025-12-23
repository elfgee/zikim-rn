import React, { forwardRef, useState } from "react"
import {
	StyleSheet,
	View,
	TextInput as RNTextInput,
	TextInputProps as RNTextInputProps,
	TextStyle,
	StyleProp,
	Platform,
} from "react-native"
import { Margin, Color } from "../types"
import { Text } from "./Text"
import { revertMargin } from "../utils/style"

export interface TextInputProps extends RNTextInputProps, Margin {
	disabled?: boolean
	readonly?: boolean
	left?: React.ReactElement
	right?: React.ReactElement
	inputStyle?: StyleProp<TextStyle>
	postfix?: string
	autoHeight?: boolean
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
	({ style, disabled, readonly, left, right, inputStyle, multiline, autoHeight, postfix, ...props }, ref) => {
		const [contentHeight, seContentHeight] = useState<number | undefined>()
		return (
			<View style={[styles.root, revertMargin(props), style]}>
				{!!left && <View style={styles.mr4}>{left}</View>}
				<RNTextInput
					ref={ref}
					focusable={!disabled && !readonly}
					editable={!disabled && !readonly}
					//? for textAlgin Vertical
					multiline={multiline || autoHeight}
					//? for prevent new line when press submit
					blurOnSubmit={multiline ? false : true}
					//? 자동완성 사용 안함
					autoCorrect={false}
					scrollEnabled={false}
					placeholderTextColor={Color.gray70}
					onContentSizeChange={
						autoHeight
							? ({ nativeEvent }) => {
									seContentHeight(nativeEvent.contentSize.height)
							  }
							: undefined
					}
					style={[
						styles.textStyle,
						disabled ? styles.disabled : undefined,
						inputStyle,
						!multiline && { height: LINE_HEIGHT },
						Platform.OS === "ios" && { lineHeight: multiline ? LINE_HEIGHT : undefined }, // IOS에서 텍스트가 센터정렬이 안되는 문제가 있어서 line-height를 없앰
						!!contentHeight &&
							(Platform.OS === "web" // web에서는 textarea 내부 영역의 높이가 감싼 높이보다 작을경우, 줄갯수가 줄어들때 이벤트 콜백이 오지 않는 문제가 있어 padding으로 우회 처리함
								? {
										height: contentHeight - LINE_HEIGHT,
										paddingBottom: LINE_HEIGHT,
										overflow: "hidden",
								  }
								: { height: contentHeight }),
					]}
					{...props}
					onChangeText={(text) => {
						if (props.maxLength && text.length > props.maxLength) {
							props.onChangeText?.(text.substring(0, props.maxLength))
						} else {
							props.onChangeText?.(text)
						}
					}}
				/>
				{postfix && (
					<Text size="16" style={styles.postfix} ml={4} color={disabled ? Color.gray70 : undefined}>
						{postfix}
					</Text>
				)}
				{!!right && <View style={styles.ml8}>{right}</View>}
			</View>
		)
	}
)

const LINE_HEIGHT = 24

const styles = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
	},
	textStyle: {
		fontFamily: "Pretendard",
		flex: 1,
		width: "100%",
		flexBasis: "auto",
		color: Color.gray10,
		fontSize: 16,
		lineHeight: LINE_HEIGHT,
		fontWeight: "400",
		paddingTop: 0,
		paddingBottom: 0,
	},
	disabled: {
		color: Color.gray70,
	},
	mr4: {
		marginRight: 4,
	},
	ml8: {
		marginLeft: 8,
	},
	postfix: {
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: "auto",
		wordBreak: "keep-all",
	},
})
