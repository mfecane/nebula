#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

// source https://www.shadertoy.com/view/MsVXWW

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

uniform float u_control1;
uniform float u_control2;
uniform float u_control3;
uniform float u_control4;
uniform float u_control5;
uniform float u_control6;
uniform float u_control7;
uniform float u_control8;

$simplex-noise
$spiral-noise
$map

float mod289(in float x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

vec2 mod289(in vec2 x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

vec3 mod289(in vec3 x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

vec4 mod289(in vec4 x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

float SpiralNoise3D(vec3 p)
{
  float nudge = 0.34324;	// size of perpendicular vector
  float normalizer = 1.0 / sqrt(1.0 + nudge * nudge);	// pythagorean theorem on that perpendicular to maintain scale

  float n = 0.0;
  float iter = 1.0;
  for (int i = 0; i < 5; i++)
  {
    n += (sin(p.y * iter) + cos(p.x * iter)) / iter;
    p.xz += vec2(p.z, -p.x) * nudge;
    p.xz *= normalizer;
    iter *= 0.66313 ;
  }
  return n;
}

vec3 NebulaNoise(vec3 p)
{
  // float final = p.y + 4.5;
  // // frequent from (-5, 0);
  // // mid-range noise
  // final -= SpiralNoiseC(p.xyz);
  // // less frequent noise (-12, - 2)
  // // large scale features
  // final += SpiralNoiseC(p.zxy * 0.5123 + 100.0) * 4.12515;
  // // very smooth large scale noise
  // // more large scale features, but 3d
  // final -= SpiralNoise3D(p);
  float noise;

  float spiralNoise;
  float pbmSimplexNoise;

  spiralNoise = chunkSpiralNoise3(p);
  spiralNoise += u_control1 * 0.144 * chunkSpiralNoise3(2.64356 * p.zxy + vec3(1.1231, 2.5321, 4.1445));

  pbmSimplexNoise = pbm_simplex_noise3(p);

  noise = mix(
    spiralNoise,
    0.8 - pbmSimplexNoise,
    spiralNoise * 0.6
  );

  noise = 0.3 - pbmSimplexNoise;

  return vec3(noise, noise * noise, noise);
}

// combination of noises around (0.0, 30.0)
float mapNebulaDensity(vec3 p)
{
  // NebulaNoise around (-30, 10)
  float noise = pbm_simplex_noise3(p);
  return noise * noise * noise;
}

float densityFunction2(vec3 p) {
  float noise = mapNebulaDensity(3.0 * p + vec3(1.0));

  return clamp(map(noise, -2.5 + 5.0, 8.0, 0.0, 1.0), 0.0, 1.0); // * densitySphere(p);
  // return densitySphere(p);
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
  vec2 uv1 = uv * 1.6;

  vec3 pos = vec3(
    sin(uv1.x) * cos(uv1.y),
    cos(uv1.x) * cos(uv1.y),
    sin(uv1.y)
  );

  // vec3 col = vec3(Noise31(floor(pos * 20.0)) * 0.3);

  vec3 col = vec3(0.0);

  // float f = chunkSpiralNoise3(pos);
  // f = map(f, 0.0, 1.0, 0.0, 1.0);
  // col = vec3(f);

  // check spiral noise
  vec3 neb = NebulaNoise(pos);
  col = mix(vec3(0.6, 0.1, 0.8), vec3(0.4, 0.6, 0.4), neb.x) * neb.y;

  vec3 st = stars(pos * 15.0) * 2.0;
  col += st;

  st = stars(pos * 40.0) * 1.5;
  col += st;

  st = stars(pos * 80.0) * 1.5;
  col += st;

  col = clamp(col, 0.0, 1.0);

  FragColor = vec4(col, 1.0);
}
