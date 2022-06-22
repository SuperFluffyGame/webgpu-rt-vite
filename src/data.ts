import { mat4 } from "gl-matrix";
import { rotation, camera } from "./controls.js";

export const options = {
    width: window.innerWidth,
    height: window.innerHeight,
    fov: 75,
    rayBounces: 0,
    verticalMouseSensitivity: 1,
    horizontalMouseSensitivity: 1,
    multiSample: false,
};
options.fov = (options.fov * Math.PI) / 180;

export function getRotationMatrix() {
    const mat = mat4.create();
    mat4.rotateY(mat, mat, -rotation[0]);
    mat4.rotateX(mat, mat, -rotation[1]);
    // mat4.rotate(mat, mat, 1, [rotation[0], rotation[1], 1]);
    mat4.transpose(mat, mat);
    return mat as Float32Array;
}

export function getTranslationMatrix() {
    const mat = mat4.create();
    mat4.translate(mat, mat, camera);
    mat4.transpose(mat, mat);
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
export const screenUV = new Float32Array([
    0, 0, 0, 1, 1, 1,

    0, 0, 1, 0, 1, 1,
]);

//prettier-ignore
export const sphereData = new Float32Array([
//  x, y, z, w,  r,    padding
    2, 0, 0, 1,  1,    0, 0, 0,
    0, 2, 0, 1,  1,    0, 0, 0
]);
export const sphereCount = new Float32Array([2]);
export const lightPos = new Float32Array([3, -6, 0, 1]);
