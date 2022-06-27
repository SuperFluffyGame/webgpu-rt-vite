import { device } from "../render/init.js";
import {
    cameraPosMatBuffer,
    cameraRotMatBuffer,
    fovBuffer,
} from "../buffers.js";

// binding 1: cameraPosMatBuffer
// binding 2: cameraRotMatBuffer
// binding 3: fovBuffer
export const cameraBindGroupLayout = device.createBindGroupLayout({
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
        {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
        {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
    ],
});

export const cameraBindGroup = device.createBindGroup({
    layout: cameraBindGroupLayout,
    entries: [
        {
            binding: 0,
            resource: {
                buffer: cameraPosMatBuffer,
            },
        },
        {
            binding: 1,
            resource: {
                buffer: cameraRotMatBuffer,
            },
        },
        {
            binding: 2,
            resource: {
                buffer: fovBuffer,
            },
        },
    ],
});
