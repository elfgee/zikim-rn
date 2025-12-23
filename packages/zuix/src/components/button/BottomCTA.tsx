import React, { FC, useRef } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

import { Color, Margin } from "../../types"
import { revertMargin } from "../../utils/style"
import { Button, ButtonProps, ButtonPropType } from "./Button"
import { renderTextByProps } from "../../utils/renderer"
import { TextProps, TextType } from "../../components/Text"
import { Divider } from "../../components/Divider"

const TITLE_PROPS: TextProps = { size: "16", weight: "bold" }
const SUBTITLE_PROPS: TextProps = { size: "13", weight: "regular", color: Color.gray50 }

export const BottomCTA: FC<BottomCTAProps> = ({
	type = "vertical",
	buttons,
	title,
	subtitle,
	left,
	divider = false,
	style,
	...props
}) => {
	const buttonIndex = useRef(0)

	const marginStyle = revertMargin(props)
	const wrapperStyle = generateWrapperStyle(type)
	const mainButtonStyle = generateMainButtonStyle(type)
	const secondaryButtonStyle = generateSecondaryButtonStyle(type)
	const singleButtonStyle = generateSingleButtonStyle(type, !!title || !!subtitle)
	// 외부 prop 에 의해서 스타일이 달라질 수 있으므로 key 값을 유동적으로 변경하도록 한다.
	const getButtonIndex = () => {
		buttonIndex.current += 1
		return buttonIndex.current
	}
	return (
		<>
			{divider && <Divider style={s.bgGray90} mt={0} mr={0} mb={0} ml={0} />}
			<View style={[s.root, marginStyle, style]} {...props}>
				{left && <View style={s.leftView}>{left}</View>}
				<View style={[s.wrapperView, wrapperStyle]}>
					{renderTextGroup({ title, subtitle, type })}
					{buttons.map((item: ButtonPropType, i) => {
						if (isButtonComponent(item)) return item
						const { size = "44", onPress, ...props } = item as ButtonProps
						return (
							<Button
								key={getButtonIndex()}
								size={size}
								onPress={onPress}
								theme={buttons.length > 1 ? getIndexTheme(type, i) : "primary"}
								{...props}
								ml={type !== "vertical" && i > 0 ? 8 : undefined}
								style={[
									props.style,
									buttons.length > 1
										? i > 0
											? secondaryButtonStyle
											: mainButtonStyle
										: singleButtonStyle,
								]}
							/>
						)
					})}
				</View>
			</View>
		</>
	)
}

const getIndexTheme = (type: BottomCTAType, index: number) => {
	switch (type) {
		default:
		case "vertical":
			if (index === 0) return "primary"
			else return "lineGray30"
		case "5to5":
		case "1to2":
		case "2to1":
			if (index === 0) return "lineGray30"
			else return "primary"
	}
}

const renderTextGroup = ({
	title,
	subtitle,
	type,
}: {
	title?: TextType
	subtitle?: TextType
	type?: BottomCTAType
}) => {
	if (!title && !subtitle) return null
	return (
		<View style={[s.secondaryTextGroup, textGroupViewStyle(type)]}>
			{renderTextByProps(TITLE_PROPS, title)}
			{renderTextByProps(SUBTITLE_PROPS, subtitle, (first, second) => ({
				style: [!!first && s.subtitleText, typeof second !== "string" && second.style],
			}))}
		</View>
	)
}

const textGroupViewStyle = (type?: BottomCTAType) => {
	switch (type) {
		default:
		case "vertical":
			return s.mainVertical
		case "5to5":
			return s.mainHorizontal5to5
		case "1to2":
			return s.mainHorizontal1to2
		case "2to1":
			return s.mainHorizontal2to1
	}
}

const generateWrapperStyle = (type: BottomCTAType) => {
	switch (type) {
		case "vertical":
		default:
			return s.typeVertical
		case "5to5":
		case "1to2":
		case "2to1":
			return s.typeHorizontal
	}
}

const generateMainButtonStyle = (type: BottomCTAType) => {
	switch (type) {
		default:
		case "vertical":
			return undefined
		case "5to5":
			return s.mainHorizontal5to5
		case "1to2":
			return s.mainHorizontal1to2
		case "2to1":
			return s.mainHorizontal2to1
	}
}

const generateSecondaryButtonStyle = (type: BottomCTAType) => {
	switch (type) {
		default:
		case "vertical":
			return s.secondaryVertical
		case "5to5":
			return s.secondaryHorizontal5to5
		case "1to2":
			return s.secondaryHorizontal1to2
		case "2to1":
			return s.secondaryHorizontal2to1
	}
}

const generateSingleButtonStyle = (type: BottomCTAType, hasTextlayer: boolean) => {
	if (!hasTextlayer) return s.singleVertical
	switch (type) {
		default:
		case "vertical":
			return s.singleVertical
		case "5to5":
			return s.singleHorizontal5to5
		case "1to2":
			return s.singleHorizontal1to2
		case "2to1":
			return s.singleHorizontal2to1
	}
}

export type BottomCTAType = "vertical" | "5to5" | "1to2" | "2to1"
export interface BottomCTAProps extends ViewProps, Margin {
	buttons: [ButtonPropType] | [ButtonPropType, ButtonPropType]
	/** @default vertical */
	type?: BottomCTAType
	title?: TextType
	subtitle?: TextType
	left?: React.ReactElement
	/** @default false */
	divider?: boolean
}

const s = StyleSheet.create({
	root: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 12,
		marginBottom: 12,
		flexDirection: "row",
	},
	leftView: {
		marginRight: 12,
		justifyContent: "center",
	},
	wrapperView: {
		flex: 1,
	},
	typeVertical: {
		flexDirection: "column",
	},
	typeHorizontal: {
		flexDirection: "row",
	},
	mainVertical: {
		marginBottom: 8,
	},
	secondaryVertical: {
		marginTop: 8,
	},
	mainHorizontal5to5: {
		flex: 5,
	},
	secondaryHorizontal5to5: {
		flex: 5,
	},
	mainHorizontal1to2: {
		flex: 1,
	},
	secondaryHorizontal1to2: {
		flex: 2,
	},
	mainHorizontal2to1: {
		flex: 2,
	},
	secondaryHorizontal2to1: {
		flex: 1,
	},
	singleVertical: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
	},
	singleHorizontal5to5: {
		flex: 5,
	},
	singleHorizontal1to2: {
		flex: 2,
	},
	singleHorizontal2to1: {
		flex: 1,
	},
	secondaryTextGroup: {
		flexDirection: "column",
		marginRight: 12,
		justifyContent: "center",
	},
	subtitleText: {
		marginTop: 2,
	},
	bgGray90: {
		backgroundColor: Color.gray90,
	},
})

const isButtonComponent = (component: ButtonPropType): component is React.ReactElement<typeof Button> => {
	return typeof component === "object" && (component as React.ReactElement<typeof Button>).type === Button
}
