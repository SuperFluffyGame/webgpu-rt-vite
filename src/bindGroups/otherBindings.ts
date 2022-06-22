import { device } from "../init.js";
import {
    canvasSizeBuffer,
    rayBouncesBuffer,
    multiSampleBuffer,
} from "../buffers.js";

// binding 1: canvasSizeBuffer
// binding 2: rayBouncesBuffer
// binding 3: multiSampleBuffer
export const otherBindGroupLayout = device.createBindGroupLayout({
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

export const otherBindGroup = device.createBindGroup({
    layout: otherBindGroupLayout,
    entries: [
        {
            binding: 0,
            resource: {
                buffer: canvasSizeBuffer,
            },
        },
        {
            binding: 1,
            resource: {
                buffer: rayBouncesBuffer,
            },
        },
        {
            binding: 2,
            resource: {
                buffer: multiSampleBuffer,
            },
        },
    ],
});
