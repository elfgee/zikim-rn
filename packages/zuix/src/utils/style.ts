import { Color, Margin } from "../types"
import { Dimensions, Platform, Insets, StatusBar, StyleSheet } from "react-native"
import { notUndefinedOrNull } from "./util"

export const revertMargin = ({ mt, mr, mb, ml }: Margin) => {
	if (!notUndefinedOrNull(mt) && !notUndefinedOrNull(mr) && !notUndefinedOrNull(mb) && !notUndefinedOrNull(ml)) {
		return undefined
	}
	return {
		...(notUndefinedOrNull(mt) && { marginTop: mt }),
		...(notUndefinedOrNull(mr) && { marginRight: mr }),
		...(notUndefinedOrNull(mb) && { marginBottom: mb }),
		...(notUndefinedOrNull(ml) && { marginLeft: ml }),
	}
}

export const revertTouchpaddingApp = (insets: number | Insets | undefined) => {
	if (!insets) return undefined
	if (typeof insets === "number") return { margin: -insets }
	const { top, bottom, left, right } = insets
	if (
		!notUndefinedOrNull(top) &&
		!notUndefinedOrNull(right) &&
		!notUndefinedOrNull(bottom) &&
		!notUndefinedOrNull(left)
	) {
		return undefined
	}
	return {
		...(notUndefinedOrNull(top) && { marginTop: -top }),
		...(notUndefinedOrNull(right) && { marginRight: -right }),
		...(notUndefinedOrNull(bottom) && { marginBottom: -bottom }),
		...(notUndefinedOrNull(left) && { marginLeft: -left }),
	}
}

export const revertTouchpaddingWeb = (insets: number | Insets | undefined) => {
	if (!insets) return undefined
	if (typeof insets === "number") return `zuix2-tp${insets}`
	const { top, bottom, left, right } = insets
	if (
		!notUndefinedOrNull(top) &&
		!notUndefinedOrNull(right) &&
		!notUndefinedOrNull(bottom) &&
		!notUndefinedOrNull(left)
	) {
		return undefined
	}
	const touchPaddingClassName: string[] = []
	notUndefinedOrNull(top) && touchPaddingClassName.push(`zuix2-tp-top${top}`)
	notUndefinedOrNull(right) && touchPaddingClassName.push(`zuix2-tp-right${right}`)
	notUndefinedOrNull(bottom) && touchPaddingClassName.push(`zuix2-tp-bottom${bottom}`)
	notUndefinedOrNull(left) && touchPaddingClassName.push(`zuix2-tp-left${left}`)
	return touchPaddingClassName.join(" ")
}

//출처 : https://stackoverflow.com/a/52519971
export const isIphoneWithNotch = () => {
	const dimen = Dimensions.get("window")
	return (
		Platform.OS === "ios" &&
		!Platform.isPad &&
		!Platform.isTV &&
		(dimen.height === 780 || dimen.width === 780 || isiPhoneX() || isiPhoneDynamicIsland())
	)
}

export const isiPhoneX = () => {
	const dimen = Dimensions.get("window")
	return (
		(dimen.width === 375 && dimen.height === 812) || // iPhone X or Xs or 11 Pro or 12 mini
		(dimen.width === 414 && dimen.height === 896) || // iPhone Xs Max or iPhone Xr or 11 or 11 Pro Max
		(dimen.width === 390 && dimen.height === 844) || // iPhone 12 or iPhone 12 Pro
		(dimen.width === 428 && dimen.height === 926) || // iPhone 12 Pro Max
		(dimen.height === 375 && dimen.width === 812) || // iPhone X or Xs or 11 Pro or 12 mini (Landscape)
		(dimen.height === 414 && dimen.width === 896) || // iPhone Xs Max or iPhone Xr or 11 or 11 Pro Max (Landscape)
		(dimen.height === 390 && dimen.width === 844) || // iPhone 12 or iPhone 12 Pro (Landscape)
		(dimen.height === 428 && dimen.width === 926) // iPhone 12 Pro Max (Landscape)
	)
}

export const isiPhoneDynamicIsland = () => {
	const dimen = Dimensions.get("window")
	return (
		(dimen.width === 393 && dimen.height === 852) || // iPhone 14 Pro
		(dimen.height === 393 && dimen.width === 852) || // iPhone 14 Pro (Landscape)
		(dimen.width === 430 && dimen.height === 932) || // iPhone 14 Pro Max
		(dimen.height === 430 && dimen.width === 932) || // iPhone 14 Pro Max (Landscape)
		(dimen.width === 402 && dimen.height === 874) || // iPhone 16 Pro
		(dimen.height === 402 && dimen.width === 874) || // iPhone 16 Pro (Landscape)
		(dimen.width === 440 && dimen.height === 956) || // iPhone 16 Pro Max
		(dimen.height === 440 && dimen.width === 956) // iPhone 16 Pro Max (Landscape)
	)
}

const isWeb = Platform.OS === "web"
const isIos = Platform.OS === "ios"

//? when iphoneX notch, android StatusBar.currentHeight
export const statusBarHeight =
	Platform.OS === "ios" && !Platform.isPad && !Platform.isTV
		? isiPhoneX()
			? 44
			: isiPhoneDynamicIsland()
			? 59
			: 22
		: StatusBar.currentHeight || 0

export const Shadow = StyleSheet.create({
	level1: isWeb
		? {
				boxShadow: "0px 1px 4px rgba(26, 26, 26, 0.2)",
		  }
		: isIos
		? {
				shadowColor: Color.gray10,
				shadowOffset: {
					width: 0,
					height: 1,
				},
				shadowOpacity: 0.2,
				shadowRadius: 2,
		  }
		: {
				elevation: 3,
				shadowColor: Color.gray30,
		  },
	level2: isWeb
		? {
				boxShadow: "0px 4px 8px rgba(26, 26, 26, 0.06)",
		  }
		: isIos
		? {
				shadowColor: Color.gray10,
				shadowOffset: {
					width: 0,
					height: 4,
				},
				shadowOpacity: 0.06,
				shadowRadius: 4,
		  }
		: {
				elevation: 6,
				shadowColor: "#adadad",
		  },
	level3: isWeb
		? {
				boxShadow: "0px 6px 12px rgba(26, 26, 26, 0.12)",
		  }
		: isIos
		? {
				shadowColor: Color.gray10,
				shadowOffset: {
					width: 0,
					height: 6,
				},
				shadowOpacity: 0.12,
				shadowRadius: 6,
		  }
		: {
				elevation: 10,
				shadowColor: "#737373",
		  },
	level4: isWeb
		? {
				boxShadow: "0px 8px 20px rgba(26, 26, 26, 0.10)",
		  }
		: isIos
		? {
				shadowColor: Color.gray10,
				shadowOffset: {
					width: 0,
					height: 8,
				},
				shadowOpacity: 0.1,
				shadowRadius: 10,
		  }
		: {
				elevation: 16,
				shadowColor: "#8c8c8c",
		  },
})
