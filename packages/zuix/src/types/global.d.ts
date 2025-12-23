export type PartialWithout<T, K extends keyof T> = Partial<T> & Required<{ [P in K]: T[P] }>
