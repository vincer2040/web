import type { Fundamentals, Income } from "./apiTypes";

export default class Api {
    public static async fundamentals(): Promise<Fundamentals> {
        let url = `http://localhost:42069/api/fundamentals`;
        let res = await fetch(url);
        let t = await res.json() as Fundamentals;
        return t;
    }

    public static async income(): Promise<Income> {
        let url = `http://localhost:42069/api/income`;
        let res = await fetch(url);
        let r = await res.json() as Income;
        return r;
    }
}
