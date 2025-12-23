import React, { FC } from "react"
import { StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { GradientProps } from "./type"

export const Gradient: FC<GradientProps> = ({ direction = "bottom", angle, style: wrapperStyle, ...props }) => {
	const mappingDirection = () => {
		if (angle !== undefined) {
			return {
				useAngle: true,
				angle,
				angleCenter: { x: 0.5, y: 0.5 },
			}
		}
		switch (direction) {
			case "right":
				return {
					start: { x: 0, y: 0 },
					end: { x: 1, y: 0 },
				}
			case "bottom":
				return {
					start: { x: 0, y: 0 },
					end: { x: 0, y: 1 },
				}
			case "left":
				return {
					start: { x: 1, y: 0 },
					end: { x: 0, y: 0 },
				}
			case "top":
				return {
					start: { x: 0, y: 1 },
					end: { x: 0, y: 0 },
				}
		}
	}
	return <LinearGradient style={[s.root, wrapperStyle]} {...mappingDirection()} {...props} />
}

const s = StyleSheet.create({
	root: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
	},
})
