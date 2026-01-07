import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { Color, Pressable, Text } from "@zigbang/zuix2"

const ZPressable: any = Pressable as any
const ZText: any = Text as any

export function Disclosure({
	title,
	children,
	defaultOpen = false,
}: {
	title: string
	children: React.ReactNode
	defaultOpen?: boolean
}) {
	const [open, setOpen] = useState(defaultOpen)
	return (
		<View style={styles.root}>
			<ZPressable
				feedback={false}
				radius={8}
				style={styles.header}
				onPress={() => setOpen((v: boolean) => !v)}
			>
				<View style={styles.headerLeft}>
					<ZText size="14" weight="bold" color={Color.gray10}>
						{title}
					</ZText>
				</View>
				<ZText size="13" weight="bold" color={Color.gray50}>
					{open ? "접기" : "펼치기"}
				</ZText>
			</ZPressable>

			{open ? <View style={styles.body}>{children}</View> : null}
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		borderWidth: 1,
		borderColor: Color.gray90,
		borderRadius: 12,
		overflow: "hidden",
		backgroundColor: Color.white,
	},
	header: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: Color.gray99,
	},
	headerLeft: {
		flex: 1,
		paddingRight: 8,
	},
	body: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		gap: 8,
	},
})

