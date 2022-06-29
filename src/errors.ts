export function webGPUnotEnabled() {
    const errorElement = document.createElement("div");
    errorElement.textContent =
        "WebGPU is not enabled on this browser. Please enable WebGPU in your browser settings.";
    document.body.appendChild(errorElement);
    throw "WebGPU not enabled";
}
