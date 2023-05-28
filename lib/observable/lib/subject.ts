import type { SubjectType, Observer } from "./types";

export default class Subject<T> implements SubjectType<T> {

    private subscribers: Observer<T>[];

    constructor(private v: T) {
        this.subscribers = new Array<Observer<T>>();
    }

    public get value(): T {
        return this.v;
    }

    public set value(v: T) {
        if (v === this.v) {
            return;
        }
        this.v = v;
        this.send();
    }

    public subscribe(obs: Observer<T>): void {
        this.subscribers.push(obs);
    }

    private send(): void {
        let i: number;
        let len: number = this.subscribers.length;

        for (i = 0; i < len; i++) {
            let obs = this.subscribers[i];
            obs.receive(this.value);
        }
    }
}

