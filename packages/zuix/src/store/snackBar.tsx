import React from "react"
import { ComponentType } from "react"
import hoistNonReactStatic from "hoist-non-react-statics"
import type { SnackBarProps } from "../components/snackBar/SnackBar"
import { createStore, useStore } from "../libs/globalStore"

type State = Omit<SnackBarProps, "onClose">

export interface SnackBarActions<T = State> {
	showSnackBar: (state: Omit<State, "visible">) => void
	closeSnackBar: () => void
	data: T
}

const snackBarStore = createStore<State>({ title: "", visible: false })
const showSnackBar = (state: Omit<State, "visible">) => snackBarStore.setState({ ...state, visible: true })
const closeSnackBar = () => snackBarStore.setState((state) => ({ ...state, visible: false }))

export function useSnackBar(): SnackBarActions
export function useSnackBar<TValue>(selector: (state: State) => TValue): SnackBarActions<TValue>
export function useSnackBar<TValue>(selector?: (state: State) => TValue) {
	const data = useStore(snackBarStore, selector)
	return { showSnackBar, closeSnackBar, data }
}

export const withSnackBar = <T extends { snackBar: SnackBarActions }>(
	WrappedComponent: ComponentType<T>
): ComponentType<Omit<T, "snackBar">> => {
	class WithSnackBar extends React.Component<Omit<T, "snackBar">> {
		state = { value: snackBarStore.getState() }
		unsubscribe: (() => void) | undefined

		componentDidMount() {
			this.unsubscribe = snackBarStore.subscribe((value) => this.setState({ value }))
		}
		componentWillUnmount() {
			this.unsubscribe?.()
		}
		render() {
			return (
				<WrappedComponent {...(this.props as T)} snackBar={{ showSnackBar, closeSnackBar, data: this.state }} />
			)
		}
	}
	//? https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
	hoistNonReactStatic(WithSnackBar, WrappedComponent)
	return WithSnackBar
}
