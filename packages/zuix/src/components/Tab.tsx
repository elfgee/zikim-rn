import React, { FC, useRef, useEffect, useCallback, useMemo, useState } from "react"
import {
	View,
	ScrollView as RNScrollView,
	StyleSheet,
	ScrollViewProps,
	Image as RNImage,
	Platform,
	Animated,
} from "react-native"
import { Color, Margin } from "../types/index"
import { revertMargin } from "../utils/style"
import { TextType } from "../components/Text"
import { Pressable, StaticPressableProps } from "./Pressable"
import { renderTextByProps } from "../utils/renderer"
import { ScrollViewWithWebDrag } from "./layout/ScrollViewWithWebDrag"
import { notUndefinedOrNull } from "../utils/util"

export interface TabProps<T extends TabData> extends Margin, ScrollViewProps {
	data: (T & TabData)[]
	widthFixed?: boolean
	/** @default auto */
	itemSize?: "auto" | "60" | "80" | "100"
	selectedIndex?: number
	onPressItem?: (item: T, index: number) => void
	right?: React.ReactElement
	showArrows?: boolean
	/**
	 * @description Tab Item의 max height를 52px로 고정할지 말지 결정하는 값
	 */
	/** @default true */
	maxHeightFixed?: boolean
}

interface TabData extends StaticPressableProps {
	text: TextType
	size?: "auto" | "60" | "80" | "100"
	disabled?: boolean
	maxHeightFixed?: boolean
}

const IS_WEB = Platform.OS === "web"
const ScrollView = Platform.OS === "web" ? ScrollViewWithWebDrag : RNScrollView
const SELECTED_BAR_MOVE_DURATION = 130
const _Tab = <T extends TabData>(
	{
		widthFixed,
		data,
		selectedIndex,
		itemSize = "auto",
		onPressItem,
		right,
		showArrows,
		maxHeightFixed = true,
		style,
		...props
	}: TabProps<T>,
	ref: React.ForwardedRef<RNScrollView | undefined | null>
) => {
	const [scrollEnabled, setScrollEnabled] = useState(false)

	const scrollViewRef = useRef<RNScrollView | null>()
	const viewWidth = useRef(0)
	const itemRefs = useRef<{ [key: number]: { width: number; x: number } }>({})

	//? 최초에 selectedIndex가 undefined라면 애니메이션 없이 나타나기 위함
	const prevSelectedIndex = useRef<number | null>(null)
	const selectedBarWidth = useRef(new Animated.Value(0)).current
	const selectedBarX = useRef(new Animated.Value(0)).current

	const bindRef = useCallback(
		(_ref: RNScrollView | null) => {
			scrollViewRef.current = _ref

			if (typeof ref === "object" && ref !== null) {
				ref!.current = _ref
			} else if (typeof ref === "function") {
				ref(_ref)
			}
		},
		[ref]
	)

	const scrollToIndex = useCallback(
		(index: number) => {
			if (itemRefs?.current?.[index]) {
				if (!widthFixed) {
					//? 선택된 item이 중앙으로 오도록 스크롤
					;((scrollViewRef as React.MutableRefObject<RNScrollView>).current as RNScrollView)?.scrollTo({
						animated: true,
						x:
							Math.round(itemRefs.current[index].x) -
							Math.round(viewWidth.current / 2) +
							Math.round(itemRefs.current[index].width / 2),
					})
				}

				if (selectedIndex !== undefined) {
					if (notUndefinedOrNull(prevSelectedIndex.current)) {
						Animated.parallel([
							Animated.timing(selectedBarWidth, {
								toValue: itemRefs.current[index].width,
								useNativeDriver: false,
								duration: SELECTED_BAR_MOVE_DURATION,
							}),
							Animated.timing(selectedBarX, {
								toValue: itemRefs.current[index].x,
								useNativeDriver: false,
								duration: SELECTED_BAR_MOVE_DURATION,
							}),
						]).start()
					} else {
						selectedBarWidth.setValue(itemRefs.current[index].width)
						selectedBarX.setValue(itemRefs.current[index].x)
					}
					prevSelectedIndex.current = index
				}
			}
		},
		[widthFixed, selectedIndex]
	)

	const _scrollEnabled = useMemo(() => {
		return IS_WEB ? showArrows ?? scrollEnabled : !widthFixed
	}, [showArrows, scrollEnabled, widthFixed])

	useEffect(() => {
		if (notUndefinedOrNull(selectedIndex)) {
			scrollToIndex(selectedIndex)
		} else {
			prevSelectedIndex.current = null
			selectedBarWidth.setValue(0)
			selectedBarX.setValue(0)
		}
	}, [selectedIndex])

	const tabWrapperHeightStyle = maxHeightFixed ? { maxHeight: 52 } : { minHeight: 52 }

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
					tabWrapperHeightStyle,
					IS_WEB && _scrollEnabled ? styles.px12 : undefined,
					style,
				]}
				contentContainerStyle={[styles.tabContentContainer, widthFixed ? styles.flexShrink1 : undefined]}
				{...props}
				onLayout={(e) => {
					viewWidth.current = e.nativeEvent.layout.width
					props.onLayout?.(e)

					if (!scrollViewRef.current) return
					if (
						IS_WEB &&
						(scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>).current.scrollWidth >
							(
								(scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>)
									.current as HTMLDivElement
							).clientWidth
					) {
						setScrollEnabled(true)
					} else {
						setScrollEnabled(false)
					}
				}}
				gradientWrapperStyle={styles.h46}>
				<View style={styles.tabBottomBorder} />
				{data.map((item, index) => (
					<View
						key={index}
						style={[
							styles.tabContainer,
							widthFixed ? { width: `${(100 / data.length).toFixed(2)}%` } : undefined,
						]}
						onLayout={(e) => {
							itemRefs.current[index] = {
								width: e.nativeEvent.layout.width,
								x: e.nativeEvent.layout.x,
							}

							if (index === selectedIndex) {
								prevSelectedIndex.current = selectedIndex
								selectedBarWidth.setValue(e.nativeEvent.layout.width)
								selectedBarX.setValue(e.nativeEvent.layout.x)
							}
						}}>
						<Item
							size={(item as TabData).size || itemSize}
							_fixed={widthFixed ? true : false}
							selected={index === selectedIndex}
							disabled={(item as TabData).disabled}
							onPress={() => {
								if (onPressItem) {
									onPressItem(item, index)
								}
							}}
							{...item}
						/>
					</View>
				))}
				{right && <View style={styles.blankRight} />}
				<Animated.View
					style={[
						styles.selectedUnderBar,
						{
							width: selectedBarWidth,
							left: selectedBarX,
						},
					]}
				/>
			</ScrollView>
			{right && (
				<View style={styles.rightWrapper}>
					<RNImage
						style={styles.rightGradient}
						source={{
							uri: "https://zuix2.zigbang.io/images/tab-right-gradient.png",
						}}
					/>
					{right}
				</View>
			)}
		</View>
	)
}

/**
 * @stackoverflow https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
export const Tab = React.forwardRef(_Tab) as <T extends TabData>(
	p: TabProps<T> & { ref?: React.ForwardedRef<RNScrollView | undefined | null> }
) => React.ReactElement

interface TabItemProps extends StaticPressableProps {
	text: TextType
	size?: "auto" | "60" | "80" | "100"
	selected?: boolean
	disabled?: boolean
	_fixed?: boolean
}

const Item: FC<TabItemProps> = ({ text, size = "auto", selected, disabled, _fixed, style, ...props }) => {
	return (
		<Pressable
			disabled={disabled}
			style={[
				styles.tabItem,
				_fixed ? styles.fixedTab : undefined,
				!_fixed && size !== "auto" ? { width: Number(size), maxWidth: Number(size) } : undefined,
				style,
			]}
			{...props}>
			{renderTextByProps(
				{
					size: "14",
					weight: selected ? "bold" : undefined,
					textAlign: "center",
					color: getItemColor({ disabled, selected }),
					mr: 4,
					ml: 4,
					allowFontScaling: false,
				},
				text
			)}
		</Pressable>
	)
}
const getItemColor = ({ disabled, selected }: { disabled: boolean | undefined; selected: boolean | undefined }) => {
	if (disabled) {
		return Color.gray70
	}
	if (selected) {
		return Color.orange1
	}
	return Color.gray30
}

const styles = StyleSheet.create({
	tabContentContainer: {
		flexGrow: 1,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: "row",
	},
	tabBottomBorder: {
		left: 0,
		right: 0,
		position: "absolute",
		bottom: 0,
		height: 1,
		backgroundColor: Color.gray95,
	},
	tabColumnWrapper: { height: 52, alignItems: "center", justifyContent: "center" },
	tabContainer: {
		flexShrink: 1,
		flexBasis: "auto",
	},
	tabWrapper: {
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: "auto",
	},
	selectedUnderBar: {
		height: 2,
		backgroundColor: Color.orange1,
		position: "absolute",
		bottom: 0,
	},
	tabItem: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: 16,
		paddingBottom: 12,
	},

	fixedTab: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		paddingLeft: 4,
		paddingRight: 4,
	},
	rightWrapper: {
		position: "absolute",
		right: 0,
		justifyContent: "center",
		alignItems: "center",
		width: 68,
		height: 47,
	},
	rightGradient: { position: "absolute", width: "100%", height: "100%" },
	blankRight: {
		width: 48,
		height: 47,
	},
	flexShrink1: { flexShrink: 1 },
	px12: {
		paddingLeft: 12,
		paddingRight: 12,
	},
	h46: {
		height: 46,
	},
})
