import { mat4, vec2 } from "gl-matrix";
import { Camera, Sphere, Light, Scene, Options } from "./render.js";

export function getRotationMatrix(camera: Camera) {
    const mat = mat4.create();
    mat4.rotateY(mat, mat, -camera.direction[0]);
    mat4.rotateX(mat, mat, -camera.direction[1]);
    // mat4.rotate(mat, mat, 1, [rotation[0], rotation[1], 1]);
    return mat as Float32Array;
}

export function getTranslationMatrix(camera: Camera) {
    const mat = mat4.create();
    mat4.translate(mat, mat, camera.position as Float32Array);
    return mat as Float32Array;
}

//prettier-ignore
export const screenGeo = new Float32Array([
    -1, -1, 0, 1, 
    -1,  1, 0, 1,
     1,  1, 0, 1,

    -1, -1, 0, 1, 
     1, -1, 0, 1, 
     1,  1, 0, 1,
]);

export function getCameraData(camera: Camera) {
    const out = new Float32Array(36);
    const translationMat = getTranslationMatrix(camera);
    mat4.transpose(translationMat, translationMat);

    const rotationMat = getRotationMatrix(camera);
    mat4.transpose(rotationMat, rotationMat);

    out.set(translationMat, 0);
    out.set(rotationMat, 16);
    out.set([camera.fov], 32);

    return out;
}

export function getSphereData(spheres: Sphere[]) {
    const length = spheres.length;
    if (length === 0) {
        return new Float32Array([0, 0, 0, 1, 1, 1, 1, 1, 1]);
    }
    const out = new Float32Array(spheres.length * 12);
    for (let i = 0; i < length; i++) {
        const sphere = spheres[i];
        out.set(sphere.position, i * 12);
        out.set(sphere.color, i * 12 + 4);
        out.set([sphere.radius], i * 12 + 8);
        out.set([sphere.reflectiveness], i * 12 + 9);
    }
    return out;
}

export function getLightData(lights: Light[]) {
    const length = lights.length;
    if (length === 0) {
        return new Float32Array([0, 0, 0, 1, 1, 1, 1, 1, 1]);
    }
    const out = new Float32Array(lights.length * 12);
    for (let i = 0; i < length; i++) {
        const light = lights[i];
        out.set(light.position, i * 12);
        out.set(light.color, i * 12 + 4);
        out.set([light.intensity], i * 12 + 8);
    }
    return out;
}

export function getOptionsData(scene: Scene, sphereCount: number) {
    const out = new Float32Array(6);
    out.set(scene.options.canvasSize, 0);
    out.set([sphereCount], 2);
    out.set([scene.options.rayBounces ?? 0], 3);
    out.set([scene.lights.length], 4);
    out.set([scene.options.globalReflectiveness ?? 0], 5);
    return out;
}
