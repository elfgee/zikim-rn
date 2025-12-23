import { ViewStyle } from "react-native"
import { PressableProps } from "../../components/Pressable"
import { Color, Margin } from "../../types"
import { SVG } from "./svg"

interface IconContainerStyle {
	width: number
	height: number
	backgroundColor?: Color | string
	borderRadius?: number
	borderWidth?: number
	borderColor?: Color
}

export type IconShape = keyof typeof SVG

export interface IconProps extends PressableProps, Margin {
	width?: number
	height?: number
	style?: ViewStyle
	color?: Color | string
	subcolor?: Color | string
	shape: IconShape
	containerStyle?: IconContainerStyle
}
