import React, { FC, useEffect } from "react"
import { Modal, StyleSheet, TouchableWithoutFeedback, View, StyleProp, ViewStyle, ModalProps } from "react-native"
import { Color } from "../types"
import { renderTextByProps } from "../utils/renderer"
import { Button, ButtonProps } from "./button"
import { TextProps, TextType } from "../components/Text"

const BELOW_TEXT_BUTTON_PROPS: TextProps = {
	size: "12",
	color: Color.gray80,
	weight: "medium",
	textAlign: "right",
	mt: 8,
	mr: 4,
	ml: 4,
}

export const Dialog: FC<DialogProps> = ({
	children,
	onClose,
	cancelOnTouchOutside = false,
	onPressOutside,
	visible,
	title,
	subtitle,
	buttonAlign = "column",
	buttons,
	bottom,
	wrapStyle,
	bottomTextButton,
	...props
}) => {
	const handlePressOutside = () => {
		if (cancelOnTouchOutside) onClose?.()
		onPressOutside?.()
	}
	useEffect(() => () => onClose?.(), [])
	const isRowBtn = buttonAlign !== "column"
	return (
		<Modal transparent={true} visible={visible} {...props}>
			<View style={[styles.wrap, wrapStyle]}>
				<TouchableWithoutFeedback onPress={handlePressOutside}>
					<View style={styles.bg} />
				</TouchableWithoutFeedback>
				<View style={styles.dialog}>
					<View style={styles.dialogContent}>
						{(title !== undefined || subtitle !== undefined) && (
							<View style={styles.title}>
								{renderTextByProps(TITLE_PROPS, title)}
								{renderTextByProps(SUBTITLE_PROPS, subtitle)}
							</View>
						)}
						{children}
						{buttons ? (
							<View
								style={[
									buttons.length > 0 ? styles.buttonBox : styles.emptyButtonBox,
									isRowBtn ? styles.rowBtnBox : styles.columnBtnBox,
								]}>
								{buttons.length > 0 &&
									buttons.map(({ size = "40", onPress, isCloseBtn, ...props }, i) => (
										<Button
											key={i}
											size={size}
											onPress={(e) => {
												onPress?.(e)
												if (isCloseBtn) onClose?.()
											}}
											theme={i === 0 && isRowBtn ? "lineGray30" : undefined}
											{...props}
											style={[
												props.style,
												{
													marginTop: !isRowBtn && i > 0 ? 8 : undefined,
													marginLeft: isRowBtn && i > 0 ? 8 : undefined,
													flex: getButtonFlex(buttonAlign, i),
												},
											]}
										/>
									))}
							</View>
						) : (
							<View style={styles.emptyButtonBox} />
						)}
					</View>
					{!!bottomTextButton && (
						<View style={styles.bottomTextButton}>
							{renderTextByProps(BELOW_TEXT_BUTTON_PROPS, bottomTextButton)}
						</View>
					)}
				</View>
				{bottom}
			</View>
		</Modal>
	)
}

const TITLE_PROPS: TextProps = { size: "16", weight: "bold", ml: 16, mr: 16, mb: 8 }
const SUBTITLE_PROPS: TextProps = { size: "16", weight: "regular", ml: 16, mr: 16, mb: 8 }

const getButtonFlex = (align: DialogProps["buttonAlign"], index: number): number => {
	if (align === "3to7") return index === 0 ? 3 : 7
	else if (align === "5to5") return 1
	else return 0
}

export interface DialogProps extends ModalProps {
	onClose?: () => void
	visible: boolean
	/** @default true */
	cancelOnTouchOutside?: boolean
	onPressOutside?: () => void
	title?: TextType
	subtitle?: TextType
	/** @default column */
	buttonAlign?: "column" | "5to5" | "3to7"
	buttons?: [DialogButtonProps] | [DialogButtonProps, DialogButtonProps]
	bottom?: React.ReactElement
	bottomTextButton?: TextType
	wrapStyle?: StyleProp<ViewStyle>
}

interface DialogButtonProps extends ButtonProps {
	isCloseBtn?: boolean
}

const styles = StyleSheet.create({
	wrap: {
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	bg: {
		width: "100%",
		height: "100%",
		position: "absolute",
		backgroundColor: Color.grayOpacity60,
	},
	dialog: {
		width: "100%",
		maxWidth: 400,
	},
	dialogContent: {
		backgroundColor: Color.white,
		maxWidth: 340,
		marginLeft: 30,
		marginRight: 30,
		minHeight: 100,
		elevation: 3,
		borderRadius: 4,
	},
	title: {
		paddingTop: 16,
	},
	secondTitle: {
		marginTop: 8,
	},
	buttonBox: {
		padding: 16,
	},
	emptyButtonBox: {
		paddingTop: 12,
	},
	columnBtnBox: {
		flexDirection: "column",
	},
	rowBtnBox: {
		flexDirection: "row",
	},
	bottomTextButton: {
		maxWidth: 340,
		marginLeft: 30,
		marginRight: 30,
	},
})
