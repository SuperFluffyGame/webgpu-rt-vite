import { Scene } from "./render/render";

const fpsDisplay = document.getElementById("fps-display")!;
const tfaDisplay = document.getElementById("tfa-display")!;
const sphereCountDisplay = document.getElementById("sphere-count-display")!;

export function updataStats(
    scene: Scene,
    deltaTime: number,
    previousDeltaTimes: number[]
) {
    fpsDisplay.textContent = (1000 / deltaTime).toFixed(0);
    tfaDisplay.textContent = (
        previousDeltaTimes.map(v => 1000 / v).reduce((a, b) => a + b, 0) /
        previousDeltaTimes.length
    ).toFixed(0);

    sphereCountDisplay.textContent = scene.spheres.length.toString();
}
