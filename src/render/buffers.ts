import { device } from "./init";

export function getCameraBuffer() {
    return device.createBuffer({
        label: "camera buffer",
        size: 144,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
}
export function getSpheresBuffer(numSpheres: number) {
    let size = 0;
    if (numSpheres === 0) {
        size = 48;
    } else {
        size = numSpheres * 48;
    }
    return device.createBuffer({
        label: "spheres buffer",
        size,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
}

export function getLightsBuffer(numLights: number) {
    let size = 0;
    if (numLights === 0) {
        size = 48;
    } else {
        size = numLights * 48;
    }
    return device.createBuffer({
        label: "lights buffer",
        size,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
}

export function getOptionsBuffer() {
    return device.createBuffer({
        label: "options buffer",
        size: 24,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
}
