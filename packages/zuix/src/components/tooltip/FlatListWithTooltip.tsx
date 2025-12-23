import React, { ForwardedRef, useCallback, useRef, useState } from "react"
import { Animated, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Platform, FlatListProps } from "react-native"
import { useTooltipWithNode, TooltipContext } from "../../store/tooltip"
import { Tooltip } from "../../components/tooltip/Tooltip"

const flatListNativeId = "tooltip-flatlist-container"
function FlatListWithTooltipInner<ItemT>(
	{
		automaticallyCloseScrollBegin = true,
		ListHeaderComponent,
		ListHeaderComponentStyle,
		onScroll,
		onScrollBeginDrag,
		...props
	}: FlatListWithTooltipProps<ItemT>,
	ref: ForwardedRef<Animated.FlatList<ItemT>>
) {
	const [node, setNode] = useState<Animated.FlatList<ItemT> | null>(null)
	const { store, data, closeTooltip } = useTooltipWithNode(node)
	const scrollOffsetY = useRef(0)
	const bindRef = useCallback(
		(ele: any) => {
			setNode(ele)
			if (typeof ref === "object" && ref !== null) ref.current = ele
			else if (typeof ref === "function") ref(ele)
		},
		[ref]
	)
	const ListHeader = useCallback(
		(props: any) => (
			<>{typeof ListHeaderComponent === "function" ? <ListHeaderComponent {...props} /> : ListHeaderComponent}</>
		),
		[ListHeaderComponent, data, node, closeTooltip]
	)
	const handleScroll = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			if (automaticallyCloseScrollBegin && data.visible) {
				data.onClose && data.onClose()
				closeTooltip()
			}
			Platform.OS === "web" ? onScroll?.(e) : onScrollBeginDrag?.(e)
		},
		[
			closeTooltip,
			Platform.OS === "web" ? onScroll : onScrollBeginDrag,
			automaticallyCloseScrollBegin,
			data.visible,
			data.onClose,
		]
	)

	const refinePosition =
		Platform.OS === "web"
			? data.position
			: { x: data.position?.x ?? 0, y: (data.position?.y ?? 0) - scrollOffsetY.current }
	return (
		<TooltipContext.Provider value={store.current}>
			<Animated.FlatList
				{...{
					onScroll: (e) => {
						onScroll?.(e)
						scrollOffsetY.current = e.nativeEvent.contentOffset.y
					},
					onScrollBeginDrag: onScrollBeginDrag,
					[Platform.OS === "web" ? "onScroll" : "onScrollBeginDrag"]: handleScroll,
				}}
				{...props}
				ref={bindRef}
				nativeID={flatListNativeId}
				ListHeaderComponentStyle={[styles.listHeader, ListHeaderComponentStyle]}
				ListHeaderComponent={ListHeader}
			/>
			{data.visible && !!node && (
				<Tooltip
					usingInnerScrolllingView
					{...data}
					rootRef={node}
					visible
					position={refinePosition}
					nativeID={flatListNativeId}
					onClose={() => {
						data.onClose && data.onClose()
						closeTooltip()
					}}
				/>
			)}
		</TooltipContext.Provider>
	)
}

export const FlatListWithTooltip = React.forwardRef(FlatListWithTooltipInner) as <T>(
	props: FlatListWithTooltipProps<T> & {
		ref?: React.ForwardedRef<Animated.AnimatedProps<FlatListProps<T>>>
	}
) => ReturnType<typeof FlatListWithTooltipInner>

export interface FlatListWithTooltipProps<T> extends Animated.AnimatedProps<FlatListProps<T>> {
	automaticallyCloseScrollBegin?: boolean
}

const styles = StyleSheet.create({
	listHeader: { zIndex: 1, elevation: 1 },
})
