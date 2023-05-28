
import { render } from "solid-js/web";
import Counter from "./components/Counter";

function mountCounter() {
    let counterElement = document.getElementById("counter");
    if (!counterElement) return;
    render(Counter, counterElement);
}

mountCounter();

window.addEventListener("flamethrower:router:end", mountCounter);
