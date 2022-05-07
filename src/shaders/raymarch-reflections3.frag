#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

uniform float u_gyrdens1;
uniform float u_vignette;
uniform float u_dim;
uniform float u_thick;

uniform sampler2D u_Sampler;
uniform samplerCube u_Sampler2;

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 128
#define MAX_DIST 20.0
#define SURF_DIST 0.0001 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

$lib
$distances
$noise
$simplex-noise
$col
$sampleBlur
$space

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


vec3 twistSpace2(vec3 point, float amount) {
  float angle = (point.y + point.y * point.y * point.y / 3.0) * PI * amount;

  return vec3(
    point.x * sin(angle) + point.z * cos(angle),
    point.y,
    point.x * - cos(angle) + point.z * sin(angle)
  );
}

float sdSphere2(vec3 p, float radius) {
  p.x *= 1.2;
  p.y *= 0.8;
  p.z *= 1.0;
  return (length(p) - radius);
}

float gyroid1(vec3 point) {
  return sdGyroid2(point + vec3(4.3345, 5.2515, 7.2351), 4.17, 0.4) / 2.0;
}

float gyroid2(vec3 point) {
  point = twistSpace(point, 0.3);
  return sdGyroid2(point, 6.7, 0.7) / 2.0;
}

float sceneDistance(vec3 point) {
  point = twistSpace2(point, 0.3);

  float g1 = gyroid1(point);
  float g2 = gyroid2(point);
  // float g2 = sdGyroid3(p1 * 8.0, 0.6324, 0.2 + 0.8 * u_thick);
  float sph = sdSphere2(point, 1.3) ;
  // float pl = dPlane(point);
  // float sph2 = dBigSphere(point, 20.0);

  float d = smin(g1, g2, -0.03);
  d = smin(d, sph, -0.03) * 0.8;
  // d = smin(d, sph2, 0.08);

  return d;
}

float sceneMaterial(vec3 point) {
  // vec3 p1 = point + vec3(0.0, 0.7 * (0.5 + 0.5 * sin(u_time / 10.0)), 0.0);

  // float g1 = sdGyroid2(p1 * 8.0, 0.7456 + 0.7674 * u_gyrdens1, 0.2 + 0.8 * u_thick);
  // // float g2 = sdGyroid3(p1 * 8.0, 0.6324, 0.2 + 0.8 * u_thick);
  // float sph = dSphere(p1, 1.2);
  // // float pl = dPlane(point);
  // // float sph2 = dBigSphere(point, 20.0);

  // // float d = smin(g1, g2, -0.2) / 10.0;
  // float d = max(g1, sph, -0.1);
  // // d = smin(d, sph2, 0.08);

  // // if(d == sph2) {
  // //   return 0.0;
  // // }

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

void main() {
  const float mouseFactor = 0.0005;
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(-0.4, 0.0, -1.5 - u_scrollValue * 1.5);
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

  vec4 samp = SampleCubeBlur(rayDirection) * smoothstep(2.0, 0.0, length(uv)) / 2.0;
  // vec4 samp = texture(u_Sampler2, rayDirection);
  col = samp.rgb;

  if (d < MAX_DIST) {
    vec3 p = rayOrigin + rayDirection * d;
    vec3 n = GetNormal(p);
    float mat = sceneMaterial(p);
    vec3 shiftpoint = (p +
      vec3(
        cos(u_time / 20.0 + 1.3255),
        u_time / 20.0,
        sin(u_time / 20.0 + 2.5342)
      ));
    vec3 r = reflect(rayDirection, n) + vec3(pbm_simplex_noise3(shiftpoint * 5.0)) * 0.2 * (1.0 - mat);
    dif = 1.0 + dot(n, normalize(vec3(0.3, 1.0, 0.0))) * 0.3;

    vec4 samp = texture(u_Sampler2, r);
    col = samp.rgb * dif;

    // simple shading
    // col = vec3(dot(vec3(0.0, 1.0, 0.0), n));

    vec3 reflectDirection = normalize(r);
    vec3 reflectOrigin = p + reflectDirection * SURF_DIST  + 0.02;

    float d1 = rayMarch(reflectOrigin, reflectDirection);

    if (d1 < MAX_DIST) {
      vec3 p1 = reflectOrigin + reflectDirection * d1;
      vec3 n1 = GetNormal(p1);
      vec3 r1 = reflect(reflectDirection, n1);
      vec4 samp = texture(u_Sampler2, r1) / 3.0;
      dif = 1.0 + dot(n1, normalize(vec3(0.3, 1.0, 0.0))) * 0.3;
      col = mix(col, samp.rgb * dif, 0.8);
    }
  }

  FragColor = vec4(col, 1.0);
}
