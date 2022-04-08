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
  vec3 Radius = vec3(0.05);
  float mip = 0.0;

  vec4 color = texture(u_Sampler2, dir, mip);
  for(float d = 0.0; d < TAU; d += TAU/Directions) {
    for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {
      // TODO ::: fix this, make orthogonal

      vec3 shift = vec3(
        cos(d) * cos(d) - cos(d) * sin(d),
        cos(d) * sin(d) + cos(d) * cos(d),
        sin(d)
      );

      color += texture(u_Sampler2, dir + shift * Radius * i, mip);
    }
  }
  color /= Quality * Directions;
  return color;
}
