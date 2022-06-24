import { canvas } from "./init";
export const optionTab = document.getElementById("options-tab")!;
export const optionPanel = document.getElementById("options")!;

export const options = {
    width: window.innerWidth,
    height: window.innerHeight,
    fov: 75,
    rayBounces: 0,
    verticalMouseSensitivity: 1,
    horizontalMouseSensitivity: 1,
    multiSample: false,
    optionPanelWidth: 300,
};
options.fov = (options.fov * Math.PI) / 180;

optionTab.addEventListener("click", e => {
    console.log("click");
    optionPanel.style.left = "" + options.optionPanelWidth;
});

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
