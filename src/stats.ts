const fpsDisplay = document.getElementById("fps-display")!;
const tfaDisplay = document.getElementById("tfa-display")!;

export function updataStats(deltaTime: number, previousDeltaTimes: number[]) {
    fpsDisplay.textContent = (1000 / deltaTime).toFixed(0);
    tfaDisplay.textContent = (
        previousDeltaTimes.map(v => 1000 / v).reduce((a, b) => a + b, 0) /
        previousDeltaTimes.length
    ).toFixed(0);
}
