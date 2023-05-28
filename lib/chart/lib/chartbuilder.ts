export class ChartBuilder {
    private style: string | null;
    constructor(private element: HTMLElement) {
        this.style = null;
    }

    public addTitle(name: string): void  {
        let nameEl = document.createElement("p");
        nameEl.innerText = name;
        nameEl.id = "title";
        this.element.append(nameEl);
    }

    public addChart(chartfn: () => string): void {
        this.element.insertAdjacentHTML("beforeend", chartfn());
    }

    public addXLabel(xLabel: string) {
        let element = `<p class="d" id="xlabel">${xLabel}</p>`
        this.element.insertAdjacentHTML("beforeend", element);
    }

    /**
     *  ____
     * |____|
     * |_|__|
     * |____|
     */
    private applyOneColTwoColOneColStyle() {
        let newStyle = `
            .twoColOneCol {
                display: grid;
                grid-template-areas:
                    "a a a"
                    "b c c"
                    "d d d";
            }
            .a {
                grid-area: a;
            }
            .b {
                grid-area: b;
            }
            .c {
                grid-area: c;
            }
            .d {
                grid-area: d;
            }
        `;

        if (this.style) {
            let style = document.getElementById("chartstyle");
            this.style.replace("</style>", newStyle + "</style>");
            if (style) {
                style.remove();
                document.head.insertAdjacentHTML("beforeend", this.style);
            } else {
                document.head.insertAdjacentHTML("beforeend", this.style);
            }
        } else {
            this.style = `<style id="chartstyle">${newStyle}</style>`;
            document.head.insertAdjacentHTML("beforeend", this.style);
        }

        this.element.classList.add("twoColOneCol");
    }

    public addYLabel(ylabel: string) {
        let element = `<p id="ylabel" class="b" style="transform: rotate(90deg); display: flex; align-items: center; justify-content: center;">${ylabel}</p>`;
        this.element.insertAdjacentHTML("beforeend", element);
        this.applyOneColTwoColOneColStyle();
    }
}
