declare module "react-native" {
	interface PressableProps {
		className?: string
	}
}

export enum FontSize {
	size8 = 8,
	size10 = 10,
	size11 = 11,
	size12 = 12,
	size13 = 13,
	size14 = 14,
	size16 = 16,
	size18 = 18,
	size20 = 20,
	size22 = 22,
	size24 = 24,
	size26 = 26,
}

export enum Color {
	gray10 = "#1A1A1A",
	gray30 = "#4D4D4D",
	gray40 = "#666666",
	gray50 = "#808080",
	gray70 = "#B3B3B3",
	gray80 = "#CCCCCC",
	gray90 = "#E6E6E6",
	gray95 = "#F2F2F2",
	gray97 = "#F7F7F7",
	gray99 = "#FCFCFC",
	white = "#FFFFFF",
	orange1 = "#FF6905",
	orange2 = "#FFF7F0",
	orange3 = "#FFE8D9",
	red1 = "#FA4E3E",
	red2 = "#FFECEB",
	blue1 = "#3798FA",
	blue2 = "#EBF5FF",
	blue3 = "#025FD2",
	blue4 = "#1C75BC",
	blue5 = "#1A71D3",
	navy1 = "#092C59",
	navy2 = "#E4EBF2",
	navy3 = "#BCCCE0",
	navy4 = "#F5F7FA",
	green1 = "#0BA04B",
	green2 = "#E6F5ED",
	green3 = "#009D41",
	green4 = "#F0F6F2",
	green5 = "#3AB54B",
	green6 = "#55BAA6",
	grayOpacity05 = "rgba(26, 26, 26, 0.05)", // deprecated color
	grayOpacity60 = "rgba(26, 26, 26, 0.6)",
	grayOpacity08 = "rgba(26, 26, 26, 0.08)",
	grayOpacity16 = "rgba(26, 26, 26, 0.16)",
	whiteOpacity04 = "rgba(255, 255, 255, 0.4)",
	transparent = "transparent",
}

if (process.env.DOMAIN === "daum") {
	;(Color as any).orange1 = "#3A98FC"
	;(Color as any).orange2 = "#ECF6FE"
	;(Color as any).orange3 = "#DAEEFE"
}

export type FontWeight = "regular" | "medium" | "bold"

export type Margin = {
	/** margin-top */
	mt?: number
	/** margin-right */
	mr?: number
	/** margin-bottom */
	mb?: number
	/** margin-left */
	ml?: number
}

export type { TooltipProps } from "./tooltip"
