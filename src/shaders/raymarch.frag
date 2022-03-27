#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

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

$lib
$distances
$noise
$simplex-noise

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 512
#define MAX_DIST 8.0
#define SURF_DIST 0.0000001 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

vec4 orb;

vec3 twistSpace(vec3 point) {
  float angle = (1.0 - point.y) * (-PI + u_control5 * TAU);

  return vec3(
    point.x * sin(angle) + point.z * cos(angle),
    point.y * u_control3,
    point.x * - cos(angle) + point.z * sin(angle)
  );
}

vec3 pixelateSpace(vec3 point) {
  vec3 n = vec3(
    pbm_simplex_noise3(point * 1.0),
    pbm_simplex_noise3(point * 1.0 + 1.251),
    pbm_simplex_noise3(point * 1.0 + 2.1414)
  );

  point.x = point.x + point.x * cos(n.x * 3.0 * u_control1) * u_control2 - point.z * sin(n.x * 3.0 * u_control1) * u_control2;
  point.z = point.z + point.x * sin(n.x * 3.0 * u_control1) * u_control2 + point.z * cos(n.x * 3.0 * u_control1) * u_control2;

  return point;
}

float fractal(vec3 point) {
  point = -1.0 + 2.0 * fract(point);
  float r2 = length(point) - 0.2;
  return r2 * 0.25;
}

float sceneDistance(vec3 point) {
  // float box = sdBox(p - vec3(0.0, 1.0, 0.0), vec3(1.0));
  // point = twistSpace(point);
  // point = pixelateSpace(point);

  // float sphereDist = sdSphere(point, 1.0);
  // float gyroid = sdGyroid(point, 5.0);
  // float d = smin(sphereDist, gyroid * 0.9, 0.07);

  return fractal(point);
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
	vec3 rayOrigin = vec3(0.0, 0.0, -0.5 - u_scrollValue * 4.0);

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
