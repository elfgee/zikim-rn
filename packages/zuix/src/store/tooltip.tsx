import hoistNonReactStatics from "hoist-non-react-statics"
import React, { ComponentType, useCallback, useContext, useEffect, useRef } from "react"
import { createStore, Store, useStore } from "../libs/globalStore"
import { TooltipProps } from "../types/tooltip"
export interface TooltipActions<T = TooltipProps> {
	showTooltip: (state: Omit<TooltipProps, "visible" | "rootRef">) => void
	closeTooltip: () => void
	data: T
}

const defaultState = { visible: false }
const defaultContext = {
	getState: () => defaultState,
	setState: () => null,
	subscribe: () => () => null,
}

export const TooltipContext = React.createContext<Store<TooltipProps>>(defaultContext)

export const useTooltipWithNode = (node: TooltipProviderProps["node"]) => {
	const store = useRef(createStore<TooltipProps>({ subtitle: "", visible: false, rootRef: node ?? undefined }))
	const data = useStore(store.current)
	const closeTooltip = useCallback(() => {
		if (!store.current.getState().visible) return
		store.current.setState(({ rootRef }) => ({ rootRef, visible: false }))
	}, [store])
	useEffect(() => {
		store.current.setState((state) => ({ ...state, rootRef: node ?? undefined }))
	}, [node])
	return { store, data, closeTooltip }
}

export function useTooltip(): TooltipActions
export function useTooltip<TValue>(selector: (state: TooltipProps) => TValue): TooltipActions<TValue>
export function useTooltip<TValue>(selector?: (state: TooltipProps) => TValue) {
	const store = useContext(TooltipContext)
	const data = useStore(store, selector)
	const closeTooltip = () => store.setState(({ rootRef }) => ({ rootRef, visible: false }))
	const showTooltip: TooltipActions["showTooltip"] = (state) =>
		store.setState(({ rootRef }) => ({ ...state, rootRef, visible: true }))
	return { showTooltip, closeTooltip, data }
}

export const withTooltip = <T extends { tooltip: Pick<TooltipActions, "showTooltip" | "closeTooltip"> }>(
	WrappedComponent: ComponentType<T>
): ComponentType<Omit<T, "tooltip">> => {
	class WithTooltip extends React.Component<Omit<T, "tooltip">> {
		render() {
			return (
				<TooltipContext.Consumer>
					{(store) => (
						<WrappedComponent
							{...(this.props as T)}
							tooltip={{
								showTooltip: (...state: Parameters<TooltipActions["showTooltip"]>) => {
									store.setState(({ rootRef }) => ({ ...state, rootRef, visible: true }))
								},
								closeTooltip: () => store.setState(({ rootRef }) => ({ rootRef, visible: false })),
							}}
						/>
					)}
				</TooltipContext.Consumer>
			)
		}
	}
	//? https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
	hoistNonReactStatics(WithTooltip, WrappedComponent)
	return WithTooltip
}
export interface TooltipProviderProps {
	node: React.Component | null
}
