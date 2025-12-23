import React, { FC, useMemo, useCallback, useState } from "react"
import { StyleSheet, View, ViewProps } from "react-native"
import { Text } from "../components/Text"
import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { notUndefinedOrNull } from "../utils/util"
import { Divider } from "./Divider"
import { Icon } from "./icon"
import { Pressable } from "./Pressable"

export const Calendar: FC<CalendarProps> = ({
	currentMonth,
	minDate,
	maxDate,
	onDayPress,
	markedDates,
	disabledDates,
	pastRange = 0,
	futureRange = 0,
	visibleRangeBtn = false,
	style,
	...props
}) => {
	const [current, setCurrentMonth] = useState<Date>(currentMonth ? new Date(currentMonth) : new Date())
	const marked = useMemo(() => (markedDates ? convertStrToDate(markedDates) : []), [markedDates])
	const data = useMemo(() => {
		const monthArr: ItemData[] = []
		current.setHours(0, 0, 0, 0)
		const firstDate = getFirstDayOfMonth(current, -pastRange)
		const lastDate = getFirstDayOfMonth(current, futureRange)
		const min = minDate && parseDateStr(minDate)
		const max = maxDate && parseDateStr(maxDate)
		const disabled = convertStrArrToDate(disabledDates ?? [])

		while (firstDate <= lastDate) {
			const curr = new Date(firstDate)
			const next = new Date(curr)
			next.setMonth(next.getMonth() + 1)
			monthArr.push({
				month: curr,
				markedDates: marked.filter((v) =>
					Array.isArray(v) ? v.some((d) => d >= curr && d < next) : v >= curr && v < next
				),
				disabledDates: disabled
					.filter((v) => (Array.isArray(v) ? v.some((d) => d >= curr && d < next) : v >= curr && v < next))
					.concat(min && curr <= min ? [[curr, min]] : [])
					.concat(max && next > max ? [[max, next]] : []),
			})
			firstDate.setMonth(firstDate.getMonth() + 1)
		}
		return monthArr
	}, [current, minDate, maxDate, markedDates, disabledDates])
	const onPressShowPrevMonth = useCallback(() => {
		setCurrentMonth(new Date(current.setMonth(current.getMonth() - 1)))
	}, [current])
	const onPressShowNextMonth = useCallback(() => {
		setCurrentMonth(new Date(current.setMonth(current.getMonth() + 1)))
	}, [current])
	return (
		<View {...props} style={[revertMargin(props), style]}>
			<DateRange
				range={marked[0]}
				visibleRangeBtn={visibleRangeBtn}
				onPressShowPrevMonth={onPressShowPrevMonth}
				onPressShowNextMonth={onPressShowNextMonth}
				current={current}
			/>
			<WeekTitle />
			{data.map((item) => (
				<MonthItem item={item} key={item.month.getTime()} onDayPress={onDayPress} />
			))}
		</View>
	)
}

const MonthItem: FC<{ item: ItemData; onDayPress?: (item: DateData) => void }> = ({ item, onDayPress }) => {
	const { year, month } = parseDate(item.month)
	const weekDay = item.month.getDay()
	const daysInMonth = new Date(year, month, 0).getDate()
	return (
		<>
			<Text
				size="16"
				lineHeight={20}
				color={Color.gray50}
				mt={20}
				ml={20}
				mr={20}
				mb={12}
				textAlign="center"
				allowFontScaling={false}>
				{year}년 {month}월
			</Text>
			<View>
				<View style={s.dayWrap}>
					{Array.from({ length: weekDay }).map((_, i) => (
						<View key={i} style={s.dayItem} />
					))}
					{Array.from({ length: daysInMonth }).map((_, i) => {
						const day = i + 1
						const date = new Date(year, month - 1, day)
						const isToday = date.toDateString() === new Date().toDateString()
						const handlePress = () => onDayPress?.(parseDate(new Date(year, month - 1, day)))
						return (
							<DayItem
								key={i}
								day={day}
								isToday={isToday}
								onDayPress={handlePress}
								{...getDayOverlayData(date, item)}
							/>
						)
					})}
				</View>
			</View>
		</>
	)
}

const DayItem = ({ day, isToday, isMarked, isDisabled, inMarkedRange, onDayPress }: DayProps) => {
	return (
		<View style={[s.dayItem, !isDisabled && inMarkedRange === 1 && s.filledRange]}>
			{!isDisabled && inMarkedRange == 0.5 && <View style={s.firstRange} />}
			{!isDisabled && inMarkedRange == -0.5 && <View style={s.lastRange} />}
			<Pressable style={s.dayItemIn} onPress={isDisabled ? undefined : onDayPress} radius={20}>
				<Text
					size="16"
					color={Color.gray10}
					textAlign="center"
					allowFontScaling={false}
					style={[s.dayItemText, isMarked && s.marked, isDisabled && s.disabled]}>
					{day}
				</Text>
				{isToday && <View style={[s.today, isMarked && s.todayMarked]} />}
			</Pressable>
		</View>
	)
}

const WeekTitle = () => {
	return (
		<>
			<View style={s.headerRow}>
				{WEEK_STR.map((v) => (
					<Text size="14" lineHeight={18} key={v} style={s.headerItem} allowFontScaling={false}>
						{v}
					</Text>
				))}
			</View>
			<Divider type="lineFull" />
		</>
	)
}

const DateRange = ({
	range,
	visibleRangeBtn,
	onPressShowPrevMonth,
	onPressShowNextMonth,
	current,
}: {
	range: Date | [Date, Date] | undefined
	visibleRangeBtn?: boolean
	onPressShowPrevMonth?: () => void
	onPressShowNextMonth?: () => void
	current: Date
}) => {
	if (!range) return null

	const date = useMemo(() => {
		const dateToStr = (d: Date) => {
			const { month, date, day } = parseDate(d)
			return `${month}월 ${date}일(${day})`
		}
		return range instanceof Date ? [dateToStr(range)] : range.map((v) => dateToStr(v))
	}, [range])

	const isPrevMonthDisabled = useMemo(() => {
		if (!current) return false
		const currentParsed = parseDate(current)
		const todayParsed = parseDate(new Date())
		return (
			currentParsed.year < todayParsed.year ||
			(currentParsed.year === todayParsed.year && currentParsed.month <= todayParsed.month)
		)
	}, [current])

	return (
		<View style={s.rangeWrap}>
			{visibleRangeBtn && (
				<Icon
					width={16}
					height={16}
					shape="ArrowLeft"
					onPress={onPressShowPrevMonth}
					mr={4}
					disabled={isPrevMonthDisabled}
					color={isPrevMonthDisabled ? Color.gray70 : undefined}
				/>
			)}
			<Text size="18" weight="bold" mr={visibleRangeBtn ? 0 : 20} allowFontScaling={false}>
				{date[0]}
			</Text>
			{date[1] && (
				<>
					<Icon width={20} height={20} shape="ArrowRight" />
					<Text size="18" weight="bold" ml={20} allowFontScaling={false}>
						{date[1]}
					</Text>
				</>
			)}
			{visibleRangeBtn && (
				<Icon width={16} height={16} shape="ArrowRight" onPress={onPressShowNextMonth} ml={4} />
			)}
		</View>
	)
}

/* Interfaces */

type DateProp = [DateStr, DateStr] | DateStr
export interface CalendarProps extends ViewProps, Margin {
	currentMonth?: `${number}-${number}`
	minDate?: DateStr
	maxDate?: DateStr
	onDayPress?: (date: DateData) => void
	markedDates?: DateProp
	disabledDates?: DateProp[]
	/** @default 0 */
	pastRange?: number
	/** @default 0 */
	futureRange?: number
	/** @default false */
	visibleRangeBtn?: boolean
}

type DayProps = { day: number; isToday: boolean; onDayPress: () => void } & ReturnType<typeof getDayOverlayData>

interface ItemData {
	month: Date
	disabledDates: (Date | [Date, Date])[]
	markedDates: (Date | [Date, Date])[]
	onDayPress?: (date: DateData) => void
}

interface DateData {
	year: number
	month: number
	date: number
	day: string
	timestamp: number
}

type DateStr = `${number}-${number}-${number}`

/* Helper functions */

const getFirstDayOfMonth = (date: Date, offset?: number) => {
	const newDate = new Date(date)
	newDate.setDate(1)
	if (offset !== undefined) newDate.setMonth(newDate.getMonth() + offset)
	return newDate
}

const parseDate = (d: Date): DateData => {
	const year = d.getFullYear()
	const month = d.getMonth() + 1
	const date = d.getDate()
	const day = WEEK_STR[d.getDay()]
	return { year, month, date, day, timestamp: d.getTime() }
}

const parseDateStr = (str: string): Date => {
	const dateArr = str.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/)
	if (!dateArr) return new Date("")
	return new Date(Number(dateArr[1]), Number(dateArr[2]) - 1, Number(dateArr[3] ?? 1))
}

const convertStrArrToDate = (arr: DateProp[]): (Date | [Date, Date])[] => {
	return arr.map((v) => {
		if (Array.isArray(v)) return [parseDateStr(v[0]), parseDateStr(v[1])]
		else return parseDateStr(v)
	})
}

const convertStrToDate = (date: DateProp): (Date | [Date, Date])[] => {
	if (Array.isArray(date)) return [[parseDateStr(date[0]), parseDateStr(date[1])]]
	else return [parseDateStr(date)]
}

const getDayOverlayData = (date: Date, item: ItemData) => {
	const isMarked = !!item.markedDates.find((dateItem) => {
		return Array.isArray(dateItem)
			? dateItem.some((rangeDate) => rangeDate.getTime() === date.getTime())
			: dateItem.getTime() === date.getTime()
	})
	const isDisabled = !!item.disabledDates.find((dateItem) => {
		return Array.isArray(dateItem)
			? dateItem[0] <= date && date <= dateItem[1]
			: dateItem.getTime() === date.getTime()
	})
	const inMarkedRange = (() => {
		const rangeArr = item.markedDates
			.filter((v) => Array.isArray(v))
			.map((v) => {
				if (!Array.isArray(v)) return
				if (v[0].getTime() === date.getTime()) return 0.5
				else if (v[1].getTime() === date.getTime()) return -0.5
				else if (date > v[0] && date < v[1]) return 1
				return undefined
			})
			.filter(notUndefinedOrNull)
		if (!rangeArr.length) return
		if (rangeArr.includes(1)) return 1
		if (rangeArr.includes(0.5) && rangeArr.includes(-0.5)) return 1
		return rangeArr[0]
	})()
	return { isMarked, isDisabled, inMarkedRange } as const
}

const WEEK_STR = ["일", "월", "화", "수", "목", "금", "토"]

/* Styles */
const s = StyleSheet.create({
	rangeWrap: {
		marginVertical: 12,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	rangeDate: {},
	headerRow: {
		paddingHorizontal: 12,
		flexDirection: "row",
		paddingTop: 12,
		paddingBottom: 5,
	},
	headerItem: {
		flex: 1,
		textAlign: "center",
		justifyContent: "space-between",
		marginHorizontal: 10,
	},
	dayWrap: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginHorizontal: 8,
		marginBottom: 16,
	},
	dayItem: {
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: Math.floor((100 / 7) * 1000) / 1000 + "%",
		alignItems: "center",
		marginBottom: 4,
	},
	dayItemIn: {
		flexGrow: 0,
		flexShrink: 0,
		flexBasis: 40,
	},
	dayItemText: {
		height: 40,
		width: 40,
		lineHeight: 40,
		zIndex: 1,
		overflow: "hidden",
	},
	today: {
		position: "absolute",
		bottom: 8,
		left: 12,
		right: 12,
		height: 2,
		backgroundColor: Color.orange1,
		zIndex: 1,
	},
	marked: {
		borderRadius: 20,
		backgroundColor: Color.orange1,
		color: Color.white,
	},
	todayMarked: { backgroundColor: Color.white },
	disabled: {
		backgroundColor: undefined,
		color: Color.gray80,
	},
	filledRange: {
		backgroundColor: Color.orange2,
	},
	firstRange: {
		position: "absolute",
		right: 0,
		top: 0,
		bottom: 0,
		width: "50%",
		backgroundColor: Color.orange2,
	},
	lastRange: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: "50%",
		backgroundColor: Color.orange2,
	},
})
