import "./styles/main.css";
import { canvas } from "./render/init.js";
import { render, Scene } from "./render/render.js";
import * as Controls from "./controls.js";
import { options } from "./options.js";

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

function update() {
    requestAnimationFrame(update);
    scene.camera.fov = options.fov;
    scene.canvasSize[0] = options.width;
    scene.canvasSize[1] = options.height;

    scene.camera.position = Controls.camera;
    scene.camera.direction = Controls.rotation;
    render(scene);
}

update();
