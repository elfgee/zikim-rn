import React, { FC } from "react"
import { View, StyleSheet, ViewProps, FlexStyle, ViewStyle } from "react-native"
import { Margin, Color } from "../types"
import { revertMargin } from "../utils/style"
import { Text, TextType } from "./Text"
import { Divider } from "./Divider"
import { Pressable, PressableProps } from "./Pressable"
import { renderTextByProps } from "../utils/renderer"

export interface TableRow {
	items: TableItem[]
	itemRowStyle?: ViewStyle
	isShowRowDivider?: boolean
}

export interface TableProps extends Margin, ViewProps {
	headerData?: HeaderDataItem[]
	data: (TableRow | TableItem[])[]
	ratio: number[]
	isShowHeaderBelowDivider?: boolean
}

type HeaderDataItem = {
	item: string | React.ReactElement<typeof Text> | React.ReactElement<typeof Col>
	align?: "left" | "center" | "right"
}
export interface TableItem extends PressableProps {
	item: string | React.ReactElement<typeof Text> | React.ReactElement<typeof Col> | TableItem[]
	colSpan?: number
	direction?: "row" | "column"
	align?: "left" | "center" | "right"
	verticalAlign?: "top" | "center" | "bottom"
}

interface ColProps extends PressableProps, Margin {
	/** @default 1 */
	flex?: number
	align?: "left" | "center" | "right"
	verticalAlign?: "top" | "center" | "bottom"
	isHeader?: boolean
}

const Col: React.FC<ColProps> = ({
	flex = 1,
	align,
	verticalAlign = "center",
	style,
	children,
	isHeader,
	...props
}) => {
	const getAlign = () => {
		const _align: { alignItems: string | undefined; justifyContent: string } = {
			alignItems: align,
			justifyContent: verticalAlign,
		}

		if (_align.alignItems === "left") {
			_align.alignItems = "flex-start"
		} else if (align === "right") {
			_align.alignItems = "flex-end"
		}
		if (_align.justifyContent === "top") {
			_align.justifyContent = "flex-start"
		} else if (verticalAlign === "bottom") {
			_align.justifyContent = "flex-end"
		}

		return _align as FlexStyle
	}
	return (
		<Pressable style={[revertMargin(props), style, { flex }]} {...props}>
			<View style={[styles.flex1, getAlign()]}>
				<View style={[styles.itemCol, isHeader ? styles.headerCol : undefined]}>
					{children as React.ReactNode}
				</View>
			</View>
		</Pressable>
	)
}

//* colSpan으로 합친 col의 flex값을 추가
const getColSpanFlex = (ratio: number[], colSpan: number, index: number) => {
	let total = 0

	for (let i = 0; i < colSpan; i++) {
		total += ratio[index + i]
	}
	return total
}

const renderCol = ({
	data,
	flex,
	key,
	ratio,
	isHeader,
}: {
	data: TableItem | HeaderDataItem
	flex: number
	key: number
	ratio: number[]
	isHeader?: boolean
}) => {
	const { item, ...props } = data
	if (Array.isArray(item)) {
		if ((data as TableItem).direction === "row") {
			return renderRow({
				items: item as TableItem[],
				key,
				divider: false,
				startIndex: 1,
				style: styles.noRowMargin,
				ratio,
			})
		}
		return (
			<View style={[{ flex }, { flexDirection: (data as TableItem).direction || undefined }]} key={key}>
				{item.map((_item, index) => renderCol({ data: _item as TableItem, flex: 1, key: index, ratio }))}
			</View>
		)
	}
	if (typeof item === "string") {
		if (isHeader) {
			return (
				<Col flex={flex} {...props} key={key} isHeader={isHeader}>
					{renderTextByProps({ size: "13", color: Color.gray50 }, item)}
				</Col>
			)
		}
		return (
			<Col flex={flex} {...props} key={key}>
				{renderTextByProps({ size: "13", weight: "regular" }, item)}
			</Col>
		)
	} else if ((item as JSX.Element)?.type === Text) {
		if (isHeader) {
			return (
				<Col flex={flex} {...props} key={key} isHeader={isHeader}>
					{renderTextByProps({ size: "13", color: Color.gray50 }, item as TextType)}
				</Col>
			)
		}
		return (
			<Col flex={flex} {...props} key={key}>
				{item}
			</Col>
		)
	} else if ((item as JSX.Element)?.type === Col) {
		return React.cloneElement(item as JSX.Element, { ...item.props, flex, key })
	} else {
		return item
	}
}

const renderRow = ({
	items,
	key,
	divider = true,
	style,
	startIndex = 0,
	ratio,
}: {
	items: TableItem[] | HeaderDataItem[]
	key?: number
	divider?: boolean
	style?: ViewStyle
	startIndex?: number
	ratio: number[]
}) => {
	return (
		<React.Fragment key={key}>
			<View style={[styles.itemRow, style]}>
				{items.map((item, index) => {
					let newIndex = index + startIndex
					//?이전에 colSpan 있으면 index추가해줘야함
					const colSpans = (items as TableItem[]).filter((r, _index) => r.colSpan && _index < index)
					colSpans.forEach((r) => (newIndex += r.colSpan! - 1))

					const flex = (item as TableItem).colSpan
						? getColSpanFlex(ratio, (item as TableItem).colSpan!, index)
						: ratio[newIndex]
					if (Array.isArray(item)) {
						return item.map((_item, _index) =>
							renderCol({ data: _item, flex, key: _index, ratio, isHeader: false })
						)
					}
					return renderCol({ data: item, flex, key: index, ratio, isHeader: false })
				})}
			</View>
			{divider && <Divider mt={0} mb={0} />}
		</React.Fragment>
	)
}

const renderHeader = ({ items, ratio }: { items: HeaderDataItem[]; ratio: number[] }) => {
	return (
		<View style={[styles.headerItemRow, styles.noPaddingVertical]}>
			{items.map((item, index) => {
				return renderCol({ data: item, flex: ratio[index], key: index, ratio, isHeader: true })
			})}
		</View>
	)
}

export const Table: FC<TableProps> & { Col: React.FC<ColProps> } = ({
	style,
	headerData,
	data,
	ratio,
	isShowHeaderBelowDivider = true,
	...props
}) => {
	return (
		<View style={[revertMargin(props), style]}>
			{headerData && renderHeader({ items: headerData, ratio })}
			{isShowHeaderBelowDivider && <Divider mt={0} mb={0} />}
			{data.map((row, index) => {
				if ((row as TableRow).items !== undefined) {
					return renderRow({
						items: (row as TableRow).items,
						key: index,
						ratio,
						style: (row as TableRow).itemRowStyle,
						divider: (row as TableRow).isShowRowDivider,
					})
				}
				return renderRow({ items: row as TableItem[], key: index, ratio })
			})}
		</View>
	)
}

Table.Col = Col
const styles = StyleSheet.create({
	headerItemRow: {
		flexDirection: "row",
		marginLeft: 20,
		marginRight: 20,
		paddingTop: 8,
		paddingBottom: 8,
		minHeight: 34,
	},
	itemRow: {
		flexDirection: "row",
		marginLeft: 20,
		marginRight: 20,
		paddingTop: 8,
		paddingBottom: 8,
	},

	itemCol: {
		paddingTop: 5,
		paddingRight: 2,
		paddingLeft: 2,
		paddingBottom: 5,
	},
	headerCol: {
		justifyContent: "center",
		paddingTop: 0,
		paddingBottom: 0,
	},
	flex1: { flex: 1 },
	noPaddingVertical: { paddingTop: 0, paddingBottom: 0 },
	noRowMargin: { marginLeft: 0, marginRight: 0, paddingTop: 0, paddingBottom: 0 },
})
