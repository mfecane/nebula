#version 300 es

precision mediump float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

uniform float u_quality;
uniform float u_pixelate;

#define PI 3.14159265358
#define TAU 6.28318530718
#define EXP 2.71828

$lib
$distances
$noise
$simplex-noise
$space
$spiral-noise

#define MAX_STEPS 128
#define MAX_DIST 20.0

// can make huge hit distance for nice effect
#define SURF_DIST 0.001  // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float min3(float v1, float v2, float v3, float k) {
  return smin(smin(v1, v2, k), v3, k);
}

  // vec3 randomSpaceShift(vec3 p) {
  //   p += simplex_noise3(p, 0.01) * 0.2;
  //   return p;
  // }

float mapDist(vec3 p) {
  //vec3 p1 = shwistSpace(p.xyz, -0.2 + 0.4 * u_control4);
  // vec3 p1 = randomSpaceShift(p);
  vec3 p1;

  p1 = pixelateSpace(p, 0.1 + 1.0 * u_pixelate);
  p1 = p1 + (-2.5 + chunkSpiralNoise3(p1)) * 0.2;
  // vec3 p1 = shwankSpace(p, 0.5 * u_control5);

  // don't do this, trust me
  // vec3 p1 = polarTocartesian(p);
  // vec3 p1 = p;
  // multiply spheres
  // vec3 p1 = (-0.5 + fract(p / 8.0)) * 8.0;
  // float d = length(p1) - 0.3;

  // float d = length(vec2(p1.x, p1.y)) - 0.3;

  // float s = sdSphere(p1, 4.0);
  float g1 = sdGyroid2(p1, 1.0, 0.01);
  float g2 = sdGyroid3(p1, 0.5, 0.01);
  float d = smin(g1, g2, -0.1) * 0.5;
  // d = smin(s, d, -0.1);

  return d;
}

float sceneDistance(vec3 point) {
  return mapDist(point);
}

vec3 GetNormal(vec3 p) {
  float d = sceneDistance(p);
  vec2 e = vec2(0.001, 0.0);
  vec3 n = d - vec3(
    sceneDistance(p - e.xyy),
    sceneDistance(p - e.yxy),
    sceneDistance(p - e.yyx)
  );

  return normalize(n);
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    dO += dS;
    if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
      break;
    }
  }

  return dO;
}

vec2 rayMarchCol(vec3 ro, vec3 rd) {
  float dO = 0.0;

  float col = 0.0;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    col += smoothstep(2.0, 0.0, dS) * 0.13;
    dO += dS;
    if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
      break;
    }
  }

  return vec2(col, dO);
}

vec3 colorize(float t) {

  // 1.0 - pow(t - 1.0, 2.0)
  // 4.0 * pow(t - 0.5, 3.0) + 0.5
  // pow(1.6 * t - 0.8, 3.0) + 0.5
  // (exp(t) - 1.0) / (EXP - 1.0)
  // (exp(3.0 * t) - 1.0) / (pow(EXP, 3.0) - 1.0)

  vec3 col = vec3(
    4.0 * pow(t - 0.5, 3.0) + 0.5,
    (exp(0.8 * t) - 1.0) / (pow(EXP, 0.8) - 1.0),
    pow(1.6 * t - 0.8, 3.0) + 0.5
  );

  col = mix(
    col,
    vec3(1.0, 0.4, 0.1),
    smoothstep(-0.0, 0.1, (0.2 - pow(2.0 - 4.0 * t, 2.0)))
  );

  // t = clamp(t, 0.0, 1.0);

  // vec3 col = mix(
  //   vec3(0.1, 0.1, 0.6),
  //   vec3(1.0, 0.8, 0.5),
  //   pow(1.6 * t - 0.8, 3.0) + 0.5
  // ) * mix(
  //   vec3(0.1, 0.1, 0.0),
  //   vec3(1.2, 0.8, 0.8),
  //   (exp(3.0 * t) - 1.0) / (pow(EXP, 3.0) - 1.0)
  // );

  // col = vec3(
  //   5.0 * pow(col.r, 1.2),
  //   5.0 * pow(col.g, 1.6),
  //   5.0 * pow(col.b, 1.6)
  // );

  return clamp(col * 1.1 - 0.1, 0.0, 1.0);
}

// TODO ::: add RaySphere intersect
void main() {
  const float mouseFactor = 0.0005;
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 0.0, -1.0 - u_scrollValue * 8.0);

  vec2 rot = vec2(
    u_mouseY * mouseFactor * PI * 2.0,
    u_mouseX * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);

  vec2 d = rayMarchCol(rayOrigin, rayDirection);

  float t = clamp(d[0] * 0.1, 0.0, 1.0) ;
  t *= (1.9 - length(uv) * 0.8);
  // t = clamp(t, 0.0, 1.0);
  vec3 col = colorize(t);

  if(d[1] < MAX_DIST) {
      vec3 p = rayOrigin + rayDirection * d[1];
      vec3 n = GetNormal(p);
      //vec3 r = reflect(rayDirection, n);

      //float dif = dot(n, normalize(vec3(0.0, 2.0, 0.0))) * 0.5 + 0.5;
      col += vec3(1.0, 1.0, 1.0) * (1.0 - t);
  }
  // col = vec3(0.0, 1.0, 0.0);
  FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
