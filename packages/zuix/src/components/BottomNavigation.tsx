import React, { FC } from "react"
import { View, StyleSheet, ScrollViewProps } from "react-native"
import { Color, Margin } from "../types/index"
import { revertMargin } from "../utils/style"
import { TextType } from "../components/Text"
import { Pressable, StaticPressableProps } from "./Pressable"
import { renderTextByProps } from "../utils/renderer"
import { Icon, IconProps } from "./icon"

export interface BottomNavigationProps extends Margin, ScrollViewProps {
	items: BottomNavigationItemType[]
	onPressItem?: (item: BottomNavigationItemType, index: number) => void
	activeIndex?: number
}

export type BottomNavigationItemType = {
	iconShape: IconProps["shape"]
	title: TextType
}

export const BottomNavigation = ({ items, activeIndex, onPressItem, style, ...props }: BottomNavigationProps) => {
	return (
		<View style={[styles.container, revertMargin(props), style]} {...props}>
			{items.map((item, index) => (
				<Item
					key={index}
					iconShape={item.iconShape}
					title={item.title}
					active={index === activeIndex}
					onPress={() => {
						if (onPressItem) {
							onPressItem(item, index)
						}
					}}
				/>
			))}
		</View>
	)
}

interface BottomNavigationItemProps extends StaticPressableProps, BottomNavigationItemType {
	active: boolean
}

const Item: FC<BottomNavigationItemProps> = ({ title, iconShape, active, ...props }) => {
	return (
		<Pressable style={styles.item} {...props}>
			{<Icon shape={iconShape} color={getItemColor({ active })} width={24} height={24} style={styles.icon} />}
			{renderTextByProps(
				{
					size: "12",
					textAlign: "center",
					allowFontScaling: false,
					lineHeight: 16,
				},
				title
			)}
		</Pressable>
	)
}
const getItemColor = ({ active }: { active: boolean }) => {
	if (active) {
		return Color.orange1
	}
	return Color.gray80
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Color.white,
		height: 68,
		maxHeight: 68,
		display: "flex",
		flexDirection: "row",
	},
	item: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		marginLeft: "auto",
		marginRight: "auto",
		marginBottom: 4,
		marignTop: 0,
	},
})
