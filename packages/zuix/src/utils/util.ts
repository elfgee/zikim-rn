export function getValue<ObjectType>(object: ObjectType, path: string): ObjectType | undefined {
	const keys = path.split(".")
	let result = object
	try {
		for (const key of keys) {
			result = (result as unknown as { [key: string]: ObjectType })[key]
		}
		return result
	} catch (e) {
		return undefined
	}
}

export const notUndefinedOrNull = <T>(x: T | null): x is NonNullable<T> => {
	return x !== undefined && x !== null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
	let isThrottled = false

	const throttledFunction = (...args: Parameters<T>): ReturnType<T> | void => {
		if (isThrottled) {
			return undefined
		}

		isThrottled = true

		setTimeout(() => {
			isThrottled = false
			func(...args)
		}, delay)

		return func(...args)
	}

	return throttledFunction as T
}
