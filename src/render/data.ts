import { mat4, vec2 } from "gl-matrix";
import { rotation, camera } from "../controls.js";
import { Camera, Sphere, Light, Scene } from "./render.js";

export function getRotationMatrix() {
    const mat = mat4.create();
    mat4.rotateY(mat, mat, -rotation[0]);
    mat4.rotateX(mat, mat, -rotation[1]);
    // mat4.rotate(mat, mat, 1, [rotation[0], rotation[1], 1]);
    return mat as Float32Array;
}

export function getTranslationMatrix() {
    const mat = mat4.create();
    mat4.translate(mat, mat, camera);
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

//prettier-ignore
export let sphereData = new Float32Array(16)

sphereData.set([
    //  x, y, z, w,  r,    padding
    2, 0, 0, 1, 1, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 0,
]);
export const sphereCount = new Float32Array([2]);
export const lightPos = new Float32Array([3, -6, 0, 1]);

export function createSphere(x: number, y: number, z: number, r: number) {
    const oldSphereData = sphereData;
    sphereData = new Float32Array((sphereCount[0] + 1) * 8);
    sphereData.set(oldSphereData);

    sphereData.set([x, y, z, 1, r, 0, 0, 0], sphereCount[0] * 8);
    sphereCount[0]++;
}

export function getSphereData(spheres: Sphere[]) {
    const out = new Float32Array(spheres.length * 8);
    for (let i = 0; i < spheres.length; i++) {
        const sphere = spheres[i];
        out.set(sphere.position, i * 8);
        out.set([sphere.radius], i * 8 + 4);
    }
    return out;
}

export function getCameraData(camera: Camera) {
    const out = new Float32Array(36);
    const translationMat = mat4.create();
    mat4.translate(
        translationMat,
        translationMat,
        camera.position as Float32Array
    );
    mat4.transpose(translationMat, translationMat);

    const rotationMat = mat4.create();
    mat4.rotateY(rotationMat, rotationMat, -camera.direction[0]);
    mat4.rotateX(rotationMat, rotationMat, -camera.direction[1]);
    mat4.transpose(rotationMat, rotationMat);

    out.set(translationMat, 0);
    out.set(rotationMat, 16);
    out.set([camera.fov], 32);

    return out;
}

export function getLightData(lights: Light[]) {
    const out = new Float32Array(lights.length * 16);
    for (let i = 0; i < lights.length; i++) {
        const light = lights[i];
        out.set(light.position, i * 16);
        out.set(light.color, i * 16 + 4);
        out.set([light.intensity], i * 16 + 8);
    }
    return out;
}

export function getOptionsData(scene: Scene) {
    const out = new Float32Array(5);
    out.set(scene.canvasSize, 0);
    out.set([scene.spheres.length], 2);
    out.set([scene.rayBounces ?? 0], 3);
    out.set([scene.multisample ? 1 : 0], 4);
    return out;
}
