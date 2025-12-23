import React, { useState, useEffect, useRef, FC, useMemo } from "react"
import {
	View,
	StyleSheet,
	Animated,
	Dimensions,
	ViewProps,
	Keyboard,
	KeyboardEventListener,
	Platform,
	ScrollView,
	Easing,
} from "react-native"
import { Color } from "../../types"
import { Provider } from "../../components/Provider"
import { Icon } from "../../components/icon"
import { Title } from "../../components/Title"
import { TextType } from "../../components/Text"
import { Pressable } from "../Pressable"

export interface BottomSheetViewProps extends ViewProps {
	visible: boolean
	/** @default false */
	minimized?: boolean
	/** @default false */
	minimizable?: boolean
	onClose?: (from: "closebutton" | "state") => void
	/** 'auto' or number or percentage */
	height?: number | "auto" | `${number}%`
	minimizeHeight?: number
	onPressHandler?: (minimized: boolean) => void
	/**
	 * 'auto' or number or percentage
	 * @default auto
	 * */
	title?: string | React.ReactElement<typeof Title>
	children?: React.ReactNode
	hasCloseButton?: boolean
	justifyContent?: "flex-start" | "center" | "flex-end"
	alignItems?: "flex-start" | "center" | "flex-end"
	fixedBottom?: React.ReactElement
}
type OnCloseFrom = Parameters<NonNullable<BottomSheetViewProps["onClose"]>>[0]

const ANIMATION_DURATION = 300
const easeInOutCubic = Easing.bezier(0.65, 0, 0.35, 1)

const windowHeight = Dimensions.get("window").height

export const BottomSheetView: FC<BottomSheetViewProps> = ({
	visible,
	onClose,
	height = "auto",
	minimized,
	minimizeHeight,
	minimizable,
	title,
	children,
	hasCloseButton,
	justifyContent,
	alignItems,
	onPressHandler,
	fixedBottom,
	...props
}) => {
	//* use for animating before modal inivisible
	const [_visible, _setVisible] = useState(false)
	const [rootH, setRootH] = useState(windowHeight)

	const [bottomH, setBottomH] = useState(0)
	const bottomPositon = useRef(new Animated.Value(windowHeight)).current
	const prevHeight = useRef<Animated.Value & { _value?: number }>(new Animated.Value(0)).current
	const sheetY = useRef(new Animated.Value(windowHeight)).current
	const fade = useRef(new Animated.Value(0)).current
	const closeFrom = useRef<OnCloseFrom>("state")
	const subscriptions = useRef<ReturnType<typeof Keyboard.addListener>[]>([])

	const contentsHeight = useMemo(() => {
		if (typeof height === "string" && /%$/.test(height)) {
			return Math.round((rootH * Number(height.replace("%", ""))) / 100)
		} else if (height !== "auto" && isNaN(Number(height))) {
			console.error(height, 'height only accept "auto" or "n%" or number type')
			return rootH
		} else {
			return Number(height)
		}
	}, [rootH, height])

	const closeBottomSheet = (from: OnCloseFrom) => {
		closeFrom.current = from
		Animated.parallel([
			animate(sheetY, rootH),
			...(fixedBottom ? [animate(bottomPositon, rootH + prevHeight._value!)] : []),
		]).start(() => {
			sheetY.setValue(rootH)
			_setVisible(false)
			if (!visible && _visible) {
				onClose?.(closeFrom.current)
			}
			if (fixedBottom) {
				bottomPositon.setValue(rootH + prevHeight._value!)
			}
		})
	}

	useEffect(() => {
		if (visible) {
			_setVisible(true)
			animate(fade, 1).start()
		} else if (!visible && _visible) {
			animate(fade, 0).start(() => _setVisible(false))
			closeBottomSheet(closeFrom.current)
		}
	}, [visible])

	useEffect(() => {
		if (!_visible && visible) {
			onClose?.(closeFrom.current)
		}
		if (_visible) {
			sheetY.setValue(rootH)
			if (fixedBottom) {
				bottomPositon.setValue(rootH + prevHeight._value!)
			}
		}
	}, [_visible, rootH])

	useEffect(() => {
		if (minimized && minimizeHeight) {
			animate(sheetY, rootH - minimizeHeight - bottomH).start()
		} else {
			Animated.parallel([
				animate(sheetY, rootH - (height === "auto" ? prevHeight._value! : contentsHeight) - bottomH),
				...(fixedBottom ? [animate(bottomPositon, rootH - bottomH)] : []),
			]).start()
		}
	}, [minimized, rootH, bottomH])

	useEffect(() => {
		const onKeyboardChange: KeyboardEventListener = (e) => {
			const { endCoordinates } = e
			if (Platform.OS === "ios" && windowHeight === endCoordinates.screenY) {
				onKeyboardHide(e)
				return
			}

			animate(
				sheetY,
				rootH - prevHeight._value! - endCoordinates.height < 0
					? 0
					: rootH - prevHeight._value! - endCoordinates.height
			).start()
		}

		const onKeyboardHide: KeyboardEventListener = () => {
			animate(sheetY, rootH - prevHeight._value!).start()
		}
		if (Platform.OS === "ios") {
			subscriptions.current = [Keyboard.addListener("keyboardWillChangeFrame", onKeyboardChange)]
		} else {
			subscriptions.current = [
				Keyboard.addListener("keyboardDidHide", onKeyboardHide),
				Keyboard.addListener("keyboardDidShow", onKeyboardChange),
			]
		}
		return () => {
			subscriptions.current.forEach((fn) => fn.remove())
		}
	}, [rootH])

	if (!_visible) {
		return null
	}
	return (
		<>
			<Animated.View
				onLayout={(e) => {
					setRootH(Math.round(e.nativeEvent.layout.height))
				}}
				style={[styles.root, { opacity: fade }, { transform: [{ translateY: sheetY }] }]}
				{...props}>
				<Provider>
					<View
						style={{
							height: height === "auto" ? "auto" : contentsHeight,
						}}>
						<View
							style={styles.flex1}
							onLayout={(e) => {
								const _height =
									height === "auto" ? Math.round(e.nativeEvent.layout.height) : contentsHeight
								if (minimized && minimizeHeight) {
									animate(sheetY, rootH - minimizeHeight - bottomH).start(() => {
										prevHeight.setValue(_height)
									})
									return
								}
								if (prevHeight._value! < _height) {
									prevHeight.setValue(_height)
								}

								if (fixedBottom) {
									animate(bottomPositon, rootH - bottomH).start()
								}
								animate(sheetY, rootH - _height - bottomH).start(() => {
									prevHeight.setValue(_height)
								})
							}}>
							{minimizable && (
								<View style={styles.handlerWrapper}>
									<Pressable
										onPress={() => {
											onPressHandler?.(!!minimized)
										}}
										style={[styles.handlerIcon, minimized ? styles.rotate180 : styles.rotate0]}>
										<View style={styles.handlerLeft} />
										<View style={styles.handlerRight} />
									</Pressable>
								</View>
							)}
							{!minimizable && <View style={!title ? styles.h16 : styles.h12} />}
							{renderTitle(closeBottomSheet, title, hasCloseButton)}
							<ScrollView
								// Slider는 overflow:"scroll"로 감싸질때 정확한 높이 측정이  가능 혹은 ScrollView로 감싸야 함
								scrollEnabled={false}
								contentContainerStyle={[styles.flex1, { justifyContent, alignItems }]}>
								{children}
							</ScrollView>
						</View>
					</View>
				</Provider>
			</Animated.View>
			{fixedBottom && (
				<Animated.View
					onLayout={(e) => {
						setBottomH(Math.round(e.nativeEvent.layout.height))
					}}
					style={[
						styles.fixedBottomWrapper,
						{
							transform: [{ translateY: bottomPositon }],
						},
					]}>
					{fixedBottom}
				</Animated.View>
			)}
		</>
	)
}

const animate = (
	value: Animated.Value,
	to: Animated.TimingAnimationConfig["toValue"],
	option?: { useNativeDriver: boolean }
) => {
	return Animated.timing(value, {
		toValue: to,
		duration: ANIMATION_DURATION,
		easing: easeInOutCubic,
		useNativeDriver: true,
		...option,
	})
}

const renderTitle = (
	closeBottomSheet: (from: OnCloseFrom) => void,
	title: BottomSheetViewProps["title"],
	hasCloseButton?: boolean
) => {
	if ((title as JSX.Element).type === Title) {
		return title
	}
	return (
		<Title
			size="18"
			title={title as TextType}
			mt={8}
			mr={20}
			mb={8}
			ml={20}
			right={
				hasCloseButton ? (
					<Icon
						width={20}
						height={20}
						shape="Delete"
						color={Color.gray50}
						onPress={() => {
							closeBottomSheet("closebutton")
						}}
					/>
				) : undefined
			}
		/>
	)
}

const styles = StyleSheet.create({
	root: {
		position: "absolute",
		overflow: "hidden",
		zIndex: 10,
		width: "100%",
		height: "100%",
		backgroundColor: Color.white,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},

	flex1: { flexGrow: 1, flexShrink: 1, flexBasis: "auto" },
	handlerWrapper: {
		borderRadius: 5,
		height: 16.5,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	handlerIcon: {
		width: 23.2,
		height: 9.6,
		alignItems: "center",
		flexDirection: "row",
	},
	handlerLeft: {
		backgroundColor: "#D9D9D9",
		transform: [{ rotate: "-150deg" }],
		width: 14,
		height: 3,
		borderRadius: 6,
	},
	handlerRight: {
		backgroundColor: "#D9D9D9",
		transform: [{ rotate: "-30deg" }],
		left: -3,
		width: 14,
		height: 3,
		borderRadius: 6,
	},
	rotate0: {
		transform: [{ rotate: "0deg" }],
	},
	rotate180: {
		transform: [{ rotate: "180deg" }],
	},
	empty20: { height: 20, width: "100%" },
	fixedBottomWrapper: {
		position: "absolute",
		left: 0,
		right: 0,
		zIndex: 11,
	},
	h12: { height: 12 },
	h16: { height: 16 },
})
