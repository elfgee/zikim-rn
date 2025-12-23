import React, { FC, useRef, useEffect, useCallback, useMemo, useState } from "react"
import { View, StyleSheet, ScrollView as RNScrollView, ScrollViewProps, Platform } from "react-native"
import { Color, Margin } from "../types/index"
import { revertMargin } from "../utils/style"
import { TextType } from "../components/Text"
import { Pressable, StaticPressableProps } from "./Pressable"
import { renderTextByProps } from "../utils/renderer"

import { ScrollViewWithWebDrag } from "./layout/ScrollViewWithWebDrag"

type TabBoxTheme = "primary" | "secondary" | "lineOrange1" | "navy1" | "smallNavy2"

export interface TabBoxProps<T extends TabData> extends Margin, ScrollViewProps {
	data: (T & TabData)[]
	widthFixed?: boolean
	/** @default auto */
	itemSize?: "auto" | "60" | "80" | "100"
	selectedIndex?: number
	onPressItem?: (item: T, index: number) => void
	/** @default lineOrange1 */
	theme?: TabBoxTheme
	showArrows?: boolean
}

const IS_WEB = Platform.OS === "web"
const ScrollView = Platform.OS === "web" ? ScrollViewWithWebDrag : RNScrollView

interface TabData extends StaticPressableProps {
	text: TextType
	theme?: TabBoxTheme
	size?: "auto" | "60" | "80" | "100"
	disabled?: boolean
}

export const _TabBox = <T extends TabData>(
	{
		widthFixed,
		data,
		selectedIndex,
		itemSize = "auto",
		onPressItem,
		theme = "lineOrange1",
		showArrows,
		style,
		...props
	}: TabBoxProps<T>,
	ref: React.ForwardedRef<RNScrollView | undefined | null>
) => {
	const [scrollEnabled, setScrollEnabled] = useState(false)

	const scrollViewRef = useRef<RNScrollView | null>()
	const viewWidth = useRef(0)
	const itemRefs = useRef<{ [key: number]: { width: number; x: number } }>({})

	const bindRef = useCallback(
		(_ref: RNScrollView | null) => {
			scrollViewRef.current = _ref

			if (typeof ref === "object" && ref !== null) {
				ref.current = _ref
			} else if (typeof ref === "function") {
				ref(_ref)
			}
		},
		[ref]
	)

	const scrollToIndex = useCallback(
		(index: number) => {
			if (!widthFixed && itemRefs?.current?.[index]) {
				//? 선택된 item이 중앙으로 오도록 스크롤
				;(scrollViewRef as React.MutableRefObject<RNScrollView>).current?.scrollTo({
					animated: true,
					x:
						Math.round(itemRefs.current[index].x) -
						Math.round(viewWidth.current / 2) +
						Math.round(itemRefs.current[index].width / 2),
				})
			}
		},
		[widthFixed]
	)
	const _scrollEnabled = useMemo(() => {
		return IS_WEB ? showArrows ?? scrollEnabled : !widthFixed
	}, [showArrows, scrollEnabled, widthFixed])

	useEffect(() => {
		if (selectedIndex !== undefined) {
			scrollToIndex(selectedIndex)
		}
	}, [selectedIndex])

	return (
		<View style={revertMargin(props)}>
			<ScrollView
				scrollEnabled={_scrollEnabled}
				horizontal={!widthFixed}
				ref={bindRef}
				showsHorizontalScrollIndicator={false}
				bounces={false}
				style={[
					styles.tabWrapper,
					theme === "smallNavy2" ? styles.height40 : undefined,
					IS_WEB && _scrollEnabled ? styles.px12 : undefined,
					style,
				]}
				contentContainerStyle={[styles.tabContentContainer]}
				{...props}
				onLayout={(e) => {
					viewWidth.current = e.nativeEvent.layout.width
					props.onLayout?.(e)

					if (!scrollViewRef.current) return
					if (
						IS_WEB &&
						(scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>).current.scrollWidth >
							(scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>).current.clientWidth
					) {
						setScrollEnabled(true)
					} else {
						setScrollEnabled(false)
					}
				}}>
				{data.map((item, index) => (
					<View
						key={index}
						style={[
							styles.tabContainer,
							widthFixed ? { width: `${(100 / data.length).toFixed(2)}%` } : undefined,
							data!.length - 1 === index ? undefined : theme === "smallNavy2" ? styles.mr4 : styles.mr8,
						]}
						onLayout={(e) => {
							itemRefs.current[index] = {
								width: e.nativeEvent.layout.width,
								x: e.nativeEvent.layout.x,
							}
						}}>
						<Item
							size={(item as TabData).size || itemSize}
							_fixed={widthFixed ? true : false}
							selected={index === selectedIndex}
							disabled={item.disabled}
							theme={(item as TabData).theme || theme}
							onPress={() => {
								if (onPressItem) {
									onPressItem(item, index)
								}
								scrollToIndex(index)
							}}
							{...item}
						/>
					</View>
				))}
			</ScrollView>
		</View>
	)
}

/**
 * @stackoverflow https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
export const TabBox = React.forwardRef(_TabBox) as <T extends TabData>(
	p: TabBoxProps<T> & {
		ref?: React.ForwardedRef<RNScrollView | undefined | null>
	}
) => React.ReactElement

interface TabBoxItemProps extends Margin, StaticPressableProps {
	text: TextType
	theme?: TabBoxTheme
	size?: "auto" | "60" | "80" | "100"
	selected?: boolean
	/** @default false */
	disabled?: boolean
	_fixed?: boolean
}

const Item: FC<TabBoxItemProps> = ({
	text,
	theme = "primary",
	size,
	selected,
	disabled = false,
	_fixed,
	style,
	...props
}) => {
	return (
		<Pressable
			radius={4}
			disabled={disabled}
			style={[
				styles.tabItem,
				theme === "smallNavy2" ? styles.height32 : undefined,
				getBackgroundStyle({ theme, selected, disabled }),
				_fixed ? styles.fixedItem : undefined,
				!_fixed && size && size !== "auto" ? styles[`width${size}`] : undefined,
				style,
			]}
			{...props}>
			<View style={[styles.border, getBorderStyle({ theme, selected, disabled })]} />
			{renderTextByProps(
				{
					size: theme === "smallNavy2" ? "13" : "14",
					weight: !disabled && selected ? "bold" : undefined,
					textAlign: "center",
					color: getItemColor({ theme, selected, disabled }),
					allowFontScaling: false,
				},
				text
			)}
		</Pressable>
	)
}

const getBorderStyle = ({
	theme,
	selected,
	disabled,
}: {
	theme: TabBoxTheme
	selected: boolean | undefined
	disabled: boolean
}) => {
	switch (theme) {
		case "primary":
		case "lineOrange1":
		default:
			if (disabled) {
				return styles.borderGray95
			}
			return selected ? styles.borderOrange1 : styles.borderGray90
		case "secondary":
		case "navy1":
		case "smallNavy2":
			return styles.border0
	}
}
const getItemColor = ({
	theme,
	selected,
	disabled,
}: {
	theme: TabBoxTheme
	selected: boolean | undefined
	disabled: boolean
}) => {
	if (disabled) {
		return Color.gray80
	}
	switch (theme) {
		case "primary":
		case "lineOrange1":
		default:
			return selected ? Color.orange1 : Color.gray10

		case "secondary":
		case "navy1":
			return selected ? Color.white : Color.gray30

		case "smallNavy2":
			return selected ? Color.navy1 : Color.gray30
	}
}

const getBackgroundStyle = ({
	theme,
	selected,
	disabled,
}: {
	theme: TabBoxTheme
	selected: boolean | undefined
	disabled: boolean
}) => {
	switch (theme) {
		case "primary":
		case "lineOrange1":
		default:
			return styles.bgWhite

		case "secondary":
		case "navy1":
			if (disabled) {
				return styles.bgGray97
			}
			return selected ? styles.bgNavy1 : styles.bgGray95
		case "smallNavy2":
			if (disabled) {
				return styles.bgGray97
			}
			return selected ? styles.bgNavy2 : styles.bgGray95
	}
}

const styles = StyleSheet.create({
	tabContentContainer: {
		flexGrow: 1,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Color.white,
	},
	tabColumnWrapper: { height: 48, alignItems: "center", justifyContent: "center" },
	tabContainer: {
		flexShrink: 1,
		flexGrow: 0,
		flexBasis: "auto",
	},
	tabWrapper: {
		height: 48,
		maxHeight: 48,
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: "auto",
	},
	tabItem: {
		height: 36,
		maxHeight: 36,
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: 16,
		paddingRight: 16,
		borderRadius: 4,
	},

	fixedItem: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		paddingLeft: 0,
		paddingRight: 0,
	},
	alignCenter: {
		alignItems: "center",
	},
	mr8: {
		marginRight: 8,
	},
	mr4: {
		marginRight: 4,
	},
	border: {
		position: "absolute",
		width: "100%",
		height: "100%",
		borderWidth: 1,
		borderRadius: 4,
	},
	height40: { height: 40, maxHeight: 40 },
	height32: { height: 32, maxHeight: 32 },
	width60: { width: 60, maxWidth: 60 },
	width80: { width: 80, maxWidth: 80 },
	width100: { width: 100, maxWidth: 100 },
	borderGray90: { borderColor: Color.gray90 },
	borderGray95: { borderColor: Color.gray95 },
	borderOrange1: { borderColor: Color.orange1, borderWidth: 1.4 },
	border0: { borderWidth: 0 },
	bgWhite: { backgroundColor: Color.white },
	bgGray95: { backgroundColor: Color.gray95 },
	bgGray97: { backgroundColor: Color.gray97 },
	bgNavy1: { backgroundColor: Color.navy1 },
	bgNavy2: { backgroundColor: Color.navy2 },
	px12: {
		paddingLeft: 12,
		paddingRight: 12,
	},
})
