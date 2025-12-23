import React, { ReactElement, useMemo } from "react"
import { FlexStyle, ScrollView, ScrollViewProps, StyleSheet, View, ViewProps } from "react-native"
import { Margin } from "../../types"
import { revertMargin } from "../../utils/style"

export const ListView = React.forwardRef<ScrollView | undefined, ListViewProps>(
	({ children, align = "horizontal", columns, gap = 0, scrollable, style, ...props }, ref) => {
		let childrenArr = useMemo(
			() =>
				(Array.isArray(children) ? ([] as ReactElement[]).concat(...children) : [children]).filter((v) => !!v),
			[children]
		)
		let itemWrapStyle: FlexStyle[] = []
		if (align !== "vertical" && !scrollable && typeof columns === "number" && columns > 0) {
			const itemSize = Math.floor(10000 / columns) / 100 + "%"
			itemWrapStyle = itemWrapStyle.concat(s.filledItem, { flexBasis: itemSize })
		}
		if (align !== "vertical") {
			childrenArr = childrenArr.map((child) => {
				if (typeof child === "object" && child?.props)
					return React.cloneElement(child, {
						...child.props,
						style: [child.props.style].concat(s.gridItemComp),
					})
				else return child
			})
		}
		if (gap) itemWrapStyle.push({ paddingTop: gap, paddingLeft: gap })
		const items = (
			<View style={[{ marginTop: gap && -gap, marginLeft: gap && -gap }, wrapStyle[align]]}>
				{childrenArr.map((child, i) => (
					<View style={itemWrapStyle} key={i}>
						{child}
					</View>
				))}
			</View>
		)
		if (scrollable)
			return (
				<ScrollView
					ref={ref as React.ForwardedRef<ScrollView>}
					bounces={false}
					showsHorizontalScrollIndicator={false}
					horizontal={align === "horizontal"}
					style={[revertMargin(props), s.scrollRoot, style]}
					{...props}>
					{items}
				</ScrollView>
			)

		return (
			<View style={[revertMargin(props), style]} {...props}>
				{items}
			</View>
		)
	}
)

export type ListViewProps =
	| {
			children: ReactElement | ReactElement[] | (ReactElement | ReactElement[])[]
			/** @default horizontal */
			align?: "vertical" | "horizontal" | "grid"
			columns?: number
			/** @default 0 */
			gap?: number
	  } & Margin &
			(({ scrollable: true } & ScrollViewProps) | ({ scrollable?: false } & ViewProps))

const wrapStyle = StyleSheet.create({
	vertical: {},
	horizontal: { flexDirection: "row" },
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
})

const s = StyleSheet.create({
	scrollRoot: {
		flexGrow: 0,
		flexShrink: 0,
	},
	filledItem: {
		flexGrow: 0,
		flexShrink: 0,
	},

	gridItemComp: {
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: "auto",
	},
})
