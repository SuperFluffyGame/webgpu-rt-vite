import "./styles/main.css";
import { render } from "./render/render.js";
import * as controls from "./controls.js";
import * as stats from "./stats.js";
import { options, criticalChanged, setCriticalChanged } from "./options.js";
import { scene, addSphere, addLight } from "./scene.js";
import { formatString } from "./utils";
import { vec4 } from "gl-matrix";

// const toFormat = "Random Number: ${data.thing}";

// const formatted = formatString(
//     toFormat,
//     {
//         thing: { name: "World", type: "Planet" },
//     },
//     { stringifyJSON: true }
// );

// console.log(formatted);

// addSphere(0, -3, 3, 1, 1, 0, 1);
// addSphere(0, 3, 4, 1, 0, 1, 1);
// addSphere(5, 3, 0, 1, 1, 1, 0);

// addSphere(0, -10, 0, 4, 1, 1, 0);
// addSphere(0, -4, 0, 1, 1, 0, 1);
// addSphere(1, 0, 0, 1, 1, 1, 1);

let spread_distance = 100;
for (let i = 0; i < 5000; i++) {
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
addLight(1, 0, 0, 1, 1, 1, 1);

const previousDeltaTimes: number[] = [];

let a = new Float32Array([1, 2, 3, 1]);
let b = new Float32Array([1, 2, 5, 1]);
console.log(vec4.dist(a, b));

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
