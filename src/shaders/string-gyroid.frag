#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

uniform float u_quality;
uniform float u_control1;
uniform float u_control2;
uniform float u_control3;
uniform float u_control4;
uniform float u_control5;
uniform float u_control6;
uniform float u_control7;
uniform float u_control8;

#define PI  3.14159265358
#define TAU 6.28318530718

$lib
$distances
$noise
$simplex-noise
$space

#define MAX_STEPS 128
#define MAX_DIST 20.0
#define SURF_DIST 0.5  // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float min3(float v1, float v2, float v3, float k) {
  return smin(smin(v1, v2, k), v3, k);
}

vec3 randomSpaceShift(vec3 p) {
  p += pbm_simplex_noise3(p) * u_control5;
  return p;
}

float mapDist(vec3 p) {
  //vec3 p1 = shwistSpace(p.xyz, -0.2 + 0.4 * u_control4);
  vec3 p1 = p;
  // vec3 p1 = shwankSpace(p, u_control2);

  // don't do this, trust me
  // vec3 p1 = polarTocartesian(p);
  // vec3 p1 = p;
  // multiply spheres
  // vec3 p1 = (-0.5 + fract(p / 8.0)) * 8.0;
  // float d = length(p1) - 0.3;

  // float d = length(vec2(p1.x, p1.y)) - 0.3;

  // float s = sdSphere(p1, 4.0);
  float g1 = sdGyroid2(p1, 0.5 + 1.0 * u_control1, 0.02);
  float g2 = sdGyroid3(p1, 0.5, 0.02);
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

vec4 rayMarchCol(vec3 ro, vec3 rd) {
  float dO = 0.0;

  vec3 col = vec3(0.0);

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    col += smoothstep(5.0, 0.0, sqrt(dS)) * vec3(0.3, 0.1, 0.2);
    dO += dS;
    if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
      break;
    }
  }

  return vec4(col, dO);
}

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
  vec4 d = rayMarchCol(rayOrigin, rayDirection);
  vec3 col;

  col += d.rgb * 0.1;

  if(d.w < MAX_DIST) {
      vec3 p = rayOrigin + rayDirection * d.w;
      vec3 n = GetNormal(p);
      //vec3 r = reflect(rayDirection, n);

      //float dif = dot(n, normalize(vec3(0.0, 2.0, 0.0))) * 0.5 + 0.5;
      col += vec3(0.1, 0.1, 0.0) * (1.0 - length(col));
  }
  col *= (1.9 - length(uv) * 0.8);

  FragColor = vec4(col, 1.0);
}
