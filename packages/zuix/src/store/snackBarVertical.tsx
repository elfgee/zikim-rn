import React, { ComponentType } from "react"
import hoistNonReactStatics from "hoist-non-react-statics"
import { SnackBarVerticalProps } from "../components/snackBar/SnackBarVertical"
import { createStore, useStore } from "../libs/globalStore"

type State = Omit<SnackBarVerticalProps, "onClose">

export interface SnackBarVerticalActions<T = State> {
	showSnackBar: (state: Omit<State, "visible">) => void
	closeSnackBar: () => void
	data: T
}

const snackBarStore = createStore<State>({ title: "", visible: false })
const showSnackBar = (state: Omit<State, "visible">) => snackBarStore.setState({ ...state, visible: true })
const closeSnackBar = () => snackBarStore.setState((state) => ({ ...state, visible: false }))

export function useSnackBarVertical(): SnackBarVerticalActions
export function useSnackBarVertical<TValue>(selector: (state: State) => TValue): SnackBarVerticalActions<TValue>
export function useSnackBarVertical<TValue>(selector?: (state: State) => TValue) {
	const data = useStore(snackBarStore, selector)
	return { showSnackBar, closeSnackBar, data }
}
export const withSnackBarVertical = <T extends { snackBarVertical: SnackBarVerticalActions }>(
	WrappedComponent: ComponentType<T>
): ComponentType<Omit<T, "snackBarVertical">> => {
	class WithSnackBarVertical extends React.Component<Omit<T, "snackBarVertical">> {
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
				<WrappedComponent
					{...(this.props as T)}
					snackBarVertical={{ showSnackBar, closeSnackBar, data: this.state }}
				/>
			)
		}
	}
	//? https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
	hoistNonReactStatics(WithSnackBarVertical, WrappedComponent)
	return WithSnackBarVertical
}
