import React, { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, UIManager, findNodeHandle, Platform, Dimensions } from "react-native"

import { Color } from "../../types"
import { TextProps } from "../../components/Text"
import { renderTextByProps } from "../../utils/renderer"
import { useTooltip } from "../../store/tooltip"
import { Pressable, StaticPressableProps } from "../../components/Pressable"
import { TooltipPositionType, TooltipProps } from "../../types/tooltip"

const MARGIN_TOP_TO_POINTER = 8
const MARGIN_HORIZONTAL_TO_POINTER = 20
const FIXED_TOOLTIP_WIDTH = 260
const FIXED_TOOLTIP_WIDTH_HALF = 160

const TITLE_PROPS: TextProps = { size: "14", weight: "bold", color: Color.gray10 }
const SUBTITLE_PROPS: TextProps = { size: "13", weight: "regular", color: Color.gray30 }
const TEXT_BUTTON_PROPS: TextProps = { size: "13", weight: "medium", color: Color.gray50, underline: true, mt: 4 }

export const Tooltip = <T,>({
	visible,
	title,
	subtitle,
	textButton,
	onClose,
	rootRef,
	target,
	position,
	onPress,
	usingInnerScrolllingView = true,
	nativeID,
	scrollOffsetY,
	style,
	...props
}: TooltipProps<T> & StaticPressableProps & { nativeID: string }) => {
	if (!visible) return null

	const [measure, setMeasure] = useState({})
	const { data: ref } = useTooltip(useCallback((v) => v.rootRef, []))
	const node = rootRef ?? ref

	useEffect(() => {
		if (target && node && visible) {
			if (Platform.OS === "web" && nativeID) {
				const targetEl = target as any
				const containerEl = document.getElementById(nativeID)

				if (!targetEl || !containerEl) return

				const rect = targetEl.getBoundingClientRect()

				const containerRect = containerEl.getBoundingClientRect()
				const pageWidth = containerEl?.clientWidth ?? window.innerWidth

				const relativeTop = rect.top - containerRect.top

				const left = rect.left - containerRect.left
				const top = relativeTop + (scrollOffsetY?.current ?? 0)

				const layoutWidth = dimensionWidth(pageWidth)
				const alignPriority = compouteAlign(left, layoutWidth)
				const geom = computeGeometry(left, top)
				const adjustedSize = addPosition(geom, position)
				setMeasure({ ...geom, ...adjustedSize, ...alignPriority })
			}
		}
	}, [visible, title, subtitle, textButton, onClose])

	if (isEmptyObject(measure)) return null

	return (
		<View style={[s.root, measure]}>
			<Pressable
				style={[s.wrapper, s.shadow, style]}
				onPress={(e) => {
					onPress && onPress(e)
					onClose && onClose()
				}}
				feedback={false}
				{...props}>
				{renderTextByProps(TITLE_PROPS, title)}
				{renderTextByProps(SUBTITLE_PROPS, subtitle, (first, second) => ({
					mt: title ? 4 : 0,
				}))}
				{renderTextByProps(TEXT_BUTTON_PROPS, textButton)}
			</Pressable>
		</View>
	)
}

function dimensionWidth(pageWidth: number) {
	const dimensionWidth = Dimensions.get("window").width
	if (!pageWidth || Platform.OS !== "web") return dimensionWidth
	return pageWidth
}

function compouteAlign(left: number, layoutWidth: number) {
	let _align: "flex-start" | "flex-end" = "flex-start"

	if (left < Math.round(FIXED_TOOLTIP_WIDTH_HALF)) {
		_align = "flex-start"
	} else if (layoutWidth < Math.round(left + FIXED_TOOLTIP_WIDTH_HALF)) {
		_align = "flex-end"
	}
	return { justifyContent: _align }
}

function computeGeometry(left: number, top: number): TooltipAbsoluteType {
	let _left = 0
	let _top = 0

	if (FIXED_TOOLTIP_WIDTH_HALF < left) {
		_left = left - FIXED_TOOLTIP_WIDTH_HALF
	}
	//TODO: 간헐적으로 measureLayout 4번째 인자값인 height 값이 0 으로 넘어오기에 height 값을 더하던 로직을 제외함
	// _top = top + height
	_top = top

	return {
		left: _left,
		top: _top,
	}
}

function addPosition(geom: TooltipAbsoluteType, position?: TooltipPositionType): TooltipAbsoluteType {
	if (!position) return geom
	return {
		left: geom.left + position.x,
		top: geom.top + position.y,
	}
}

function isEmptyObject(obj: object) {
	return Object.keys(obj).length === 0
}

type TooltipAbsoluteType = { left: number; top: number }

const s = StyleSheet.create({
	root: {
		position: "absolute",
		left: 0,
		right: 0,
		flexDirection: "row",
		overflow: "visible",
	},
	wrapper: {
		flexDirection: "column",
		overflow: "visible",
		width: FIXED_TOOLTIP_WIDTH,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Color.gray70,
		backgroundColor: Color.white,
		padding: 12,
		marginTop: MARGIN_TOP_TO_POINTER,
		marginLeft: MARGIN_HORIZONTAL_TO_POINTER,
		marginRight: MARGIN_HORIZONTAL_TO_POINTER,
	},
	shadow:
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
})
