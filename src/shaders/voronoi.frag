#version 300 es

precision mediump float;

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

uniform mat4 u_MVP;
uniform vec2 u_resolution;

#define PI 3.14159265358
#define TAU 6.28318530718
#define EXP 2.71828

#define MIN_STEP 0.05
#define MAX_STEPS 32
#define MAX_DIST 10.0
#define SURF_DIST 0.05

$lib
$distances
$noise
$simplex-noise
$space
$spiral-noise
$rand

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

vec3 hash( vec3 x )
{
	x = vec3( dot(x,vec3(127.1,311.7, 74.7)),
			  dot(x,vec3(269.5,183.3,246.1)),
			  dot(x,vec3(113.5,271.9,124.6)));

	return fract(sin(x)*43758.5453123);
}

float smin3(float v1, float v2, float v3, float k) {
  return smin(smin(v1, v2, k), v3, k);
}

float voronoi(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);

  float id = 0.0;
	vec3 ming, minr;
  float mind = 8.0;

  for(int k = -1; k <= 1; k++)
    for(int j = -1; j <= 1; j++)
      for(int i = -1; i <= 1; i++)
        {
          vec3 grid = vec3(float(i), float(j), float(k));
          vec3 targetPoint = hash(p + grid);
          // if (targetPoint.y > 1.0) {
          //   res = 100.0;

          // }
          vec3 r = vec3(grid) - f + targetPoint;
          // float d = dot(r, r);
          float d = dot(abs(r), vec3(1.0));
          if(d < mind)
          {
            mind = d;
            minr = r;
            ming = grid;
          }
        }

  mind = 8.0;
  for(int k = -2; k <= 2; k++)
    for(int j = -2; j <= 2; j++)
      for(int i = -2; i <= 2; i++)
        {
          vec3 grid = ming + vec3(float(i), float(j), float(k));
          vec3 o = hash(p + grid);
          vec3 r = grid + o - f;

          if (dot(minr - r, minr - r) > 0.00001) {
            mind = min(mind, dot(0.5 * (minr + r), normalize(r - minr)));
          }
        }

  return mind / 2.0;
}

float sceneDistance(vec3 p) {
  float v = voronoi(p);
  float plane = p.y + 1.0;
  float sph = sdSphere(p, 1.0);
  return smin(v, sph, -0.02);
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  float col = 0.0;
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    dS = min(dS, MIN_STEP);
    col += smoothstep(0.3, 0.2, dS) * 0.005;
    dO += dS;

    if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
      break;
    }
  }

  return col;
}

vec3 setupRaymarch() {
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

  // march ray to the sphere
  float d = rayMarch(rayOrigin, rayDirection);

  // vec3 col = colorNormal(rayOrigin, rayDirection, d);
  vec3 col = vec3(d);
  return col;
}

void main() {
  // vec3 col = setupRaymarch();
  FragColor = vec4(
    vec3(voronoi(vec3(uv, 1.0))),
    1.0
  );
}

// vec3 GetNormal(vec3 p) {
//   float d = sceneDistance(p);
//   vec2 e = vec2(0.001, 0.0);
//   vec3 n = d - vec3(
//     sceneDistance(p - e.xyy),
//     sceneDistance(p - e.yxy),
//     sceneDistance(p - e.yyx)
//   );

//   return normalize(n);
// }

// vec3 colorNormal(vec3 rayOrigin, vec3 rayDirection, float d) {
//   vec3 col = vec3(0.0);
//   if(d < MAX_DIST) {
//       vec3 p = rayOrigin + rayDirection * d;
//       vec3 n = GetNormal(p);
//       vec3 r = reflect(rayDirection, n);

//       float dif = dot(n, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
//       col = vec3(dif);
//   }
//   return col;
// }

// float rayMarchGlow(vec3 ro, vec3 rd) {
//   float dO = 0.0;
//   float col = 0.0;
//   float glow = 1e9;
//   for(int i = 0; i < MAX_STEPS; i++) {
//     vec3 p = ro + rd * dO;
//     float dS = sceneDistance(p);
//     dO += dS;
//     glow = min(glow, dS);
//     if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
//       break;
//     }
//   }
//   return max((0.2 - glow) * 3.0, 0.0);
// }
