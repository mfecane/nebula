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

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.00001 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float sceneDistance(vec3 point) {
  // float box = sdBox(p - vec3(0.0, 1.0, 0.0), vec3(1.0));

  float angle = (1.0 - point.y) * (-PI + u_control5 * TAU);
  point = vec3(
    point.x * sin(angle) + point.z * cos(angle),
    point.y * u_control3,
    point.x * - cos(angle) + point.z * sin(angle)
  );

  float sphereDist = sdSphere(point, 0.5 + u_control1 * 1.0);
  float gyroid = sdGyroid(point, 1.0 + u_control2 * 8.0);
  float d = smin(sphereDist, gyroid * 0.9, -0.07);

  return d;
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
  const float mouseFactor = 0.0002;
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 0.0, -u_scrollValue);

  float rot = vec2(
    u_mouseY * mouseFactor * PI * 2.0,
    u_mouseX * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);
  float d = rayMarch(rayOrigin, rayDirection);


  if(d < MAX_DIST) {
      vec3 p = rayOrigin + rayDirection * d;
      vec3 n = GetNormal(p);
      vec3 r = reflect(rayDirection, n);

      float dif = dot(n, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
      col = vec3(dif);
  }

  FragColor = vec4(col, 1.0);
}
