import QS from "./components/qs";
import { render } from "solid-js/web";

const app = document.getElementById("app") as HTMLElement;

render(() => QS(), app);

