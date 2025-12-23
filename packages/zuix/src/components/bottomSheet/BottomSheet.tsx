import React, { useState, useEffect, useRef, useMemo, useCallback, FC } from "react"
import {
	View,
	StyleSheet,
	Modal,
	Animated,
	Pressable as RNPressable,
	Dimensions,
	PanResponder,
	ScrollView,
	ScrollViewProps,
	Platform,
	ModalProps,
} from "react-native"
import { isIphoneWithNotch, statusBarHeight } from "../../utils/style"
import { Color } from "../../types"
import { Provider } from "../../components/Provider"
import { Icon } from "../../components/icon"
import { KeyboardPaddingView } from "../KeyboardPaddingView"
import { Title } from "../../components/Title"
import { TextType } from "../../components/Text"

export interface BottomSheetProps extends ModalProps {
	visible: boolean
	/** @default false */
	draggable?: boolean
	onClose?: (from: "background" | "closebutton" | "state" | "drag" | "requestClose") => void
	/** 'auto' or number or percentage */
	maxHeight?: number | "auto" | `${number}%`
	/**
	 * 'auto' or number or percentage
	 * @default auto
	 * */
	initialHeight?: number | "auto" | `${number}%`
	title?: string | React.ReactElement<typeof Title>
	children?: React.ReactNode
	hasCloseButton?: boolean
	/** 'BottomCTA' component only */
	bottomButton?: React.ReactElement
	justifyContent?: "flex-start" | "center" | "flex-end"
	alignItems?: "flex-start" | "center" | "flex-end"
	/** @default false
	 * @description
	 * RN Modal 대신 웹 모달을 사용할 경우 true로 설정
	 * 웹모달은 실제로는 모달이 아니라 뷰로 이루어져있음
	 * react-native-keyboard-controller를 사용할때 react-native-is-edge-to-edge를 통해 전체화면을 사용하게 되는데
	 * 안드로이드 10 이하에서는 안드로이드 하단 네비게이션바와 모달이 겹치는 이슈가 발생함. 이를 피하기 위해 강제로 RNModal대신 WebModal(정확히는 View)를 사용하기 위한 props
	 * ref: https://github.com/zoontek/react-native-edge-to-edge/issues/25
	 *
	 * note: 추후 직방앱의 react native 버전이 0.77 이상으로 올라가서 navigationBarTranslucent 속성을 설정할 수 있게되면 RNModal을 사용하고도 이 속성없이 동작 할 수도 있음
	 * ref: https://reactnative.dev/docs/0.77/modal#navigationbartranslucent
	 * */
	noModal?: boolean
	/** @default grayOpacity60 */
	overlayColorType?: "grayOpacity60" | "transparent"
}
type OnCloseFrom = Parameters<NonNullable<BottomSheetProps["onClose"]>>[0]

const REQUIRE_MOVING_VALUE = 12
const IPHONE_BOTTOM_NOTCH = 34
const ANIMATION_DURATION = 300
const DRAGGABLE_INITIAL_MAX_HEIGHT = 450

const windowHeight = Dimensions.get("window").height

export const BottomSheet: FC<BottomSheetProps> & {
	ScrollView: React.ForwardRefExoticComponent<ScrollViewProps & React.RefAttributes<ScrollView | undefined>>
} = ({
	visible,
	draggable = false,
	onClose,
	maxHeight,
	initialHeight = "auto",
	title,
	children,
	hasCloseButton,
	bottomButton,
	justifyContent,
	alignItems,
	overlayColorType = "grayOpacity60",
	...props
}) => {
	const BottomSheetModal = Platform.OS === "web" || props.noModal ? WebModal : Modal

	//* use for animating before modal inivisible
	const [_visible, _setVisible] = useState(false)
	const [isMaxTop, setMaxTop] = useState(false)
	const [layoutInit, setLayoutInit] = useState(false)
	const [bottomH, setBottomH] = useState<number>(0)
	const [rootH, setRootH] = useState<number>(windowHeight)
	const onCloseFrom = useRef<OnCloseFrom>("state")
	const cachedSheetH = useRef<number | undefined>(undefined)
	const sheetY = useRef(new Animated.Value(rootH)).current
	const sheetH = useRef(new Animated.Value(0)).current
	const layoutElement = useRef<View>(null)

	//? to prevent animating duplicate
	const animating = useRef(false)
	const [heightAnimating, setHeightAnimating] = useState(false)

	const startAnimation = useCallback((ani: Animated.CompositeAnimation | Animated.CompositeAnimation[]) => {
		const runFn = Array.isArray(ani) ? Animated.parallel(ani) : ani
		animating.current = true
		const originStart = runFn.start.bind(runFn)
		runFn.start = (callback) =>
			originStart((result) => {
				animating.current = false
				return callback?.(result)
			})
		return runFn
	}, [])

	const getNumberFromStyleValue = useCallback((value: number | "auto" | `${number}%`, defaultValue: number) => {
		if (typeof value === "string" && /%$/.test(value)) {
			return Math.round(rootH * Number(value.replace("%", ""))) / 100
		} else if (value !== "auto" && isNaN(Number(value))) {
			console.error(value, 'value only accept "auto" or "n%" or number type')
			return defaultValue
		} else {
			return Number(value)
		}
	}, [])

	const maxH = useMemo(() => {
		const max = rootH - statusBarHeight
		if (!maxHeight || maxHeight === "auto") return max
		return Math.min(getNumberFromStyleValue(maxHeight, max), max)
	}, [maxHeight, rootH])

	const bottomSheetH = useMemo(() => {
		if (isMaxTop) return maxH
		if (initialHeight === "auto") return initialHeight
		return Math.min(getNumberFromStyleValue(initialHeight, maxH), maxH)
	}, [initialHeight, isMaxTop, layoutInit])

	const backToInitial = useCallback(() => {
		let height = 0
		if (initialHeight === "auto") {
			height = cachedSheetH.current ?? DRAGGABLE_INITIAL_MAX_HEIGHT
		} else {
			height = Math.min(getNumberFromStyleValue(initialHeight, height), maxH)
		}

		setHeightAnimating(true)
		startAnimation(animate(sheetH, Math.round(height), { useNativeDriver: false })).start(({ finished }) => {
			if (finished && isMaxTop) {
				setMaxTop(false)
				setHeightAnimating(false)
			}
		})
	}, [bottomButton, initialHeight, isMaxTop])

	const moveToInitial = () => {
		layoutElement.current?.measure((x, y, w, height) => {
			sheetY.setValue(Math.round(height))
			startAnimation(animate(sheetY, 0)).start(() => null)
		})
	}

	const moveToTop = useCallback(() => {
		layoutElement.current?.measure((x, y, w, h) => {
			const height = Math.round(h)
			cachedSheetH.current = height
			setMaxTop(true)
			sheetH.setValue(height)
			setHeightAnimating(true)
			startAnimation(animate(sheetH, maxH, { useNativeDriver: false })).start(() => {
				sheetH.setValue(maxH)
				setHeightAnimating(false)
			})
		})
	}, [maxH])

	const closeBottomSheet = useCallback(
		(from: OnCloseFrom) => {
			layoutElement.current?.measure((x, y, w, h) => {
				const height = Math.round(h)
				onCloseFrom.current = from
				startAnimation([animate(sheetY, height)]).start(() => {
					sheetY.setValue(height)
					_setVisible(false)
					if (!visible && _visible) {
						onClose?.(onCloseFrom.current)
					}
				})
			})
		},
		[visible, _visible, onClose]
	)

	const panResponders = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => !!draggable,
				onMoveShouldSetPanResponder: () => false,
				onPanResponderMove: (_, gestureState) => {
					if (animating.current === true) return
					//* move to top
					if (gestureState.dy < 0 && !isMaxTop && Math.abs(gestureState.dy) > REQUIRE_MOVING_VALUE) {
						return moveToTop()
					}
					//* move from top
					if (gestureState.dy > REQUIRE_MOVING_VALUE && isMaxTop) {
						return backToInitial()
					}
					if (gestureState.dy > REQUIRE_MOVING_VALUE && !isMaxTop) {
						return closeBottomSheet("drag")
					}
				},
				onPanResponderRelease: (_, gestureState) => {
					animating.current = false
					if (gestureState.dy > 0 && gestureState.vy > 1.5) closeBottomSheet("drag")
				},
			}),
		[moveToTop, backToInitial, closeBottomSheet, isMaxTop]
	)

	useEffect(() => {
		if (visible) {
			_setVisible(true)
		} else if (!visible && _visible) {
			closeBottomSheet("state")
		}
	}, [visible])

	useEffect(() => {
		if (layoutInit) moveToInitial()
	}, [layoutInit])

	useEffect(() => {
		if (!_visible && visible) {
			onClose?.(onCloseFrom.current)
		}
		if (!_visible) {
			setLayoutInit(false)
			setMaxTop(false)
		}
	}, [_visible])
	return (
		<BottomSheetModal
			animationType={"fade"}
			transparent
			statusBarTranslucent
			{...props}
			visible={_visible}
			/**
			 * ? to handle back press
			 * @doc https://reactnative.dev/docs/modal#onrequestclose
			 */
			onRequestClose={(e) => {
				if (props?.onRequestClose) {
					props.onRequestClose(e)
					return
				}
				closeBottomSheet("requestClose")
			}}>
			<Provider>
				<View
					style={styles.root}
					onLayout={(e) => {
						setRootH(Math.round(e.nativeEvent.layout.height))
						setLayoutInit(true)
					}}>
					<>
						{_visible && (
							<>
								<RNPressable
									style={[
										styles.overlay,
										{
											backgroundColor:
												overlayColorType === "grayOpacity60"
													? Color.grayOpacity60
													: "transparent",
										},
									]}
									onPress={() => {
										closeBottomSheet("background")
									}}
								/>
								<Animated.View
									style={[
										{
											opacity: layoutInit ? 1 : 0,
											marginTop: statusBarHeight,
										},
										{ maxHeight: maxH },
										{ transform: [{ translateY: sheetY }] },
									]}
									{...panResponders.panHandlers}>
									<KeyboardPaddingView
										keyboardVerticalOffset={
											bottomH + (isIphoneWithNotch() ? IPHONE_BOTTOM_NOTCH : 0)
										}
										style={[styles.bottomSheetContainer]}>
										<Animated.View
											style={[
												styles.flexAuto,
												!isMaxTop && draggable
													? { maxHeight: Math.min(DRAGGABLE_INITIAL_MAX_HEIGHT, maxH) }
													: { maxHeight: maxH },
												{ height: heightAnimating ? sheetH : bottomSheetH },
											]}
											ref={layoutElement}
											// android에서 onLayout이 있어야만 measure가 제대로 동작함
											onLayout={() => null}>
											<View style={styles.dragHandleBar} onStartShouldSetResponder={() => true}>
												{draggable && <View style={styles.drageHandleIcon} />}
											</View>
											{renderTitle(closeBottomSheet, title, hasCloseButton)}
											<View
												style={[
													bottomSheetH !== "auto" && styles.flex1,
													isIphoneWithNotch() && styles.iphoneBottom,
													{ justifyContent, alignItems, flexShrink: 1 },
												]}>
												{children}
												<View
													style={bottomButton ? styles.inVisibleBottomButton : undefined}
													onLayout={(e) => {
														setBottomH(e.nativeEvent.layout.height)
													}}>
													{bottomButton}
												</View>
											</View>
										</Animated.View>
										{bottomButton && (
											<View
												style={[
													styles.bottomWrapper,
													isIphoneWithNotch() && styles.iphoneBottom,
												]}>
												{bottomButton}
											</View>
										)}
									</KeyboardPaddingView>
								</Animated.View>
							</>
						)}
					</>
				</View>
			</Provider>
		</BottomSheetModal>
	)
}

const animate = (
	value: Animated.Value,
	to: Animated.TimingAnimationConfig["toValue"],
	option?: { useNativeDriver: boolean }
) => {
	//! useNativeDriver: true로 하면 모달이 닫힐때 창의 위치가 틀어지는 현상이 있어 false로 설정함
	return Animated.timing(value, { toValue: to, duration: ANIMATION_DURATION, useNativeDriver: true, ...option })
}

/**
 * @history zigbang-www 의 Modal 사용이 지도 우측 영역이 아닌 전체화면에 띄어져 View 를 사용함
 */
const WebModal: React.FC<{ visible: boolean; children: React.ReactNode }> = ({ visible, children }) => {
	const [_visible, _setVisible] = useState(visible)

	const fade = useRef(new Animated.Value(0)).current

	useEffect(() => {
		if (visible) {
			animate(fade, 1).start(() => _setVisible(true))
		} else {
			animate(fade, 0).start(() => _setVisible(false))
		}
	}, [visible])
	return _visible ? (
		<Animated.View
			style={[
				styles.webModal,
				{
					opacity: fade,
					zIndex: 10,
				},
			]}>
			{children}
		</Animated.View>
	) : null
}

BottomSheet.ScrollView = React.forwardRef(({ children, ...props }, ref) => {
	return (
		<ScrollView
			bounces={false}
			scrollEnabled
			{...props}
			ref={ref as React.ForwardedRef<ScrollView>}
			contentContainerStyle={[styles.grow1shrink0, props.contentContainerStyle]}>
			<View
				onResponderTerminationRequest={() => false}
				onStartShouldSetResponder={() => true}
				style={styles.flex1auto}>
				{children}
			</View>
		</ScrollView>
	)
})

const renderTitle = (
	closeBottomSheet: (from: OnCloseFrom) => void,
	title: BottomSheetProps["title"],
	hasCloseButton?: boolean
) => {
	if ((title as JSX.Element)?.type === Title) {
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
		flex: 1,
		justifyContent: "flex-end",
	},
	overlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
		flexShrink: 1,
	},
	bottomSheetContainer: {
		backgroundColor: Color.white,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		overflow: "hidden",
		flexShrink: 1,
	},
	flex1: { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
	flexAuto: { flexGrow: 0, flexShrink: 1, flexBasis: "auto" },
	grow1shrink0: { flexGrow: 1, flexShrink: 0 },
	dragHandleBar: {
		height: 8,
		paddingTop: 4,
		alignItems: "center",
	},
	drageHandleIcon: {
		width: 34,
		height: 4,
		borderRadius: 5,
		backgroundColor: Color.gray80,
	},
	bottomWrapper: { width: "100%", flexShrink: 1, position: "absolute", bottom: 0, backgroundColor: Color.white },
	iphoneBottom: { paddingBottom: IPHONE_BOTTOM_NOTCH },
	empty20: { height: 20, width: "100%" },
	inVisibleBottomButton: {
		width: 0,
		opacity: 0,
		flexShrink: 0,
	},
	webModal: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		overflow: "hidden",
	},
	flex1auto: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: "auto",
	},
})
