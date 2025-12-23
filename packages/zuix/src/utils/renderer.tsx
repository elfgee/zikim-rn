import React, { ComponentType, Fragment, ReactElement } from "react"
import { Text, TextProps, TextType } from "../components/Text"

export const renderTextByProps = (
	defaultProps: TextProps,
	appendedProps?: TextType,
	appendProps?: (firstProps: TextProps, secondProps: string | TextProps) => TextProps
) => {
	if (!appendedProps) return null
	if (appendedProps && (isTextComponent(appendedProps) || isFragmentComponent(appendedProps))) return appendedProps
	const extraProps = appendProps?.(defaultProps, appendedProps ?? {})
	if (typeof appendedProps === "string")
		return <Text {...Object.assign({}, defaultProps, extraProps)}>{appendedProps}</Text>
	const mergeProps = Object.assign({}, defaultProps, appendedProps, extraProps)
	if (!mergeProps.children) return null
	return renderByProps(Text, mergeProps)
}

const isFragmentComponent = (component: TextType): component is React.ReactComponentElement<typeof Fragment> => {
	return (
		typeof component === "object" && (component as React.ReactComponentElement<typeof Fragment>).type === Fragment
	)
}

export const isTextComponent = (component: TextType): component is React.ReactComponentElement<typeof Text> => {
	return typeof component === "object" && (component as React.ReactComponentElement<typeof Text>).type === Text
}

export const isComponent = <T extends React.ComponentType>(
	ele: React.ReactElement<T> | unknown
): ele is React.ReactElement => {
	return typeof ele === "object" && typeof (ele as React.ReactElement).type === "function"
}

export const renderByProps = <K, T extends ComponentType<K>>(
	Comp: ComponentType<K>,
	props: ReactElement<T> | K
): JSX.Element | null => {
	if (typeof props === "object" && (props as ReactElement<T>).type === Comp) return props as ReactElement<T>
	const propsObj = props as K
	//@ts-ignore
	return <Comp {...propsObj} />
}
