import BarChart from "./barchart";
import type { BarChartData } from "./types";

export default function chart() {
    console.log("hi");
}

export function barchart<T>(data: BarChartData<T>): BarChart<T> {
    return new BarChart(data);
}
