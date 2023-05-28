import { Router } from "./router";

const PrefetchTypes = ["visible", "hover"] as const;
const LinkTypes = ["link", "popstate", "noop", "disqualified", "scroll", "go", "external", "scrolled"] as const;

type PrefetchType = typeof PrefetchTypes[number];
type LinkType = typeof LinkTypes[number];

export type FlamethrowerOptions = {
    log?: boolean;
    prefetch?: PrefetchType;
    pageTransitions?: boolean;
};

export interface RouteChangeData {
    type: LinkType;
    next?: string;
    prev?: string;
    scrollId?: string;
};

export type FlameWindow = Window & typeof globalThis & { flamethrower: Router };

export type FetchProgressEvent = {
    progress: number;
    received: number;
    length: number;
};

export type IntersectionOps = {
    root?: Element | Document;
    rootMargin: string;
    threshold: number;
}
