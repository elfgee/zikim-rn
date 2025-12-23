import React, { FC, useCallback, useRef, useState } from "react"
import {
	Image as RNImage,
	ImageProps as RNImageProps,
	ImageSourcePropType,
	StyleSheet,
	View,
	Platform,
	NativeSyntheticEvent,
	ImageErrorEventData,
	ImageLoadEventData,
} from "react-native"

import { Color, Margin } from "../types"
import { revertMargin } from "../utils/style"
import { Icon } from "./icon"

const IS_WEB = Platform.OS === "web"

type PercentUnit = "%"

interface _ImageProps extends Omit<RNImageProps, "source">, Margin {
	width?: `${number}${PercentUnit}` | number
	height?: `${number}${PercentUnit}` | number
	radius?: boolean
	source: ImageSourcePropType | undefined
	dimmed?: boolean
	aspectRatio?: number | undefined
	children?: React.ReactNode
}

//? height와 aspectRatio가 함께 사용되지 않도록 제한
export type ImageProps = _ImageProps &
	(
		| {
				height?: never
		  }
		| {
				aspectRatio?: never
		  }
	)

export const Image: FC<ImageProps> = ({
	width,
	height,
	radius,
	style,
	dimmed,
	aspectRatio,
	source,
	children,
	/** @default cover */
	resizeMode = "cover",
	...props
}) => {
	const [imageError, setImageError] = useState(false)
	const marginStyle = revertMargin(props)
	const radiusStyle = !!radius && s.borderRadius
	const imageRadiusStyle =
		resizeMode && (resizeMode === "contain" || resizeMode === "center") ? undefined : radiusStyle
	const sizeStyle = { width, height }
	const isLargeImage = width && typeof width === "number" && width > 180

	const _onError = useRef(props.onError)
	const _onLoad = useRef(props.onLoad)
	const _onLoadEnd = useRef(props.onLoadEnd)
	const _onLoadStart = useRef(props.onLoadStart)

	/**
	 * @slack https://zigbang.slack.com/archives/C9JFDTQ5T/p1702611947318839
	 * @desc react-native-web Image의 onError,onLoad,onLoadEnd,onLoadStart 의 갱신이 image의 새로운 load를 일으키는 것을 방지
	 */
	_onError.current = props.onError
	_onLoad.current = props.onLoad
	_onLoadEnd.current = props.onLoadEnd
	_onLoadStart.current = props.onLoadStart

	const onError = useCallback((e: NativeSyntheticEvent<ImageErrorEventData>) => {
		_onError.current?.(e)
		setImageError(true)
	}, [])

	const onLoad = useCallback((e: NativeSyntheticEvent<ImageLoadEventData>) => {
		_onLoad.current?.(e)
	}, [])

	const onLoadEnd = useCallback(() => {
		_onLoadEnd.current?.()
	}, [])
	const onLoadStart = useCallback(() => {
		_onLoadStart.current?.()
	}, [])

	return (
		<View style={[s.root, { width, height: IS_WEB && aspectRatio ? "auto" : height }, marginStyle, style]}>
			{(imageError || !source) && (
				<View style={[s.placeholder, radiusStyle]}>
					<Icon
						shape={process.env.DOMAIN === "daum" ? "LogoDaum" : "LogoZigbang"}
						color={Color.gray80}
						width={isLargeImage ? 48 : 24}
						height={isLargeImage ? 48 : 24}
					/>
				</View>
			)}
			{source &&
				(IS_WEB && aspectRatio ? (
					<View style={{ width, paddingBottom: `${(1 / aspectRatio) * 100}%` }}>
						<RNImage
							style={[imageRadiusStyle, s.absoluteImg]}
							{...props}
							resizeMode={resizeMode}
							source={source}
							onError={onError}
							onLoad={onLoad}
							onLoadStart={onLoadStart}
							onLoadEnd={onLoadEnd}
						/>
					</View>
				) : (
					<RNImage
						style={[imageRadiusStyle, sizeStyle, { aspectRatio }]}
						{...props}
						resizeMode={resizeMode}
						source={source}
						onError={onError}
						onLoad={onLoad}
						onLoadStart={onLoadStart}
						onLoadEnd={onLoadEnd}
					/>
				))}
			{dimmed && <View style={[s.dimmed, radiusStyle]} />}
			{radius && <View style={s.border} pointerEvents={"none"} />}
			{children && <View style={s.overlay}>{children}</View>}
		</View>
	)
}

const s = StyleSheet.create({
	root: {
		overflow: "hidden",
	},
	placeholder: {
		position: "absolute",
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Color.gray95,
	},
	border: {
		zIndex: 1,
		position: "absolute",
		width: "100%",
		height: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Color.grayOpacity08,
	},
	borderRadius: {
		borderRadius: 4,
	},
	tag: {
		position: "absolute",
		top: 4,
		left: 4,
	},
	icon: {
		position: "absolute",
		top: 4,
		right: 4,
	},
	dimmed: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundColor: Color.grayOpacity60,
	},
	overlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
	whiteBG: {
		backgroundColor: Color.white,
	},
	transparentBG: {
		backgroundColor: Color.transparent,
	},
	absoluteImg: { position: "absolute", top: 0, width: "100%", height: "100%" },
})
