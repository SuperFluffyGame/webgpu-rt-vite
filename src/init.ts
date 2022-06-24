import { options } from "./options.js";
export { options };

import basicVertShaderCode from "./shaders/basic.vert.wgsl?raw";
import raytraceFragShaderCode from "./shaders/raytrace.frag.wgsl?raw";
export { basicVertShaderCode, raytraceFragShaderCode };

// check if webgpu is enabled
if (!navigator.gpu) {
    throw "WebGPU is not enabled!";
}

// get essentail parts
export const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter;
export const device = await adapter.requestDevice();
export const colorTarget: GPUTextureFormat = "rgba8unorm";

export const canvas = document.getElementById("c") as HTMLCanvasElement;

canvas.width = options.width;
canvas.height = options.height;
export const context = canvas.getContext("webgpu") as GPUCanvasContext;
context.configure({
    device,
    format: colorTarget,
    alphaMode: "opaque",
});
