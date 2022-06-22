struct VertOutput {
    @builtin(position) pos: vec4<f32>,
}

@vertex
fn main(
    @location(0) pos: vec4<f32>,
) -> VertOutput{
    var out: VertOutput;
    out.pos = pos;
    return out;
}