import RingBuffer from "./ringbuffer";

export default function ringBuffer<T>(initialCap: number, factory: () => T): RingBuffer<T> {
    return new RingBuffer(initialCap, factory);
}
