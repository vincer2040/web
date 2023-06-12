import Api from "./api";
import {
    getFundamentalElements, getRevenueElements, getBalanceElements, getCashFlowElements,
    NumberCompactor, PercentCompactor, LowerCase, CurrencyCompactor,
} from "./util";
import type { Balance, CashFlow, Fundamentals, Income } from "./apiTypes";
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
    let revenueElements = getRevenueElements();
    let currencyFormatter = new CurrencyCompactor('1');
    r.annualReports.forEach((i) => {
        let revenueLI = document.createElement("li");
        let dateElement = document.createElement("p");
        let revenueAmtElement = document.createElement("p");

        dateElement.innerText = i.fiscalDateEnding;

        currencyFormatter.val = i.totalRevenue;
        revenueAmtElement.innerText = currencyFormatter.out();

        revenueLI.append(dateElement, revenueAmtElement);
        revenueElements.totalRevenue.append(revenueLI);

        revenueLI.classList.add('flex', 'gap-2');
        dateElement.classList.add('text-xl');
        revenueAmtElement.classList.add('text-xl');
    });
}

async function balance() {
    let r: Balance = await Api.balance();
    let balanceElements = getBalanceElements();
    let currencyFormatter = new CurrencyCompactor('1');
    r.annualReports.forEach((i) => {
        let totalAssetsLI = document.createElement("li");
        let dateElement = document.createElement("p");
        let totalAssetsEl = document.createElement("p");
        let totalLiabilitiesLI = document.createElement("li");
        let totalLiabilitiesEL = document.createElement("p");
        let cashLI = document.createElement("li");
        let cashEl = document.createElement("p");

        dateElement.classList.add('text-xl'); // do this first since we deep clone it

        dateElement.innerText = i.fiscalDateEnding;
        currencyFormatter.val = i.totalAssets;
        totalAssetsEl.innerText = currencyFormatter.out();
        currencyFormatter.val = i.totalLiabilities;
        totalLiabilitiesEL.innerText = currencyFormatter.out();
        currencyFormatter.val = i.cashAndCashEquivalentsAtCarryingValue;
        cashEl.innerText = currencyFormatter.out();

        totalAssetsLI.append(dateElement, totalAssetsEl);
        totalLiabilitiesLI.append(dateElement.cloneNode(true), totalLiabilitiesEL)
        cashLI.append(dateElement.cloneNode(true), cashEl);
        balanceElements.totalAssets.append(totalAssetsLI);
        balanceElements.totalLiabilities.append(totalLiabilitiesLI);
        balanceElements.cash.append(cashLI);

        totalAssetsLI.classList.add("flex", "gap-2");
        totalLiabilitiesLI.classList.add("flex", "gap-2");
        cashLI.classList.add("flex", "gap-2");
        totalAssetsEl.classList.add('text-xl');
        totalLiabilitiesEL.classList.add('text-xl');
        cashEl.classList.add("text-xl");
    });
}

async function cashflow() {
    let r: CashFlow = await Api.cashflow();
    let cashFlowElements = getCashFlowElements();
    let currencyFormatter = new CurrencyCompactor("1");
    r.annualReports.forEach((i) => {
        let netIncomeLI = document.createElement("li");
        let operatingCashFlowLI = document.createElement("li");
        let divPayoutLI = document.createElement("li");
        let dateElement = document.createElement("p");
        let netIncomeEl = document.createElement("p");
        let operatingCashFlowEl = document.createElement("p");
        let divPayoutEl = document.createElement("p");

        dateElement.classList.add('text-xl'); // do this first since we deep clone it

        dateElement.innerText = i.fiscalDateEnding;
        currencyFormatter.val = i.netIncome;
        netIncomeEl.innerText = currencyFormatter.out();
        currencyFormatter.val = i.operatingCashflow;
        operatingCashFlowEl.innerText = currencyFormatter.out();
        currencyFormatter.val = i.dividendPayout;
        divPayoutEl.innerText = currencyFormatter.out();

        netIncomeLI.append(dateElement, netIncomeEl);
        operatingCashFlowLI.append(dateElement.cloneNode(true), operatingCashFlowEl);
        divPayoutLI.append(dateElement.cloneNode(true), divPayoutEl);
        cashFlowElements.netIncome.append(netIncomeLI);
        cashFlowElements.operatingCashFlow.append(operatingCashFlowLI);
        cashFlowElements.divPayout.append(divPayoutLI);

        netIncomeEl.classList.add("text-xl");
        netIncomeLI.classList.add("flex", "gap-2");
        operatingCashFlowEl.classList.add("text-xl");
        operatingCashFlowLI.classList.add("flex", "gap-2");
        divPayoutEl.classList.add("text-xl");
        divPayoutLI.classList.add("flex", "gap-2");
    });
}

async function search() {
    await Promise.all([fundamentals(), revenue(), balance(), cashflow()]);
}

searchBtn.addEventListener("click", search);
