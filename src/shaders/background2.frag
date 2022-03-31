#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;
uniform float u_quality;
uniform float u_control4;

$simplex-noise
$spiral-noise
$map

#define PI  3.14159265358
#define TAU 6.28318530718


float Noise31(vec3 p){
  p = fract(p * vec3(123.344314, 234.542341, 123.432423));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y * p.z);
}

vec3 cloudsNoise(vec3 p)
{
  float noise;

  float spiralNoise;
  float pbmSimplexNoise;


  float spiralNoise1 = chunkSpiralNoise3(p);
  float simplex1 = pbm_simplex_noise3(p);

  p += vec3(1.0, 0.5, 1.0) * simplex1;

  spiralNoise = chunkSpiralNoise3(p);
  spiralNoise += 0.72 * chunkSpiralNoise3(2.64356 * p.zxy + vec3(1.1231, 2.5321, 4.1445));

  pbmSimplexNoise = pbm_simplex_noise3(p);

  noise = mix(
    spiralNoise,
    0.8 - pbmSimplexNoise,
    spiralNoise * 0.6
  );

  return vec3(
    (pbmSimplexNoise * 1.8 + 0.8) * (1.0 + p.x * 0.5),
    (1.0 - sin(spiralNoise)),
    (spiralNoise * spiralNoise) * (1.0 + p.y * 0.5)
  );
}

void main()
{
  // polar to cartesian
  vec3 pos = vec3(
    sin(uv.x * PI + PI / 2.0) * cos(uv.y * PI),
    cos(uv.x * PI + PI / 2.0) * cos(uv.y * PI),
    sin(uv.y * PI)
  );

  vec3 col = vec3(0.0);

  vec3 neb = cloudsNoise(pos);

  col = vec3(1.2, 0.05, 0.05);
  // col = mix(col, vec3(0.05, 1.0, 0.2), neb.yzx);
  col = mix(col, vec3(0.05, 0.1, 0.1), neb * neb );
  col = mix(col, vec3(0.01, 0.8, 0.3), (neb.yzx * neb.yzx * 0.6));

  col = clamp(col, 0.0, 1.0);

  FragColor = vec4(col, 1.0);
  // FragColor = vec4(vec3(neb.x), 1.0);
}
