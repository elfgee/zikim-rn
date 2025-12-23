import React, { FC } from "react"
import { View, ViewProps, StyleSheet } from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { Icon } from "../components/icon"

export const Rating: FC<RatingProps> = ({
	value,
	type,
	onItemSelected,
	left,
	right,
	style,
	ml = 20,
	mr = 20,
	mt,
	mb,
	...props
}) => {
	const marginStyle = revertMargin({ mt, mr, mb, ml })
	const rootStyle = getRootStyle(type)
	const ratingStars = ratingStarMaker(value, type, onItemSelected)
	return (
		<View style={[rootStyle, marginStyle, style]} {...props}>
			{left && <View style={s.leftView}>{left}</View>}
			{ratingStars}
			{right && <View style={s.rightView}>{right}</View>}
		</View>
	)
}

const ratingStarMaker = (value: number, type: RatingType, onItemSelected: RatingProps["onItemSelected"]) => {
	const ratingCount = Math.min(Math.max(value, 0), 5)
	const isControl = type === "control"
	return new Array(5)
		.fill(0)
		.map((_, index) => (
			<Icon
				feedback={false}
				onPress={isControl ? () => onItemSelected?.(index) : undefined}
				key={`rating_${index}`}
				shape={"StarSolid"}
				color={index < ratingCount ? Color.orange1 : Color.gray90}
				style={isControl && index !== 0 ? s.controlSeparator : undefined}
				width={isControl ? 40 : 16}
				height={isControl ? 40 : 16}
			/>
		))
}

const getRootStyle = (type: RatingType) => {
	switch (type) {
		default:
		case "control":
			return s.controlRoot
		case "readonly":
			return s.readonlyRoot
	}
}

export type RatingType = "control" | "readonly"
export interface RatingProps extends ViewProps, Margin {
	value: number
	type: RatingType
	onItemSelected?: (index: number) => void
	left?: React.ReactElement
	right?: React.ReactElement
}

const s = StyleSheet.create({
	controlRoot: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 12,
		marginBottom: 12,
	},
	readonlyRoot: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 4,
		marginBottom: 4,
		alignSelf: "flex-start",
	},
	leftView: { marginRight: 4 },
	rightView: { marginLeft: 4 },
	controlSeparator: { marginLeft: 4 },
})
