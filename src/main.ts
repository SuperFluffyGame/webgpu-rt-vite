import "./styles/main.css";
import { render } from "./render/render.js";
import * as controls from "./controls.js";
import { options, criticalChanged, setCriticalChanged } from "./options.js";
import * as stats from "./stats.js";
import { scene, addSphere, addLight } from "./scene.js";

// addSphere(0, -3, 3, 1, 1, 0, 1);
// addSphere(0, 3, 4, 1, 0, 1, 1);
// addSphere(5, 3, 0, 1, 1, 1, 0);
let spread_distance = 100;

for (let i = 0; i < 250; i++) {
    addSphere(
        Math.random() * spread_distance - spread_distance / 2,
        Math.random() * spread_distance - spread_distance / 2,
        Math.random() * spread_distance - spread_distance / 2,
        Math.random() * 0.5 + 0.5,

        Math.random(),
        Math.random(),
        Math.random()
    );
}
addLight(0, 0, 0, 1, 1, 1, 1);

const previousDeltaTimes: number[] = [];

export let deltaTime = 0;
let prevTime: number;
function update(time: number) {
    deltaTime = time - prevTime;
    prevTime = time;
    if (previousDeltaTimes.length > 19) {
        previousDeltaTimes.shift();
    }
    previousDeltaTimes.push(deltaTime);

    stats.updataStats(deltaTime, previousDeltaTimes);
    controls.updateControls(deltaTime);
    requestAnimationFrame(update);

    scene.camera.fov = options.fov;
    scene.canvasSize[0] = options.width;
    scene.canvasSize[1] = options.height;

    scene.camera.position = controls.camera;
    scene.camera.direction = controls.rotation;

    scene.antiAliasing = options.aa;

    render(scene, criticalChanged);
    setCriticalChanged(false);
}

update(0);
