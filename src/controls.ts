import { pressedKeys, mouse } from "./inputs.js";

export const camera = new Float32Array(3);
export const rotation = new Float32Array(2);

export function updateControls(dt: number) {
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

    // rotation[0] = 0;
    // rotation[1] = 0;
    // rotation[0] = (-45 / 180) * Math.PI;
    // rotation[1] = (45 / 180) * Math.PI;
}
