import "./styles/main.css";
import {
    getRotationMatrix,
    getTranslationMatrix,
    lightPos,
    screenGeo,
    sphereCount,
    sphereData,
} from "./render/data.js";
import {
    device,
    basicVertShaderCode,
    raytraceFragShaderCode,
    colorTarget,
    canvas,
    context,
} from "./render/init.js";
import {
    canvasSizeBuffer,
    cameraPosMatBuffer,
    cameraRotMatBuffer,
    fovBuffer,
    sphereBuffer,
    sphereCountBuffer,
    lightPosBuffer,
    rayBouncesBuffer,
    multiSampleBuffer,
} from "./buffers.js";
import {
    cameraBindGroup,
    cameraBindGroupLayout,
} from "./bindGroups/cameraBindings.js";
import {
    objectBindGroup,
    objectBindGroupLayout,
} from "./bindGroups/objectBindings.js";
import {
    otherBindGroup,
    otherBindGroupLayout,
} from "./bindGroups/otherBindings.js";
import { options } from "./options.js";
import { mat4 } from "gl-matrix";

const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [
        cameraBindGroupLayout,
        objectBindGroupLayout,
        otherBindGroupLayout,
    ],
});
//create pipline
const pipeline = device.createRenderPipeline({
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

//creating and setting the buffers for attributes
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

// render!
function render(_time: number) {
    requestAnimationFrame(render);
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
    const translationMatrix = getTranslationMatrix();
    mat4.transpose(translationMatrix, translationMatrix);
    const rotationMatrix = getRotationMatrix();
    mat4.transpose(rotationMatrix, rotationMatrix);

    //group 1
    device.queue.writeBuffer(cameraPosMatBuffer, 0, translationMatrix);
    device.queue.writeBuffer(cameraRotMatBuffer, 0, rotationMatrix);
    device.queue.writeBuffer(fovBuffer, 0, new Float32Array([options.fov]));

    //group 2
    device.queue.writeBuffer(sphereCountBuffer, 0, sphereCount);
    device.queue.writeBuffer(sphereBuffer, 0, sphereData);
    device.queue.writeBuffer(lightPosBuffer, 0, lightPos);

    //group 3
    device.queue.writeBuffer(
        canvasSizeBuffer,
        0,
        new Float32Array([options.width, options.height])
    );
    device.queue.writeBuffer(
        rayBouncesBuffer,
        0,
        new Float32Array([options.rayBounces])
    );
    device.queue.writeBuffer(
        multiSampleBuffer,
        0,
        new Float32Array([+options.multiSample])
    );

    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, cameraBindGroup);
    renderPass.setBindGroup(1, objectBindGroup);
    renderPass.setBindGroup(2, otherBindGroup);

    renderPass.setVertexBuffer(0, screenGeoBuffer);
    // renderPass.setVertexBuffer(1, screenUVbuffer);

    renderPass.draw(6);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
}
requestAnimationFrame(render);

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
