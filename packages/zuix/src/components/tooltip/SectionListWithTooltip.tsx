import React, { ForwardedRef, useCallback, useRef, useState } from "react"
import { SectionListProps, Animated, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Platform } from "react-native"
import { useTooltipWithNode, TooltipContext } from "../../store/tooltip"
import { Tooltip } from "../../components/tooltip/Tooltip"

const sectionListNativeId = "tooltip-sectionlist-container"
const SectionListWithTooltipInner = <ItemT, SectionT>(
	{
		automaticallyCloseScrollBegin = true,
		ListHeaderComponent,
		ListHeaderComponentStyle,
		onScroll,
		onScrollBeginDrag,
		...props
	}: SectionListWithTooltipProps<ItemT, SectionT>,
	ref: ForwardedRef<Animated.SectionList<ItemT, SectionT>>
) => {
	const [node, setNode] = useState<Animated.SectionList<ItemT, SectionT> | null>(null)
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
			<>
				{typeof ListHeaderComponent === "function" ? <ListHeaderComponent {...props} /> : ListHeaderComponent}
				{data.visible && !!node && (
					<Tooltip
						usingInnerScrolllingView
						{...data}
						rootRef={node}
						visible
						nativeID={sectionListNativeId}
						scrollOffsetY={scrollOffsetY}
						onClose={() => {
							data.onClose && data.onClose()
							closeTooltip()
						}}
					/>
				)}
			</>
		),
		[ListHeaderComponent, data, node, closeTooltip]
	)
	const handleScroll = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			if (automaticallyCloseScrollBegin && data.visible) {
				data.onClose && data.onClose()
				closeTooltip()
			}
			scrollOffsetY.current = e.nativeEvent.contentOffset.y
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
	return (
		<TooltipContext.Provider value={store.current}>
			<Animated.SectionList
				{...{
					onScroll: onScroll,
					onScrollBeginDrag: onScrollBeginDrag,
					[Platform.OS === "web" ? "onScroll" : "onScrollBeginDrag"]: handleScroll,
				}}
				{...props}
				ref={bindRef}
				nativeID={sectionListNativeId}
				ListHeaderComponentStyle={[styles.listHeader, ListHeaderComponentStyle]}
				ListHeaderComponent={ListHeader}
			/>
		</TooltipContext.Provider>
	)
}

export const SectionListWithTooltip = React.forwardRef(SectionListWithTooltipInner) as <T, K>(
	props: SectionListWithTooltipProps<T, K> & {
		ref?: React.ForwardedRef<Animated.AnimatedProps<SectionListProps<T, K>>>
	}
) => ReturnType<typeof SectionListWithTooltipInner>

export interface SectionListWithTooltipProps<T, K> extends Animated.AnimatedProps<SectionListProps<T, K>> {
	automaticallyCloseScrollBegin?: boolean
}

const styles = StyleSheet.create({
	listHeader: { zIndex: 1, elevation: 1 },
})
