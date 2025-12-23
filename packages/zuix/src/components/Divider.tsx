import React, { FC } from "react"
import { StyleSheet, View, ViewProps } from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"

export interface DividerProps extends Margin, ViewProps {
	/** @default linePadding */
	type?: "linePadding" | "section" | "lineFull"
}

export const Divider: FC<DividerProps> = ({ type = "linePadding", style, ...props }) => {
	return <View style={[getHeight(type), getMargin(type), styles.divider, revertMargin(props), style]} {...props} />
}

const getMargin = (type: DividerProps["type"]) => {
	switch (type) {
		case "linePadding":
			return styles.margin20
		case "section":
			return styles.mt20mb20
		case "lineFull":
		default:
			return undefined
	}
}

const getHeight = (type: DividerProps["type"]) => {
	switch (type) {
		case "section":
			return styles.height12
		case "linePadding":
		case "lineFull":
		default:
			return styles.height1
	}
}

const styles = StyleSheet.create({
	height12: { height: 12 },
	height1: { height: 1 },
	divider: { alignSelf: "stretch", backgroundColor: Color.gray95 },
	margin20: {
		marginTop: 20,
		marginRight: 20,
		marginBottom: 20,
		marginLeft: 20,
	},
	mt20mb20: {
		marginTop: 20,
		marginBottom: 20,
	},
})
