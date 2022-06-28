import { vec2, vec4 } from "gl-matrix";
import {
    device,
    colorTarget,
    context,
    canvas,
    basicVertShaderCode,
    raytraceFragShaderCode,
    raytraceFragSSAA4code,
    raytraceFragSSAA9code,
} from "./init.js";
import { options } from "../options.js";
import {
    screenGeo,
    getSphereData,
    getCameraData,
    getLightData,
    getOptionsData,
} from "./data.js";
import { getBindGroupData, bindGroupBuffers } from "./bindings.js";
import { getPipeline } from "./pipeline.js";
import { AntiAliasing } from "../options.js";

export interface Scene {
    spheres: Sphere[];
    lights: Light[];
    camera: Camera;
    multisample?: boolean;
    rayBounces?: number;
    canvasSize: vec2;
    antiAliasing?: AntiAliasing;
}

export interface Camera {
    position: vec4;
    direction: vec2;
    fov: number;
}

export interface Sphere {
    radius: number;
    position: vec4;
    color: vec4;
}

export interface Light {
    position: vec4;
    color: vec4;
    intensity: number;
}

const screenGeoBuffer = device.createBuffer({
    size: screenGeo.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
});
new Float32Array(screenGeoBuffer.getMappedRange()).set(screenGeo);
screenGeoBuffer.unmap();

// create output texture
let renderOutputTexture = device.createTexture({
    size: [options.width, options.height],
    format: colorTarget,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
    sampleCount: 4,
});

let previousData: {
    bindGroup: GPUBindGroup;
    pipeline: GPURenderPipeline;
    buffers: bindGroupBuffers;
    aa: AntiAliasing;
} | null = null;
export function render(scene: Scene, hasChanged?: boolean) {
    let vert = basicVertShaderCode;
    let frag: string;

    switch (scene.antiAliasing) {
        case AntiAliasing.SSAA4: {
            frag = raytraceFragSSAA4code;
            break;
        }
        case AntiAliasing.SSAA9: {
            frag = raytraceFragSSAA9code;
            break;
        }
        case AntiAliasing.NoAA:
        default: {
            frag = raytraceFragShaderCode;
            break;
        }
    }

    let bindGroup: GPUBindGroup;
    let buffers: bindGroupBuffers;
    let pipeline: GPURenderPipeline;
    if (hasChanged || previousData === null) {
        const data = getBindGroupData(
            scene.spheres.length,
            scene.lights.length
        );
        bindGroup = data.group;
        buffers = data.buffers;
        pipeline = getPipeline(vert, frag);
    } else {
        buffers = previousData.buffers;
        bindGroup = previousData.bindGroup;
        pipeline = previousData.pipeline;
    }

    device.queue.writeBuffer(
        buffers.cameraBuffer,
        0,
        getCameraData(scene.camera)
    );
    device.queue.writeBuffer(
        buffers.spheresBuffer,
        0,
        getSphereData(scene.spheres)
    );
    device.queue.writeBuffer(
        buffers.lightsBuffer,
        0,
        getLightData(scene.lights)
    );
    device.queue.writeBuffer(buffers.optionsBuffer, 0, getOptionsData(scene));

    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: "clear",
                storeOp: "store",
                view: renderOutputTexture.createView(),
                resolveTarget: context.getCurrentTexture().createView(),
            },
        ],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.setVertexBuffer(0, screenGeoBuffer);

    renderPass.draw(6);
    renderPass.end();

    // const query = device.createQuerySet({
    //     type: "timestamp",
    //     count: 2,
    // });

    // commandEncoder.writeTimestamp(query, 0);
    device.queue.submit([commandEncoder.finish()]);
    // commandEncoder.writeTimestamp(query, 1);

    // console.log(query);
    previousData = {
        bindGroup,
        pipeline,
        buffers,
        aa: scene.antiAliasing ?? AntiAliasing.NoAA,
    };
}

window.addEventListener("resize", () => {
    options.width = canvas.width = window.innerWidth;
    options.height = canvas.height = window.innerHeight;

    renderOutputTexture.destroy();
    renderOutputTexture = device.createTexture({
        size: [options.width, options.height],
        format: colorTarget,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
        sampleCount: 4,
    });
});
