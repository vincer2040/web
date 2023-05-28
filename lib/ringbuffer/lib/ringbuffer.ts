
export default class RingBuffer<T> {
    private insertIndex = 0;
    private removalIndex = 0;
    private buffer: T[];
    constructor(initialCap: number, private factory: () => T) {
        this.buffer = new Array(initialCap);
    }

    capacity(): number {
        return this.buffer.length;
    }

    fromCache(): T {
        if (this.insertIndex === this.removalIndex) {
            const out: T = this.factory();
            return out;
        }

        const out = this.buffer[this.removalIndex];

        this.removalIndex = (this.removalIndex + 1) % this.buffer.length;

        return out;
    }

    toCache(item: T): void {
        this.buffer[this.insertIndex] = item;

        this.insertIndex = (this.insertIndex + 1) % this.buffer.length;

        if (this.insertIndex === this.removalIndex) {
            const nextBuffer = new Array(this.buffer.length * 2);
            for (let i = 0; i < this.buffer.length; i++) {
                nextBuffer[i] = this.buffer[i];
            }
            this.removalIndex = 0;
            this.insertIndex = this.buffer.length;
            this.buffer = nextBuffer;
        }
    }
}
