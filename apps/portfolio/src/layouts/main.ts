import router from "router"

router({ prefetch: "visible", log: false, pageTransitions: false });

let isOpen = false;

function hamburger() {
    let h = document.getElementById("hamburger") as HTMLElement;
    h.addEventListener("click", () => {
        let smallNav = document.getElementById("small-nav");
        if (!isOpen) {
            if (smallNav) {
                smallNav.classList.remove("hidden");
            }
            h.classList.add("open");
        } else {
            if (smallNav) {
                smallNav.classList.add("hidden");
            }
            h.classList.remove("open");
        }
        isOpen = !isOpen;
    });
    // reset state
    h.classList.remove("open");
    isOpen = false;
}

hamburger();

window.addEventListener("flamethrower:router:end", () => {
    hamburger();
})

