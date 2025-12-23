import React, { useRef, useCallback, useEffect, useState } from "react"
import { StyleSheet, ScrollViewProps, ScrollView as RNScrollView, View, Platform } from "react-native"

import { Margin } from "../types"
import { revertMargin } from "../utils/style"
import { ChipProps, Chip } from "../components/Chip"
import { ScrollViewWithWebDrag } from "./layout/ScrollViewWithWebDrag"
import { Gradient, GradientProps } from "./gradient"

export interface ChipFilterProps<T extends ChipProps> extends Margin, ScrollViewProps {
	data: T[]
	selectedIndex?: number[] | number
	onPressItem?: (item: T, index: number) => void
	right?: React.ReactElement
}

const IS_WEB = Platform.OS === "web"
const ScrollView = IS_WEB ? ScrollViewWithWebDrag : RNScrollView
const RIGHT_GRADIENT: GradientProps = {
	locations: [0, 0.35, 1],
	colors: ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"],
	direction: "right",
}

export const _ChipFilter = <T extends ChipProps>(
	{ data, selectedIndex, onPressItem, right, style, ...props }: ChipFilterProps<T>,
	ref: React.ForwardedRef<RNScrollView | undefined | null>
) => {
	const scrollViewRef = useRef<RNScrollView | null>()
	const viewWidth = useRef(0)
	const itemRefs = useRef<{ [key: number]: { width: number; x: number } }>({})
	const [selectedItemCount, setSelectedItemCount] = useState(0)
	const itemsMeasureState = useRef<boolean>(false)

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
	const scrollToIndex = useCallback((index: number, animated = true) => {
		if (itemRefs?.current?.[index]) {
			//? 선택된 item이 중앙으로 오도록 스크롤
			;(scrollViewRef as React.MutableRefObject<RNScrollView>).current?.scrollTo({
				animated,
				x:
					Math.round(itemRefs.current[index].x) -
					Math.round(viewWidth.current / 2) +
					Math.round(itemRefs.current[index].width / 2),
			})
		}
	}, [])

	useEffect(() => {
		if (!itemsMeasureState.current) return
		if (Array.isArray(selectedIndex)) {
			if (selectedItemCount < selectedIndex.length) {
				scrollToIndex(selectedIndex[selectedIndex.length - 1], true)
			}
			setSelectedItemCount(selectedIndex.length)
		} else {
			scrollToIndex(selectedIndex as number, true)
		}
	}, [selectedIndex, itemsMeasureState])

	const handleLayoutItems = () => {
		if (itemsMeasureState.current) return
		if (Object.keys(itemRefs.current).length === data.length && viewWidth.current > 0) {
			itemsMeasureState.current = true
			if (Array.isArray(selectedIndex)) {
				scrollToIndex(selectedIndex[selectedIndex.length - 1], false)
			} else {
				scrollToIndex(selectedIndex as number, false)
			}
		}
	}

	return (
		<View style={[revertMargin(props), style]}>
			<ScrollView
				ref={bindRef}
				horizontal
				scrollEnabled={!IS_WEB}
				showsHorizontalScrollIndicator={false}
				bounces={false}
				style={s.scrollView}
				contentContainerStyle={[s.contentContainer, right && s.pr58]}
				{...props}
				onLayout={(e) => {
					viewWidth.current = e.nativeEvent.layout.width
					props.onLayout?.(e)
					handleLayoutItems()
				}}>
				{data.map((item, index) => {
					const selected = Array.isArray(selectedIndex)
						? selectedIndex.some((v) => v === index)
						: index === selectedIndex
					return (
						<View
							key={index}
							style={s.itemWrapper}
							onLayout={(e) => {
								itemRefs.current[index] = {
									width: e.nativeEvent.layout.width,
									x: e.nativeEvent.layout.x,
								}
								handleLayoutItems()
							}}>
							<Chip
								status={selected ? "selected" : "normal"}
								onPress={() => onPressItem?.(item, index)}
								{...item}
							/>
						</View>
					)
				})}
			</ScrollView>
			{right && (
				<View style={s.rightWrapper}>
					<Gradient {...RIGHT_GRADIENT} />
					{right}
				</View>
			)}
		</View>
	)
}

/**
 * @stackoverflow https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
export const ChipFilter = React.forwardRef(_ChipFilter) as <T extends ChipProps>(
	p: ChipFilterProps<T> & { ref?: React.ForwardedRef<RNScrollView | undefined | null> }
) => React.ReactElement

const s = StyleSheet.create({
	scrollView: {
		minHeight: 60,
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: "auto",
	},
	contentContainer: {
		flexGrow: 1,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	pr58: {
		paddingRight: 58,
	},
	rightWrapper: {
		position: "absolute",
		right: 0,
		justifyContent: "center",
		alignItems: "center",
		width: 68,
		height: 60,
	},
	rightGradient: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
	itemWrapper: {
		flexShrink: 1,
		flexBasis: "auto",
		marginRight: 8,
	},
})
