import type { FetchProgressEvent, FlamethrowerOptions, RouteChangeData } from "./interfaces";
import { addToPushState, handleLinkClick, handlePopState, scrollTo } from "./handlers";
import { mergeHead, formatNextDocument, replaceBody, runScripts } from "./dom";

const intersectionOpts = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
} as const;

export class Router {
    public enabled = true;
    private prefetched = new Set<string>();
    private observer: IntersectionObserver;

    constructor(private opts?: FlamethrowerOptions) {
        if (!this.opts) {
            this.opts.log = false;
            this.opts.pageTransitions = false;
        }

        if (window?.history) {
            document.addEventListener("click", (e) => this.onClick(e));
            window.addEventListener("popstate", (e) => this.onPop(e));
            this.opts.log && console.log("🔥 router engaged");
            this.prefetch();
        } else {
            console.warn("flamethrower router not supported in this browser or environment");
            this.enabled = false;
        }
    }

    public go(path: string): Promise<boolean> {
        const prev = window.location.href;
        const next = new URL(path, location.origin).href;
        return this.reconstructDOM({ type: "go", next, prev });
    }

    public back(): void {
        window.history.back();
    }

    public forward(): void {
        window.history.forward();
    }

    private get allLinks(): (HTMLAnchorElement | HTMLAreaElement)[] {
        let ret = new Array<HTMLAreaElement | HTMLAnchorElement>();
        let links = document.links;
        let linksLen = links.length;
        let i: number;
        for (i = 0; i < linksLen; i++) {
            let node = links.item(i);
            if (node.href.includes(document.location.origin) &&
                !node.href.includes("#") &&
                node.href !== (document.location.href || document.location.href + "/") &&
                !this.prefetched.has(node.href)
               ) {
                ret.push(node);
            }
        }
        return ret;
    }

    private log(...args: any[]): void {
        this.opts.log && console.log(...args);
    }

    private prefetch(): void {
        if (this.opts.prefetch === "visible") {
            this.prefetchVisible();
        } else if (this.opts.prefetch === "hover") {
            this.prefetchOnHover();
        } else {
            return;
        }
    }

    private prefetchOnHover(): void {
        this.allLinks.forEach((node) => {
            const url = node.getAttribute("href");
            node.addEventListener("pointerenter", () => this.createLink(url), { once: true });
        });
    }

    private prefetchVisible(): void {
        if ("IntersectionObserver" in window) {
            this.observer ||= new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    const url = entry.target.getAttribute("href");

                    if (this.prefetched.has(url)) {
                        observer.unobserve(entry.target);
                        return;
                    }

                    if (entry.isIntersecting) {
                        this.createLink(url);
                        observer.unobserve(entry.target);
                    }
                });
            }, intersectionOpts);
            this.allLinks.forEach((node) => this.observer.observe(node));
        }
    }

    private createLink(url: string): void {
        const linkEl = document.createElement("link");
        linkEl.rel = "prefetch";
        linkEl.href = url;
        linkEl.as = "document";

        linkEl.onload = () => this.log("🌩️ prefetched", url);
        linkEl.onerror = (err) => this.log("🤕 can\"t prefetch", url, err);

        document.head.appendChild(linkEl);

        this.prefetched.add(url);
    }

    private onClick(e: MouseEvent): void {
        this.reconstructDOM(handleLinkClick(e));
    }

    private onPop(e: PopStateEvent): void {
        this.reconstructDOM(handlePopState(e));
    }

    private async reconstructDOM({ type, next, prev, scrollId }: RouteChangeData): Promise<boolean> {
        if (!this.enabled) {
            this.log("router disabled");
            return;
        }
        try {
            this.log("⚡", type);
            if (["popstate", "link", "go"].includes(type) && next !== prev) {

                this.opts.log && console.time("⏱️");

                window.dispatchEvent(new CustomEvent("flamethrower:router:fetch"));
                if (type != "popstate") {
                    addToPushState(next);
                }

                const res = await fetch(next, { headers: { "X-Flamethrower": "1" } })
                .then((res) => {
                    const reader = res.body.getReader();
                    const length = parseInt(res.headers.get("Content-Length"));
                    let bytesReceived = 0;
                    return new ReadableStream({
                        start(controller) {
                            function push() {
                                reader.read().then(({ done, value }) => {
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    bytesReceived += value.length;
                                    window.dispatchEvent(
                                        new CustomEvent<FetchProgressEvent>("flamethrower:router:fetch-progress", {
                                            detail: {
                                                progress: Number.isNaN(length) ? 0 : (bytesReceived / length) * 100,
                                                received: bytesReceived,
                                                length: length || 0,
                                            },
                                        }),
                                    );
                                    controller.enqueue(value);
                                    push();
                                });
                            }
                            push();
                        },
                    });
                })
                .then((stream) => new Response(stream, { headers: { "Content-Type": "text/html" } }));

                const html = await res.text();
                const nextDoc = formatNextDocument(html);
                mergeHead(nextDoc);
                if (this.opts.pageTransitions && (document as any).createDocumentTransition) {
                    const transition = (document as any).createDocumentTransition();
                    transition.start(() => {
                        replaceBody(nextDoc);
                        runScripts();
                        scrollTo(type, scrollId);
                    });
                } else {
                    replaceBody(nextDoc);
                    runScripts();
                    scrollTo(type, scrollId);
                }


                window.dispatchEvent(new CustomEvent("flamethrower:router:end"));
                setTimeout(() => {
                    this.prefetch();
                }, 200);
                this.opts.log && console.timeEnd("⏱️");
                document.removeEventListener("click", (e) => this.onClick(e), true);
            }
        } catch (err) {
            window.dispatchEvent(new CustomEvent("flamethrower:router:error", err));
            this.opts.log && console.timeEnd("⏱️");
            console.error("💥 router fetch failed", err);
            return false;
        }
    }
}
