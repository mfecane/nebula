#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

uniform float u_quality;
uniform float u_thick;

#define PI  3.14159265358
#define TAU 6.28318530718

$lib
$distances
$noise
$simplex-noise
$space

#define MAX_STEPS 512
#define MAX_DIST 20.0
#define SURF_DIST 0.001 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float min3(float v1, float v2, float v3, float k) {
  return smin(smin(v1, v2, k), v3, k);
}

float mapDist(vec3 p) {
  vec3 p1 = twistSpace(p.yzx, 0.02);

 p1 = -0.5 + fract(p1 / 2.0);

  float d = length(vec2(p1.x, p1.y)) - u_thick;

  // float d = abs(length(p1) - 0.6);
  // float d = sdGyroid(p, 1.0);

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

void main() {
  const float mouseFactor = 0.0005;
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 4.0, -0.5 - u_scrollValue * 8.0);

  vec2 rot = vec2(
    u_mouseY * mouseFactor * PI * 2.0,
    u_mouseX * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);
  float d = rayMarch(rayOrigin, rayDirection);
  vec3 col;

  if(d < MAX_DIST) {
      vec3 p = rayOrigin + rayDirection * d;
      vec3 n = GetNormal(p);
      vec3 r = reflect(rayDirection, n);

      float dif = dot(n, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
      col = vec3(dif);
  }

  FragColor = vec4(col, 1.0);
}
