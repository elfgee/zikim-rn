import React from "react"
import { Stack } from "expo-router"
import { DiagnosisProvider } from "@/components/diagnosis/diagnosis-context"

export default function DiagnosisLayout() {
	return (
		<DiagnosisProvider>
			<Stack
				screenOptions={{
					headerShadowVisible: false,
					headerBackTitleVisible: false,
				}}
			/>
		</DiagnosisProvider>
	)
}

