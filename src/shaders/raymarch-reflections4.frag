#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;
uniform float u_gamma;
uniform float u_gyrdens1;

uniform float u_control1;
uniform float u_control2;

uniform sampler2D u_Sampler;
uniform samplerCube u_Sampler2;

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 128
#define MAX_DIST 15.0
#define SURF_DIST 0.0005 // hit distance

$lib
$distances
$noise
$simplex-noise
$col
$sampleBlur
$space

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

vec3 hash33(vec3 p) {
    float n = sin(dot(p , vec3(7, 157, 113)));
    return fract(vec3(2097152, 262144, 32768)*n);
}

float hash21(vec2 p){
  p = fract(p * vec2(123.344314, 234.542341) * sin(floor(u_time / 2.0)));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y);
}

float hash21_2(vec2 p){
  return fract(sin(p.x + p.y + u_time / 5.0) * cos(p.y * 2.1554 + u_time / 5.0));
}

float dPlane(vec3 point) {
  float dist = point.y + 0.8;
  return dist;
}

float dBigSphere(vec3 point, float radius) {
  float dist = length(point + vec3(0.0, radius + 0.8, 0.0)) - radius;
  return dist;
}

float dSphere(vec3 point, float radius) {
  // point -= vec3(0.0, 0.5, 0.0);
  float dist = length(point) - radius;
  return dist;
}

float sceneDistance(vec3 p) {
  float s = sdSphere2(p, 1.0, 0.03);
  float g = sdGyroid(p, 1.0 + 4.0, 0.03);
  float sph2 = dBigSphere(p, 10.0);

  float d = smin(s, g, -0.2);
  d = min(d, sph2);

  return d;
}

float sceneMaterial(vec3 p) {
  float s = sdSphere2(p, 1.0, 0.05);
  float g = sdGyroid(p, 1.0 + 4.0, 0.05);
  float sph2 = dBigSphere(p, 5.0);

  float d = max(s, g);
  d = min(d, sph2);

  if (d == sph2) {
    return 0.0;
  }

  return 1.0;
}

vec2 rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  float col = 0.0;
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    float mat = sceneMaterial(p);

    col += max(0.5 - dS, 0.0) * 0.05 * mat;
    dO += min(dS, 0.1);
    if (abs(dS) < SURF_DIST || dO > MAX_DIST) {
      break;
    }
  }
  return vec2(dO, col);
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
	vec3 rayOrigin = vec3(-0.4, 0.0, -0.5 - u_scrollValue * 1.0);
  float mouseY1 = max(u_mouseY, -70.0);


  vec2 rot = vec2(
    mouseY1 * mouseFactor * PI * 2.0,
    u_mouseX * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);

  vec2 res = rayMarch(rayOrigin, rayDirection);
  float d = res.x;
  float c = res.y;

  vec3 col = vec3(c);

  if (d < MAX_DIST) {
    vec3 p = rayOrigin + rayDirection * d;
    vec3 n = GetNormal(p);
    float mat = sceneMaterial(p);
    vec3 r = reflect(rayDirection, n);

    // float dif = dot(n, normalize(vec3(0.0, 1.0, 0.0))) * 0.5 + 0.5;
    // col = vec3(dif) * mat;

    if (mat == 0.0) {
      vec3 reflectDirection = normalize(r);
      vec3 reflectOrigin = p + reflectDirection * SURF_DIST  + 0.02;
      res = rayMarch(reflectOrigin, reflectDirection);
      float d1 = res.x;
      float c1 = res.y;

      if (d1 < MAX_DIST) {
        vec3 p1 = reflectOrigin + reflectDirection * d1;
        vec3 n1 = GetNormal(p1);
        vec3 r1 = reflect(reflectDirection, n1);

        // float dif1 = dot(n1, normalize(vec3(0.0, 1.0, 0.0))) * 0.5 + 0.5;

        col += c1 / 2.0;
      }
    }


  }

  FragColor = vec4(col, 1.0);
}
