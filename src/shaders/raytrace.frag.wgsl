struct Sphere {
    pos: vec4<f32>,
    radius: f32,
    //3xf32 padding
}
struct FragOutput {
    @location(0) color: vec4<f32>
}

//camera bindings
@group(0) @binding(0) var<uniform> camera_pos_mat: mat4x4<f32>;
@group(0) @binding(1) var<uniform> camera_rot_mat: mat4x4<f32>;
@group(0) @binding(2) var<uniform> camera_fov: f32;

//object bindings
@group(1) @binding(0) var<uniform> spheres_count: f32;
@group(1) @binding(1) var<storage> spheres: array<Sphere>;
@group(1) @binding(2) var<uniform> light_pos: vec4<f32>;

// other bindings
@group(2) @binding(0) var<uniform> canvas_size: vec2<f32>;
@group(2) @binding(1) var<uniform> ray_bounces: f32;
@group(2) @binding(2) var<uniform> mult_sample: f32;

fn ray_sphere_hit(ray_origin: vec4<f32>, ray_dir: vec4<f32>, sphere_origin: vec4<f32>, sphere_radius: f32) -> f32{
    var a = pow(ray_dir.x, 2) + pow(ray_dir.y, 2) + pow(ray_dir.z, 2);
    var b = 2 * (
        ray_dir.x * (ray_origin.x - sphere_origin.x) +
        ray_dir.y * (ray_origin.y - sphere_origin.y) +
        ray_dir.z * (ray_origin.z - sphere_origin.z)
    );
    var c = (
        pow(ray_origin.x - sphere_origin.x,2) +
        pow(ray_origin.y - sphere_origin.y,2) +
        pow(ray_origin.z - sphere_origin.z,2)
    ) - pow(sphere_radius, 2);
    
    var descriminant = pow(b, 2) - (4 * a * c);

    if (descriminant < 0) {
        return -1.0;
    } else {
        return (-b - sqrt(descriminant) ) / (2.0*a);
    }
}

@fragment
fn main(
    @builtin(position) pos: vec4<f32>
) -> FragOutput {
    // let PI: f32 = 3.141592636;
    var out: FragOutput;

    let min_size = min(canvas_size.x, canvas_size.y);
    let new_pos = vec2<f32>((pos.x - canvas_size.x / 2.0) / (min_size / 2.0), 
                            (pos.y - canvas_size.y / 2.0) / (min_size / 2.0));

    let ray_origin = vec4<f32>(0,0,0,1) * camera_pos_mat;
    var ray_dir = normalize(
        vec4<f32>(
            new_pos.x,
            new_pos.y,
            - (1 / tan(camera_fov / 2)), 1
        ) * camera_rot_mat
    );

    let sky_color1 = vec4<f32>(138 / 255.0, 255 / 255.0, 249 / 255.0, 1);
    let sky_color2 = vec4<f32>(46  / 255.0, 168 / 255.0, 201 / 255.0,1);
    let sphere_color = vec4<f32>(0.8,1,0,1);
    let sky_color = mix(sky_color1, sky_color2, 1 -ray_dir.y);


    var closest_sphere_index: f32 = -1;
    var closest_sphere_t: f32 = 100000;

    for (var i = 0; i < i32(spheres_count); i++) {
        var sphere = spheres[i];

        var t = ray_sphere_hit(ray_origin, ray_dir, sphere.pos, sphere.radius);
        if(t < closest_sphere_t && t > 0){
            closest_sphere_index = f32(i);
            closest_sphere_t = t;
        }
    }

    if(closest_sphere_index >= 0 && closest_sphere_index < spheres_count && closest_sphere_t > 0){
        let sphere = spheres[i32(closest_sphere_index)];
        let hit_point = ray_origin + ray_dir * closest_sphere_t;
        let normal = (hit_point - sphere.pos);
        let light_to_hit_normal = normalize(hit_point - light_pos);
        let hit_to_light_normal = normalize(light_pos - hit_point);


        let light_t = ray_sphere_hit(hit_point, light_to_hit_normal, sphere.pos, sphere.radius - 0.01);


        if(light_t > 0){
            out.color = sphere_color;
        }
    } else {
        out.color = sky_color;
    }

    return out;
}