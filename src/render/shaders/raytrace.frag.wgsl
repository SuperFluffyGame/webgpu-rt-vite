struct Sphere {
    pos: vec4<f32>,
    color: vec4<f32>,
    radius: f32,
}

struct Light {
    pos: vec4<f32>,
    color: vec4<f32>,
    intensity: f32,
}

struct Options {
    canvas_size: vec2<f32>,
    sphere_count: f32,
    ray_bounces: f32,
    light_count: f32,
}
struct Camera {
    pos_mat: mat4x4<f32>,
    dir_mat: mat4x4<f32>,
    fov: f32,
}


@group(0) @binding(0) var<uniform> camera: Camera;
@group(0) @binding(1) var<storage> spheres: array<Sphere>;
@group(0) @binding(2) var<storage> lights: array<Light>;
@group(0) @binding(3) var<uniform> options: Options;


fn ray_sphere_hit(ray_origin: vec4<f32>, ray_dir: vec4<f32>, sphere_origin: vec4<f32>, sphere_radius: f32) -> f32 {
    var a = dot(ray_dir.xyz, ray_dir.xyz);
    var b = 2.0 * dot(ray_dir.xyz, (ray_origin.xyz - sphere_origin.xyz));
    var c = dot((ray_origin.xyz - sphere_origin.xyz), (ray_origin.xyz - sphere_origin.xyz)) - pow(sphere_radius, 2);

    var descriminant = pow(b, 2) - (4 * a * c);

    // if (descriminant < 0) {
    //     return -1.0;
    // } else {
    return (-b - sqrt(descriminant) ) / (2.0 * a);
    // }
}

struct closest_sphere_output {
    index: f32,
    t: f32
}
fn get_closest_sphere(ray_origin: vec4<f32>, ray_dir: vec4<f32>, exclude_index: f32) -> closest_sphere_output{
    var closest_sphere_index: f32 = -1;
    var closest_sphere_t: f32 = -1;
    var first_hit = true;

    for(var i = 0; i < i32(options.sphere_count); i++) {
        if (i == i32(exclude_index)) {
            continue;
        }
        var t = ray_sphere_hit(ray_origin, normalize(ray_dir), spheres[i].pos, spheres[i].radius);
        if (t > 0.0 && (t < closest_sphere_t || first_hit)) {
            first_hit = false;
            closest_sphere_index = f32(i);
            closest_sphere_t = t;
        }
    }


    return closest_sphere_output(closest_sphere_index, closest_sphere_t);
}

fn is_occluded(ray_pos: vec4<f32>, ray_dir: vec4<f32>, target: vec4<f32>, lose_precision_on_index: i32) -> f32{
    var dist_to_target = distance(ray_pos.xyz, target.xyz);
    for(var i = 0; i < i32(options.sphere_count); i++) {
        let sphere = spheres[i];

        var t: f32;
        if (i == lose_precision_on_index) {
            // the only reason this is is because of stupid floating point precision errors. argh
            t = ray_sphere_hit(ray_pos, ray_dir, sphere.pos, sphere.radius - 0.001);
        } else {
            t = ray_sphere_hit(ray_pos, ray_dir, sphere.pos, sphere.radius);
        }
        if (t > 0.0 && t < dist_to_target || distance(ray_pos.xyz, sphere.pos.xyz) < sphere.radius) {
            return 0;
        }
    }

    return 1;
}

fn getNewPosFromOldPos(pos: vec2<f32>) -> vec2<f32> {
    let min_size = min(options.canvas_size.x, options.canvas_size.y);
    let new_pos = (2 * pos.xy - options.canvas_size) / min_size;

    return new_pos;
}


@fragment
fn main(
    @builtin(position) pos: vec4<f32>
) -> @location(0) vec4<f32> {

    let new_pos = getNewPosFromOldPos(pos.xy);
    let ray_origin = vec4<f32>(0, 0, 0, 1) * camera.pos_mat;
    var ray_dir = normalize(
        vec4<f32>(
            new_pos.x,
            new_pos.y,
            - (1 / tan(camera.fov / 2)),
            1
        ) * camera.dir_mat
    );

    let sky_color1 = vec4<f32>(138 / 255.0, 255 / 255.0, 249 / 255.0, 1);
    let sky_color2 = vec4<f32>(46 / 255.0, 168 / 255.0, 201 / 255.0, 1);
    let sky_color = mix(sky_color1, sky_color2, 1 - ray_dir.y);

    let light_pos = lights[0].pos;


    let initial_hit = get_closest_sphere(ray_origin, ray_dir, -1.0);
    let sphere = spheres[i32(initial_hit.index)];
    let hit_point = ray_origin + ray_dir * initial_hit.t;
    let light_to_hit_normal = vec4(normalize(hit_point.xyz - light_pos.xyz), 1);

    let hit_by_light: f32 = is_occluded(light_pos, light_to_hit_normal, hit_point, i32(initial_hit.index));




    //if it did not hit a sphere, return the sky color
    if (initial_hit.t < 0.0) {
        return sky_color;
    }
    return (sphere.color * clamp(25 / distance(light_pos.xyz, hit_point.xyz), 0, 1)) * hit_by_light;
}