import React, { FC } from "react"
import { View, ImageSourcePropType, StyleSheet, Image } from "react-native"
import { revertMargin } from "../utils/style"
import { Pressable, StaticPressableProps } from "../components/Pressable"
import { Margin } from "../types"

export interface BannerProps extends Margin, StaticPressableProps {
	/** @default 12 */
	mt?: number | undefined
	/** @default 20 */
	mr?: number | undefined
	/** @default 12 */
	mb?: number | undefined
	/** @default 20 */
	ml?: number | undefined
	source: ImageSourcePropType
}

export const Banner: FC<BannerProps> = ({ style, source, mt = 12, mr = 20, mb = 12, ml = 20, ...props }) => {
	return (
		<Pressable style={[styles.imageWrapper, revertMargin({ mt, mr, mb, ml }), style]} radius={4} {...props}>
			<View style={styles.wrapper}>
				<Image source={source} style={styles.bannerImage} resizeMode={"contain"} />
			</View>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	imageWrapper: {
		alignItems: "center",
	},
	wrapper: {
		maxWidth: 320,
		width: "100%",
	},
	bannerImage: {
		width: "100%",
		maxWidth: "100%",
		height: "auto",
		maxHeight: 72,
		aspectRatio: 320 / 72,
	},
})
