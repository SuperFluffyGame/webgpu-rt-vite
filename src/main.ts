import "./styles/main.css";
import { canvas } from "./render/init.js";
import { render, Scene } from "./render/render.js";
import * as controls from "./controls.js";
import { options } from "./options.js";
import { updataStats } from "./stats";

const scene: Scene = {
    camera: {
        position: new Float32Array([0, 0, 5, 1]),
        direction: new Float32Array([0, 0]),
        fov: options.fov,
    },
    spheres: [
        {
            position: new Float32Array([0, 0, 0, 1]),
            radius: 1,
        },
    ],
    lights: [
        {
            position: new Float32Array([0, -5, 0, 1]),
            color: new Float32Array([1, 1, 1, 1]),
            intensity: 1,
        },
    ],
    canvasSize: new Float32Array([options.width, options.height]),
};

export let renderedMillis = 0;
export let deltaTime = 0;

let prevTime = 0;
function update(time: number) {
    deltaTime = time - prevTime;
    prevTime = time;
    updataStats(renderedMillis, deltaTime);
    requestAnimationFrame(update);
    scene.camera.fov = options.fov;
    scene.canvasSize[0] = options.width;
    scene.canvasSize[1] = options.height;

    scene.camera.position = controls.camera;
    scene.camera.direction = controls.rotation;

    const start = performance.now();

    render(scene);

    const end = performance.now();
    renderedMillis = end - start;
}

update(0);
