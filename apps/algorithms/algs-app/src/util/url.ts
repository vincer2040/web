
export function getWsURL(href: string): string {
    const url = new URL(window.location.origin + href);
    url.protocol = url.protocol.replace("http", "ws");
    return url.href;
}
