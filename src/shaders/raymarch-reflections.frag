#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

$lib
$distances
$noise

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 200
#define MAX_DIST 30.0
#define SURF_DIST 0.005 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

vec2 dPlane(vec3 point) {
  float dist = point.y + 0.6;
  float id = 0.2 + 0.8 * Noise21(floor(point.xz * 1.0));
  return vec2(dist, id);
}

float dSphere(vec3 point) {
  return length(point) - 0.7;
}

float sceneDistance(vec3 point) {
  float sphere = dSphere(point);
  vec2 plane = dPlane(point);
  return smin(sphere, plane.x, 0.2);
}

float sceneMaterial(vec3 point) {
  float sphere = dSphere(point);
  vec2 plane = dPlane(point);
  float d = min(sphere, plane.x);

  if(d == plane.x) {
    return plane.y;
  }

  return 1.0;
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

void main() {
  const float mouseFactor = 0.0005;
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 0.0, 1.0 - u_scrollValue * 3.0);
  float mouseY1 = max(u_mouseY, -70.0);

  vec2 rot = vec2(
    mouseY1 * mouseFactor * PI * 2.0,
    u_mouseX * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);

  float d = rayMarch(rayOrigin, rayDirection);

  vec3 col;
  float dif;
  float dif1;
  if(d < MAX_DIST) {
    vec3 p = rayOrigin + rayDirection * d;
    vec3 n = GetNormal(p);
    vec3 r = reflect(rayDirection, n);

    float mat = sceneMaterial(p);
    dif = dot(n, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
    dif *= mat;

    if (mat > 0.0) {
      vec3 reflectDirection = normalize(r);
      vec3 reflectOrigin = p + reflectDirection * SURF_DIST  + 0.02;

      float d1 = rayMarch(reflectOrigin, reflectDirection);

      if (d1 < MAX_DIST) {
        col.b = 1.0;

        vec3 p1 = reflectOrigin + reflectDirection * d1;
        vec3 n1 = GetNormal(p1);

        dif1 = dot(n1, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
        dif = mix(dif, dif1, (1.0 - mat));
      }
    }
  }

  col = vec3(dif);
  FragColor = vec4(col, 1.0);
}
