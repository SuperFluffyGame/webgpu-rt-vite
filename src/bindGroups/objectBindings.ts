import { device } from "../init.js";
import { sphereBuffer, sphereCountBuffer, lightPosBuffer } from "../buffers.js";

// binding 1: sphereBuffer
// binding 2: sphereCountBuffer
// binding 3: lightPosBuffer
export const objectBindGroupLayout = device.createBindGroupLayout({
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
                type: "read-only-storage",
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

export const objectBindGroup = device.createBindGroup({
    layout: objectBindGroupLayout,
    entries: [
        {
            binding: 0,
            resource: {
                buffer: sphereCountBuffer,
            },
        },
        {
            binding: 1,
            resource: {
                buffer: sphereBuffer,
            },
        },
        {
            binding: 2,
            resource: {
                buffer: lightPosBuffer,
            },
        },
    ],
});
