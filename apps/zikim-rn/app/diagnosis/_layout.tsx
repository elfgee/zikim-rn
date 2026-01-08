import React from "react"
import { Stack } from "expo-router"
import { DiagnosisProvider } from "@/components/diagnosis/diagnosis-context"
import { SnackBar, useSnackBar } from "@zigbang/zuix2"

export default function DiagnosisLayout() {
	return (
		<DiagnosisProvider>
			<>
				<Stack
					screenOptions={{
						headerShadowVisible: false,
						headerBackTitleVisible: false,
					}}
				/>
				<SnackBarHost />
			</>
		</DiagnosisProvider>
	)
}

function SnackBarHost() {
	const { data, closeSnackBar } = useSnackBar()
	// data: { title, subtitle?, visible, ... }
	return <SnackBar {...(data as any)} onClose={closeSnackBar} />
}

