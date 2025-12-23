import React, { FC, useCallback, useEffect, useMemo, useState } from "react"
import { StyleSheet, View, ViewProps, PixelRatio } from "react-native"
import { Color, Margin } from "../types"
import { TextType } from "../components/Text"
import { Pressable } from "../components/Pressable"
import { renderTextByProps } from "../utils/renderer"
import { revertMargin } from "../utils/style"

const ACTUALLY_BORDER_WIDTH = PixelRatio.roundToNearestPixel(1.4)

const getRadiusBorderStyle = (index: number, length: number, gridLength: number, rows: number) => {
	if (index === 0) return s.btlr4
	if (index + 1 === gridLength) return s.btrr4
	if (index === gridLength * (rows - 1)) return s.bblr4
	if (index === length - 1) return s.bbrr4
}

const RangeButton: FC<RangeButtonProps> = ({
	disabled,
	title,
	length,
	gridLength,
	rows,
	index,
	onPressItem,
	selectedItem,
}) => {
	const preloadBorderStyle = useMemo(() => {
		const radiusBorder = getRadiusBorderStyle(index, length, gridLength, rows)
		return [radiusBorder]
	}, [index, length, gridLength, rows])

	const _onPress = useCallback(() => onPressItem(index), [index, onPressItem])
	const isSelected = useMemo(
		() => !disabled && index >= selectedItem[0] && index <= selectedItem[1],
		[disabled, index, selectedItem]
	)
	const widthStyle = useMemo(() => s[`flexBasis${gridLength}`], [gridLength])

	return (
		<Pressable style={[s.pressView, widthStyle, isSelected && s.zIndex1]} onPress={disabled ? undefined : _onPress}>
			<View style={[s.button, preloadBorderStyle, isSelected && s.selected, disabled && s.disabled]}>
				{renderTextByProps(
					{
						size: "14",
						weight: isSelected ? "bold" : "regular",
						style: s.title,
						numberOfLines: 1,
						allowFontScaling: false,
						ellipsizeMode: "tail",
						color: disabled ? Color.gray80 : Color.gray10,
					},
					title
				)}
			</View>
		</Pressable>
	)
}

const getRestElement = (itemsLength: number, gridLength: number) => {
	const rest = itemsLength % gridLength
	if (rest != 0) {
		return Array(gridLength - rest).fill({ value: "", disabled: true })
	}
	return []
}

const checkFullRange = (items: RangeButtonItem[]) => {
	const fullRange = items
		.map((value: RangeButtonItem, index: number) => {
			if (index === 0 || value.disabled) return
			return index
		})
		.filter((v) => !!v)
	return [Math.min(...(fullRange as number[])), Math.max(...(fullRange as number[]))]
}

export const RangeFilter: FC<RangeFilterProps> = ({
	items,
	onPressItem,
	selectedItem: propsSelectedItem,
	mt,
	mr = 20,
	mb,
	ml = 20,
	rows = 2,
	style,
	...props
}) => {
	const [fullItems, setFullItems] = useState<RangeButtonItem[]>(items)
	const [selectedItem, setselectedItem] = useState<[number, number]>(propsSelectedItem || [0, 0])

	const itemsLength = fullItems.length
	const gridLength = rows === 2 ? 4 : 3
	const checkItem = checkFullRange(fullItems)

	useEffect(() => {
		if (propsSelectedItem) {
			setselectedItem(propsSelectedItem)
		}
	}, [JSON.stringify(propsSelectedItem)])

	useEffect(() => {
		setFullItems([...items, ...getRestElement(items.length, gridLength)])
	}, [rows])

	const _onPressItem = useCallback(
		(index: number) => {
			let newItems: SelectedItem = [...selectedItem]

			if (index === 0) {
				newItems = [0, 0]
			} else if (selectedItem[0] != selectedItem[1] || selectedItem[0] === 0) {
				newItems = [index, index]
			} else if (selectedItem[0] < index) {
				newItems = [selectedItem[0], index]
			} else {
				newItems = [index, index]
			}

			if (newItems[0] === checkItem[0] && newItems[1] === checkItem[1]) {
				newItems = [0, 0]
			}

			setselectedItem(newItems)
			onPressItem && onPressItem(newItems, index)
		},
		[onPressItem, selectedItem, setselectedItem]
	)

	return (
		<View style={[revertMargin({ mt, mr, mb, ml }), style]} {...props}>
			<View style={s.wrapper}>
				{fullItems.map((item, i) => (
					<RangeButton
						key={i}
						title={item.value}
						length={itemsLength}
						index={i}
						disabled={item.disabled}
						gridLength={gridLength}
						rows={rows}
						onPressItem={_onPressItem}
						selectedItem={selectedItem}
					/>
				))}
			</View>
		</View>
	)
}

type SelectedItem = [number, number]
type RangeButtonItem = { value: string; disabled?: boolean }

interface RangeButtonProps {
	isSlected?: boolean
	disabled?: boolean
	title: TextType
	length: number
	index: number
	gridLength: 3 | 4
	rows: 2 | 3
	onPressItem: (index: number) => void
	selectedItem: SelectedItem
}
interface RangeFilterProps extends ViewProps, Margin {
	items: RangeButtonItem[]
	onPressItem?: ([startIndex, endIndex]: SelectedItem, pressedIndex: number) => void
	selectedItem?: SelectedItem
	/** @default 2 */
	rows?: 2 | 3
}

const s = StyleSheet.create({
	wrapper: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		marginTop: ACTUALLY_BORDER_WIDTH,
		marginLeft: ACTUALLY_BORDER_WIDTH,
	},
	pressView: {
		flex: 0,
		zIndex: 0,
		marginTop: -ACTUALLY_BORDER_WIDTH,
		marginLeft: -ACTUALLY_BORDER_WIDTH,
	},
	button: {
		height: 40,
		justifyContent: "center",
		backgroundColor: Color.white,
		borderColor: Color.gray90,
		borderWidth: 1,
	},
	selected: {
		borderColor: Color.gray10,
		borderWidth: ACTUALLY_BORDER_WIDTH,
	},
	title: {
		paddingLeft: 2,
		paddingRight: 2,
		overflow: "hidden",
		width: "100%",
		textAlign: "center",
	},
	disabled: {
		backgroundColor: Color.gray97,
	},
	btlr4: {
		borderTopLeftRadius: 4,
	},
	btrr4: {
		borderTopRightRadius: 4,
	},
	bblr4: {
		borderBottomLeftRadius: 4,
	},
	bbrr4: {
		borderBottomRightRadius: 4,
	},
	flexBasis3: {
		flexBasis: `${100 / 3}%`,
	},
	flexBasis4: {
		flexBasis: `${100 / 4}%`,
	},
	zIndex1: {
		zIndex: 1,
	},
})
