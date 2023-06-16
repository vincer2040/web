import Api from "./api";
import {
    getFundamentalElements,
    NumberCompactor, PercentCompactor, LowerCase, CurrencyCompactor,
} from "./util";
import type { Balance, CashFlow, Fundamentals, Income, AnnualReport, TickerList, Ticker } from "./apiTypes";
import type { FundamentalElements } from "./searchTypes";
import { Chart, registerables } from "chart.js";
import type { ChartItem } from "chart.js";

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

/**
 * FP bros be like 'this is not a class.
 * no classes here. definetly not a
 * class we're using here'
 */
(async () => {
    let ticks = await Api.tickers();
    let tickers = new Tickers(ticks);
    let chartManager = new ChartManager();
    let searchBtn = document.getElementById("searchbtn") as HTMLButtonElement;
    let symbolInputEl = document.getElementById("symbol-input") as HTMLInputElement;
    let suggestionEl = document.getElementById("suggest") as HTMLTableSectionElement;


    async function revenue(symbol: string) {
        let r: Income = await Api.income(symbol);
        r.annualReports.reverse();
        let el = document.getElementById('total-revenue') as ChartItem;
        let totalRev: AnnualReport = {
            dates: r.annualReports.map(i => i.fiscalDateEnding),
                data: r.annualReports.map(i => i.totalRevenue),
        };
        chartManager.push(chartFactory(el, totalRev, "total revenue"));
    }

    async function balance(symbol: string) {
        let r: Balance = await Api.balance(symbol);
        r.annualReports.reverse();
        let assetsEl = document.getElementById("total-assets") as ChartItem;
        let cashEl = document.getElementById("cash") as ChartItem;
        let liabilitiesEl = document.getElementById("total-liabilities") as ChartItem;
        let dates = r.annualReports.map(i => i.fiscalDateEnding);
        let totalAssets: AnnualReport = {
            dates: dates,
            data: r.annualReports.map(i => i.totalAssets),
        };
        let cash: AnnualReport = {
            dates: dates,
            data: r.annualReports.map(i => i.cashAndCashEquivalentsAtCarryingValue),
        };
        let totalLiabilities: AnnualReport = {
            dates: dates,
            data: r.annualReports.map(i => i.totalLiabilities),
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

        let dates = r.annualReports.map(i => i.fiscalDateEnding);
        let netIncome: AnnualReport = {
            dates: dates,
            data: r.annualReports.map(i => i.netIncome),
        };
        let operatingCashFlow: AnnualReport = {
            dates: dates,
            data: r.annualReports.map(i => i.operatingCashflow),
        };
        let divPayout: AnnualReport = {
            dates: dates,
            data: r.annualReports.map(i => i.dividendPayout),
        };

        chartManager.push(chartFactory(netIncomeEl, netIncome, "net income"));
        chartManager.push(chartFactory(operatingCashFlowEl, operatingCashFlow, "net income"));
        chartManager.push(chartFactory(divPayoutEl, divPayout, "net income"));
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

    async function search(e: MouseEvent) {
        let symbol = getSymbol();
        e.preventDefault();
        if (!tickers.isValid(symbol)) {
            console.log("noooooo");
            return;
        }
        chartManager.destroyAll();
        disableSearchBtn(searchBtn);
        await Promise.all([fundamentals(symbol), revenue(symbol), balance(symbol), cashflow(symbol)]);
        enableSearchBtn(searchBtn);
    }

    function createSuggestion(tickers: Array<Ticker>): Array<HTMLElement> {
        let elements = tickers
            .map(i => {
                let el = document.createElement("section");
                let tickEl = document.createElement("p");
                let nameEl = document.createElement("p");
                tickEl.innerText = i.ticker;
                nameEl.innerText = i.title;
                el.append(tickEl, nameEl);
                el.classList.add("grid", "place-items-center", "grid-cols-2", "gap-3", "w-full");
                return el;
            });
        return elements;
    }

    function typeASearch() {
        let symbol = getSymbol();
        let tickSearch = tickers.search(symbol);
        let suggest = tickSearch.slice(0, 3);
        let suggested = createSuggestion(suggest);
        Array.from(suggestionEl.children).forEach(node => node.remove());
        suggestionEl.append(...suggested);
    }

    searchBtn.addEventListener("click", search);
    symbolInputEl.addEventListener('keyup', typeASearch);
})();

