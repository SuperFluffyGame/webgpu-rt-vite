const fpsDisplay = document.getElementById("fps-display")!;
const msDisplay = document.getElementById("ms-display")!;

export function updataStats(renderedMillis: number, deltaTime: number) {
    fpsDisplay.textContent = (1000 / deltaTime).toFixed(0);
    msDisplay.textContent = renderedMillis.toFixed(2);
}
