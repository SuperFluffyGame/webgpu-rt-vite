export const options = {
    width: window.innerWidth,
    height: window.innerHeight,
    fov: 75,
    rayBounces: 0,
    verticalMouseSensitivity: 1,
    horizontalMouseSensitivity: 1,
    multiSample: false,
};

const fovSlider = document.getElementById("fov") as HTMLInputElement;
const fovDisplay = document.getElementById(
    "fov-display"
) as HTMLParagraphElement;

fovSlider.addEventListener("input", e => {
    const value = parseFloat(fovSlider.value);
    options.fov = (value * Math.PI) / 180;

    const display = value.toString().padStart(3, "0");
    fovDisplay.innerText = `${display}°`;
});

window.addEventListener("load", e => {
    const value = parseFloat(fovSlider.value);

    const display = value.toString().padStart(3, "0");
    fovDisplay.innerText = `${display}°`;
});
