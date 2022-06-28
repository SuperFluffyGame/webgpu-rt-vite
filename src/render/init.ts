import { options } from "../options";

if (!navigator.gpu) {
    throw "WebGPU is not enabled!";
}
import basicVertShaderCode from "./shaders/basic.vert.wgsl?raw";
import raytraceFragShaderCode from "./shaders/raytrace.frag.wgsl?raw";
export { basicVertShaderCode, raytraceFragShaderCode };

// get essentail parts
export const adapter = (await navigator.gpu.requestAdapter({
    powerPreference: "low-power",
}))!;
export const device = await adapter.requestDevice({
    // requiredFeatures: ["timestamp-query"],
});
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
