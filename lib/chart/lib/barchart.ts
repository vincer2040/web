import { ChartBuilder } from "./chartbuilder";
import { svgBarChartFactory } from "./util";
import type { BarChartData } from "./types";

export default class BarChart<T> extends ChartBuilder {

    constructor(private data: BarChartData<T>) {
        let element = document.getElementById(data.elementId);
        if (!element) {
            throw new Error(`element with id ${data.elementId} does not exist`);
        }
        super(element);
        this.create();
    }

    private title(): void {
        if (this.data.title) {
            this.addTitle(this.data.title);
        }
    }

    private chart(): void {
        this.addChart(svgBarChartFactory);
    }

    private xLabel(): void {
        if (this.data.xLabel) {
            this.addXLabel(this.data.xLabel);
        }
    }

    private yLabel(): void {
        if (this.data.yLabel) {
            this.addYLabel(this.data.yLabel);
        }
    }

    private create(): void {
        this.title();
        this.chart();
        this.xLabel();
        this.yLabel();
    }
}
