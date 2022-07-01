import "./styles/main.css";
import { render } from "./render/render.js";
import * as controls from "./controls.js";
import * as stats from "./stats.js";
import { options, criticalChanged, setCriticalChanged } from "./options.js";
import { scene, addSphere, addLight } from "./scene.js";
import { vec4 } from "gl-matrix";

// addSphere(0, -3, 3, 1, 1, 0, 1);
// addSphere(0, 3, 4, 1, 0, 1, 1);
// addSphere(5, 3, 0, 1, 1, 1, 0);

// addSphere(0, -10, 0, 4, 1, 1, 0, 0);
// addSphere(0, -4, 0, 1, 1, 0, 1, 1);
// addSphere(2, 0, 0, 1, 1, 1, 1, 0.0);

let spread_distance = 50;
for (let i = 0; i < 500; i++) {
    addSphere(
        Math.random() * spread_distance - spread_distance / 2,
        Math.random() * spread_distance - spread_distance / 2,
        Math.random() * spread_distance - spread_distance / 2,
        Math.random() * 0.5 + 0.5,

        Math.random(),
        Math.random(),
        Math.random(),
        Math.random()
    );
}
addLight(1, 0, 0, 1, 1, 1, 1);

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

    controls.updateControls(deltaTime);
    requestAnimationFrame(update);

    scene.camera.fov = options.fov;
    scene.camera.renderDistance = options.renderDistance;
    scene.options.canvasSize[0] = options.width;
    scene.options.canvasSize[1] = options.height;
    scene.options.rayBounces = options.rayBounces;
    scene.options.globalReflectiveness = options.globalReflectiveness;

    scene.camera.position = vec4.fromValues(
        controls.camera[0],
        controls.camera[1],
        controls.camera[2],
        1
    );
    scene.camera.direction = controls.rotation;

    scene.options.antiAliasing = options.aa;

    let renderInfo = render(scene, criticalChanged);
    setCriticalChanged(false);

    stats.updataStats(scene, deltaTime, previousDeltaTimes, renderInfo);
}

update(0);
