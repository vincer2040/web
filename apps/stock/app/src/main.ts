import router from "router";

let r = router({prefetch: "visible", log: false});

let searchBtn = document.getElementById("search");

searchBtn?.addEventListener("click", async () => {
    await r.go("/search");
});
