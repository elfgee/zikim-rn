import React, { FC, useRef, useEffect, useCallback, useState } from "react"
import {
	View,
	StyleSheet,
	ScrollView as RNScrollView,
	ScrollViewProps,
	ImageBackground,
	NativeSyntheticEvent,
	NativeScrollEvent,
	Platform,
	TouchableWithoutFeedback,
} from "react-native"
import { Color, Margin } from "../types/index"
import { revertMargin } from "../utils/style"
import { TextType } from "../components/Text"
import { Pressable, StaticPressableProps } from "./Pressable"
import { renderTextByProps } from "../utils/renderer"

import { ScrollViewWithWebDrag } from "./layout/ScrollViewWithWebDrag"

interface TagData extends StaticPressableProps {
	text: TextType
}

export interface TagBoxProps<T extends TagData> extends Margin, ScrollViewProps {
	data: (T & TagData)[]
	/** @default orange */
	theme?: "orange" | "gray"
	/** @default auto */
	itemDirection?: "left" | "right"
	selectedIndex?: number
	onPressItem?: (item: T, index: number) => void
}

const IS_WEB = Platform.OS === "web"
const ScrollView = IS_WEB ? ScrollViewWithWebDrag : RNScrollView

export const _TagBox = <T extends TagData>(
	{ data, theme = "orange", selectedIndex, onPressItem, itemDirection, ...props }: TagBoxProps<T>,
	ref: React.ForwardedRef<RNScrollView | undefined | null>
) => {
	const [scrollEnabled, setScrollEnabled] = useState(false)
	const [scrollStarted, setScrollStarted] = useState(false)
	const [scrollEnded, setScrollEnded] = useState(false)

	const scrollViewRef = useRef<RNScrollView | null>()
	const scrollViewWidth = useRef(0)
	const contentWidth = useRef(0)
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

	const scrollToIndex = useCallback((index: number) => {
		if (itemRefs?.current?.[index]) {
			//? 선택된 item이 중앙으로 오도록 스크롤
			;(scrollViewRef as React.MutableRefObject<RNScrollView>).current?.scrollTo({
				animated: true,
				x:
					Math.round(itemRefs.current[index].x) -
					Math.round(scrollViewWidth.current / 2) +
					Math.round(itemRefs.current[index].width / 2),
			})
		}
	}, [])

	useEffect(() => {
		if (selectedIndex !== undefined) {
			scrollToIndex(selectedIndex)
		}
	}, [selectedIndex])

	const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (!contentWidth.current) {
			return
		}

		if (!scrollViewWidth.current) {
			return
		}

		const scrollX = event.nativeEvent.contentOffset.x
		if (scrollX > 0) {
			setScrollStarted(true)
		} else {
			setScrollStarted(false)
		}

		if (Math.ceil(scrollViewWidth.current + scrollX) >= contentWidth.current) {
			setScrollEnded(true)
		} else {
			setScrollEnded(false)
		}
	}, [])

	const measureViewSize = useCallback(() => {
		if (!contentWidth.current) {
			return
		}

		if (!scrollViewWidth.current) {
			return
		}

		if (scrollViewWidth.current < contentWidth.current) {
			setScrollEnabled(true)
		} else {
			setScrollEnabled(false)
			setScrollEnded(true)
		}
	}, [])

	return (
		<View style={[revertMargin(props), styles.container]}>
			<ScrollView
				scrollEnabled={scrollEnabled}
				horizontal={true}
				ref={bindRef}
				showsHorizontalScrollIndicator={false}
				bounces={false}
				style={[styles.tagWrapper, IS_WEB && scrollEnabled ? styles.px12 : undefined, props.style]}
				contentContainerStyle={[
					styles.tagContentContainer,
					itemDirection === "right" ? { justifyContent: "flex-end" } : { justifyContent: "flex-start" },
					props.contentContainerStyle,
				]}
				onScroll={(e) => {
					onScroll(e)
				}}
				onScrollEndDrag={(e) => {
					onScroll(e)
				}}
				onContentSizeChange={(width) => {
					contentWidth.current = width
					measureViewSize()
				}}
				onLayout={(e) => {
					scrollViewWidth.current = e.nativeEvent.layout.width
					measureViewSize()
				}}
				{...props}>
				{data.map((item, index) => (
					<View
						key={index}
						style={[styles.tagContainer, data!.length - 1 === index ? undefined : styles.mr4]}
						onLayout={(e) => {
							itemRefs.current[index] = {
								width: e.nativeEvent.layout.width,
								x: e.nativeEvent.layout.x,
							}
						}}>
						<Item
							theme={theme}
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
			{!IS_WEB && scrollEnabled && (
				<>
					<View style={styles.leftArrowWrapper}>
						<View style={styles.leftGradientWrapper}>
							{scrollStarted && (
								<ImageBackground
									style={styles.gradientImageStyle}
									source={{ uri: "https://zuix2.zigbang.io/images/gr_L.png" }}
								/>
							)}
						</View>
					</View>
					<View style={styles.rightArrowWrapper}>
						<View style={styles.rightGradientWrapper}>
							{!scrollEnded && (
								<ImageBackground
									style={styles.gradientImageStyle}
									source={{ uri: "https://zuix2.zigbang.io/images/gr_R.png" }}
								/>
							)}
						</View>
					</View>
				</>
			)}
		</View>
	)
}

/**
 * @stackoverflow https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
export const TagBox = React.forwardRef(_TagBox) as <T extends TagData>(
	p: TagBoxProps<T> & {
		ref?: React.ForwardedRef<RNScrollView | undefined | null>
	}
) => React.ReactElement

interface TagBoxItemProps extends Margin, StaticPressableProps {
	text: TextType
	theme?: "orange" | "gray"
}

const Item: FC<TagBoxItemProps> = ({ text, theme = "orange", ...props }) => {
	const themeBg = theme === "orange" ? styles.tagOrange : styles.tagGray
	const themeText = theme === "orange" ? styles.tagItemTextOrange : styles.tagItemTextGray
	return (
		<TouchableWithoutFeedback onPress={props.onPress || undefined}>
			<View style={[styles.tagItem, themeBg]}>
				{renderTextByProps(
					{
						style: [styles.tagItemText, themeText],
					},
					text
				)}
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	tagContentContainer: {
		flexGrow: 1,
		paddingLeft: 20,
		paddingRight: 20,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Color.white,
	},
	tagContainer: {
		flexShrink: 1,
		flexGrow: 0,
		flexBasis: "auto",
	},
	tagWrapper: {
		display: "flex",
		flexDirection: "row",
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: "auto",
	},
	tagItem: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
		justifyContent: "center",
		alignItems: "center",
		paddingLeft: 4,
		paddingRight: 4,
		height: 24,
		borderRadius: 2,
		backgroundColor: Color.transparent,
	},
	tagOrange: {
		backgroundColor: Color.white,
	},
	tagGray: {
		backgroundColor: Color.navy2,
	},
	tagItemText: {
		fontSize: 12,
		fontWeight: "400",
		lineHeight: 16,
		textAlign: "center",
	},
	tagItemTextOrange: {
		color: Color.orange1,
	},
	tagItemTextGray: {
		color: Color.gray10,
	},
	mr4: {
		marginRight: 4,
	},
	px12: {
		paddingLeft: 12,
		paddingRight: 12,
	},
	leftArrowWrapper: {
		height: "100%",
		position: "absolute",
		left: 0,
		paddingLeft: 12,
		justifyContent: "center",
	},
	leftGradientWrapper: { flexDirection: "row", position: "absolute", top: 0, left: 0, height: "100%" },
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
