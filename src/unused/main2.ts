import { Renderer } from "./WG/index.js";
const canvas = document.getElementById("c") as HTMLCanvasElement;
const basicVertShaderCode = await (
    await fetch("./shaders/basic.vert.wgsl")
).text();
const basicFragShaderCode = await (
    await fetch("./shaders/basic.frag.wgsl")
).text();

const renderer = await Renderer.init(
    navigator.gpu,
    canvas,
    basicVertShaderCode,
    basicFragShaderCode
);
