import Subject from "observable";
import type { Observer } from "observable";

type Cpus = Array<number>;

type ProcessInfo = {
    pid: string,
    name: string,
};

type Processes = Array<ProcessInfo>;

class CpuSubject extends Subject {
    private _cpus!: Cpus;
    constructor() {
        super();
    }

    get cpus(): Cpus {
        return this._cpus;
    }

    set cpus(cpus: Cpus) {
        this._cpus = cpus;
        this.notify();
    }
}

class ProcessSubject extends Subject {
    private _processes!: Processes;
    constructor() {
        super();
    }

    get processes(): Processes {
        return this._processes;
    }

    set processes(p: Processes) {
        this._processes = p;
        this.notify();
    }
}

class CpuObserver implements Observer {
    private children: Array<HTMLElement>;
    constructor() {
        this.children = new Array(0);
    }

    public update(cpuSubject: CpuSubject): void {
        let cpus = cpuSubject.cpus;
        this.render(cpus);
    }

    private render(cpus: Cpus) {
        let ul = document.getElementById("cpus") as HTMLUListElement;
        let i: number;
        let len = cpus.length;
        if (this.children.length === 0) {
            this.children = new Array(len);
            for (i = 0; i < len; i++) {
                let cpui = cpus[i].toFixed(2);
                let pi = document.createElement("p");
                let pcpu = document.createElement("p");
                let dcpu = document.createElement("div");
                let animcpu = document.createElement("div");
                pi.innerText = `${i + 1}: `;
                pi.classList.add("p-2");
                pcpu.innerText = `${cpui}`
                pcpu.classList.add("grid", "place-items-center", "absolute", "w-full", "h-full", "z-10");
                dcpu.classList.add("w-full", "bg-sky-200", "grid", "p-2", "rounded-md", "relative");
                animcpu.classList.add("absolute", "bg-sky-600", "rounded-md", "duration-100");
                animcpu.style.width = `${cpui}%`
                animcpu.style.height = "100%";
                dcpu.append(pcpu);
                dcpu.append(animcpu);
                this.children[i] = document.createElement("li");
                this.children[i].classList.add("flex", "gap-3", "w-1/3");
                this.children[i].append(pi);
                this.children[i].append(dcpu);
            }
            ul.append(...this.children);
        } else {
            for (i = 0; i < len; i++) {
                let cpui = cpus[i].toFixed(2);
                let dcpu = this.children[i].children[1] as HTMLElement;
                let pcpu = dcpu.children[0] as HTMLElement;
                let animcpu = dcpu.children[1] as HTMLElement;
                pcpu.innerText = `${cpui}%`
                animcpu.style.width = `${cpui}%`
            }
        }
    }
}

class ProcessObserver implements Observer {
    constructor() {}

    update(theChangedObject: ProcessSubject): void {
        let processes = theChangedObject.processes;
        console.log(processes);
    }
}

function getWsURL(u: string): string {
    let url = new URL(window.location.origin + u);
    url.protocol = url.protocol.replace("http", "ws");
    return url.href;
}

function createWebSocket(url: string): WebSocket {
    return new WebSocket(url);
}

function main() {
    let cpuUrl = getWsURL("/realtime/cpus");
    let processUrl = getWsURL("/realtime/processes");
    let cpuws = createWebSocket(cpuUrl);
    let processws = createWebSocket(processUrl);
    let cpuSubject = new CpuSubject();
    let processSubject = new ProcessSubject();
    let cpuObserver = new CpuObserver();
    let processObserver = new ProcessObserver();
    cpuSubject.attach(cpuObserver);
    processSubject.attach(processObserver);
    cpuws.onmessage = (ev) => {
        let data: Cpus = JSON.parse(ev.data) as Cpus;
        cpuSubject.cpus = data;
    }
    processws.onmessage = (ev) => {
        let data: Processes = JSON.parse(ev.data) as Processes;
        processSubject.processes = data;
    }
}

main();

