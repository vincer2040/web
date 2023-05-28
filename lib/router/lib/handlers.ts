import type { RouteChangeData } from './interfaces';

export function scrollTo(type: string, id?: string): void {
    if (['link', 'go'].includes(type)) {
        if (id) {
            const el = document.querySelector(id);
            el ? el.scrollIntoView({ behavior: 'smooth', block: 'start' }) : window.scrollTo({ top: 0 });
        } else {
            window.scrollTo({ top: 0 });
        }
    }
}

export function fullURL(url?: string): string {
    const href = new URL(url || window.location.href).href;
    return href.endsWith('/') || href.includes('.') || href.includes('#') ? href : `${href}/`;
}

export function addToPushState(url: string): void {
    if (!window.history.state || window.history.state.url !== url) {
        window.history.pushState({ url }, 'internalLink', url);
    }
}

export function scrollToAnchor(anchor: string) {
    document
    .querySelector(anchor)
    .scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function handlePopState(_: PopStateEvent): RouteChangeData {
    return RouteData.getPopInstance();
}

export function handleLinkClick(e: MouseEvent): RouteChangeData {
    return RouteData.getInstance(e);
}

export class RouteData implements RouteChangeData {
    private static instance: RouteData;
    type: 'link' | 'popstate' | 'noop' | 'disqualified' | 'scroll' | 'go' | 'external' | 'scrolled';
    next?: string;
    prev?: string;
    scrollId?: string;
    private constructor(type: "mouse" | "pop", e?: MouseEvent) {
        if (type === "mouse") this.handleMouse(e);
        if (type === "pop") this.handlePop();
    }

    public static getPopInstance(): RouteData {
        if (!RouteData.instance) {
            RouteData.instance = new RouteData("pop");
        }
        let instance = RouteData.instance;
        instance.handlePop();
        return instance;
    }

    public static getInstance(e: MouseEvent): RouteData {
        if (!RouteData.instance) {
            RouteData.instance = new RouteData("mouse", e);
        }
        let instance = RouteData.instance;
        instance.handleMouse(e);
        return instance;
    }

    private handlePop() {
        const next = fullURL();
        this.type = "popstate"
        this.prev = null;
        this.scrollId = null;
        this.next = next;
    }

    private handleMouse(e: MouseEvent) {
        let anchor: HTMLAnchorElement;
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            this.type = "disqualified";
            this.next = null;
            this.prev = null;
            this.scrollId = null;
            return;
        }
        for (let n = e.target as HTMLElement; n.parentNode; n = n.parentNode as HTMLElement) {
            if (n.nodeName === "A") {
                anchor = n as HTMLAnchorElement;
                break;
            }
        }
        if (anchor && anchor.host !== location.host) {
            anchor.target = "_blank";
            this.type =  "external";
            this.next = null;
            this.prev = null;
            this.scrollId = null;
            return;
        }
        if (anchor && "cold" in anchor?.dataset) {
            this.type =  "disqualified";
            this.next = null;
            this.prev = null;
            this.scrollId = null;
            return;
        }
        if (anchor?.hasAttribute("href")) {
            const ahref = anchor.getAttribute("href");
            const url = new URL(ahref, location.href);
            e.preventDefault();
            if (ahref?.startsWith("#")) {
                scrollToAnchor(ahref);
                this.next = null;
                this.prev = null;
                this.scrollId = null;
                this.type =  "scrolled";
            }
            this.type = "link";
            this.next = fullURL(url.href);
            this.prev = fullURL();
            this.scrollId = ahref.match(/#([\w"-]+)\b/g)?.[0];
            return;
        } else {
            this.type = "noop";
            this.next = null;
            this.prev = null;
            this.scrollId = null;
            return;
        }
    }
}


