import { useCallback } from "react"
import { useSyncExternalStore } from "use-sync-external-store/shim"

type Listener<T> = (arg: T) => void
export interface Store<TState> {
	getState: () => TState
	setState: (fn: TState | ((state: TState) => TState)) => void
	subscribe: (listener: Listener<TState>) => () => void
}

export function createStore<TState>(initialState: TState): Store<TState> {
	let state = initialState
	const getState: () => TState = () => state
	const listeners = new Set<Listener<TState>>()
	const setState: Store<TState>["setState"] = (fn) => {
		state = fn instanceof Function ? fn(state) : fn
		listeners.forEach((l) => l(state))
	}
	const subscribe = (listener: Listener<TState>) => {
		listeners.add(listener)
		return () => listeners.delete(listener)
	}
	return { getState, setState, subscribe }
}

export function useStore<TState>(store: Store<TState>): TState
export function useStore<TState, TValue>(store: Store<TState>, selector?: (state: TState) => TValue): TValue
export function useStore<TState, TValue>(store: Store<TState>, selector?: (state: TState) => TValue) {
	const getSnapshot = useCallback(() => (selector ? selector(store.getState()) : store.getState()), [store, selector])
	return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}
