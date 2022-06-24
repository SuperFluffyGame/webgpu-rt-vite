import { mat4 } from "gl-matrix";
import { rotation, camera } from "./controls.js";

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
