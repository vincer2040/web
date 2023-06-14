import Api from "./api";
import {
    getFundamentalElements,
    NumberCompactor, PercentCompactor, LowerCase, CurrencyCompactor,
} from "./util";
import type { Balance, CashFlow, Fundamentals, Income, AnnualReport } from "./apiTypes";
import type { FundamentalElements } from "./searchTypes";
import { Chart, registerables } from "chart.js";
import type { ChartItem } from "chart.js";

Chart.register(...registerables);

let searchBtn = document.getElementById("searchbtn") as HTMLButtonElement;

async function fundamentals() {
    let fundamentalElements: FundamentalElements = getFundamentalElements();
    let fundamentals: Fundamentals = await Api.fundamentals("aapl");

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
                labels: d.dates.map(i => i),
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

async function revenue() {
    let r: Income = await Api.income("aapl");
    r.annualReports.reverse();
    let el = document.getElementById('total-revenue') as ChartItem;
    let totalRev: AnnualReport = {
        dates: r.annualReports.map(i => i.fiscalDateEnding),
        data: r.annualReports.map(i => i.totalRevenue),
    };
    chartFactory(el, totalRev, "total revenue");
}

async function balance() {
    let r: Balance = await Api.balance("aapl");
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
    chartFactory(assetsEl, totalAssets, "total assets");
    chartFactory(cashEl, cash, "cash");
    chartFactory(liabilitiesEl, totalLiabilities, "total liabilities");
}

async function cashflow() {
    let r: CashFlow = await Api.cashflow("aapl");
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

    chartFactory(netIncomeEl, netIncome, "net income");
    chartFactory(operatingCashFlowEl, operatingCashFlow, "net income");
    chartFactory(divPayoutEl, divPayout, "net income");
}

async function search() {
    await Promise.all([fundamentals(), revenue(), balance(), cashflow()]);
}

searchBtn.addEventListener("click", search);
