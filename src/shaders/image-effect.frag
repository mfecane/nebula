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

bool RaySphereIntersect(vec3 org, vec3 dir, float radius, out float near, out float far)
{
  float b = dot(dir, org);
  float c = dot(org, org) - radius;
  float delta = b * b - c;
  if (delta < 0.0){
    return false;
  }
  float deltasqrt = sqrt(delta);
  near = -b - deltasqrt;
  far = -b + deltasqrt;
  return far > 0.0;
}


float planeDistance(vec3 p) {
  return p.y + 0.8;
}

float densityFunction(vec3 p) {
  float s = sdSphere2(p, 1.0, 0.03);
  float g = sdGyroid(p, 1.0 + 4.0, 0.03);

  float d = smin(s, g, -0.2);

  return d;
}

vec2 rayMarch(vec3 ro, vec3 rd) {
  float col = 0.0;
  float min_dist;
  float max_dist;

  RaySphereIntersect(ro, rd, 3.0, min_dist, max_dist);
  float dO = max(min_dist, 0.0);


  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float planeDistance = planeDistance(p);
    float dS = densityFunction(p);
    float mat = sceneMaterial(p);

    // col += 0.2;
    col += max(0.3 - dS, 0.0 ) * 0.05;

    // prevent overstepping
    float step = max(0.05, dS / 0.5);
    step = min(step, planeDistance);

    dO += min(0.05, planeDistance);

    if (dO > max_dist || abs(planeDistance) < SURF_DIST) {
      break;
    }
    // check this
    // float planeDistance = planeDistance(p);
    // if (planeDistance < 0.0) {
    //   dO = planeDistance;
    //   col = 1.0;
    //   break;
    // }
  }

  // float planeDistance = planeDistance(ro + rd * dO);
  // if (planeDistance < 0.0) {
  //   col = 1.0;
  // }

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
  vec2 uv1 = uv * 0.5 - 0.5;

  vec2 n = floor(uv1 * 10.0) / 10.0;
  vec2 luv = fract(uv1 * 10.0) / 10.0;

  float noise = Noise21(n);

  uv1 = n + noise + luv;




  vec4 col = texture(u_Sampler, uv1);
  FragColor = col;
}
