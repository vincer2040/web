
export type BarChartData<T> = {
    elementId: string,
    title?: string,
    xLabel?: string,
    yLabel?: string,
    data: XYData<T>
}

export type XYData<T> = {
    x: T[],
    y: number[],
}
