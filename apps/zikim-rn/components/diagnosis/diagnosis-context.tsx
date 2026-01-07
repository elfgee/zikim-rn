import React, { createContext, useContext, useMemo, useState } from "react"

export type TradePurpose = "jeonse" | "wolse" | "maemae"
export type ContractPeriodType = "1y" | "2y" | "custom"

export type PaymentPlan = "once" | "five" | "ticket"

export type DiagnosisDraft = {
	purpose: TradePurpose
	/** 원 단위 */
	depositWon: number | null
	/** 원 단위 */
	monthlyRentWon: number | null
	/** 원 단위 */
	salePriceWon: number | null
	contractPeriodType: ContractPeriodType | null
	contractPeriodYears: number | null

	addressQuery: string
	addressSelected: string | null
	unitDong: string | null
	unitHo: string | null

	/** 결제 플랜 */
	paymentPlan: PaymentPlan | null
	/** 잔여 이용권 */
	ticketRemaining: number
}

type DiagnosisContextValue = {
	draft: DiagnosisDraft
	setDraft: React.Dispatch<React.SetStateAction<DiagnosisDraft>>
	resetDraft: () => void
}

const DEFAULT_DRAFT: DiagnosisDraft = {
	purpose: "jeonse",
	depositWon: null,
	monthlyRentWon: null,
	salePriceWon: null,
	contractPeriodType: null,
	contractPeriodYears: null,

	addressQuery: "",
	addressSelected: null,
	unitDong: null,
	unitHo: null,

	paymentPlan: null,
	ticketRemaining: 1,
}

const DiagnosisContext = createContext<DiagnosisContextValue | null>(null)

export function DiagnosisProvider({ children }: { children: React.ReactNode }) {
	const [draft, setDraft] = useState<DiagnosisDraft>(DEFAULT_DRAFT)

	const value = useMemo<DiagnosisContextValue>(
		() => ({
			draft,
			setDraft,
			resetDraft: () => setDraft(DEFAULT_DRAFT),
		}),
		[draft]
	)

	return <DiagnosisContext.Provider value={value}>{children}</DiagnosisContext.Provider>
}

export function useDiagnosis() {
	const ctx = useContext(DiagnosisContext)
	if (!ctx) throw new Error("useDiagnosis must be used within DiagnosisProvider")
	return ctx
}

