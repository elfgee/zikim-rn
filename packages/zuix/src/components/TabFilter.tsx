import React, { useRef, useEffect, useState } from "react"
import { ViewProps, View, StyleSheet, Platform, Animated } from "react-native"
import { Color, Margin } from "../types"
import { TextType, TextProps } from "./Text"
import { revertMargin } from "../utils/style"
import { renderTextByProps } from "../utils/renderer"
import { Pressable } from "./Pressable"

const ANIMATION_DURATION = 300

export interface TabFilterProps<T> extends Margin, ViewProps {
	data: (T & TabData)[]
	widthFixed?: boolean
	/** @default auto */
	itemSize?: "auto" | number
	selectedIndex?: number
	onPressItem?: (item: T, index: number) => void
}

interface TabData {
	text: TextType
	size?: "auto" | number
	disabled?: boolean
}

export const TabFilter = <T,>({
	data,
	widthFixed,
	itemSize,
	selectedIndex,
	onPressItem,
	style,
	...props
}: TabFilterProps<T>) => {
	const itemRefs = useRef<{ [key: number]: { width: number; x: number } }>({})

	const [inited, setInited] = useState(false)
	const selectedBgWidth = useRef(new Animated.Value(0)).current
	const selectedBgX = useRef(new Animated.Value(0)).current
	const moveBackgroundToItem = (index: number) => {
		if (itemRefs?.current?.[index]) {
			Animated.parallel([
				Animated.timing(selectedBgX, {
					toValue: Math.round(itemRefs.current[index].x),
					duration: ANIMATION_DURATION,
					useNativeDriver: false,
				}),
				Animated.timing(selectedBgWidth, {
					toValue: Math.round(itemRefs.current[index].width),
					duration: ANIMATION_DURATION,
					useNativeDriver: false,
				}),
			]).start()
		}
	}

	useEffect(() => {
		if (selectedIndex !== undefined) {
			moveBackgroundToItem(selectedIndex)
		}
	}, [selectedIndex])
	return (
		<View style={[styles.root, !widthFixed && styles.alignSelfFlexStart, revertMargin(props), style]} {...props}>
			<Animated.View
				style={[
					styles.selectedBg,
					{
						width: selectedBgWidth,
						left: selectedBgX,
					},
				]}
			/>
			{data.map((item, index) => {
				const { text, disabled = false, size = itemSize } = item
				const selected = index === selectedIndex
				const isLast = index === data.length - 1
				return (
					<Pressable
						feedback={false}
						radius={4}
						style={[
							styles.tabItem,
							!inited && selected ? styles.selectedTabItem : undefined,
							{ width: size },
							widthFixed
								? { width: `${(100 / data.length).toFixed(2)}%`, minWidth: 46, flex: 1 }
								: styles.paddingHorizontal8,
						]}
						key={index}
						mr={isLast ? 0 : 8}
						onPress={() => onPressItem?.(item, index)}
						onLayout={(e) => {
							const { x, width } = e.nativeEvent.layout
							itemRefs.current[index] = {
								width,
								x,
							}
							if (selected) {
								selectedBgWidth.setValue(width)
								selectedBgX.setValue(x)
							}
							if (!inited) {
								setInited(true)
							}
						}}>
						{({ pressed }) => (
							<>
								{
									//? 텍스트 bold로 width 변화하는  것 방지
									renderTextByProps(defaultTabBoldText, text)
								}
								{
									//? 안드로이드에서 medium과 bold 둘중 medium만 ellipsis되는 현상 방지 예시 data:["최소 3년","최소 5년"]
									renderTextByProps(defaultTabMediumText, text)
								}
								{renderTextByProps(
									{
										size: "13",
										weight: selected ? "bold" : "medium",
										color: getTextColor({ selected, disabled: disabled, pressed }),
										allowFontScaling: false,
										textAlign: "center",
										numberOfLines: 1,
										style: [
											Platform.OS === "web"
												? widthFixed
													? styles.paddingHorizontal4
													: styles.paddingHorizontal8
												: undefined,
											styles.absolute,
										],
									},
									text
								)}
							</>
						)}
					</Pressable>
				)
			})}
		</View>
	)
}

const getTextColor = ({ selected, disabled, pressed }: { selected: boolean; disabled: boolean; pressed: boolean }) => {
	if (disabled) {
		return Color.gray80
	} else if (selected) {
		return Color.navy1
	} else if (pressed) {
		return Color.gray10
	} else {
		return Color.gray50
	}
}

const styles = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
		padding: 3,
		backgroundColor: Color.gray97,
		borderRadius: 6,
		overflow: "hidden",
	},
	tabItem: {
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 4,
		paddingRight: 4,
		minHeight: 24,
		justifyContent: "center",
		alignItems: "center",
	},
	selectedBg: {
		position: "absolute",
		height: 26,
		backgroundColor: Color.white,
		borderRadius: 4,
		borderColor: Color.gray95,
		borderWidth: 1,
	},
	selectedTabItem: {
		backgroundColor: Color.white,
		borderRadius: 4,
	},
	absolute: {
		position: "absolute",
	},
	paddingHorizontal8: {
		paddingLeft: 8,
		paddingRight: 8,
	},
	paddingHorizontal4: {
		paddingLeft: 4,
		paddingRight: 4,
	},
	alignSelfFlexStart: {
		alignSelf: "flex-start",
	},
	h0: { height: 0 },
})

const defaultTabBoldText: TextProps = {
	size: "13",
	weight: "bold",
	color: "transparent",
	allowFontScaling: false,
	textAlign: "center",
	numberOfLines: 1,
}

const defaultTabMediumText: TextProps = {
	size: "13",
	weight: "medium",
	color: "transparent",
	allowFontScaling: false,
	textAlign: "center",
	numberOfLines: 1,
	style: styles.h0,
}
