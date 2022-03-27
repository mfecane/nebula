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
#define MAX_DIST 100.0
#define SURF_DIST 0.01 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

vec3 cartesianToPolar (vec3 v)
{
	vec3 polar;
  float HALF_PI = PI / 2.0;
	polar[0] = length(v);

	if (v[2] > 0.0f) {
		polar[1] = atan(sqrt (v[0] * v[0]+ v[1] * v[1]) / v[2]);
	}
	else if (v[2] < 0.0f) {
		polar[1] = atan(sqrt(v[0] * v[0]+ v[1] * v[1]) / v[2]) + PI;
	}
	else {
		polar[1] = PI * 0.5f;
	}
	polar[ 1 ] -= HALF_PI;
	if (v[0] != 0.0f) {
        polar[2] = clamp(atan (v[1], v[0]), -PI, PI);
    }
	else if (v[1] > 0.0) {
		polar[2] = PI * 0.5f;
	}
	else {
		polar[2] = -PI * 0.5;
	}
	return polar;
}

float fractal(vec3 point) {
  vec3 p = cartesianToPolar(point.zxy);
  p.x = sqrt(p.x);
  p.y = p.y * 6.0/ PI;
  p.z = p.z * 6.0/ PI;

	vec4 orb = vec4(10.0);
	float scale = 1.0;

	for (int i = 0; i < 8; i++) {
		p = -1.0 + 2.0 * fract(0.5 * p + 0.5);
		float r2 = dot(p, p);
    orb = min(orb, vec4(abs(p), r2));
		float k = 2.3 *  u_control1 / r2;
		p *= k;
		scale *= k;
	}

	return 0.4 * abs(p.x) / scale;
}

float sceneDistance(vec3 point) {
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
