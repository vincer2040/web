import Api from "./api";
import {
    getFundamentalElements,
    NumberCompactor, PercentCompactor, LowerCase, CurrencyCompactor,
} from "./util";
import type { Balance, CashFlow, Fundamentals, Income, AnnualReport, TickerList, Ticker, IncomeReport, CashFlowReport } from "./apiTypes";
import type { FundamentalElements } from "./searchTypes";
import { Chart, registerables } from "chart.js";
import type { ChartItem } from "chart.js";
import { BalanceReport } from "./apiTypes";

Chart.register(...registerables);

class ChartManager {
    private charts: Array<Chart>;
    constructor() {
        this.charts = new Array();
    }

    push(c: Chart) {
        this.charts.push(c);
    }

    destroyAll() {
        this.charts.forEach(c => c.destroy());
        this.charts = new Array();
    }
}

class Tickers {
    private list: Array<Ticker>;
    constructor(data: TickerList) {
        this.list = Object.values(data);
    }

    public search(t: string): Array<Ticker> {
        let st = t.toUpperCase();
        return this.list
            .filter(i => i.ticker.includes(st));
    }

    /* slow but that's ok */
    public isValid(t: string): boolean {
        let testTick = t.toUpperCase();
        return this.list
            .map(i => i.ticker)
            .includes(testTick);
    }
}

function chartFactory(el: ChartItem, d: AnnualReport, label: string): Chart {
    return new Chart(
        el,
        {
            type: 'bar',
            options: {
                animation: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(v) {
                                return new CurrencyCompactor(v.toString()).out();
                            },
                        }
                    }
                },
            },
            data: {
                labels: d.dates,
                    datasets: [
                    {
                        label: label,
                        data: d.data.map(i => parseInt(i)),
                    }
                ]
            }
        }
    );
}

/**
 * FP bros be like 'this is not a class.
 * no classes here. definetly not a
 * class we're using here'
 */
(async () => {
    // this blocks pretty hard, figure it out
    // let ticks = await Api.tickers();
    // let tickers = new Tickers(ticks);
    let chartManager = new ChartManager();
    let searchBtn = document.getElementById("searchbtn") as HTMLButtonElement;
    let searchForm = document.getElementById("search") as HTMLFormElement;
    let symbolInputEl = document.getElementById("symbol-input") as HTMLInputElement;

    async function fundamentals(symbol: string) {
        let fundamentalElements: FundamentalElements = getFundamentalElements();
        let fundamentals: Fundamentals = await Api.fundamentals(symbol);

        let currencyFormatter = new CurrencyCompactor(fundamentals.MarketCapitalization);
        let numberFormatter = new NumberCompactor(fundamentals.SharesOutstanding);
        let percentFormatter = new PercentCompactor(fundamentals.DividendYield);
        let lowcaseFormatter = new LowerCase(fundamentals.Sector);

        fundamentalElements.nameEl.innerText = fundamentals.Name;
        fundamentalElements.symbolEl.innerText = fundamentals.Symbol;
        fundamentalElements.sectorEl.innerText = lowcaseFormatter.out();
        lowcaseFormatter.val = fundamentals.Industry;
        fundamentalElements.industryEl.innerText = lowcaseFormatter.out();
        fundamentalElements.exchangeEl.innerText = fundamentals.Exchange;
        fundamentalElements.marketcapEl.innerText = currencyFormatter.out();
        fundamentalElements.sharesoutstandingEl.innerText = numberFormatter.out();
        fundamentalElements.epsEl.innerText = fundamentals.EPS;
        fundamentalElements.evtoebitdaEl.innerText = fundamentals.EVToEBITDA;
        fundamentalElements.peEl.innerText = fundamentals.PERatio;
        fundamentalElements.fpeEl.innerText = fundamentals.ForwardPE;
        fundamentalElements.bookEl.innerText = fundamentals.BookValue;
        fundamentalElements.pricetobookEl.innerText = fundamentals.PriceToBookRatio;
        currencyFormatter.val = fundamentals.DividendPerShare;
        fundamentalElements.divpershareEl.innerText = currencyFormatter.out();
        fundamentalElements.divyieldel.innerText = percentFormatter.out();
        fundamentalElements.exdivdateEl.innerText = fundamentals.ExDividendDate;
    }

    async function revenue(symbol: string) {
        let r: Income = await Api.income(symbol);
        r.annualReports.reverse();
        let revenueEl = document.getElementById('total-revenue') as ChartItem;
        let ebitdaEl = document.getElementById('ebitda') as ChartItem;
        let operatingIncomeEl = document.getElementById("operating-income") as ChartItem;
        let len = r.annualReports.length;
        let i: number;
        let dates: Array<string> = new Array(len);
        let rev: Array<string> = new Array(len);
        let ebitdaL: Array<string> = new Array(len);
        let oi: Array<string> = new Array(len);
        for (i = 0; i < len; ++i) {
            let rep: IncomeReport = r.annualReports[i];
            dates[i] = rep.fiscalDateEnding;
            rev[i] = rep.totalRevenue;
            ebitdaL[i] = rep.ebitda;
            oi[i] = rep.operatingIncome;
        }
        let totalRev: AnnualReport = {
            dates,
            data: rev,
        };
        let ebitda: AnnualReport = {
            dates,
            data: ebitdaL,
        };
        let operatingIncome: AnnualReport = {
            dates,
            data: oi,
        };
        chartManager.push(chartFactory(revenueEl, totalRev, "total revenue"));
        chartManager.push(chartFactory(ebitdaEl, ebitda, "ebitda"));
        chartManager.push(chartFactory(operatingIncomeEl, operatingIncome, "operating income"));
    }

    async function balance(symbol: string) {
        let r: Balance = await Api.balance(symbol);
        r.annualReports.reverse();
        let assetsEl = document.getElementById("total-assets") as ChartItem;
        let cashEl = document.getElementById("cash") as ChartItem;
        let liabilitiesEl = document.getElementById("total-liabilities") as ChartItem;
        let len = r.annualReports.length;
        let i: number;
        let dates: Array<string> = new Array(len);
        let assets: Array<string> = new Array(len);
        let cashL: Array<string> = new Array(len);
        let liabilities: Array<string> = new Array(len);
        for (i = 0; i < len; ++i) {
            let rep: BalanceReport = r.annualReports[i];
            dates[i] = rep.fiscalDateEnding;
            assets[i] = rep.totalAssets;
            cashL[i] = rep.cashAndCashEquivalentsAtCarryingValue;
            liabilities[i] = rep.totalLiabilities;
        }
        let totalAssets: AnnualReport = {
            dates: dates,
            data: assets,
        };
        let cash: AnnualReport = {
            dates: dates,
            data: cashL,
        };
        let totalLiabilities: AnnualReport = {
            dates: dates,
            data: liabilities,
        };
        chartManager.push(chartFactory(assetsEl, totalAssets, "total assets"));
        chartManager.push(chartFactory(cashEl, cash, "cash"));
        chartManager.push(chartFactory(liabilitiesEl, totalLiabilities, "total liabilities"));
    }

    async function cashflow(symbol: string) {
        let r: CashFlow = await Api.cashflow(symbol);
        let netIncomeEl = document.getElementById("net-income") as ChartItem;
        let operatingCashFlowEl = document.getElementById("operating-cash-flow") as ChartItem;
        let divPayoutEl = document.getElementById("div-payout") as ChartItem;

        r.annualReports.reverse();


        let len = r.annualReports.length;
        let i: number;
        let dates: Array<string> = new Array(len);
        let ni: Array<string> = new Array(len);
        let ocf: Array<string> = new Array(len);
        let dp: Array<string> = new Array(len);
        for (i = 0; i < len; ++i) {
            let rep: CashFlowReport = r.annualReports[i];
            dates[i] = rep.fiscalDateEnding;
            ni[i] = rep.netIncome;
            ocf[i] = rep.operatingCashflow;
            dp[i] = rep.dividendPayout;
        }
        let netIncome: AnnualReport = {
            dates: dates,
            data: ni,
        };
        let operatingCashFlow: AnnualReport = {
            dates: dates,
            data: ocf,
        };
        let divPayout: AnnualReport = {
            dates: dates,
            data: dp,
        };

        chartManager.push(chartFactory(netIncomeEl, netIncome, "net income"));
        chartManager.push(chartFactory(operatingCashFlowEl, operatingCashFlow, "operating cash flow"));
        chartManager.push(chartFactory(divPayoutEl, divPayout, "div payout"));
    }

    function getSymbol(): string {
        let symbol = symbolInputEl.value;
        return symbol;
    }

    function disableSearchBtn(btn: HTMLButtonElement) {
        btn.disabled = true;
    }

    function enableSearchBtn(btn: HTMLButtonElement) {
        btn.disabled = false;
    }

    async function search(e: Event) {
        let symbol = getSymbol();
        e.preventDefault();
        // if (!tickers.isValid(symbol)) {
        //     console.log("noooooo");
        //     return;
        // }
        chartManager.destroyAll();
        disableSearchBtn(searchBtn);
        await Promise.all([fundamentals(symbol), revenue(symbol), balance(symbol), cashflow(symbol)]);
        enableSearchBtn(searchBtn);
    }

    searchForm.addEventListener("submit", search);
})();


