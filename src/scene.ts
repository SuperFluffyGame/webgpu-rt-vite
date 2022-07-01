import { Scene } from "./render/render.js";
import { options } from "./options.js";
import { vec2, vec3, vec4 } from "gl-matrix";
import { raySphereIntersection } from "./utils.js";

export const scene: Scene = {
    camera: {
        position: new Float32Array([0, 0, 5, 1]),
        direction: new Float32Array([0, 0]),
        fov: options.fov,
        renderDistance: options.renderDistance,
    },
    spheres: [],
    lights: [],
    options: {
        canvasSize: new Float32Array([options.width, options.height]),
    },
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

export function removeSphere(origin: vec4, ray: vec3) {
    let closestSphereIndex = -1;
    let closestSphereT = -1000000;

    for (let i = 0; i < scene.spheres.length; i++) {
        const sphere = scene.spheres[i];
        const t = raySphereIntersection(
            vec3.fromValues(origin[0], origin[1], origin[2]),
            ray,
            vec3.fromValues(
                sphere.position[0],
                sphere.position[1],
                sphere.position[2]
            ),
            sphere.radius
        );
        if (t < 0 && t > closestSphereT) {
            closestSphereT = t;
            closestSphereIndex = i;
        }
    }
    if (closestSphereIndex >= 0) {
        scene.spheres.splice(closestSphereIndex, 1);
    }
}
