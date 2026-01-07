import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { Color, Text } from "@zigbang/zuix2"

const ZText: any = Text as any

export type CompareBarDatum = {
	label: string
	value: number
	color?: string
}

export function BarCompareChart({
	title,
	data,
	maxValue,
	note,
}: {
	title?: string
	data: CompareBarDatum[]
	maxValue?: number
	note?: string
}) {
	const max = useMemo(() => {
		const m = Math.max(1, ...(data.map((d) => d.value) || [1]))
		return Math.max(maxValue ?? 0, m)
	}, [data, maxValue])

	return (
		<View style={styles.root}>
			{title ? (
				<ZText size="13" weight="bold" color={Color.gray10}>
					{title}
				</ZText>
			) : null}

			<View style={styles.rows}>
				{data.map((d) => {
					const w = Math.max(0, Math.min(1, d.value / max))
					const barColor = d.color ?? (d.label.includes("이 동네") ? Color.orange1 : Color.blue1)
					return (
						<View key={d.label} style={styles.row}>
							<View style={styles.labelCol}>
								<ZText size="12" weight="regular" color={Color.gray50} numberOfLines={1}>
									{d.label}
								</ZText>
							</View>
							<View style={styles.barCol}>
								<View style={styles.barTrack}>
									<View style={[styles.barFill, { width: `${Math.round(w * 100)}%`, backgroundColor: barColor }]} />
								</View>
							</View>
							<View style={styles.valueCol}>
								<ZText size="12" weight="bold" color={Color.gray10} textAlign="right">
									{d.value}
								</ZText>
							</View>
						</View>
					)
				})}
			</View>

			{note ? (
				<ZText size="12" weight="regular" color={Color.gray50}>
					{note}
				</ZText>
			) : null}
		</View>
	)
}

const styles = StyleSheet.create({
	root: { gap: 10 },
	rows: { gap: 10 },
	row: { flexDirection: "row", alignItems: "center", gap: 10 },
	labelCol: { width: 86 },
	barCol: { flex: 1 },
	valueCol: { width: 44 },
	barTrack: { height: 10, borderRadius: 999, backgroundColor: Color.gray90, overflow: "hidden" },
	barFill: { height: 10, borderRadius: 999 },
})

