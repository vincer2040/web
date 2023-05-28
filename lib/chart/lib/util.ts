
export function createGenericDiv(): HTMLDivElement {
    return document.createElement("div");
}

export function svgBarChartFactory(): string {
    return `
    <svg width="600" class="c" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#F5F5F5"/>
        <g id="Frame 1">
            <rect width="600" height="400" fill="white"/>
            <line id="x8" x1="60" y1="55" x2="570" y2="55" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x7" x1="60" y1="95" x2="570" y2="95" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x6" x1="60" y1="135" x2="570" y2="135" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x5" x1="60" y1="175" x2="570" y2="175" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x4" x1="60" y1="215" x2="570" y2="215" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x3" x1="59" y1="255" x2="570" y2="255" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x2" x1="60" y1="295" x2="570" y2="295" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x1" x1="60" y1="335" x2="570" y2="335" stroke="black" stroke-opacity="0.5" stroke-width="0.5"/>
            <line id="x-axis" x1="60" y1="375" x2="570" y2="375" stroke="black"/>
            <line id="y-axis" x1="60" y1="375" x2="60" y2="25" stroke="black"/>
        </g>
    </svg>
    `
}
