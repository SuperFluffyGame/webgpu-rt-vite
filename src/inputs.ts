import { mat4, vec4 } from "gl-matrix";
import {
    createSphere,
    getTranslationMatrix,
    options,
    getRotationMatrix,
} from "./data.js";

const canvas = document.getElementById("c") as HTMLCanvasElement;
// document.body.onclick = e => {
//     canvas.requestPointerLock();
// };

//mouse
export const mouse = { x: 0, y: 0 };
export const mouseOffset = { x: 0, y: 0 };
document.addEventListener("mousemove", e => {
    // mouse.x = e.x / (canvas.width / 2) - 1;
    // mouse.y = -e.y / (canvas.height / 2) + 1;

    mouse.x +=
        (e.movementX / (canvas.width / 2)) *
        (options.horizontalMouseSensitivity * 2);
    mouse.y +=
        (-e.movementY / (canvas.height / 2)) * options.verticalMouseSensitivity;

    if (mouse.y > Math.PI / 2) {
        mouse.y = Math.PI / 2;
    }
    if (mouse.y < -Math.PI / 2) {
        mouse.y = -Math.PI / 2;
    }

    mouseOffset.x = e.offsetX;
    mouseOffset.y = e.offsetY;
});

export const pressedKeys: any = {};
document.addEventListener("keydown", e => {
    const key = e.code;
    pressedKeys[key] = true;
});

document.addEventListener("keyup", e => {
    const key = e.code;
    pressedKeys[key] = false;
});

document.addEventListener("keypress", e => {
    if (e.code == "KeyR") {
        const vec = vec4.fromValues(0, 0, -4, 1);
        vec4.transformMat4(vec, vec, getRotationMatrix());
        vec4.transformMat4(vec, vec, getTranslationMatrix());

        // vec4.transformMat4(vec, vec, getRotationMatrix());
        createSphere(vec[0], vec[1], vec[2], 1);
    }
});
