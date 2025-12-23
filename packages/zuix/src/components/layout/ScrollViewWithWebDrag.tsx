import React, { useCallback, useRef, useState, useMemo } from "react"
import { Icon } from "../icon/Icon"
import { Color } from "../../types/index"
import {
	NativeSyntheticEvent,
	ScrollView,
	ScrollViewProps,
	NativeScrollEvent,
	ImageBackground,
	StyleSheet,
	View,
	PanResponder,
	ViewStyle,
	StyleProp,
} from "react-native"

const DEFAULT_SCROLL_EVENT_THROTTLE = 16
const SCROLL_THRESHOLD = 8

interface ScrollViewWithWebDrag extends ScrollViewProps {
	gradientWrapperStyle?: StyleProp<ViewStyle>
}

export const ScrollViewWithWebDrag = React.forwardRef(
	({ scrollEnabled, gradientWrapperStyle, ...props }: ScrollViewWithWebDrag, ref) => {
		const [scrollStarted, setScrollStarted] = useState(false)
		const [scrollEnded, setScrollEnded] = useState(false)
		const currentX = useRef(0)
		const scrollViewRef = useRef<ScrollView | null>()

		const bindRef = useCallback(
			(_ref: ScrollView | null) => {
				scrollViewRef.current = _ref

				if (typeof ref === "object" && ref !== null) {
					ref!.current = _ref
				} else if (typeof ref === "function") {
					ref(_ref)
				}
			},
			[ref]
		)
		const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const viewWidth = event.nativeEvent.layoutMeasurement.width
			const contentsWidth = event.nativeEvent.contentSize.width
			const scrollX = event.nativeEvent.contentOffset.x
			if (scrollX > 0) {
				setScrollStarted(true)
			} else {
				setScrollStarted(false)
			}

			//? Filter에서 400 + 199.5 >= 600 이 나와서 ceiling 합니다...
			if (Math.ceil(viewWidth + scrollX) >= contentsWidth) {
				setScrollEnded(true)
			} else {
				setScrollEnded(false)
			}
		}, [])

		const panResponder = useMemo(
			() =>
				PanResponder.create({
					onStartShouldSetPanResponder: () => true,
					onMoveShouldSetPanResponder(e, gestureState) {
						const { scrollWidth, offsetWidth, scrollLeft } = ((
							scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>
						).current as HTMLDivElement)!
						if (Math.abs(gestureState.dx) < SCROLL_THRESHOLD) {
							// threshold 일 시
							return false
						} else if (scrollLeft === 0 && gestureState.dx > 0) {
							// 맨 왼쪽 위치에서
							return false
						} else if (
							// 맨 오른쪽 위치에서
							scrollWidth - offsetWidth <= scrollLeft &&
							gestureState.dx < 0
						) {
							return false
						}
						return true
					},
					onPanResponderGrant: () => {
						currentX.current = (
							scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>
						).current.scrollLeft
					},
					onPanResponderMove: (e, gestureState) => {
						;((scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>)
							.current as HTMLDivElement)!.scrollLeft = currentX.current - gestureState.dx
					},
				}),
			[]
		)
		const _onPressLeftArrow = useCallback(() => {
			scrollViewRef.current?.scrollTo({
				animated: true,
				x: (scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>).current.scrollLeft - 200,
			})
		}, [])

		const _onPressRightArrow = useCallback(() => {
			scrollViewRef.current?.scrollTo({
				animated: true,
				x: (scrollViewRef as unknown as React.MutableRefObject<HTMLDivElement>).current.scrollLeft + 200,
			})
		}, [])

		const SideArrows = useMemo(() => {
			if (!scrollEnabled) {
				return
			}
			return (
				<>
					<View style={styles.leftArrowWrapper}>
						<View style={[styles.leftGradientWrapper, gradientWrapperStyle]}>
							<View style={styles.gradientWhiteSpace} />
							{scrollStarted && (
								<ImageBackground
									style={styles.gradientImageStyle}
									source={{ uri: "https://zuix2.zigbang.io/images/gr_L.png" }}
								/>
							)}
						</View>
						<Icon
							onPress={_onPressLeftArrow}
							shape={"ArrowLeft"}
							width={16}
							height={16}
							disabled={!scrollStarted}
							color={scrollStarted ? Color.gray10 : Color.gray80}
						/>
					</View>
					<View style={styles.rightArrowWrapper}>
						<View style={[styles.rightGradientWrapper, gradientWrapperStyle]}>
							{!scrollEnded && (
								<ImageBackground
									style={styles.gradientImageStyle}
									source={{ uri: "https://zuix2.zigbang.io/images/gr_R.png" }}
								/>
							)}
							<View style={styles.gradientWhiteSpace} />
						</View>
						<Icon
							onPress={_onPressRightArrow}
							shape={"ArrowRight"}
							width={16}
							height={16}
							disabled={scrollEnded}
							color={scrollEnded ? Color.gray80 : Color.gray10}
						/>
					</View>
				</>
			)
		}, [scrollEnabled, scrollStarted, scrollEnded])

		return (
			<View>
				<ScrollView
					ref={bindRef}
					scrollEnabled={scrollEnabled}
					{...props}
					onScroll={(e) => {
						onScroll(e)
						props.onScroll?.(e)
					}}
					scrollEventThrottle={props.scrollEventThrottle || DEFAULT_SCROLL_EVENT_THROTTLE}
					{...panResponder.panHandlers}
				/>
				{SideArrows}
			</View>
		)
	}
)

const styles = StyleSheet.create({
	leftArrowWrapper: {
		height: "100%",
		position: "absolute",
		left: 0,
		paddingLeft: 12,
		justifyContent: "center",
	},
	leftGradientWrapper: { flexDirection: "row", position: "absolute", top: 0, left: 0, height: "100%" },
	gradientWhiteSpace: { width: 12, backgroundColor: Color.white },
	gradientImageStyle: {
		width: 40,
		height: "100%",
	},
	rightArrowWrapper: {
		height: "100%",
		position: "absolute",
		right: 0,
		paddingRight: 12,
		justifyContent: "center",
	},
	rightGradientWrapper: { flexDirection: "row", position: "absolute", top: 0, right: 0, height: "100%" },
})
