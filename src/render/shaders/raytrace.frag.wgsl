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
struct FragOutput {
    @location(0) color: vec4<f32>
}


@group(0) @binding(0) var<uniform> camera: Camera;
@group(0) @binding(1) var<storage> spheres: array<Sphere>;
@group(0) @binding(2) var<storage> lights: array<Light>;
@group(0) @binding(3) var<uniform> options: Options;


fn ray_sphere_hit(ray_origin: vec4<f32>, ray_dir: vec4<f32>, sphere_origin: vec4<f32>, sphere_radius: f32) -> f32{
    var a = dot(ray_dir.xyz, ray_dir.xyz);
    var b = 2 * dot(ray_dir.xyz, (ray_origin.xyz - sphere_origin.xyz));
    var c = dot((ray_origin.xyz - sphere_origin.xyz), (ray_origin.xyz - sphere_origin.xyz)) - pow(sphere_radius, 2);
    
    var descriminant = pow(b, 2) - (4 * a * c);

    // if (descriminant < 0) {
    //     return -1.0;
    // } else {
        return (-b - sqrt(descriminant) ) / (2.0*a);
    // }
}

fn getNewPosFromOldPos(pos: vec2<f32>) -> vec2<f32>{
    let min_size = min(options.canvas_size.x, options.canvas_size.y);
    let new_pos =  (2 * pos.xy - options.canvas_size) / min_size; 

    return new_pos;
}


@fragment
fn main(
    @builtin(position) pos: vec4<f32>
) -> FragOutput {
    // let PI: f32 = 3.141592636;
    var out: FragOutput;

    let new_pos = getNewPosFromOldPos(pos.xy);
    //vec2<f32>((pos.x - options.canvas_size.x / 2.0) / (min_size / 2.0), 
                            // (pos.y - options.canvas_size.y / 2.0) / (min_size / 2.0));

    let ray_origin = vec4<f32>(0,0,0,1) * camera.pos_mat;
    let sky_color1 = vec4<f32>(138 / 255.0, 255 / 255.0, 249 / 255.0, 1);
    let sky_color2 = vec4<f32>(46  / 255.0, 168 / 255.0, 201 / 255.0,1);

    let light_pos = lights[0].pos;
    var ray_dir = normalize(
        vec4<f32>(
            new_pos.x,
            new_pos.y,
            - (1 / tan(camera.fov / 2)), 1
        ) * camera.dir_mat
    );
    let sky_color = mix(sky_color1, sky_color2, 1 -ray_dir.y);

    var camera_to_sphere_index: f32 = -1;
    var camera_to_sphere_t: f32 = 100000;
    //initial ray - sphere hit
    for (var i = 0; i < i32(options.sphere_count); i++) {
        var sphere = spheres[i];

        var t = ray_sphere_hit(ray_origin, ray_dir, sphere.pos, sphere.radius);
        if(t < camera_to_sphere_t && t > 0){
            camera_to_sphere_index = f32(i);
            camera_to_sphere_t = t;
        }
    }

    //if it is actually a sphere, and it is in front of the camera
    if(camera_to_sphere_index >= 0 && camera_to_sphere_index < options.sphere_count && camera_to_sphere_t > 0){
        let sphere = spheres[i32(camera_to_sphere_index)];
        let hit_point = ray_origin + ray_dir * camera_to_sphere_t;
        // let normal = (hit_point - sphere.pos);


        let hit_to_light_normal = vec4(normalize(light_pos.xyz - hit_point.xyz),1);
        let light_to_hit_normal = vec4(normalize(hit_point.xyz - light_pos.xyz),1);

        var hit_by_light: f32 = 1;
        //looping over each sphere to see if light hits it (multi object light occlusion) (not hit sphere)
        for(var i = 0; i < i32(options.sphere_count); i++){
            if(i == i32(camera_to_sphere_index)){
                continue;
            }
            let sphere = spheres[i];
            let t = ray_sphere_hit(light_pos, light_to_hit_normal, sphere.pos, sphere.radius );
            if(t > 0 && t < distance(light_pos.xyz, hit_point.xyz) || distance(light_pos.xyz, sphere.pos.xyz) < sphere.radius){
                hit_by_light = 0;
                break;
            }
        }

        let self_light_occluded_t = ray_sphere_hit(light_pos, light_to_hit_normal, sphere.pos, sphere.radius - 0.001 );
        if(self_light_occluded_t > 0 && self_light_occluded_t < distance(light_pos.xyz, hit_point.xyz) || distance(light_pos.xyz, sphere.pos.xyz) < sphere.radius){
            hit_by_light = 0;
        }

        //check if the hit sphere is closer than hit point

        if( hit_by_light == 1){
            out.color = sphere.color * clamp( 25 / distance(light_pos.xyz, hit_point.xyz), 0, 1);
        }

        
    } else {
        out.color = sky_color;
    }
    return out;
}