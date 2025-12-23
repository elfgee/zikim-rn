import React, { ComponentType } from "react"
import hoistNonReactStatics from "hoist-non-react-statics"
import type { DialogProps } from "../components/Dialog"
import { createStore, useStore } from "../libs/globalStore"

type State = Omit<DialogProps, "visible"> & { visible?: boolean }

export interface DialogActions<T = State> {
	showDialog: (state: State) => void
	closeDialog: () => void
	data: T
}

const state: State = {}
const dialogStore = createStore(state)
const showDialog = (state: State) => dialogStore.setState({ ...state, visible: true })
const closeDialog = () => dialogStore.setState((state) => ({ ...state, visible: false }))

export function useDialog(): DialogActions
export function useDialog<TValue>(selector: (state: State) => TValue): DialogActions<TValue>
export function useDialog<TValue>(selector?: (state: State) => TValue) {
	const data = useStore(dialogStore, selector)
	return { showDialog, closeDialog, data }
}

export const withDialog = <T extends { dialog: DialogActions }>(
	WrappedComponent: ComponentType<T>
): React.ComponentType<Omit<T, "dialog">> => {
	class WithDialog extends React.Component<Omit<T, "dialog">> {
		state = { value: dialogStore.getState() }
		unsubscribe: (() => void) | undefined
		componentDidMount() {
			this.unsubscribe = dialogStore.subscribe((value) => this.setState({ value }))
		}
		componentWillUnmount() {
			this.unsubscribe?.()
		}
		render() {
			return <WrappedComponent {...(this.props as T)} dialog={{ showDialog, closeDialog, data: this.state }} />
		}
	}
	//? https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
	hoistNonReactStatics(WithDialog, WrappedComponent)
	return WithDialog
}
