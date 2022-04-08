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

$lib
$distances
$noise
$simplex-noise
$col

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 200
#define MAX_DIST 30.0
#define SURF_DIST 0.005 // hit distance

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

vec2 dSphere(vec3 point) {
  float angle = 0.0;
	if (point.z != 0.0) {
    angle = clamp(atan(point.x, point.z), -PI, PI);
  }
	else if (point.x > 0.0) {
		angle = PI * 0.5;
	}
	else {
		angle = -PI * 0.5;
	}

  vec2 param = vec2(
    point.y * 4.0,
    angle
  ) * 4.0;

  float id = 1.0 + hash21_2(floor(param));

  float dist = length(point) - 0.7 * (cos(point.x) + sin(point.y));

  return vec2(dist, id);
}

float sceneDistance(vec3 point) {
  float g1 = sdGyroid2(point * 8.0, 0.5 + 1.0 * u_gyrdens1, 0.5);
  float g2 = sdGyroid3(point * 8.0, 0.5, 0.5);
  float sph = sdSphere(point, 1.0);
  float pl = dPlane(point);

  float d = smin(g1, g2, -0.1) / 8.0;
  d = smin(d, sph, -0.1);
  d = smin(d, pl, 0.1);

  return d;
}

float sceneMaterial(vec3 point) {
  float g1 = sdGyroid2(point * 8.0, 0.5 + 1.0 * u_gyrdens1, 0.5);
  float g2 = sdGyroid3(point * 8.0, 0.5, 0.5);
  float sph = sdSphere(point, 1.0);
  float pl = dPlane(point);

  float d = max(g1, g2) / 8.0;
  d = max(d, sph);
  d = min(d, pl);

  if(d == sph) {
    return 0.0;
  }

  return 1.0;
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    dO += dS;
    if (abs(dS) < SURF_DIST || dO > MAX_DIST) {
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

void main() {  const float mouseFactor = 0.0005;
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

    // reflection
    dif *= mat;

    if (mat == 1.0) {
      vec3 reflectDirection = normalize(r) + vec3(pbm_simplex_noise3(p)) * 0.1;
      vec3 reflectOrigin = p + reflectDirection * SURF_DIST  + 0.02;

      float d1 = rayMarch(reflectOrigin, reflectDirection);

      if (d1 < MAX_DIST) {
        col.b = 1.0;

        vec3 p1 = reflectOrigin + reflectDirection * d1;
        vec3 n1 = GetNormal(p1);

        dif1 = dot(n1, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
        dif = mix(dif, dif1, (1.0 - mat * 0.3));
      }
    }
  }

  col = vec3(dif);
  FragColor = vec4(col, 1.0);
}
