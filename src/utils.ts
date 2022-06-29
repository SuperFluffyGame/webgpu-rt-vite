import { vec3 } from "gl-matrix";

interface FormatStringOptions {
    throwOnError?: boolean;
    stringifyJSON?: boolean;
}

export function formatString(
    str: string,
    data: object,
    options: FormatStringOptions = {}
) {
    let inFormat = false;
    let formatDepth = 0;
    let formatValue = "";
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        switch (char) {
            case "$": {
                if (inFormat) {
                    formatValue += char;
                    break;
                }
                inFormat = true;
                break;
            }
            case "{": {
                if (inFormat) {
                    formatDepth++;
                    if (formatDepth > 1) {
                        formatValue += char;
                    }
                    break;
                }
                result += char;
                break;
            }
            case "}": {
                if (!inFormat) {
                    result += char;
                    break;
                }
                formatDepth--;
                if (formatDepth > 0) {
                    formatValue += char;
                    break;
                }
                inFormat = false;
                let evalled: any;
                try {
                    evalled = eval(formatValue);
                } catch (e) {
                    if (options.throwOnError) {
                        throw e;
                    }
                }
                if (typeof evalled === "object" && options.stringifyJSON) {
                    result += JSON.stringify(evalled);
                    break;
                }
                result += evalled;
                formatValue = "";
                break;
            }

            default: {
                if (inFormat) {
                    formatValue += char;
                    break;
                }
                result += char;
                break;
            }
        }
    }
    return result;
}

export function raySphereIntersection(
    ray_origin: vec3,
    ray_dir: vec3,
    sphere_origin: vec3,
    sphere_radius: number
): number {
    const ray_minus_sphere = vec3.sub(vec3.create(), ray_origin, sphere_origin);
    const a = vec3.dot(ray_dir, ray_dir);
    const b = 2 * vec3.dot(ray_dir, ray_minus_sphere);
    const c =
        vec3.dot(ray_minus_sphere, ray_minus_sphere) -
        sphere_radius * sphere_radius;
    const discriminant = b * b - 4 * a * c;
    // if (discriminant < 0) {
    //     return -1;
    // } else {
    return (-b - Math.sqrt(discriminant)) / (2 * a);
    // }
}
