import type { Fundamentals, Income, Balance, CashFlow } from "./apiTypes";

export default class Api {
    public static async fundamentals(symbol: string): Promise<Fundamentals> {
        let url = `http://localhost:42069/api/fundamentals/${symbol}`;
        let res = await fetch(url);
        let t = await res.json() as Fundamentals;
        return t;
    }

    public static async income(symbol: string): Promise<Income> {
        let url = `http://localhost:42069/api/income/${symbol}`;
        let res = await fetch(url);
        let r = await res.json() as Income;
        return r;
    }

    public static async balance(symbol: string): Promise<Balance> {
        let url = `http://localhost:42069/api/balance/${symbol}`;
        let res = await fetch(url);
        let r = await res.json() as Balance;
        return r;
    }

    public static async cashflow(symbol: string): Promise<CashFlow> {
        let url = `http://localhost:42069/api/cash/${symbol}`;
        let res = await fetch(url);
        let r = await res.json() as CashFlow;
        return r;
    }
}
