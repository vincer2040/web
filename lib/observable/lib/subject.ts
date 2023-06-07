import { Observer } from "./observer";

export class Subject {
    private _observers: Set<Observer>;
    constructor() {
        this._observers = new Set();
    }

    public attach(o: Observer): void {
        this._observers.add(o);
    }

    public detach(o: Observer): void {
        this._observers.delete(o);
    }

    public notify(): void {
        this._observers.forEach(e => e.update(this));
    }
}
