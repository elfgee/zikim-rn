import React, { useMemo, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Color, TabFilter, Text } from "@zigbang/zuix2"
import { Stack } from "expo-router"
import { useDiagnosis } from "@/components/diagnosis/diagnosis-context"
import { formatWonSummary } from "@/components/diagnosis/money"
import { Disclosure } from "@/components/diagnosis/disclosure"
import { StatusTag, type StatusTagType } from "@/components/diagnosis/status-tag"
import { BarCompareChart } from "@/components/diagnosis/charts/bar-compare-chart"
import { RadarChart } from "@/components/diagnosis/charts/radar-chart"

const ZText: any = Text as any
const ZTabFilter: any = TabFilter as any

type ReportTabKey = "summary" | "property" | "owner" | "market" | "loan" | "special" | "safety" | "life"

export default function DiagnosisReportScreen() {
	const { draft } = useDiagnosis()
	const [tab, setTab] = useState<ReportTabKey>("summary")

	const tabs = useMemo(
		() => [
			{ key: "summary", text: "요약" },
			{ key: "property", text: "매물" },
			{ key: "owner", text: "집주인" },
			{ key: "market", text: "시세" },
			{ key: "loan", text: "대출/보험" },
			{ key: "special", text: "특약" },
			{ key: "safety", text: "치안" },
			{ key: "life", text: "생활" },
		],
		[]
	)

	const selectedIndex = useMemo(() => Math.max(0, tabs.findIndex((t) => t.key === tab)), [tabs, tab])

	const priceLine = useMemo(() => {
		if (draft.purpose === "maemae") return `매매 ${draft.salePriceWon ? formatWonSummary(draft.salePriceWon) : "-"}`
		if (draft.purpose === "jeonse") return `전세 ${draft.depositWon ? formatWonSummary(draft.depositWon) : "-"}`
		return `보증금 ${draft.depositWon ? formatWonSummary(draft.depositWon) : "-"} / 월세 ${draft.monthlyRentWon ? formatWonSummary(draft.monthlyRentWon) : "-"}`
	}, [draft.depositWon, draft.monthlyRentWon, draft.purpose, draft.salePriceWon])

	const contractLine = useMemo(() => {
		if (draft.purpose === "maemae") return null
		const years = draft.contractPeriodType === "custom" ? draft.contractPeriodYears : draft.contractPeriodType === "1y" ? 1 : draft.contractPeriodType === "2y" ? 2 : null
		return years ? `계약기간 ${years}년` : null
	}, [draft.contractPeriodType, draft.contractPeriodYears, draft.purpose])

	return (
		<>
			<Stack.Screen options={{ title: "리포트" }} />
			<SafeAreaView style={styles.safe}>
				<ScrollView contentContainerStyle={styles.container}>
					{/* 요약(공통) */}
					<View style={styles.summaryCard}>
						<View style={{ gap: 6 }}>
							<ZText size="15" weight="bold" color={Color.gray10}>
								{draft.addressSelected ?? "주소 미선택"}
							</ZText>
							<ZText size="13" weight="regular" color={Color.gray50}>
								{priceLine}
								{contractLine ? ` · ${contractLine}` : ""}
							</ZText>
						</View>

						<View style={{ marginTop: 12, gap: 8 }}>
							<View style={styles.aiRow}>
								<StatusTag status="양호" />
								<ZText size="13" weight="bold" color={Color.gray10}>
									AI 종합 진단 의견
								</ZText>
							</View>
							<ZText size="13" weight="regular" color={Color.gray10}>
								핵심 결론이 <ZText size="13" weight="bold" color={Color.gray10}>강조</ZText>되어 보일 수 있어야 해요. (샘플 문구)
							</ZText>
							<ZText size="12" weight="regular" color={Color.gray50}>
								고지/주의 문구 영역 (TBD)
							</ZText>
						</View>
					</View>

					{/* 탭 */}
					<ZTabFilter
						widthFixed
						data={tabs}
						selectedIndex={selectedIndex}
						onPressItem={(item: any) => setTab(item.key)}
					/>

					{/* 탭별 본문 */}
					<View style={styles.body}>
						{tab === "summary" ? <SummaryTab /> : null}
						{tab === "property" ? <PropertyTab /> : null}
						{tab === "owner" ? <OwnerTab /> : null}
						{tab === "market" ? <MarketTab /> : null}
						{tab === "loan" ? <LoanTab /> : null}
						{tab === "special" ? <SpecialTab /> : null}
						{tab === "safety" ? <SafetyTab /> : null}
						{tab === "life" ? <LifeTab /> : null}
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
}

function SummaryTab() {
	const rows: { title: string; status: StatusTagType; note: string }[] = [
		{ title: "매물 진단", status: "확인 필요", note: "이상 2개" },
		{ title: "집주인 진단", status: "양호", note: "0개" },
		{ title: "시세 진단", status: "확인 필요", note: "이상 1개" },
		{ title: "대출/보험", status: "가능성 높음", note: "양호" },
		{ title: "치안", status: "양호", note: "양호" },
		{ title: "생활", status: "양호", note: "양호" },
		{ title: "특약", status: "양호", note: "추천 3개" },
	]
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				점검 항목 요약
			</ZText>
			<View style={{ gap: 10 }}>
				{rows.map((r) => (
					<View key={r.title} style={styles.row}>
						<View style={{ flex: 1, gap: 4 }}>
							<ZText size="13" weight="bold" color={Color.gray10}>
								{r.title}
							</ZText>
							<ZText size="12" weight="regular" color={Color.gray50}>
								{r.note}
							</ZText>
						</View>
						<StatusTag status={r.status} />
					</View>
				))}
			</View>
		</View>
	)
}

function PropertyTab() {
	const items: { title: string; status: StatusTagType; detail: string }[] = [
		{ title: "대지권", status: "양호", detail: "대지권 관련 항목 상세 설명/정의/특약 안내" },
		{ title: "토지별도등기", status: "확인 필요", detail: "토지별도등기 관련 안내 및 확인 포인트" },
		{ title: "가등기", status: "양호", detail: "가등기 관련 안내" },
		{ title: "압류/가압류", status: "확인 필요", detail: "압류/가압류 관련 안내" },
	]
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				권리관계 분석
			</ZText>
			<View style={{ gap: 10 }}>
				{items.map((it) => (
					<View key={it.title} style={{ gap: 8 }}>
						<View style={styles.row}>
							<ZText size="13" weight="bold" color={Color.gray10}>
								{it.title}
							</ZText>
							<StatusTag status={it.status} />
						</View>
						<Disclosure title="상세 보기">
							<ZText size="13" weight="regular" color={Color.gray10}>
								{it.detail}
							</ZText>
						</Disclosure>
					</View>
				))}
			</View>
		</View>
	)
}

function OwnerTab() {
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				소유주 상세 분석
			</ZText>
			<View style={{ gap: 10 }}>
				<RowWithStatus title="건물/토지 소유자 일치" status="양호" />
				<RowWithStatus title="임대사업자 등록" status="해당 없음" />
				<RowWithStatus title="보증금 미반환 이력" status="확인 불가" />
				<Disclosure title="고액 상습 체납자 조회">
					<ZText size="13" weight="regular" color={Color.gray10}>
						조회 버튼을 통해 결과를 확인할 수 있어요. (샘플)
					</ZText>
				</Disclosure>
			</View>
		</View>
	)
}

function MarketTab() {
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				시세 및 여유금액
			</ZText>
			<View style={{ gap: 10 }}>
				<RowWithStatus title="기존 채무금액" status="확인 필요" subtitle="채무가 있다고 무조건 위험이 아니에요. 규모/우선순위를 확인하세요." />
				<RowWithStatus title="여유 금액" status="확인 필요" subtitle="여유금액이 없으면 경고 안내 제공" />
				<RowWithStatus title="최우선 변제권" status="양호" subtitle="설명 팝업/툴팁 제공 (TBD)" />
				<Disclosure title="공문서 확인하기(등기부등본)">
					<ZText size="13" weight="regular" color={Color.gray10}>
						PDF 다운로드 버튼(건물/토지) 자리 (TBD)
					</ZText>
				</Disclosure>
			</View>
		</View>
	)
}

function LoanTab() {
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				대출/보험 예비심사
			</ZText>
			<View style={{ gap: 10 }}>
				<RowWithStatus title="보증보험 예비심사" status="가능성 높음" subtitle="보증보험 가입에 문제가 없어 보여요!" />
				<RowWithStatus title="보증금 대출 예비심사" status="불가" subtitle="보증금 대출이 힘들 수 있어요." />
				<ZText size="12" weight="regular" color={Color.gray50}>
					예비 심사는 실제 대출상담결과와 다를 수 있습니다.
				</ZText>
			</View>
		</View>
	)
}

function SpecialTab() {
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				맞춤형 특약
			</ZText>
			<ZText size="13" weight="regular" color={Color.gray10}>
				각 진단 항목의 하위 정보 구조 내에서 특약 안내가 제공될 수 있어요. (샘플)
			</ZText>
			<View style={{ gap: 10 }}>
				DisclosureCard("추천 특약 1", "특약 문구 예시 및 적용 포인트")
				DisclosureCard("추천 특약 2", "특약 문구 예시 및 적용 포인트")
				DisclosureCard("추천 특약 3", "특약 문구 예시 및 적용 포인트")
			</View>
		</View>
	)
}

function SafetyTab() {
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				치안/안전
			</ZText>
			<View style={{ gap: 10 }}>
				RowWithStatus title="방범 시설 분포(500m)" status="양호" subtitle="지도 시각화 + 시설 개수 리스트 (TBD)" />
				RowWithStatus title="안전 귀갓길 체크" status="확인 필요" subtitle="위험(빨강)/주의(노랑)/경로(점선) (TBD)" />
				<View style={{ gap: 8 }}>
					<RowWithStatus title="동네 유흥업소 수 비교" status="양호" subtitle="인근 동네 2~3개 비교 바 차트" />
					<BarCompareChart
						data={[
							{ label: "이 동네", value: 8, color: Color.orange1 as any },
							{ label: "인근 A", value: 12, color: Color.blue1 as any },
							{ label: "인근 B", value: 5, color: Color.blue1 as any },
						]}
						note={'Q. "유흥 업소"에는 어떤 것들이 있나요?  A. 단란주점, 나이트클럽, 룸살롱, 모텔 등을 포함합니다.'}
					/>
				</View>

				<View style={{ gap: 8 }}>
					<RowWithStatus title="지난해 범죄 발생 수 비교" status="확인 필요" subtitle='출처: 경찰청 · 폭력/사기/절도/성폭행(4종) 기준' />
					<BarCompareChart
						data={[
							{ label: "이 구", value: 320, color: Color.orange1 as any },
							{ label: "인근 구 A", value: 260, color: Color.blue1 as any },
							{ label: "인근 구 B", value: 410, color: Color.blue1 as any },
						]}
						note={"Q. 어디서 가져온 정보인가요? A. 경찰청 최신 데이터 기준으로 제작됩니다. (연 1회 업데이트)"}
					/>
				</View>
				<Disclosure title="추가로 확인해보세요">
					<ZText size="13" weight="regular" color={Color.gray10}>
						체크리스트 보기 / 주변 성범죄자 조회 버튼 영역 (TBD)
					</ZText>
				</Disclosure>
			</View>
		</View>
	)
}

function LifeTab() {
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				생활/편의
			</ZText>
			<View style={{ gap: 10 }}>
				RowWithStatus title="편의 시설(500m)" status="양호" subtitle="지도 시각화 + 시설 개수 리스트 (TBD)" />
				<View style={{ gap: 8 }}>
					<RowWithStatus title="내 동네와 비교하기" status="확인 필요" subtitle="+ 내 동네 설정 / 레이더 차트(6축)" />
					<RadarChart
						aLabel="이 동네"
						bLabel="내 동네"
						metrics={[
							{ key: "transport", label: "대중교통" },
							{ key: "mart", label: "마트" },
							{ key: "hospital", label: "병원" },
							{ key: "school", label: "학교" },
							{ key: "cafe", label: "카페" },
							{ key: "park", label: "공원" },
						]}
						aValues={{ transport: 62, mart: 48, hospital: 70, school: 55, cafe: 40, park: 66 }}
						bValues={{ transport: 90, mart: 72, hospital: 82, school: 60, cafe: 78, park: 44 }}
					/>
					<Disclosure title="항목 상세 보기(샘플)">
						<ZText size="13" weight="regular" color={Color.gray10}>
							대중교통 - 이 동네 3개, 내 동네 183개 (샘플)
						</ZText>
					</Disclosure>
				</View>
			</View>
		</View>
	)
}

function RowWithStatus({ title, status, subtitle }: { title: string; status: StatusTagType; subtitle?: string }) {
	return (
		<View style={styles.row}>
			<View style={{ flex: 1, gap: 4 }}>
				<ZText size="13" weight="bold" color={Color.gray10}>
					{title}
				</ZText>
				{subtitle ? (
					<ZText size="12" weight="regular" color={Color.gray50}>
						{subtitle}
					</ZText>
				) : null}
			</View>
			<StatusTag status={status} />
		</View>
	)
}

function DisclosureCard(title: string, body: string) {
	return (
		<Disclosure title={title}>
			<ZText size="13" weight="regular" color={Color.gray10}>
				{body}
			</ZText>
		</Disclosure>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Color.white as any },
	container: { padding: 16, gap: 12 },
	summaryCard: { padding: 16, borderRadius: 12, backgroundColor: Color.gray99 as any },
	aiRow: { flexDirection: "row", alignItems: "center", gap: 8 },
	body: { gap: 12, paddingBottom: 24 },
	card: { padding: 16, borderRadius: 12, backgroundColor: Color.gray99 as any, gap: 12 },
	row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
})

