import React, { useState, useCallback, useEffect, useRef, useMemo } from "react"
import {
	StyleSheet,
	View,
	Animated,
	PanResponder,
	ViewStyle,
	LayoutChangeEvent,
	StyleProp,
	Platform,
	ViewProps,
} from "react-native"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"

import { Color, Margin } from "../../types"
import { TextType } from "../../"
import { renderTextByProps } from "../../utils/renderer"
import { revertMargin } from "../../utils/style"
import { notUndefinedOrNull } from "../../utils/util"
import { Icon } from "../../components/icon"

const TOOLTIP_AREA_HEIGHT = 32

export interface SliderProps<T extends number | [number, number]> extends Margin, ViewProps {
	/** @default "28" */
	size?: "20" | "28"
	tooltip?: TextType
	value: T
	/** @default 0 */
	minimumValue?: number
	/** @default 100 */
	maximumValue?: number
	onValueChange?: (arg: T) => void
	onSlidingStart?: (arg: T) => void
	onSlidingComplete?: (arg: T) => void
	style?: StyleProp<ViewStyle>
	/** @default 1 */
	step?: number
	labels?: TextType[]
	snap?: boolean
	//Reverses the direction of the slider.
	inverted?: boolean
	/** @default false */
	isRangeSelect?: boolean
	width?: number
	/** @default Color.gray30 */
	barBackgroundColor?: string
	/** @default true */
	enableHaptic?: boolean
}

/**
 * @figma https://www.figma.com/file/4ZDxigMgcTwzJmNlrmY0iq/ZUIX-2.0?node-id=7307%3A37931
 */
//TODO 웹 확대시에 이동량이 더 많은 문제
export const Slider = <T extends number | [number, number]>({
	size = "28",
	tooltip,
	minimumValue = 0,
	maximumValue = 100,
	style,
	value,
	onValueChange,
	onSlidingStart,
	onSlidingComplete,
	step = 1,
	labels,
	snap,
	inverted,
	isRangeSelect = false,
	width,
	barBackgroundColor = Color.gray30,
	enableHaptic = true,
	...props
}: SliderProps<T>) => {
	const multi = Array.isArray(value)
	const _width = Math.round(width ? (multi ? width - 40 : width) : 0)

	const valuePositions = useRef<{ [key: string]: number }>({})

	const [rightDisabled, setRightDisabled] = useState(false)

	//? value => x
	const getOffsetX = useCallback(
		(_value: number) => {
			const _x = Number(
				(
					(width ? _width - Number(size) : maxBarWidth.current) *
					((_value - minimumValue) / (maximumValue - minimumValue))
				).toFixed(4)
			)
			if (Number.isNaN(_x)) {
				return 0
			}
			return _x
		},
		[maximumValue, minimumValue, _width]
	)

	const maxBarWidth = useRef(0)
	const currentLeftValue = useRef(multi ? value[0] : inverted ? (value as number) : 0)
	const currenRightValue = useRef(multi ? value[1] : inverted ? 0 : (value as number))
	//? 드래그 시작 전 왼쪽 볼 위치
	const currentLeftX = useRef(getOffsetX(currentLeftValue.current))
	//? 드래그 시작 전 우측 볼 위치
	const currentRightX = useRef(getOffsetX(currenRightValue.current))

	const leftBall = useRef(new Animated.Value(currentLeftX.current)).current
	const rightBall = useRef(new Animated.Value(currentRightX.current)).current

	const barWidth = useRef(new Animated.Value(currentRightX.current - currentLeftX.current)).current

	const dragging = useRef(false)

	const tooltipX = useRef(new Animated.Value(0)).current
	const tooltipAnchorX = useRef(new Animated.Value(0)).current
	const tooltipHalfWidth = useRef(0)

	//? 바의 왼쪽 끝 과 오른쪽 끝
	const minimumX = useRef(0)
	const maximumX = useRef(_width - Number(size))

	//? 1 step의 x 값
	const oneStep = useRef(Array.isArray(value) && isRangeSelect ? getOffsetX(minimumValue + step) : 0)
	oneStep.current = Array.isArray(value) && isRangeSelect ? getOffsetX(minimumValue + step) : 0

	//? panResponder의 재할당 없이 callback을 전달하기 위함
	const _onSlidingStart = useRef(onSlidingStart)
	const _onValueChange = useRef(onValueChange)
	const _onSlidingComplete = useRef(onSlidingComplete)
	const animationFrameRef = useRef<number | null>(null)

	_onSlidingStart.current = onSlidingStart
	_onValueChange.current = onValueChange
	_onSlidingComplete.current = onSlidingComplete

	const _triggerHaptic = () => {
		if (enableHaptic && Platform.OS !== "web") {
			ReactNativeHapticFeedback.trigger(Platform.OS === "ios" ? "impactLight" : "soft", {
				enableVibrateFallback: true,
			})
		}
	}

	//? x => value
	const getValueOfOffsetX = useCallback(
		(x: number) => {
			return findPreviousKey(valuePositions.current, x)
		},
		[maximumValue, minimumValue, _width]
	)

	//? x => value(step)
	const getStepValue = useCallback(
		(x: number) => {
			const _value = getValueOfOffsetX(x)
			return _value - ((_value - minimumValue) % step)
		},
		[maximumValue, minimumValue, step, getValueOfOffsetX]
	)

	const moveToolTip = useCallback(
		(left: number, right: number) => {
			const _size = Number(size)
			//? widthBar의 중앙 X
			const barCenterX = Math.round((left + right + _size) / 2)
			//? 툴팁 화살표의 위치
			const _anchorX = barCenterX - tooltipHalfWidth.current
			//? 툴팁이 우측끝에 도달하는 값
			const maximumTooltipX = maximumX.current + _size - tooltipHalfWidth.current * 2
			if (_anchorX <= 0) {
				tooltipX.setValue(0)
				tooltipAnchorX.setValue(barCenterX)
				//? 툴팁이 우측 끝에 닿으면
			} else if (maximumTooltipX <= _anchorX) {
				tooltipX.setValue(maximumTooltipX)
				//? 툴팁 중앙을 넘어가면 앵커의 위치가 두 공 사이의 x에 위치
				if (_anchorX >= maximumX.current - tooltipHalfWidth.current - _size) {
					tooltipAnchorX.setValue(
						tooltipHalfWidth.current +
							(tooltipHalfWidth.current - _size / 2 - (maximumX.current - right)) -
							(right - left) / 2 // 공의 사이 값
					)
				}
			} else {
				tooltipX.setValue(_anchorX)
				tooltipAnchorX.setValue(tooltipHalfWidth.current)
			}
		},
		[size]
	)

	const moveLeftBall = (x: number) => {
		const _x = Math.max(x, minimumX.current)
		leftBall.setValue(_x)
		barWidth.setValue(currentRightX.current - x)
		moveToolTip(x, currentRightX.current)
	}

	const moveRightBall = (x: number) => {
		const _x = Math.min(x, maximumX.current)
		rightBall.setValue(_x)
		barWidth.setValue(x - currentLeftX.current)
		moveToolTip(currentLeftX.current, x)
	}

	const moveToValue = () => {
		if (typeof value === "number") {
			const x = getOffsetX(value)
			barWidth.setValue(x)
			if (inverted) {
				if (currentLeftValue.current === value) {
					return
				}
				moveLeftBall(x)
				currentLeftX.current = x
				currentLeftValue.current = value
			} else {
				if (currenRightValue.current === value) {
					return
				}
				moveRightBall(x)
				currentRightX.current = x
				currenRightValue.current = value
			}
		} else if (Array.isArray(value)) {
			if (currentLeftValue.current !== value[0]) {
				const leftX = getOffsetX(value[0])
				currentLeftX.current = leftX
				moveLeftBall(leftX)
				currentLeftValue.current = value[0]
			}
			if (currenRightValue.current !== value[1]) {
				const rightX = getOffsetX(value[1])
				currentRightX.current = rightX
				moveRightBall(rightX)
				currenRightValue.current = value[1]
			}
		}
	}

	const leftPanResponders = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onMoveShouldSetPanResponder: () => true,
				onPanResponderStart: () => {
					dragging.current = true
					_onSlidingStart.current?.([
						getStepValue(currentLeftX.current),
						getStepValue(currentRightX.current),
					] as T)
					_triggerHaptic()
				},
				onPanResponderMove: (_, gestureState) => {
					if (animationFrameRef.current !== null) {
						cancelAnimationFrame(animationFrameRef.current)
					}
					animationFrameRef.current = requestAnimationFrame(() => {
						let movedX = currentLeftX.current + gestureState.dx
						if (minimumX.current > movedX) {
							movedX = minimumX.current
						} else if (currentRightX.current - oneStep.current < movedX) {
							//? 오른쪽 볼 보다 우측으로 가면
							movedX = currentRightX.current - oneStep.current
						}
						moveLeftBall(movedX)
						const _value = getStepValue(movedX)
						if (currentLeftValue.current !== _value) {
							_triggerHaptic()
						}
						if (inverted) {
							_onValueChange.current?.(_value as T)
						} else {
							_onValueChange.current?.([_value, currenRightValue.current] as T)
						}
						currentLeftValue.current = _value
						animationFrameRef.current = null
					})
				},
				onPanResponderEnd: (_, gestureState) => {
					const movedX = currentLeftX.current + gestureState.dx

					let leftX
					if (minimumX.current > movedX) {
						currentLeftX.current = minimumX.current
						leftX = minimumX.current
					} else if (currentRightX.current - oneStep.current < movedX) {
						currentLeftX.current = currentRightX.current - oneStep.current
						leftX = currentRightX.current - oneStep.current
					} else {
						currentLeftX.current = movedX
						leftX = movedX
					}

					if (snap) {
						const _value = getValueOfOffsetX(leftX)
						let leftStep = getStepValue(leftX)
						if (leftStep <= 0) {
							leftStep -= step
						}
						const rightStep = leftStep + step
						//? 좌측 step과의 거리
						const leftGap = _value - leftStep
						const rightGap = rightStep - _value
						if (rightGap < leftGap) {
							//?오른쪽으로 snap
							const rightStepX = getOffsetX(rightStep)
							moveLeftBall(rightStepX)
							currentLeftX.current = rightStepX
							leftX = rightStepX
						} else {
							//?왼쪽으로 snap
							const leftStepX = getOffsetX(leftStep)
							moveLeftBall(leftStepX)
							currentLeftX.current = leftStepX
							leftX = leftStepX
						}
					}
					//?우측 끝에 너무 붙어있으면
					if (maximumX.current - leftX < 5) {
						setRightDisabled(true)
					} else {
						setRightDisabled(false)
					}

					if (inverted) {
						_onSlidingComplete.current?.(getStepValue(leftX) as T)
					} else {
						_onSlidingComplete.current?.([getStepValue(leftX), getStepValue(currentRightX.current)] as T)
					}
					dragging.current = false
				},
			}),
		[getOffsetX, getValueOfOffsetX, getStepValue, step, maximumValue, minimumValue]
	)

	const rightPanResponders = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onMoveShouldSetPanResponder: () => true,
				onPanResponderStart: () => {
					dragging.current = true
					_triggerHaptic()

					if (multi) {
						_onSlidingStart.current?.([
							getStepValue(currentLeftX.current),
							getStepValue(currentRightX.current),
						] as T)
					} else {
						_onSlidingStart.current?.(getStepValue(currentRightX.current) as T)
					}
				},
				onPanResponderMove: (_, gestureState) => {
					if (animationFrameRef.current !== null) {
						cancelAnimationFrame(animationFrameRef.current)
					}
					animationFrameRef.current = requestAnimationFrame(() => {
						let movedX = currentRightX.current + gestureState.dx
						if (currentLeftX.current + oneStep.current > movedX) {
							//? 왼쪽 볼 보다 왼쪽으로 가면
							movedX = currentLeftX.current + oneStep.current
						} else if (maximumX.current < movedX) {
							movedX = maximumX.current
						}
						moveRightBall(movedX)
						const _value = getStepValue(movedX)
						if (currenRightValue.current !== _value) {
							_triggerHaptic()
						}
						if (multi) {
							_onValueChange.current?.([currentLeftValue.current, _value] as T)
						} else {
							_onValueChange.current?.(_value as T)
						}
						currenRightValue.current = _value

						animationFrameRef.current = null
					})
				},

				onPanResponderEnd: (_, gestureState) => {
					const movedX = currentRightX.current + gestureState.dx

					let rightX = movedX
					if (currentLeftX.current + oneStep.current > movedX) {
						currentRightX.current = currentLeftX.current + oneStep.current
						rightX = currentLeftX.current + oneStep.current
					} else if (maximumX.current < movedX) {
						currentRightX.current = maximumX.current
						rightX = maximumX.current
					} else if (movedX < 0) {
						currentRightX.current = 0
					} else {
						currentRightX.current = movedX
					}
					if (snap) {
						const _value = getValueOfOffsetX(rightX)
						let leftStep = getStepValue(rightX)
						if (leftStep <= 0) {
							leftStep -= step
						}
						const rightStep = leftStep + step
						//? 좌측 step과의 거리
						const leftGap = _value - leftStep
						const rightGap = rightStep - _value
						if (rightGap < leftGap) {
							//? 오른쪽으로 붙음
							const rightStepX = getOffsetX(rightStep)
							moveRightBall(rightStepX)
							currentRightX.current = rightStepX
							rightX = rightStepX
						} else {
							//? 왼쪽으로 붙음
							const leftStepX = getOffsetX(leftStep)
							moveRightBall(leftStepX)
							currentRightX.current = leftStepX
							rightX = leftStepX
						}
					}

					if (multi) {
						_onSlidingComplete.current?.([getStepValue(currentLeftX.current), getStepValue(rightX)] as T)
					} else {
						_onSlidingComplete.current?.(getStepValue(rightX) as T)
					}
					dragging.current = false
				},
			}),
		[getOffsetX, getValueOfOffsetX, getStepValue, step, maximumValue, minimumValue]
	)

	const initPosition = (e: LayoutChangeEvent) => {
		maxBarWidth.current = Math.round(e.nativeEvent.layout.width)

		minimumX.current = e.nativeEvent.layout.x
		maximumX.current = width
			? _width - Number(size)
			: e.nativeEvent.layout.x + Math.round(e.nativeEvent.layout.width)
		if (width) {
			currentLeftX.current = getOffsetX(multi ? value[0] : inverted ? (value as number) : 0)
			currentRightX.current = getOffsetX(multi ? value[1] : inverted ? 0 : (value as number))
		} else {
			currentLeftX.current = e.nativeEvent.layout.x
			currentRightX.current = e.nativeEvent.layout.x + Math.round(e.nativeEvent.layout.width) + Number(size)
		}
		barWidth.setValue(currentRightX.current - currentLeftX.current)

		if (currentLeftX.current < minimumX.current) {
			currentLeftX.current = minimumX.current
		}

		if (currentRightX.current > maximumX.current) {
			currentRightX.current = maximumX.current
		}

		if (notUndefinedOrNull(value)) {
			if (typeof value === "number") {
				const x = getOffsetX(value)
				barWidth.setValue(x)
				if (inverted) {
					moveLeftBall(x)
					currentLeftX.current = x
					currentLeftValue.current = value
				} else {
					moveRightBall(x)
					currentRightX.current = x
					currenRightValue.current = value
				}
			} else if (Array.isArray(value)) {
				const leftX = getOffsetX(value[0])
				currentLeftX.current = leftX
				moveLeftBall(leftX)
				currentLeftValue.current = value[0]

				const rightX = getOffsetX(value[1])
				currentRightX.current = rightX
				moveRightBall(rightX)
				currenRightValue.current = value[1]
			}
		} else {
			leftBall.setValue(currentLeftX.current)
			rightBall.setValue(currentRightX.current)
		}

		storeValuePositions()
	}

	const initTooltipPosition = () => {
		moveToolTip(currentLeftX.current, currentRightX.current)
	}

	const storeValuePositions = () => {
		const perValue = maximumX.current / (maximumValue - minimumValue)
		let sum = 0
		for (let i = minimumValue; i <= maximumValue; i++) {
			valuePositions.current[i] = Number(sum.toFixed(4))
			sum += perValue
		}
	}

	useEffect(() => {
		valuePositions.current = {}
		storeValuePositions()
	}, [minimumValue, maximumValue, storeValuePositions])

	useEffect(
		() => {
			if (maxBarWidth.current && notUndefinedOrNull(value)) {
				moveToValue()
				_onValueChange.current?.(value)
			}
		},
		typeof value === "number" ? [value] : [...(value as number[])]
	)

	return (
		<View
			style={[
				styles.root,
				revertMargin(multi ? { mt: props.mt, mr: 20, mb: props.mb, ml: 20 } : props),
				{
					width: width ? (multi ? width - 40 : width) : undefined,
					maxWidth: width ? (multi ? width - 40 : width) : undefined,
				},
				style,
			]}
			{...props}>
			{labels && (
				<View
					style={[
						styles.labelBarRoot,
						size == "20" ? styles.px10 : styles.px14,
						{
							top: Number(size) - 5 + (tooltip ? TOOLTIP_AREA_HEIGHT : 0),
						},
					]}>
					{labels.map((_, index) => (
						<View key={index} style={styles.labelBarItem}>
							<View style={styles.labelBar} />
						</View>
					))}
				</View>
			)}
			<View style={[styles.root, styles[`marginHorizontal${size}`], tooltip ? styles.mt32 : undefined]}>
				<View style={[styles.bar, styles.userSelectNone]} onLayout={initPosition}>
					<Animated.View
						style={[
							styles.centerBar,
							{ backgroundColor: barBackgroundColor, width: barWidth, left: leftBall },
						]}></Animated.View>
				</View>
				{(multi || inverted) && (
					<Animated.View
						style={[
							styles.ball,
							styles[`leftSize${size}`],
							styles.ballShadow,
							styles.userSelectNone,
							{ left: leftBall },
						]}
						{...leftPanResponders.panHandlers}
					/>
				)}
				{!inverted && (
					<Animated.View
						pointerEvents={rightDisabled ? "none" : undefined}
						style={[
							styles.ball,
							styles[`rightSize${size}`],
							styles.ballShadow,
							styles.userSelectNone,
							{ left: rightBall },
						]}
						{...rightPanResponders.panHandlers}
					/>
				)}
			</View>
			{!!tooltip && (
				<Tooltip
					tooltipX={tooltipX}
					tooltipAnchorX={tooltipAnchorX}
					tooltipHalfWidth={tooltipHalfWidth}
					tooltip={tooltip}
					initTooltipPosition={initTooltipPosition}
					dragging={dragging}
				/>
			)}
			{labels && <Labels labels={labels} size={size} />}
		</View>
	)
}

const Tooltip: React.FC<{
	tooltipX: Animated.Value
	tooltipAnchorX: Animated.Value
	tooltipHalfWidth: React.MutableRefObject<number>
	tooltip: TextType
	initTooltipPosition: () => void
	dragging: React.MutableRefObject<boolean>
}> = React.memo(({ tooltipX, tooltipAnchorX, tooltipHalfWidth, tooltip, initTooltipPosition, dragging }) => {
	const [inited, setInted] = useState(false)

	return (
		<Animated.View
			style={[
				styles.tooltipRoot,
				{
					left: tooltipX,
					opacity: inited ? 1 : 0,
				},
			]}>
			<View
				style={styles.tooltipBox}
				onLayout={(e) => {
					if (Math.abs(tooltipHalfWidth.current - Math.round(e.nativeEvent.layout.width) / 2) > 1) {
						tooltipHalfWidth.current = Math.round(e.nativeEvent.layout.width) / 2
					}
					setInted(true)
					//? 드래그 중에는 툴팁이 width변경으로 인해 업데이트 되지 않는다
					if (!dragging.current) {
						initTooltipPosition()
					}
				}}>
				<Animated.View style={[styles.tooltipIcon, { left: tooltipAnchorX }]}>
					<Icon shape={"SliderTooltipTriangle"} width={8} height={5} style={{ marginLeft: -5 }} />
				</Animated.View>
				{renderTextByProps(
					{
						size: "13",
						weight: "medium",
						color: Color.gray30,
						allowFontScaling: false,
						numberOfLines: 1,
					},
					tooltip
				)}
			</View>
		</Animated.View>
	)
})

const Labels = React.memo(
	({ labels, size }: { labels: TextType[]; size: "20" | "28" }) => {
		const [lastWidth, setLastWidth] = useState<number>(0)
		return (
			<View style={[styles.labelsRoot, size === "20" ? styles.px10 : styles.px14]}>
				{labels.map((label, index) => {
					const isFirst = index === 0
					const isLast = index === labels.length - 1
					const wrapperAlgin = isFirst
						? styles.alginStart
						: isLast
						? styles.alignEnd
						: Platform.OS === "web"
						? undefined
						: styles.alginCenter
					return (
						<View
							key={index}
							style={[styles.labelItem, (isLast || isFirst) && styles.flex05, isLast && styles.alignEnd]}
							onLayout={
								isLast
									? (e) => {
											setLastWidth(Math.round(e.nativeEvent.layout.width + Number(size) / 2))
									  }
									: undefined
							}>
							<View
								style={[
									styles.labelItemContainer,
									isFirst && styles.firstLabelMargin,
									isLast ? styles.justifyEnd : undefined,
									isLast ? styles.rightM14 : undefined,
									(isLast || isFirst) && lastWidth
										? {
												width: lastWidth,
										  }
										: undefined,
								]}>
								<View style={[styles.labelItemWrapper, wrapperAlgin]}>
									<View
										style={[
											styles.labelText,
											size === "20" ? styles.minWidth20 : undefined,
											!isLast && !isFirst ? styles.alginCenter : undefined,
										]}>
										{renderTextByProps(
											{
												size: "12",
												weight: "regular",
												textAlign: isLast ? "right" : isFirst ? "left" : "center",
												color: Color.gray30,
												allowFontScaling: false,
												numberOfLines: 2,
											},
											label
										)}
									</View>
								</View>
							</View>
						</View>
					)
				})}
			</View>
		)
	},
	(prev, next) => {
		return JSON.stringify(prev) === JSON.stringify(next)
	}
)

const findPreviousKey = (obj: { [key: string]: number }, targetValue: number) => {
	let previousKey = null
	for (const key in obj) {
		if (obj[key] === targetValue) {
			return Number(key)
		} else if (obj[key] > targetValue) {
			break
		}
		previousKey = key
	}

	return Number(previousKey)
}

const styles = StyleSheet.create({
	root: {
		flexGrow: 1,
		flexShrink: 0,
		flexBasis: "auto",
		justifyContent: "center",
	},
	leftSize20: {
		width: 20,
		height: 20,
		borderRadius: 10,
		marginLeft: -10,
	},
	leftSize28: {
		width: 28,
		height: 28,
		borderRadius: 14,
		marginLeft: -14,
	},
	rightSize20: {
		width: 20,
		height: 20,
		borderRadius: 10,
		marginLeft: -10,
	},
	rightSize28: {
		width: 28,
		height: 28,
		borderRadius: 14,
		marginLeft: -14,
	},
	marginHorizontal20: {
		height: 20,
		marginLeft: 10,
		marginRight: 10,
	},
	marginHorizontal28: {
		height: 28,
		marginLeft: 14,
		marginRight: 14,
	},
	ball: {
		position: "absolute",
		borderColor: Color.gray30,
		borderWidth: 1,
		backgroundColor: Color.white,
	},
	ballShadow:
		Platform.OS === "web"
			? {
					boxShadow: "0px 2px 2px rgba(26, 26, 26, 0.1)",
			  }
			: {
					shadowColor: Color.gray10,
					shadowOffset: {
						width: 0,
						height: 1,
					},
					shadowOpacity: 0.2,
					shadowRadius: 1.41,

					elevation: 2,
			  },
	bar: {
		flexDirection: "row",
		height: 4,
		maxHeight: 4,
		borderRadius: 2,
		overflow: "visible",
		backgroundColor: Color.gray95,
	},
	centerBar: { flexGrow: 0, backgroundColor: Color.gray30, borderRadius: 4 },
	userSelectNone: { userSelect: "none" } as ViewStyle,
	tooltipBox: {
		width: "auto",
		height: 26,
		maxHeight: 26,
		flexShrink: 0,
		flexBasis: "auto",
		justifyContent: "center",
		alignItems: "center",
		paddingRight: 12,
		paddingLeft: 12,
		borderWidth: 1,
		borderColor: Color.gray70,
		borderRadius: 4,
		backgroundColor: Color.white,
	},
	tooltipIcon: { position: "absolute", bottom: -5 },

	labelsRoot: {
		marginTop: 7,
		flexDirection: "row",
		overflow: "visible",
		width: "100%",
		justifyContent: "space-between",
	},
	labelBarItem: {
		alignItems: "center",
	},
	labelItem: {
		flex: 1,
		marginLeft: 2,
		marginRight: 2,
		overflow: "visible",
	},
	labelText: {
		flex: 1,
		minWidth: 28,
		alignItems: "center",
	},
	labelItemContainer: {
		flexDirection: "row",
	},
	labelItemWrapper: {
		width: "auto",
		flex: 1,
		alignItems: "center",
		minWidth: 28,
	},
	labelBar: {
		width: 1,
		height: 8,
		backgroundColor: Color.gray70,
		borderRadius: 6,
	},
	labelBarRoot: {
		position: "absolute",
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	alginStart: {
		alignItems: "flex-start",
	},
	alginCenter: {
		alignItems: "center",
	},
	alignEnd: {
		alignItems: "flex-end",
	},
	justifyEnd: {
		justifyContent: "flex-end",
	},
	mt32: { marginTop: TOOLTIP_AREA_HEIGHT },
	minWidth20: {
		minWidth: 20,
	},
	width20: {
		width: 20,
		maxWidth: 20,
	},
	flex05: {
		flex: 0.5,
	},
	px10: { paddingLeft: 10, paddingRight: 10 },
	px14: { paddingLeft: 14, paddingRight: 14 },
	firstLabelMargin: { left: -14 },
	tooltipRoot: { position: "absolute", top: 0 },
	rightM14: { right: -14 },
})
