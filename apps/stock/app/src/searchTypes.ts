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
