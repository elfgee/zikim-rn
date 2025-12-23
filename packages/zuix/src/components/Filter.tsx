import React, { useMemo, useCallback, useRef, useState } from "react"
import { ScrollView as RNScrollView, StyleSheet, ScrollViewProps, View, ViewStyle } from "react-native"
import { Color, Margin } from "../types/index"
import { revertMargin } from "../utils/style"
import { TextType } from "../components/Text"
import { Button, ButtonStatus } from "./button"
import { Icon } from "./icon"
import { Platform } from "react-native"
import { ScrollViewWithWebDrag } from "./layout/ScrollViewWithWebDrag"

export interface FilterProps<T extends FilterDatum> extends Margin, ScrollViewProps {
	data: (T & FilterDatum)[]
	onPressItem?: (data: T, index: number) => void
	/** reset 버튼 사용시 필수 옵션 */
	onReset?: () => void
	showArrows?: boolean
	/** @default true */
	divider?: boolean
}
const IS_WEB = Platform.OS === "web"
const ScrollView = Platform.OS === "web" ? ScrollViewWithWebDrag : RNScrollView
export interface FilterDatum {
	text: TextType
	/** @default normal */
	status?: "normal" | "active" | "selected"
	style?: ViewStyle
	/** @default Filter component 하위 button의 상태, button disabled 처리를 위해 추가 */
	buttonStatus?: ButtonStatus
	/** @default true */
	isButton?: boolean
	/** Button 외 UI가 필요할 때 사용 */
	filterItem?: React.ReactNode
}

export const _Filter = <T extends FilterDatum>(
	{ data, onPressItem, onReset, showArrows, divider = true, style, ...props }: FilterProps<T>,
	ref: React.ForwardedRef<RNScrollView | undefined | null>
) => {
	const [scrollEnabled, setScrollEnabled] = useState(false)
	const scrollRef = useRef<RNScrollView | null>(null)

	const bindRef = useCallback(
		(_ref: RNScrollView | null) => {
			scrollRef.current = _ref

			if (typeof ref === "object" && ref !== null) {
				ref.current = _ref
			} else if (typeof ref === "function") {
				ref(_ref)
			}
		},
		[ref]
	)
	const handlePress = useCallback(
		(index: number) => {
			onPressItem?.(data[index], index)
		},
		[data]
	)

	const handleReset = useCallback(() => {
		scrollRef?.current?.scrollTo({ x: 0, y: 0, animated: false })
		onReset?.()
	}, [onReset])

	const _scrollEnabled = useMemo(() => {
		return IS_WEB ? showArrows ?? scrollEnabled : true
	}, [showArrows, scrollEnabled])

	return (
		<View style={[styles.Container, revertMargin(props)]}>
			<ScrollView
				scrollEnabled={_scrollEnabled}
				horizontal
				ref={bindRef}
				showsHorizontalScrollIndicator={false}
				bounces={false}
				style={[IS_WEB && _scrollEnabled ? styles.px12 : undefined, style]}
				contentContainerStyle={styles.ContentContainer}
				{...props}
				onContentSizeChange={(w, h) => {
					props.onContentSizeChange?.(w, h)
					if (!scrollRef.current) return
					if (
						IS_WEB &&
						(scrollRef as unknown as React.MutableRefObject<HTMLDivElement>).current.scrollWidth >
							(scrollRef as unknown as React.MutableRefObject<HTMLDivElement>).current.clientWidth
					) {
						setScrollEnabled(true)
					} else {
						setScrollEnabled(false)
					}
				}}
				onLayout={(e) => {
					props.onLayout?.(e)

					if (!scrollRef.current) return
					if (
						IS_WEB &&
						(scrollRef as unknown as React.MutableRefObject<HTMLDivElement>).current.scrollWidth >
							(scrollRef as unknown as React.MutableRefObject<HTMLDivElement>).current.clientWidth
					) {
						setScrollEnabled(true)
					} else {
						setScrollEnabled(false)
					}
				}}>
				{data.map(({ text, status = "normal", style, isButton = true, filterItem, buttonStatus }, index) => {
					if (isButton === false) {
						return filterItem
					}
					if (typeof text === "string") {
						return (
							<Button
								key={index}
								style={[!!onReset || index !== data.length - 1 ? styles.Item : undefined, style]}
								size="32"
								theme={getTheme(status)}
								title={{ children: text, allowFontScaling: false }}
								status={buttonStatus}
								onPress={() => handlePress(index)}
							/>
						)
					}

					return (
						<Button
							key={index}
							style={[!!onReset || index !== data.length - 1 ? styles.Item : undefined, style]}
							size="32"
							theme={getTheme(status)}
							title={{ ...text, allowFontScaling: false }}
							status={buttonStatus}
							onPress={() => handlePress(index)}
						/>
					)
				})}
				{onReset && (
					<Icon
						containerStyle={styles.Icon}
						shape="Reset"
						width={20}
						height={20}
						color={Color.gray50}
						onPress={handleReset}
					/>
				)}
			</ScrollView>
			{divider && <View style={styles.shadow} />}
		</View>
	)
}

/**
 * @stackoverflow https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref
 */
export const Filter = React.forwardRef(_Filter) as <T extends FilterDatum>(
	p: FilterProps<T> & { ref?: React.ForwardedRef<RNScrollView | undefined | null> }
) => React.ReactElement

const getTheme = (status: FilterDatum["status"]) => {
	switch (status) {
		case "active":
			return "lineOrange"
		case "selected":
			return "orange2"
		default:
		case "normal":
			return "lineGray90"
	}
}

const styles = StyleSheet.create({
	Container: {
		height: 48,
		maxHeight: 48,
		flexShrink: 0,
	},
	ContentContainer: {
		paddingTop: 8,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 8,
		flexBasis: "auto",
		minWidth: "100%",
	},
	Item: {
		marginRight: 8,
	},
	Icon: {
		width: 32,
		height: 32,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: Color.gray90,
		backgroundColor: Color.white,
	},
	shadow: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: Color.grayOpacity16,
		height: 0.5,
		zIndex: 1,
	},
	px12: {
		paddingLeft: 12,
		paddingRight: 12,
	},
})
