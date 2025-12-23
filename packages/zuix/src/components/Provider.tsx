import React, { FC, useEffect, useMemo } from "react"
import { useSnackBarVertical } from "../store/snackBarVertical"
import { useSnackBar } from "../store/snackBar"
import { useDialog } from "../store/dialog"
import { Dialog, DialogProps } from "../components/Dialog"
import { SnackBar, SnackBarProps } from "../components/snackBar/SnackBar"
import { SnackBarVertical, SnackBarVerticalProps } from "../components/snackBar/SnackBarVertical"

const providerRefs = new Set()

interface ProviderProps {
	snackBarProps?: Omit<SnackBarProps, "title" | "visible" | "onClose">
	snackBarVerticalProps?: Omit<SnackBarVerticalProps, "title" | "visible" | "onClose">
	dialogProps?: Omit<DialogProps, "visible">
	children?: React.ReactNode
}

export const Provider: FC<ProviderProps> = ({ children, snackBarProps, snackBarVerticalProps, dialogProps }) => {
	const ref = useMemo(() => {
		const _ref = {}
		providerRefs.add(_ref)
		return _ref
	}, [])
	const { data: dialogData, closeDialog } = useDialog()
	const { data: snackBarData, closeSnackBar } = useSnackBar()
	const { data: verticalData, closeSnackBar: closeVertical } = useSnackBarVertical()
	useEffect(
		() => () => {
			providerRefs.delete(ref)
		},
		[]
	)
	const isLastProvider = Array.from(providerRefs)[providerRefs.size - 1] === ref
	if (!isLastProvider) return <>{children}</>
	return (
		<>
			{children}
			{dialogData.visible && <Dialog onClose={closeDialog} visible {...dialogData} {...dialogProps} />}
			{snackBarData.visible && <SnackBar {...snackBarData} visible onClose={closeSnackBar} {...snackBarProps} />}
			{verticalData.visible && (
				<SnackBarVertical {...verticalData} visible onClose={closeVertical} {...snackBarVerticalProps} />
			)}
		</>
	)
}
