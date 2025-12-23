import React, { useState, useCallback, useRef } from "react"
import { ScrollView, ScrollViewProps, NativeSyntheticEvent, NativeScrollEvent, Platform } from "react-native"
import { useTooltipWithNode, TooltipContext } from "../../store/tooltip"
import { Tooltip } from "../../components/tooltip/Tooltip"

const scrollViewNativeId = "tooltip-scrollview-container"
export const ScrollViewWithTooltip = React.forwardRef<ScrollView, ScrollViewWithTooltipProps>(
	({ automaticallyCloseScrollBegin = true, onScroll, onScrollBeginDrag, ...props }, ref) => {
		const [node, setNode] = useState<ScrollView | null>(null)
		const scrollOffsetY = useRef(0)
		const { store, data, closeTooltip } = useTooltipWithNode(node)
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
		return (
			<ScrollView
				nativeID={scrollViewNativeId}
				{...{
					onScroll: (e) => {
						onScroll?.(e)
						scrollOffsetY.current = e.nativeEvent.contentOffset.y
					},
					onScrollBeginDrag: onScrollBeginDrag,
					[Platform.OS === "web" ? "onScroll" : "onScrollBeginDrag"]: handleScroll,
				}}
				{...props}
				ref={(ele) => {
					setNode(ele)
					if (typeof ref === "object" && ref !== null) ref.current = ele
					else if (typeof ref === "function") ref(ele)
				}}>
				<TooltipContext.Provider value={store.current}>
					{props.children}
					{data.visible && !!node && (
						<Tooltip
							nativeID={scrollViewNativeId}
							usingInnerScrolllingView
							scrollOffsetY={scrollOffsetY}
							{...data}
							rootRef={node}
							visible
							onClose={() => {
								data.onClose && data.onClose()
								closeTooltip()
							}}
						/>
					)}
				</TooltipContext.Provider>
			</ScrollView>
		)
	}
)

export interface ScrollViewWithTooltipProps extends ScrollViewProps {
	automaticallyCloseScrollBegin?: boolean
}
