import { options } from "../options";

if (!navigator.gpu) {
    webGPUnotEnabled();
}
import basicVertShaderCode from "./shaders/basic.vert.wgsl?raw";
import raytraceFragShaderCode from "./shaders/raytrace.frag.wgsl?raw";
import raytraceFragSSAA9code from "./shaders/raytrace-ssaa9.frag.wgsl?raw";
import raytraceFragSSAA4code from "./shaders/raytrace-ssaa4.frag.wgsl?raw";
import { webGPUnotEnabled } from "../errors";

export {
    basicVertShaderCode,
    raytraceFragShaderCode,
    raytraceFragSSAA4code,
    raytraceFragSSAA9code,
};

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
