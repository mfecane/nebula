vec4 SampleBlur(sampler2D u_Sampler, vec2 sampleuv, float Directions, float Quality, float Size, vec2 Radius, float mip) {
  vec4 Color = texture(u_Sampler, sampleuv, mip);
  for(float d = 0.0; d < TAU; d += TAU/Directions) {
    for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {
      Color += texture(u_Sampler, sampleuv + vec2(cos(d), sin(d)) * Radius * i, mip);
    }
  }
  Color /= Quality * Directions;
  return Color;
}

vec4 SampleCubeBlur(vec3 dir) {
  float Directions = 8.0;
  float Quality = 8.0;
  float Radius = 0.1;

  vec4 color = texture(u_Sampler2, dir, 0.0);
  for(float d = Noise31(dir); d < TAU; d += TAU / Directions) {
    for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {
      vec3 newdir = vec3(dir);
      R(newdir.yz, sin(d) * Radius * i);
      R(newdir.xz, cos(d) * Radius * i);
      color += texture(u_Sampler2, newdir, 1.0);
    }
  }
  color /= Quality * Directions;
  return color;
}
