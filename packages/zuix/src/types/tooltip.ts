import { RefObject } from "react"
import { FlatList } from "react-native"
import { TextType } from "../components/Text"

export interface TooltipProps<T = unknown> {
	visible: boolean
	rootRef?: React.Component<T> | FlatList | null | undefined
	/** react-native node id  */
	target?: string
	title?: TextType
	subtitle?: TextType
	textButton?: TextType
	onClose?: () => void
	position?: TooltipPositionType
	/** @default true */
	usingInnerScrolllingView?: boolean
	scrollOffsetY?: RefObject<number>
}

export type TooltipPositionType = { x: number; y: number }
