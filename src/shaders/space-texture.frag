#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

$simplex-noise
$spiral-noise
$map

#define PI  3.14159265358
#define TAU 6.28318530718

vec3 cloudsNoise(vec3 p)
{
  float noise;

  float spiralNoise;
  float pbmSimplexNoise;

  spiralNoise = chunkSpiralNoise3(p);
  spiralNoise += 0.72 * chunkSpiralNoise3(2.64356 * p.zxy + vec3(1.1231, 2.5321, 4.1445));

  pbmSimplexNoise = pbm_simplex_noise3(p);

  noise = mix(
    spiralNoise,
    0.8 - pbmSimplexNoise,
    spiralNoise * 0.6
  );

  noise = 0.3 - pbmSimplexNoise;

  return vec3(noise, noise * noise, noise);
}

float Noise31(vec3 p){
  p = fract(p * vec3(123.344314, 234.542341, 123.432423));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y * p.z);
}

vec3 stars(vec3 p) {
  float n = Noise31(floor(p));
  p = fract(p);
  vec3 shift = vec3(n - 0.5, fract(n * 10.0), fract(n * 100.0));
  float d = length(p - shift);
  float m = smoothstep(0.2 * n, 0.0, d) * n;
  float bas = sin(n * 213.131);
  return m * vec3(
    1.0 * fract(bas * 0.123552),
    1.0 * fract(bas * 0.535235),
    1.0 * fract(bas * 0.231223)
  );
}

void main()
{
  // polar to cartesian
  vec3 pos = vec3(
    sin(uv.x * PI) * cos(uv.y * PI),
    cos(uv.x * PI) * cos(uv.y * PI),
    sin(uv.y * PI)
  );

  vec3 col = vec3(0.0);

  vec3 neb = cloudsNoise(vec3(cloudsNoise(pos) * 1.0));

  col = mix(vec3(0.6, 0.1, 0.8), vec3(0.4, 0.6, 0.4), neb.x) * neb.y * 0.3;

  vec3 st = stars(pos * 40.0) * 3.0;
  col += st;

  st = stars(pos * 60.0) * 2.0;
  col += st;

  st = stars(pos * 80.0) * 1.5;
  col += st;

  col = clamp(col, 0.0, 1.0);

  FragColor = vec4(col, 1.0);
}
