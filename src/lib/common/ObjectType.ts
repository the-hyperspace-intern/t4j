export type NonVoidArray<T> = [T, ...T[]];

export type ObjectType<T> = { new (): T } | Function;
