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

export function getPipeline(vertSource: string, fragSource: string) {
    return device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
            module: device.createShaderModule({
                code: vertSource,
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
                code: fragSource,
            }),
            entryPoint: "main",
            targets: [{ format: colorTarget }],
        },
        multisample: {
            count: 4,
        },
    });
}
