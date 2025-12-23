import { PropsWithChildren } from "react"
import { TooltipProviderProps, useTooltipWithNode, TooltipContext } from "../../store/tooltip"
import { Tooltip } from "../../components/tooltip/Tooltip"

export const TooltipProvider = ({ node, children }: PropsWithChildren<TooltipProviderProps>) => {
	const { store, data, closeTooltip } = useTooltipWithNode(node)
	return (
		<TooltipContext.Provider value={store.current}>
			{children}
			{data.visible && !!node && <Tooltip {...data} rootRef={node} visible onClose={closeTooltip} />}
		</TooltipContext.Provider>
	)
}
