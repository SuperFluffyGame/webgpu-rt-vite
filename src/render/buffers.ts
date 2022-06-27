import { device } from "./init";

export function getCameraBuffer() {
    return device.createBuffer({
        size: 144,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
}
export function getSpheresBuffer(numSpheres: number) {
    return device.createBuffer({
        size: numSpheres * 32,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
}

export function getLightsBuffer(numLights: number) {
    return device.createBuffer({
        size: numLights * 64,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
}

export function getOptionsBuffer() {
    return device.createBuffer({
        size: 20,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
}
