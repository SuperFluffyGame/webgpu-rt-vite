import { Scene } from "./render/render.js";
import { options } from "./options.js";

export const scene: Scene = {
    camera: {
        position: new Float32Array([0, 0, 5, 1]),
        direction: new Float32Array([0, 0]),
        fov: options.fov,
    },
    spheres: [],
    lights: [],
    canvasSize: new Float32Array([options.width, options.height]),
};

export function addSphere(
    x: number,
    y: number,
    z: number,
    r: number,
    cr: number,
    cg: number,
    cb: number
) {
    scene.spheres.push({
        position: new Float32Array([x, y, z, 1]),
        radius: r,
        color: new Float32Array([cr, cg, cb, 1]),
    });
}

export function addLight(
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number,
    i: number
) {
    scene.lights.push({
        position: new Float32Array([x, y, z, 1]),
        color: new Float32Array([r, g, b, 1]),
        intensity: i,
    });
}
