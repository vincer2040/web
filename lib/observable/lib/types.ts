export type SubjectType<T> = {
    value: T,
    subscribe: (obs: Observer<T>) => void,
}

export type Observer<T> = {
    receive: (val: T) => void,
}
