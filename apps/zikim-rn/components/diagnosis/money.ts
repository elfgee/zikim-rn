export function onlyDigits(v: string) {
	return v.replace(/[^\d]/g, "")
}

export function formatWithComma(num: number) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * 원 단위를 "2억원", "1억 5,000만원" 형태로 변환 (UI 보조용)
 * - 억(100,000,000), 만(10,000) 단위까지만 다룹니다.
 */
export function formatWonToKoreanText(won: number) {
	if (!Number.isFinite(won) || won <= 0) return ""
	const EOK = 100_000_000
	const MAN = 10_000
	const eok = Math.floor(won / EOK)
	const rem = won % EOK
	const man = Math.floor(rem / MAN)

	if (eok > 0 && man > 0) return `${eok}억 ${formatWithComma(man)}만원`
	if (eok > 0) return `${eok}억원`
	// 1억 미만은 만원 단위로
	return `${formatWithComma(Math.floor(won / MAN))}만원`
}

/**
 * 리포트 요약용: "천만원 단위"로 짧게 (예: 200,000,000 -> "2억", 55,000,000 -> "5,500만원")
 */
export function formatWonSummary(won: number) {
	if (!Number.isFinite(won) || won <= 0) return "-"
	const EOK = 100_000_000
	const MAN = 10_000
	if (won >= EOK) {
		const v = Math.round((won / EOK) * 10) / 10 // 소수 1자리
		return Number.isInteger(v) ? `${v.toFixed(0)}억` : `${v}억`
	}
	// 1억 미만은 만원 단위
	const man = Math.round(won / MAN)
	return `${formatWithComma(man)}만원`
}

