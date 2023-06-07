import { Subject } from "./subject";

export interface Observer {
    update(theChangedObject: Subject): void;
}
