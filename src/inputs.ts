import { vec4 } from "gl-matrix";
import { getTranslationMatrix, getRotationMatrix } from "./render/data.js";
import { canvas } from "./render/init.js";
import { options } from "./options.js";

//mouse
export const mouse = { x: 0, y: 0 };
export const mouseOffset = { x: 0, y: 0 };
document.addEventListener("mousemove", e => {
    if (!inPointerLock) {
        return;
    }
    // mouse.x = e.x / (canvas.width / 2) - 1;
    // mouse.y = -e.y / (canvas.height / 2) + 1;

    mouse.x +=
        (e.movementX / (canvas.width / 2)) *
        (options.horizontalMouseSensitivity * (options.width / options.height));
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

export let inPointerLock = false;
canvas.parentElement!.addEventListener("click", e => {
    document.body.requestPointerLock();
});

document.addEventListener("pointerlockchange", e => {
    inPointerLock = !inPointerLock;
});
