import Api from "./api";
import type { Fundamentals } from "./apiTypes";
import router from "router";

let r = router({prefetch: "visible", log: false});

let searchBtn = document.getElementById("search");

searchBtn?.addEventListener("click", async () => {
    await r.go("/search");
    let name_el = document.getElementById("name") as HTMLHeadingElement;
    let t: Fundamentals = await Api.fundamentals("aapl");
    name_el.innerText = t.Name;
    console.log(t);
});
