import {
    getCameraBuffer,
    getLightsBuffer,
    getOptionsBuffer,
    getSpheresBuffer,
} from "./buffers";
import { device } from "./init";

export const bindGroupLayout = device.createBindGroupLayout({
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
                type: "read-only-storage",
            },
        },
        {
            binding: 3,
            visibility: GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
            },
        },
    ],
});

// const bindGroup = device.createBindGroup({
//     layout: bindGroupLayout,
//     entries: [
//         {
//             binding: 0,
//             resource: {
//                 buffer: getCameraBuffer(),
//             },
//         },
//         {
//             binding: 1,
//             resource: {
//                 buffer: getSpheresBuffer(1),
//             },
//         },
//         {
//             binding: 2,
//             resource: {
//                 buffer: getLightsBuffer(1),
//             },
//         },
//         {
//             binding: 3,
//             resource: {
//                 buffer: getOptionsBuffer(),
//             },
//         },
//     ],
// });

// binding 0: cameraBuffer
// binding 1: spheresBuffer
// binding 2: lightsBuffer
// binding 3: optionsBuffer

export function getBindGroupData(numSpheres: number, numLights: number) {
    const cameraBuffer = getCameraBuffer();
    const spheresBuffer = getSpheresBuffer(numSpheres);
    const lightsBuffer = getLightsBuffer(numLights);
    const optionsBuffer = getOptionsBuffer();

    const group = device.createBindGroup({
        label: "bind group",
        layout: bindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: cameraBuffer,
                },
            },
            {
                binding: 1,
                resource: {
                    buffer: spheresBuffer,
                },
            },
            {
                binding: 2,
                resource: {
                    buffer: lightsBuffer,
                },
            },
            {
                binding: 3,
                resource: {
                    buffer: optionsBuffer,
                },
            },
        ],
    });

    return {
        buffers: { cameraBuffer, spheresBuffer, lightsBuffer, optionsBuffer },
        group,
    };
}

export interface bindGroupBuffers {
    cameraBuffer: GPUBuffer;
    spheresBuffer: GPUBuffer;
    lightsBuffer: GPUBuffer;
    optionsBuffer: GPUBuffer;
}
