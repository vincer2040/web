import type { IntersectionOps } from "./interfaces";

export function intersectionOptsFactory(): IntersectionOps {
    return {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
    };
}

export class Cache<T> {
    private buf: Array<T>;
    private insert: number;
    constructor(private factory: () => T, private capacity: number) {
        this.insert = 0;
        this.buf = new Array<T>(this.capacity);
    }

    get(): T {
        let out: T;
        if (this.insert === 0) {
            out = this.factory();
            return out;
        }
        out = this.buf.pop() as T;
        this.insert--;
        return out;
    }

    toCache(val: T): void {
        if (this.insert === this.capacity) {
            return;
        }
        this.buf[this.insert] = val;
        this.insert++;
    }
}
