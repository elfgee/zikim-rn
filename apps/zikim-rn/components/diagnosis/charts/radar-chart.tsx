import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import Svg, { G, Line, Polygon, Text as SvgText } from "react-native-svg"
import { Color, Text } from "@zigbang/zuix2"

const ZText: any = Text as any

export type RadarMetric = { key: string; label: string; value: number }

function clamp01(x: number) {
	return Math.max(0, Math.min(1, x))
}

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
	return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

export function RadarChart({
	title,
	aLabel,
	bLabel,
	metrics,
	aValues,
	bValues,
	size = 260,
}: {
	title?: string
	aLabel: string
	bLabel: string
	metrics: { key: string; label: string }[]
	aValues: Record<string, number>
	bValues: Record<string, number>
	size?: number
}) {
	const { pointsA, pointsB, axes, labels } = useMemo(() => {
		const n = metrics.length
		const cx = size / 2
		const cy = size / 2
		const pad = 30
		const r = (size - pad * 2) / 2
		const start = -Math.PI / 2

		const toPoints = (values: Record<string, number>) =>
			metrics
				.map((m, i) => {
					const angle = start + (i * 2 * Math.PI) / n
					const v = clamp01((values[m.key] ?? 0) / 100)
					const p = polarToCartesian(cx, cy, r * v, angle)
					return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
				})
				.join(" ")

		const axes = metrics.map((m, i) => {
			const angle = start + (i * 2 * Math.PI) / n
			const p = polarToCartesian(cx, cy, r, angle)
			return { x: p.x, y: p.y }
		})

		const labels = metrics.map((m, i) => {
			const angle = start + (i * 2 * Math.PI) / n
			const p = polarToCartesian(cx, cy, r + 14, angle)
			return { label: m.label, x: p.x, y: p.y }
		})

		return { pointsA: toPoints(aValues), pointsB: toPoints(bValues), axes, labels }
	}, [aValues, bValues, metrics, size])

	return (
		<View style={styles.root}>
			{title ? (
				<ZText size="13" weight="bold" color={Color.gray10}>
					{title}
				</ZText>
			) : null}

			<View style={styles.svgWrap}>
				<Svg width={size} height={size}>
					<G>
						{/* grid */}
						{[0.2, 0.4, 0.6, 0.8, 1].map((t) => {
							const n = metrics.length
							const cx = size / 2
							const cy = size / 2
							const pad = 30
							const r = (size - pad * 2) / 2
							const start = -Math.PI / 2
							const pts = metrics
								.map((_, i) => {
									const angle = start + (i * 2 * Math.PI) / n
									const p = polarToCartesian(cx, cy, r * t, angle)
									return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
								})
								.join(" ")
							return <Polygon key={t} points={pts} fill="none" stroke={Color.gray90 as any} strokeWidth={1} />
						})}

						{/* axes */}
						{axes.map((p, idx) => (
							<Line key={idx} x1={size / 2} y1={size / 2} x2={p.x} y2={p.y} stroke={Color.gray90 as any} strokeWidth={1} />
						))}

						{/* polygons */}
						<Polygon points={pointsB} fill={withAlpha(Color.blue1 as any, 0.18)} stroke={Color.blue1 as any} strokeWidth={2} strokeDasharray="6 4" />
						<Polygon points={pointsA} fill={withAlpha(Color.orange1 as any, 0.18)} stroke={Color.orange1 as any} strokeWidth={2} />

						{/* labels */}
						{labels.map((l, idx) => (
							<SvgText
								key={idx}
								x={l.x}
								y={l.y}
								fontSize={10}
								fill={Color.gray50 as any}
								textAnchor="middle"
								alignmentBaseline="middle"
							>
								{l.label}
							</SvgText>
						))}
					</G>
				</Svg>
			</View>

			<View style={styles.legend}>
				<View style={styles.legendItem}>
					<View style={[styles.dot, { backgroundColor: Color.orange1 }]} />
					<ZText size="12" weight="regular" color={Color.gray50}>
						{aLabel}
					</ZText>
				</View>
				<View style={styles.legendItem}>
					<View style={[styles.dot, { backgroundColor: Color.blue1 }]} />
					<ZText size="12" weight="regular" color={Color.gray50}>
						{bLabel}
					</ZText>
				</View>
			</View>
		</View>
	)
}

function withAlpha(hex: string, alpha: number) {
	// expects #RRGGBB
	if (!hex.startsWith("#") || hex.length !== 7) return hex
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	return `rgba(${r},${g},${b},${alpha})`
}

const styles = StyleSheet.create({
	root: { gap: 10 },
	svgWrap: {
		alignSelf: "center",
		borderRadius: 12,
		backgroundColor: Color.white,
		borderWidth: 1,
		borderColor: Color.gray90,
		overflow: "hidden",
	},
	legend: { flexDirection: "row", gap: 14, justifyContent: "center" },
	legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
	dot: { width: 10, height: 10, borderRadius: 999 },
})

