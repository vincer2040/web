import Api from "./api";
import { getFundamentalElements, CurrencyCompactor, NumberCompactor, PercentCompactor, LowerCase } from "./util";
import type { Fundamentals, Income } from "./apiTypes";
import type { FundamentalElements } from "./searchTypes";

let searchBtn = document.getElementById("searchbtn") as HTMLButtonElement;

async function fundamentals() {
    let fundamentalElements: FundamentalElements = getFundamentalElements();
    let fundamentals: Fundamentals = await Api.fundamentals();

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

async function revenue() {
    let r: Income = await Api.income();
    r.annualReports.forEach((i) => {
        console.log(i.fiscalDateEnding, i.totalRevenue);
    });
}

async function search() {
    let f = fundamentals();
    let r = revenue();

    await Promise.all([f, r]);
}

searchBtn.addEventListener("click", search);
