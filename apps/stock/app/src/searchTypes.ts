export type NumberFormatter = {
    out: () => string;
}

export type StringFormatter = NumberFormatter;

export type FundamentalElements = {
    nameEl: HTMLHeadingElement;
    symbolEl: HTMLHeadingElement;
    sectorEl: HTMLHeadingElement;
    industryEl: HTMLHeadingElement;
    exchangeEl: HTMLHeadingElement;
    marketcapEl: HTMLParagraphElement;
    sharesoutstandingEl: HTMLParagraphElement;
    epsEl: HTMLParagraphElement;
    evtoebitdaEl: HTMLParagraphElement;
    peEl: HTMLParagraphElement;
    fpeEl: HTMLParagraphElement;
    bookEl: HTMLParagraphElement;
    pricetobookEl: HTMLParagraphElement;
    divpershareEl: HTMLParagraphElement;
    divyieldel: HTMLParagraphElement;
    exdivdateEl: HTMLParagraphElement;
}

export type RevenueElements = {
    totalRevenue: HTMLUListElement;
};

export type BalanceElements = {
    totalAssets: HTMLUListElement;
    cash: HTMLUListElement;
    totalLiabilities: HTMLUListElement;
};

export type CashFlowElements = {
    netIncome: HTMLUListElement;
    operatingCashFlow: HTMLUListElement;
    divPayout: HTMLUListElement;
};

