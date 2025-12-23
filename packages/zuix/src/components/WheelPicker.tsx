import React, { FC, useState, useRef, useEffect, useMemo, useCallback } from "react"
import { StyleSheet, View, Platform, ViewProps, Image, ScrollView, ViewStyle } from "react-native"
import { Margin, Color } from "../types"
import { revertMargin } from "../utils/style"
import { Text } from "./Text"

const ITEM_HEIGHT = 240 / 5

const ListItem = React.memo(({ label, selected }: { label?: string; selected?: boolean }) => (
	<View
		style={[s.listItem, Platform.OS === "web" && s.userSelectNone]}
		onResponderTerminationRequest={() => false}
		onStartShouldSetResponder={() => true}>
		<Text
			size="16"
			color={selected ? Color.gray10 : Color.gray50}
			style={Platform.OS === "web" && s.userSelectNone}>
			{label}
		</Text>
	</View>
))

const WheelItem: FC<WheelItemProps> = ({
	items,
	wheelIndex,
	setNewSelectedIndex,
	selectedItem,
	isWheelResetRequired,
	setResetScrollViewRef,
}) => {
	const [inited, setInited] = useState(false)
	const webDragging = useRef(false)
	const currentY = useRef(0)
	const scrollView = useRef<ScrollView | HTMLDivElement>(null)

	useEffect(() => {
		// 초기화 필요한 경우 스크롤뷰 저장
		if (isWheelResetRequired) {
			setResetScrollViewRef?.(scrollView.current)
		}
	}, [wheelIndex, isWheelResetRequired, scrollView])

	const selectedIndex = useMemo(
		() => items.findIndex((item) => item.value === selectedItem?.value),
		[items, selectedItem]
	)

	const _handleMouseDown = useCallback((e: MouseEvent) => {
		webDragging.current = true
		currentY.current = e.clientY + (scrollView.current as HTMLDivElement)!.scrollTop
	}, [])

	const _handleMouseUp = useCallback(() => {
		webDragging.current = false
		const index = Math.round((scrollView.current as HTMLDivElement)!.scrollTop / ITEM_HEIGHT)
		;(scrollView.current as any)?.scrollTo({ x: 0, y: index * ITEM_HEIGHT })
	}, [setNewSelectedIndex])

	const _handleMouseMove = useCallback((e: MouseEvent) => {
		if (webDragging.current) {
			;(scrollView.current as HTMLDivElement)!.scrollTop = currentY.current - e.clientY
		}
	}, [])

	useEffect(() => {
		if (scrollView.current) {
			setInited(true)
		}
		if (scrollView.current && Platform.OS !== "web") {
			;(scrollView.current as ScrollView).scrollTo({ x: 0, y: selectedIndex * ITEM_HEIGHT, animated: false })
		}
		if (scrollView.current && Platform.OS === "web") {
			;(scrollView.current as HTMLDivElement).scrollTop = selectedIndex * ITEM_HEIGHT
			;(scrollView.current as HTMLDivElement).addEventListener("mousedown", _handleMouseDown)
			;(scrollView.current as HTMLDivElement).addEventListener("mouseleave", _handleMouseUp)
			;(scrollView.current as HTMLDivElement).addEventListener("mouseup", _handleMouseUp)
			;(scrollView.current as HTMLDivElement).addEventListener("mousemove", _handleMouseMove)
			return () => {
				;(scrollView.current as HTMLDivElement)?.removeEventListener("mousedown", _handleMouseDown)
				;(scrollView.current as HTMLDivElement)?.removeEventListener("mouseleave", _handleMouseUp)
				;(scrollView.current as HTMLDivElement)?.removeEventListener("mouseup", _handleMouseUp)
				;(scrollView.current as HTMLDivElement)?.removeEventListener("mousemove", _handleMouseMove)
			}
		}
	}, [])

	return (
		<View style={[s.list, !inited ? s.opacity0 : undefined]} key={wheelIndex}>
			<ScrollView
				scrollToOverflowEnabled={true}
				onMomentumScrollEnd={(event) => {
					const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT)
					setNewSelectedIndex(index)
				}}
				onScroll={(event) => {
					const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT)
					setNewSelectedIndex(index)
				}}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				scrollEventThrottle={16}
				ref={scrollView as React.RefObject<ScrollView>}
				snapToInterval={ITEM_HEIGHT}>
				<ListItem />
				<ListItem />
				{items.map((item) => (
					<ListItem key={item.value} label={item.label} selected={item.value === selectedItem?.value} />
				))}
				{items.length === 0 && <Text color={Color.gray50}>{"No Items"}</Text>}
				<ListItem />
				<ListItem />
			</ScrollView>
		</View>
	)
}

export const WheelPicker: FC<WheelPickerProps<WheelItemsArr>> = ({
	wheelItems,
	style,
	onChange,
	defaultItems,
	isWheelResetRequired,
	...props
}) => {
	const [selectedItems, setSelectedItems] = useState<SelectedItems<WheelItemsArr>>(
		defaultItems || (wheelItems.map((items) => items[0]) as SelectedItems<WheelItemsArr>)
	)
	const resetScrollViewRefs = useRef<(ScrollView | HTMLDivElement | null)[]>(Array(wheelItems.length).fill(null))
	const currentWheelItems = useRef<WheelItemsArr>(wheelItems)

	useEffect(() => {
		currentWheelItems.current = wheelItems
	}, [wheelItems])

	const setResetScrollViewRef = useCallback((ref: ScrollView | HTMLDivElement | null, wheelIndex: number) => {
		resetScrollViewRefs.current[wheelIndex] = ref
	}, [])

	const setNewSelectedIndex = useCallback(
		(wheelIndex: number) => (index: number) => {
			selectedItems[wheelIndex] = currentWheelItems.current[wheelIndex][index]
			const isWheelReset = isWheelResetRequired && wheelIndex === 0
			if (isWheelReset) {
				// 두 번째 휠부터 모든 휠 리셋
				for (let i = 1; i < currentWheelItems.current.length; i++) {
					if (currentWheelItems.current[i]?.[0]) {
						selectedItems[i] = currentWheelItems.current[i][0]
						if (resetScrollViewRefs.current[i]) {
							;(resetScrollViewRefs.current[i] as any)?.scrollTo({ x: 0, y: 0, animated: false })
						}
					}
				}
			}

			onChange?.([...selectedItems])
			setSelectedItems([...selectedItems])
		},
		[currentWheelItems, selectedItems, isWheelResetRequired, onChange]
	)

	return (
		<View style={[s.root, revertMargin(props), style]} {...props}>
			<View style={s.zip}>
				<View style={s.selected} />
				{wheelItems.map((items, wheelIndex) => (
					<WheelItem
						key={wheelIndex}
						items={items}
						wheelIndex={wheelIndex}
						setNewSelectedIndex={setNewSelectedIndex(wheelIndex)}
						selectedItem={selectedItems[wheelIndex]}
						isWheelResetRequired={isWheelResetRequired}
						setResetScrollViewRef={(ref) => setResetScrollViewRef(ref, wheelIndex)}
					/>
				))}
				<View style={s.topGradient} pointerEvents={"none"}>
					<Image style={s.img} source={{ uri: "https://zuix2.zigbang.io/images/dim_top.png" }} />
				</View>
				<View style={s.bottomGradient} pointerEvents={"none"}>
					<Image style={s.img} source={{ uri: "https://zuix2.zigbang.io/images/dim_btm.png" }} />
				</View>
			</View>
		</View>
	)
}

const s = StyleSheet.create({
	root: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 12,
		marginBottom: 12,
		flexBasis: "auto",
	},
	zip: {
		paddingLeft: 20,
		paddingRight: 20,
		flexGrow: 1,
		flexBasis: "auto",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "flex-start",
		backgroundColor: Color.white,
	},
	selected: {
		position: "absolute",
		left: 20,
		right: 20,
		height: ITEM_HEIGHT,
		top: ITEM_HEIGHT * 2,
		backgroundColor: Color.gray95,
		borderRadius: 5,
	},
	list: {
		height: ITEM_HEIGHT * 5 + 1,
		flex: 1,
		flexGrow: 1,
		flexBasis: "auto",
	},
	listItem: {
		height: ITEM_HEIGHT,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedItem: {
		left: 0,
		right: 0,
	},
	topGradient: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		width: "100%",
	},
	bottomGradient: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		width: "100%",
	},
	img: {
		width: "100%",
		height: 96,
	},
	opacity0: {
		opacity: 0,
	},
	userSelectNone: Platform.OS === "web" ? ({ userSelect: "none" } as ViewStyle) : {},
})

export type WheelItemsArr = [WheelItem[]] | [WheelItem[], WheelItem[]] | [WheelItem[], WheelItem[], WheelItem[]]
export type SelectedItems<T extends WheelItemsArr> = WheelItem[]
export interface WheelPickerProps<T extends WheelItemsArr> extends ViewProps, Margin {
	wheelItems: T
	defaultItems?: SelectedItems<T>
	onChange?: (selectedItems: SelectedItems<T>) => void
	isWheelResetRequired?: boolean
}

export interface WheelItemProps {
	items: WheelItem[]
	wheelIndex: number
	defaultItem?: WheelItem
	setNewSelectedIndex: (index: number) => void
	selectedItem: WheelItem
	isWheelResetRequired?: boolean
	setResetScrollViewRef?: (ref: ScrollView | HTMLDivElement | null) => void
}
export interface WheelItem {
	value: number | string
	label: string
}
