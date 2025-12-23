export interface GradientProps {
	colors: (string | number)[]
	locations?: number[]
	style?: object
	/** @default bottom */
	direction?: "left" | "right" | "bottom" | "top"
	angle?: number
	children?: React.ReactNode
}
