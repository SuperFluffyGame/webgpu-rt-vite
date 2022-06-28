export const enum AntiAliasing {
    NoAA,
    SSAA4,
    SSAA9,
}

export let criticalChanged = false;
export function setCriticalChanged(b: boolean) {
    criticalChanged = b;
}

export const options = {
    width: window.innerWidth,
    height: window.innerHeight,
    fov: 75,
    rayBounces: 0,
    verticalMouseSensitivity: 1,
    horizontalMouseSensitivity: 1,
    multiSample: false,
    optionPanelWidth: 300,
    aa: AntiAliasing.NoAA,
};
options.fov = (options.fov * Math.PI) / 180;

export const optionPanel = document.getElementById("options")!;

const fovSlider = document.getElementById("fov") as HTMLInputElement;
const fovDisplay = document.getElementById(
    "fov-display"
) as HTMLParagraphElement;
const fovReset = document.getElementById("fov-reset") as HTMLButtonElement;

const vMouseSlider = document.getElementById("v-mouse") as HTMLInputElement;
const vMouseDisplay = document.getElementById(
    "v-mouse-display"
) as HTMLParagraphElement;
const vMouseReset = document.getElementById(
    "v-mouse-reset"
) as HTMLButtonElement;

const hMouseSlider = document.getElementById("h-mouse") as HTMLInputElement;
const hMouseDisplay = document.getElementById(
    "h-mouse-display"
) as HTMLParagraphElement;
const hMouseReset = document.getElementById(
    "h-mouse-reset"
) as HTMLButtonElement;

const aaSelect = document.getElementById("aa-select") as HTMLSelectElement;
const aaReset = document.getElementById("aa-reset") as HTMLButtonElement;

fovSlider.addEventListener("input", e => {
    const fov = parseFloat(fovSlider.value);
    setFOV(fov);
});
fovReset.addEventListener("click", e => {
    fovSlider.value = "75";
    setFOV(75);
});

vMouseSlider.addEventListener("input", e => {
    const value = parseFloat(vMouseSlider.value);
    setVmouseSensitivity(value);
});
vMouseReset.addEventListener("click", e => {
    vMouseSlider.value = "1";
    setVmouseSensitivity(1);
});

hMouseSlider.addEventListener("input", e => {
    const value = parseFloat(hMouseSlider.value);
    setHmouseSensitivity(value);
});
hMouseReset.addEventListener("click", e => {
    hMouseSlider.value = "1";
    setHmouseSensitivity(1);
});

aaSelect.addEventListener("change", e => {
    criticalChanged = true;
    const value = aaSelect.value;
    switch (value) {
        case "SSAA4": {
            options.aa = AntiAliasing.SSAA4;
            break;
        }
        case "SSAA9": {
            options.aa = AntiAliasing.SSAA9;
            break;
        }
        case "NoAA":
        default: {
            options.aa = AntiAliasing.NoAA;
        }
    }
});

window.addEventListener("load", e => {
    const fovValue = parseFloat(fovSlider.value);
    const fovDisplayValue = fovValue.toString().padStart(3, "0");
    fovDisplay.innerText = `${fovDisplayValue}°`;

    const vMouseValue = parseFloat(vMouseSlider.value);
    const vMouseDisplayValue = vMouseValue.toFixed(1);
    vMouseDisplay.innerText = `${vMouseDisplayValue}`;

    const hMouseValue = parseFloat(hMouseSlider.value);
    const hMouseDisplayValue = hMouseValue.toFixed(1);
    hMouseDisplay.innerText = `${hMouseDisplayValue}`;
});

function setFOV(fov: number) {
    options.fov = (fov * Math.PI) / 180;

    const display = fov.toString().padStart(3, "0");
    fovDisplay.innerText = `${display}°`;
}

function setHmouseSensitivity(sensitivity: number) {
    options.horizontalMouseSensitivity = sensitivity;

    const display = sensitivity.toFixed(1);
    hMouseDisplay.innerText = `${display}`;
}

function setVmouseSensitivity(sensitivity: number) {
    options.verticalMouseSensitivity = sensitivity;

    const display = sensitivity.toFixed(1);
    vMouseDisplay.innerText = `${display}`;
}
