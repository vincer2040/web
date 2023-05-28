import type { FlamethrowerOptions } from "./interfaces";
import { Router } from "./router"

export default function flamethrower(opts?: FlamethrowerOptions) {
    return new Router(opts);
}
