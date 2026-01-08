import React, { useMemo, useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Color, Pressable, Text, useSnackBar } from "@zigbang/zuix2"
import { Stack } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useDiagnosis } from "@/components/diagnosis/diagnosis-context"
import { formatWonSummary } from "@/components/diagnosis/money"
import { Disclosure } from "@/components/diagnosis/disclosure"
import { StatusTag, type StatusTagType } from "@/components/diagnosis/status-tag"
import { BarCompareChart } from "@/components/diagnosis/charts/bar-compare-chart"
import { RadarChart } from "@/components/diagnosis/charts/radar-chart"

const ZText: any = Text as any
const ZPressable: any = Pressable as any
const ZButton: any = Button as any

type ReportTabKey = "property" | "owner" | "market" | "loan" | "special" | "safety" | "life"

export default function DiagnosisReportScreen() {
	const { draft } = useDiagnosis()
	const [tab, setTab] = useState<ReportTabKey>("property")

	const tabs = useMemo(
		() => [
			{ key: "property", text: "매물 진단" },
			{ key: "owner", text: "집주인 진단" },
			{ key: "market", text: "시세진단" },
			{ key: "loan", text: "대출/보험 진단" },
			{ key: "special", text: "맞춤 특약" },
			{ key: "safety", text: "범죄/치안" },
			{ key: "life", text: "생활/편의" },
		],
		[]
	)

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
			<Stack.Screen
				options={{
					title: "지킴진단",
					headerRight: () => (
						<View style={{ marginRight: 8 }}>
							<Ionicons name="share-outline" size={22} color={Color.gray10 as any} />
						</View>
					),
				}}
			/>
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

					{/* 주요 점검 항목/특약 요약(항상 노출) */}
					<SummaryTab />

					{/* 탭(디자인: 가로 스크롤) */}
					<ReportTabBar tabs={tabs} value={tab} onChange={setTab} />

					{/* 탭별 본문 */}
					<View style={styles.body}>
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
			<ZText size="14" weight="bold" color={Color.gray10}>주요 점검 항목</ZText>
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
			<View style={styles.specialSummary}>
				<ZText size="13" weight="bold" color={Color.gray10}>
					이 집 맞춤형 특약도 확인해보세요!
				</ZText>
				<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
					<ZText size="12" weight="regular" color={Color.gray50}>
						안전한 계약을 위한 추천 특약
					</ZText>
					<ZText size="12" weight="bold" color={Color.gray10}>
						4개
					</ZText>
				</View>
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
						<Disclosure title="상세 보기" defaultOpen={it.status === "확인 필요"}>
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
			<ZText size="14" weight="bold" color={Color.gray10}>시세진단</ZText>
			<View style={styles.infoBox}>
				<ZText size="13" weight="bold" color={Color.gray10}>
					매매 추정 시세란?
				</ZText>
				<ZText size="12" weight="regular" color={Color.gray50}>
					인근 거래/시세 데이터를 기반으로 추정한 값으로, 실제 거래 시점에 따라 변동될 수 있어요.
				</ZText>
			</View>
			<View style={styles.formulaBox}>
				<ZText size="12" weight="regular" color={Color.gray50}>
					여유금액 = (매매 추정 시세) - (기존 채무금액) - (보증금)
				</ZText>
				<View style={styles.formulaGraphic} />
			</View>
			<View style={{ gap: 10 }}>
				<RowWithStatus title="기존 채무금액" status="확인 필요" subtitle="채무가 있다고 무조건 위험이 아니에요. 규모/우선순위를 확인하세요." />
				<RowWithStatus title="여유 금액" status="확인 필요" subtitle="여유금액이 없으면 경고 안내 제공" />
				<RowWithStatus title="최우선 변제권" status="양호" subtitle="설명 컨텐츠는 섹션 내 항상 노출 (TBD)" />
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
	const { showSnackBar } = useSnackBar()
	return (
		<View style={styles.card}>
			<ZText size="14" weight="bold" color={Color.gray10}>
				맞춤형 특약
			</ZText>
			<ZText size="13" weight="regular" color={Color.gray10}>
				각 진단 항목의 하위 정보 구조 내에서 특약 안내가 제공될 수 있어요. (샘플)
			</ZText>
			<View style={{ gap: 10 }}>
				<CopyableClause
					title="등기변동 금지 특약"
					body="계약일 이후부터 잔금 지급일까지 임대인은 본 부동산에 근저당권·가압류·압류·전세권·임차권 등 어떠한 권리도 추가로 설정하거나 변경하지 않는다."
					onCopy={() => showSnackBar({ title: "클립보드에 복사되었습니다." })}
				/>
				<CopyableClause
					title="보증보험 가입 불가 시 무조건 계약 무효"
					body="본 계약은 임대인이 HUG 또는 SGI 보증보험 가입을 한 후에 계약이 유지되며, 가입이 거절될 경우 계약은 무효로 하며 임대인은 임차인에게 손해배상 책임을 부담하지 않고 계약금 전액을 즉시 반환한다."
					onCopy={() => showSnackBar({ title: "클립보드에 복사되었습니다." })}
				/>
				<CopyableClause
					title="확정일자 및 전입신고 보장"
					body="임대인은 임차인의 잔금 지급일에 즉시 전입신고 및 확정일자 부여를 받을 수 있도록 협조하며, 임차인의 전입 및 확정일자를 지연시키는 어떠한 방해도 하지 않는다."
					onCopy={() => showSnackBar({ title: "클립보드에 복사되었습니다." })}
				/>
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
					<CrimeCompareCards
						items={[
							{ label: "마포구", valueText: "98건" },
							{ label: "은평구", valueText: "121건" },
							{ label: "서대문구", valueText: "75건" },
						]}
					/>
					<Disclosure title="FAQ">
						<ZText size="13" weight="regular" color={Color.gray10}>
							Q. 어디서 가져온 정보인가요?{"\n"}A. 1년에 한번 시/군/구 단위로 업데이트 되는 경찰청 최신 데이터 기준으로 제작되어 보여집니다.
						</ZText>
					</Disclosure>
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
							// 디자인 기준 축/순서(시계방향): 편의점 → 대형마트 → 대중교통 → 교육/학원가 → 외식/카페 → 병원/약국
							{ key: "conv", label: "편의점" },
							{ key: "bigmart", label: "대형마트" },
							{ key: "transport", label: "대중교통" },
							{ key: "academy", label: "교육/학원가" },
							{ key: "dining", label: "외식/카페" },
							{ key: "hospital", label: "병원/약국" },
						]}
						aValues={{ conv: 60, bigmart: 30, transport: 50, academy: 40, dining: 55, hospital: 45 }}
						bValues={{ conv: 45, bigmart: 55, transport: 80, academy: 35, dining: 60, hospital: 70 }}
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

function ReportTabBar({
	tabs,
	value,
	onChange,
}: {
	tabs: { key: ReportTabKey; text: string }[]
	value: ReportTabKey
	onChange: (k: ReportTabKey) => void
}) {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
			{tabs.map((t) => {
				const selected = t.key === value
				return (
					<ZPressable key={t.key} feedback={false} onPress={() => onChange(t.key)} style={styles.tabItem}>
						<ZText size="13" weight={selected ? "bold" : "medium"} color={selected ? Color.orange1 : Color.gray50}>
							{t.text}
						</ZText>
						<View style={[styles.tabUnderline, selected ? styles.tabUnderlineOn : styles.tabUnderlineOff]} />
					</ZPressable>
				)
			})}
		</ScrollView>
	)
}

function CopyableClause({ title, body, onCopy }: { title: string; body: string; onCopy: () => void }) {
	return (
		<View style={styles.clauseCard}>
			<View style={styles.clauseHeader}>
				<ZText size="13" weight="bold" color={Color.gray10}>
					✓ {title}
				</ZText>
				<ZButton theme="transparent" title="" size="32" onPress={onCopy} style={styles.iconBtn}>
					<Ionicons name="copy-outline" size={18} color={Color.gray10 as any} />
				</ZButton>
			</View>
			<ZText size="13" weight="regular" color={Color.gray10}>
				{body}
			</ZText>
		</View>
	)
}

function CrimeCompareCards({ items }: { items: { label: string; valueText: string }[] }) {
	return (
		<View style={styles.crimeRow}>
			{items.map((it) => (
				<View key={it.label} style={styles.crimeCard}>
					<ZText size="12" weight="regular" color={Color.gray50} textAlign="center">
						{it.label}
					</ZText>
					<ZText size="16" weight="bold" color={Color.gray10} textAlign="center">
						{it.valueText}
					</ZText>
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: Color.white as any },
	container: { padding: 16, gap: 12 },
	summaryCard: { padding: 16, borderRadius: 12, backgroundColor: Color.gray99 as any },
	aiRow: { flexDirection: "row", alignItems: "center", gap: 8 },
	specialSummary: { marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: Color.white as any, gap: 8 },
	infoBox: { padding: 12, borderRadius: 12, backgroundColor: Color.white as any, gap: 6 },
	formulaBox: { padding: 12, borderRadius: 12, backgroundColor: Color.white as any, gap: 10 },
	formulaGraphic: { height: 44, borderRadius: 10, backgroundColor: Color.gray95 as any },
	body: { gap: 12, paddingBottom: 24 },
	card: { padding: 16, borderRadius: 12, backgroundColor: Color.gray99 as any, gap: 12 },
	row: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
	tabBar: { gap: 18, paddingVertical: 6, paddingHorizontal: 2 },
	tabItem: { alignItems: "center", gap: 6 },
	tabUnderline: { height: 2, width: "100%" },
	tabUnderlineOn: { backgroundColor: Color.orange1 },
	tabUnderlineOff: { backgroundColor: "transparent" },
	clauseCard: { padding: 14, borderRadius: 12, backgroundColor: Color.white as any, gap: 10 },
	clauseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
	iconBtn: { paddingHorizontal: 6, paddingVertical: 6 },
	crimeRow: { flexDirection: "row", gap: 10 },
	crimeCard: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: Color.white as any, gap: 6 },
})

