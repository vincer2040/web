function m(r, e) {
  if (["link", "go"].includes(r))
    if (e) {
      const t = document.querySelector(e);
      t ? t.scrollIntoView({ behavior: "smooth", block: "start" }) : window.scrollTo({ top: 0 });
    } else
      window.scrollTo({ top: 0 });
}
function d(r) {
  const e = new URL(r || window.location.href).href;
  return e.endsWith("/") || e.includes(".") || e.includes("#") ? e : `${e}/`;
}
function E(r) {
  (!window.history.state || window.history.state.url !== r) && window.history.pushState({ url: r }, "internalLink", r);
}
function k(r) {
  document.querySelector(r).scrollIntoView({ behavior: "smooth", block: "start" });
}
function I(r) {
  return c.getPopInstance();
}
function x(r) {
  return c.getInstance(r);
}
class c {
  constructor(e, t) {
    e === "mouse" && this.handleMouse(t), e === "pop" && this.handlePop();
  }
  static getPopInstance() {
    c.instance || (c.instance = new c("pop"));
    let e = c.instance;
    return e.handlePop(), e;
  }
  static getInstance(e) {
    c.instance || (c.instance = new c("mouse", e));
    let t = c.instance;
    return t.handleMouse(e), t;
  }
  handlePop() {
    const e = d();
    this.type = "popstate", this.prev = null, this.scrollId = null, this.next = e;
  }
  handleMouse(e) {
    var t;
    let n;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
      this.type = "disqualified", this.next = null, this.prev = null, this.scrollId = null;
      return;
    }
    for (let o = e.target; o.parentNode; o = o.parentNode)
      if (o.nodeName === "A") {
        n = o;
        break;
      }
    if (n && n.host !== location.host) {
      n.target = "_blank", this.type = "external", this.next = null, this.prev = null, this.scrollId = null;
      return;
    }
    if (n && "cold" in (n == null ? void 0 : n.dataset)) {
      this.type = "disqualified", this.next = null, this.prev = null, this.scrollId = null;
      return;
    }
    if (n != null && n.hasAttribute("href")) {
      const o = n.getAttribute("href"), s = new URL(o, location.href);
      e.preventDefault(), o != null && o.startsWith("#") && (k(o), this.next = null, this.prev = null, this.scrollId = null, this.type = "scrolled"), this.type = "link", this.next = d(s.href), this.prev = d(), this.scrollId = (t = o.match(/#([\w"-]+)\b/g)) == null ? void 0 : t[0];
      return;
    } else {
      this.type = "noop", this.next = null, this.prev = null, this.scrollId = null;
      return;
    }
  }
}
function L(r) {
  return new DOMParser().parseFromString(r, "text/html");
}
function g(r) {
  document.body.querySelectorAll("[router-preserve]").forEach((e) => {
    let t = r.body.querySelector('[router-preserve][id="' + e.id + '"]');
    if (t) {
      const n = e.cloneNode(!0);
      t.replaceWith(n);
    }
  }), document.body.replaceWith(r.body);
}
function N(r) {
  const e = (i) => Array.from(i.querySelectorAll('head>:not([rel="prefetch"]')), t = e(document), n = e(r), { staleNodes: o, freshNodes: s } = q(t, n);
  o.forEach((i) => i.remove()), document.head.append(...s);
}
function q(r, e) {
  const t = [], n = [];
  let o = 0, s = 0;
  for (; o < r.length || s < e.length; ) {
    const i = r[o], l = e[s];
    if (i != null && i.isEqualNode(l)) {
      o++, s++;
      continue;
    }
    const u = i ? n.findIndex((h) => h.isEqualNode(i)) : -1;
    if (u !== -1) {
      n.splice(u, 1), o++;
      continue;
    }
    const a = l ? t.findIndex((h) => h.isEqualNode(l)) : -1;
    if (a !== -1) {
      t.splice(a, 1), s++;
      continue;
    }
    i && t.push(i), l && n.push(l), o++, s++;
  }
  return { staleNodes: t, freshNodes: n };
}
function v() {
  document.head.querySelectorAll("[data-reload]").forEach(b), document.body.querySelectorAll("script").forEach(b);
}
function b(r) {
  const e = document.createElement("script"), t = Array.from(r.attributes);
  for (const { name: n, value: o } of t)
    e[n] = o;
  e.append(r.textContent), r.replaceWith(e);
}
const A = {
  root: null,
  rootMargin: "0px",
  threshold: 1
};
class C {
  constructor(e) {
    this.opts = e, this.enabled = !0, this.prefetched = /* @__PURE__ */ new Set(), this.opts || (this.opts.log = !1, this.opts.pageTransitions = !1), window != null && window.history ? (document.addEventListener("click", (t) => this.onClick(t)), window.addEventListener("popstate", (t) => this.onPop(t)), this.opts.log && console.log("🔥 router engaged"), this.prefetch()) : (console.warn("flamethrower router not supported in this browser or environment"), this.enabled = !1);
  }
  go(e) {
    const t = window.location.href, n = new URL(e, location.origin).href;
    return this.reconstructDOM({ type: "go", next: n, prev: t });
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  get allLinks() {
    let e = new Array(), t = document.links, n = t.length, o;
    for (o = 0; o < n; o++) {
      let s = t.item(o);
      s.href.includes(document.location.origin) && !s.href.includes("#") && s.href !== (document.location.href || document.location.href + "/") && !this.prefetched.has(s.href) && e.push(s);
    }
    return e;
  }
  log(...e) {
    this.opts.log && console.log(...e);
  }
  prefetch() {
    if (this.opts.prefetch === "visible")
      this.prefetchVisible();
    else if (this.opts.prefetch === "hover")
      this.prefetchOnHover();
    else
      return;
  }
  prefetchOnHover() {
    this.allLinks.forEach((e) => {
      const t = e.getAttribute("href");
      e.addEventListener("pointerenter", () => this.createLink(t), { once: !0 });
    });
  }
  prefetchVisible() {
    "IntersectionObserver" in window && (this.observer || (this.observer = new IntersectionObserver((e, t) => {
      e.forEach((n) => {
        const o = n.target.getAttribute("href");
        if (this.prefetched.has(o)) {
          t.unobserve(n.target);
          return;
        }
        n.isIntersecting && (this.createLink(o), t.unobserve(n.target));
      });
    }, A)), this.allLinks.forEach((e) => this.observer.observe(e)));
  }
  createLink(e) {
    const t = document.createElement("link");
    t.rel = "prefetch", t.href = e, t.as = "document", t.onload = () => this.log("🌩️ prefetched", e), t.onerror = (n) => this.log('🤕 can"t prefetch', e, n), document.head.appendChild(t), this.prefetched.add(e);
  }
  onClick(e) {
    this.reconstructDOM(x(e));
  }
  onPop(e) {
    this.reconstructDOM(I());
  }
  async reconstructDOM({ type: e, next: t, prev: n, scrollId: o }) {
    if (!this.enabled) {
      this.log("router disabled");
      return;
    }
    try {
      if (this.log("⚡", e), ["popstate", "link", "go"].includes(e) && t !== n) {
        this.opts.log && console.time("⏱️"), window.dispatchEvent(new CustomEvent("flamethrower:router:fetch")), e != "popstate" && E(t);
        const s = await (await fetch(t, { headers: { "X-Flamethrower": "1" } }).then((l) => {
          const u = l.body.getReader(), a = parseInt(l.headers.get("Content-Length"));
          let h = 0;
          return new ReadableStream({
            start(p) {
              function f() {
                u.read().then(({ done: y, value: w }) => {
                  if (y) {
                    p.close();
                    return;
                  }
                  h += w.length, window.dispatchEvent(
                    new CustomEvent("flamethrower:router:fetch-progress", {
                      detail: {
                        progress: Number.isNaN(a) ? 0 : h / a * 100,
                        received: h,
                        length: a || 0
                      }
                    })
                  ), p.enqueue(w), f();
                });
              }
              f();
            }
          });
        }).then((l) => new Response(l, { headers: { "Content-Type": "text/html" } }))).text(), i = L(s);
        N(i), this.opts.pageTransitions && document.createDocumentTransition ? document.createDocumentTransition().start(() => {
          g(i), v(), m(e, o);
        }) : (g(i), v(), m(e, o)), window.dispatchEvent(new CustomEvent("flamethrower:router:end")), setTimeout(() => {
          this.prefetch();
        }, 200), this.opts.log && console.timeEnd("⏱️"), document.removeEventListener("click", (l) => this.onClick(l), !0);
      }
    } catch (s) {
      return window.dispatchEvent(new CustomEvent("flamethrower:router:error", s)), this.opts.log && console.timeEnd("⏱️"), console.error("💥 router fetch failed", s), !1;
    }
  }
}
function S(r) {
  return new C(r);
}
S({ prefetch: "visible", log: !1, pageTransitions: !1 });
