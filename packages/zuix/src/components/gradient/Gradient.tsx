import React from "react"
import { GradientProps } from "./type"

export const Gradient: React.FC<GradientProps> = ({
	colors,
	locations,
	direction = "bottom",
	angle,
	style: wrapperStyle,
	...props
}) => {
	const mappingColors = colors.map((v, i) => {
		if (!locations) return colors
		return `${v} ${locations[i] * 100}%`
	})
	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				background: `linear-gradient(${getDirection(direction, angle)}${mappingColors.join(",")})`,
				...(wrapperStyle as React.CSSProperties),
			}}>
			{props.children}
		</div>
	)
}

const getDirection = (direction: GradientProps["direction"], angle?: GradientProps["angle"]) => {
	if (angle !== undefined) {
		return `${angle}deg,`
	}
	return `to ${direction},`
}
