import { vec3, vec4 } from "gl-matrix";
import { pressedKeys, mouse, inPointerLock } from "./inputs.js";
import { setCriticalChanged } from "./options.js";
import { getRotationMatrix, getTranslationMatrix } from "./render/data.js";
import { canvas } from "./render/init.js";
import { addSphere, removeSphere, scene } from "./scene.js";

export const camera = new Float32Array(3);
export const rotation = new Float32Array(2);

export function updateControls(dt: number) {
    if (!inPointerLock) {
        return;
    }
    const moveSpeed = 8 * (dt / 1000);
    if (pressedKeys.KeyW) {
        camera[2] -= moveSpeed * Math.cos(rotation[0]);
        camera[0] -= moveSpeed * -Math.sin(rotation[0]);
    }
    if (pressedKeys.KeyS) {
        camera[2] += moveSpeed * Math.cos(rotation[0]);
        camera[0] += moveSpeed * -Math.sin(rotation[0]);
    }
    if (pressedKeys.KeyA) {
        camera[2] += moveSpeed * Math.cos(rotation[0] + Math.PI / 2);
        camera[0] += moveSpeed * -Math.sin(rotation[0] + Math.PI / 2);
    }
    if (pressedKeys.KeyD) {
        camera[2] -= moveSpeed * Math.cos(rotation[0] + Math.PI / 2);
        camera[0] -= moveSpeed * -Math.sin(rotation[0] + Math.PI / 2);
    }

    if (pressedKeys.Space) {
        camera[1] -= moveSpeed;
    }
    if (pressedKeys.ShiftLeft) {
        camera[1] += moveSpeed;
    }

    rotation[0] = mouse.x;
    rotation[1] = mouse.y;
}

canvas.addEventListener("mousedown", e => {
    if (e.button === 2) {
        const pos = vec4.fromValues(0, 0, -4, 1);
        vec4.transformMat4(pos, pos, getRotationMatrix(scene.camera));
        vec4.transformMat4(pos, pos, getTranslationMatrix(scene.camera));
        addSphere(pos[0], pos[1], pos[2], 0.5, 0, 0, 1, 1);
        setCriticalChanged(true);
    } else if (e.button === 0) {
        const rot = vec3.fromValues(0, 0, 1);
        vec3.transformMat4(rot, rot, getRotationMatrix(scene.camera));
        removeSphere(scene.camera.position, rot);
        setCriticalChanged(true);
    }
});
