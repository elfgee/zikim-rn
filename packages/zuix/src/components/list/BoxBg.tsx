import React, { FC } from "react"
import { View, ViewProps, StyleSheet } from "react-native"

import { Color, Margin } from "../../types"
import { revertMargin } from "../../utils/style"

export interface BoxBgProps extends ViewProps, Margin {
	bg?: Color | string
}

export const BoxBg: FC<BoxBgProps> = ({ children, bg, style, ...props }) => {
	const marginStyle = revertMargin(props)
	return (
		<View style={[s.root, marginStyle, bg ? { backgroundColor: bg } : undefined, style]} {...props}>
			{children}
		</View>
	)
}

const s = StyleSheet.create({
	root: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 12,
		marginBottom: 12,
		paddingTop: 16,
		paddingBottom: 16,
		borderRadius: 4,
		backgroundColor: Color.gray97,
		borderWidth: 1,
		borderColor: Color.gray95,
	},
})
