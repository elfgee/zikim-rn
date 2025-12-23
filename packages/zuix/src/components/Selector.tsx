import React, { useState, useCallback, useRef, useEffect } from "react"
import { StyleSheet, View, ScrollView, ViewProps, Platform } from "react-native"
import { Color } from "../types"
import { ListItem } from "./list"

const ITEM_HEIGHT = 48

export interface SelectItem {
	value: string | number
	label: string
}

interface SelectorProps extends ViewProps {
	itemGroup: SelectItem[][]
	defaultIndexGroup?: number[]
	onChangeGroup?: ((selectedItem: SelectItem) => void)[]
	style?: ViewProps["style"]
}

interface SelectorItemGroupProps extends ViewProps {
	items: SelectItem[]
	defaultIndex?: number
	onChange?: (selectedItem: SelectItem) => void
}

export const Selector = ({
	itemGroup: selectItemGroup,
	defaultIndexGroup,
	onChangeGroup,
	style,
	id,
}: SelectorProps) => (
	<View style={[styles.root, style]} key={id}>
		{selectItemGroup.map((selectItems, index) => (
			<SelectorItemGroup
				key={index}
				items={selectItems}
				defaultIndex={defaultIndexGroup?.[index]}
				onChange={onChangeGroup?.[index]}
			/>
		))}
	</View>
)

const SelectorItemGroup = ({ items, defaultIndex, onChange }: SelectorItemGroupProps) => {
	const scrollViewRef = useRef<ScrollView>(null)
	const wheelTimer = useRef<NodeJS.Timeout | null>(null)
	const isDraggingOnWeb = useRef(false)
	const needPreventClick = useRef(false)
	const dragScrollY = useRef(0)
	const dragStartY = useRef(0)
	const [selectedItem, setSelectedItem] = useState<SelectItem | undefined>(undefined)

	const getScrollTopOnWeb = useCallback(() => scrollViewRef.current?.getScrollableNode?.()?.scrollTop || 0, [])

	const handleSelectItem = useCallback(
		(item: SelectItem) => {
			setSelectedItem(item)
			onChange?.(item)

			const index = items.findIndex((i) => i.value === item.value)
			if (index >= 0 && index < items.length) {
				const scrollTop = index * ITEM_HEIGHT
				scrollViewRef.current?.scrollTo({
					y: scrollTop,
					animated: true,
				})
			}
		},
		[onChange, items]
	)

	const handleMouseDown = useCallback(
		(e: MouseEvent) => {
			needPreventClick.current = false
			isDraggingOnWeb.current = true
			dragScrollY.current = e.clientY + getScrollTopOnWeb()
			dragStartY.current = e.clientY
		},
		[getScrollTopOnWeb]
	)

	const handleMouseUp = useCallback(
		(e: MouseEvent) => {
			isDraggingOnWeb.current = false
			needPreventClick.current = Math.abs(dragStartY.current - e.clientY) > 5
			const scrollTop = getScrollTopOnWeb()
			if (scrollTop > 0) {
				scrollViewRef.current?.scrollTo({
					y: Math.floor((scrollTop + ITEM_HEIGHT / 2) / ITEM_HEIGHT) * ITEM_HEIGHT,
					animated: true,
				})
			}
		},
		[getScrollTopOnWeb]
	)

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (isDraggingOnWeb.current) {
			scrollViewRef.current?.scrollTo({
				y: dragScrollY.current - e.clientY,
				animated: false,
			})
		}
	}, [])

	const handleMouseClick = useCallback((e: MouseEvent) => {
		if (needPreventClick.current) {
			e.preventDefault()
			e.stopPropagation()
			needPreventClick.current = false
		}
	}, [])

	const handleWheel = useCallback(() => {
		if (wheelTimer.current) {
			clearTimeout(wheelTimer.current)
		}

		wheelTimer.current = setTimeout(() => {
			const scrollTop = getScrollTopOnWeb()
			if (scrollTop > 0) {
				scrollViewRef.current?.scrollTo({
					y: Math.floor((scrollTop + ITEM_HEIGHT / 2) / ITEM_HEIGHT) * ITEM_HEIGHT,
					animated: true,
				})
			}
		}, 200)
	}, [getScrollTopOnWeb])

	useEffect(() => {
		if (defaultIndex !== undefined) {
			const item = items[defaultIndex]
			// 초기 선택 애니메이션 효과를 위해 100ms 지연
			setTimeout(() => {
				handleSelectItem(item)
			}, 100)
		}
	}, [items, defaultIndex])

	useEffect(() => {
		if (scrollViewRef.current && Platform.OS === "web") {
			// Add web-specific event listeners
			const nativeElement = scrollViewRef.current.getScrollableNode?.() as unknown as HTMLDivElement

			if (nativeElement && nativeElement.addEventListener) {
				nativeElement.addEventListener("mousedown", handleMouseDown)
				nativeElement.addEventListener("mouseleave", handleMouseUp)
				nativeElement.addEventListener("mouseup", handleMouseUp)
				nativeElement.addEventListener("mousemove", handleMouseMove)
				nativeElement.addEventListener("click", handleMouseClick)
				nativeElement.addEventListener("wheel", handleWheel, { passive: false })

				return () => {
					// Clean up event listeners
					nativeElement.removeEventListener("mousedown", handleMouseDown)
					nativeElement.removeEventListener("mouseleave", handleMouseUp)
					nativeElement.removeEventListener("mouseup", handleMouseUp)
					nativeElement.removeEventListener("mousemove", handleMouseMove)
					nativeElement.removeEventListener("click", handleMouseClick)
					nativeElement.removeEventListener("wheel", handleWheel)
					if (wheelTimer.current) {
						clearTimeout(wheelTimer.current)
					}
				}
			}
		}
		return undefined
	}, [handleMouseClick, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel])

	return (
		<View style={styles.container}>
			<ScrollView
				ref={scrollViewRef}
				scrollEventThrottle={16}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				snapToInterval={ITEM_HEIGHT}
				pagingEnabled>
				<View style={styles.content}>
					{items.map((item) => (
						<SelectorItem
							key={item.value}
							item={item}
							selectedItem={selectedItem}
							onPress={handleSelectItem}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	)
}

const SelectorItem = ({
	item,
	selectedItem,
	onPress,
}: {
	item: SelectItem
	selectedItem?: SelectItem
	onPress: (selectedItem: SelectItem) => void
}) => {
	if (selectedItem?.value === item.value) {
		return <SelectorSelectedItem item={item} onPress={onPress} />
	}
	return <SelectorNormalItem item={item} onPress={onPress} />
}

const SelectorSelectedItem = ({ item, onPress }: { item: SelectItem; onPress: (selectedItem: SelectItem) => void }) => (
	<ListItem
		title={{
			weight: "bold",
			textAlign: "center",
			children: item.label,
			color: Color.orange1,
		}}
		mt={0}
		mb={0}
		ml={0}
		mr={0}
		style={[styles.item, styles.selectedItem]}
		onPress={() => onPress(item)}
	/>
)

const SelectorNormalItem = ({ item, onPress }: { item: SelectItem; onPress: (selectedItem: SelectItem) => void }) => (
	<ListItem
		style={[styles.item, styles.normalItem]}
		title={{ weight: "regular", textAlign: "center", children: item.label }}
		mt={0}
		mb={0}
		ml={0}
		mr={0}
		onPress={() => onPress(item)}
	/>
)

const styles = StyleSheet.create({
	root: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 8,
		marginBottom: 8,
		flexBasis: "auto",
		flexDirection: "row",
		gap: 20,
		backgroundColor: Color.white,
	},
	container: {
		flex: 1,
	},
	content: {
		flexDirection: "column",
	},
	item: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		margin: 0,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedItem: {
		backgroundColor: Color.orange2,
		borderRadius: 8,
	},
	normalItem: {
		backgroundColor: Color.white,
		borderRadius: 8,
	},
})
