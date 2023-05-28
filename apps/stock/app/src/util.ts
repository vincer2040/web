import type { NumberFormatter, StringFormatter, FundamentalElements } from "./searchTypes";

export class CurrencyCompactor implements NumberFormatter {
    private formator: Intl.NumberFormat;
    constructor(private numstr: string) {
        this.formator = Intl.NumberFormat('en', {
            notation: 'compact',
            style: 'currency',
            currency: 'USD',
        });
    }

    set val(val: string) {
        this.numstr = val;
    }

    out(): string {
        let int: number = parseFloat(this.numstr);
        return this.formator.format(int);
    }
}

export class NumberCompactor implements NumberFormatter {
    private formator: Intl.NumberFormat;
    constructor(private numstr: string) {
        this.formator = Intl.NumberFormat('en', {
            notation: 'compact',
        });
    }

    set val(val: string) {
        this.numstr = val;
    }

    out(): string {
        return this.formator.format(parseFloat(this.numstr));
    }
}

export class PercentCompactor implements NumberFormatter {

    private formator: Intl.NumberFormat;
    constructor(private numstr: string) {
        this.formator = Intl.NumberFormat('en', {
            notation: 'compact',
            style: 'percent',
        });
    }

    set val(val: string) {
        this.numstr = val;
    }

    out(): string {
        return this.formator.format(parseFloat(this.numstr));
    }
}

export class LowerCase implements StringFormatter {

    constructor(private str: string) {
    }

    set val(val: string) {
        this.str = val;
    }

    out(): string {
        return this.str.toLowerCase();
    }
}

export function getFundamentalElements(): FundamentalElements {
    return {
        nameEl: document.getElementById("name") as HTMLHeadingElement,
        symbolEl: document.getElementById("symbol") as HTMLHeadingElement,
        sectorEl: document.getElementById("sector") as HTMLHeadingElement,
        industryEl: document.getElementById("industry") as HTMLHeadingElement,
        exchangeEl: document.getElementById("exchange") as HTMLHeadingElement,
        marketcapEl: document.getElementById("marketcap") as HTMLParagraphElement,
        sharesoutstandingEl: document.getElementById("sharesoutstanding") as HTMLParagraphElement,
        epsEl: document.getElementById("eps") as HTMLParagraphElement,
        evtoebitdaEl: document.getElementById("evtoebitda") as HTMLParagraphElement,
        peEl: document.getElementById("pe") as HTMLParagraphElement,
        fpeEl: document.getElementById("fpe") as HTMLParagraphElement,
        bookEl: document.getElementById("book") as HTMLParagraphElement,
        pricetobookEl: document.getElementById("pricetobook") as HTMLParagraphElement,
        divpershareEl: document.getElementById("divpershare") as HTMLParagraphElement,
        divyieldel: document.getElementById("divyield") as HTMLParagraphElement,
        exdivdateEl: document.getElementById("exdivdate") as HTMLParagraphElement,
    }
}

