import { bindGroupLayout } from "./bindings";
import {
    device,
    basicVertShaderCode,
    raytraceFragShaderCode,
    colorTarget,
} from "./init";

const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout],
});

export function getPipeline() {
    return device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module: device.createShaderModule({
                code: basicVertShaderCode,
            }),
            entryPoint: "main",
            buffers: [
                // pos attribute
                {
                    arrayStride: 16,
                    attributes: [
                        {
                            shaderLocation: 0,
                            format: "float32x4",
                            offset: 0,
                        },
                    ],
                },
            ],
        },
        fragment: {
            module: device.createShaderModule({
                code: raytraceFragShaderCode,
            }),
            entryPoint: "main",
            targets: [{ format: colorTarget }],
        },
        multisample: {
            count: 4,
        },
    });
}
