#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;
uniform float u_gamma;

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
    float n = sin(dot(p, vec3(7, 157, 113)));
    return fract(vec3(2097152, 262144, 32768)*n);
}

float dPlane(vec3 point) {
  float dist = point.y + 1.0;
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

  float id = 1.0 + Noise21(floor(param));

  float dist = length(point) - 0.7 * (cos(point.x) + sin(point.y));

  return vec2(dist, id);
}

float sceneDistance(vec3 point) {
  vec2 sphere = dSphere(point);
  float plane = dPlane(point);
  float d = min(sphere.x, plane);
  return d;
}

float sceneMaterial(vec3 point) {
  vec2 sphere = dSphere(point);
  float plane = dPlane(point);
  float d = min(sphere.x, plane);

  if(d == sphere.x) {
    return sphere.y;
  }

  return 0.0;
}

vec2 rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  float glow = 0.0;
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;

    float dS = sceneDistance(p);

    dO += dS;

    if (abs(dS) < SURF_DIST || dO > MAX_DIST) {
      break;
    }
  }

  vec3 p = ro + rd * dO;
  float mat = sceneMaterial(p);
  if (mat > 1.0 && dO < MAX_DIST) {
    glow = 0.0;
    for (int j = 0; j < 16; ++j) {
      vec3 samplePoint = p +
      (
        hash33(p + vec3(cos(u_time), 0.0, sin(u_time)) + 0.2523 * p.zxy * float(j)
      ) - 0.5) * 0.02;
      glow += sceneMaterial(samplePoint) / 33.0;
    }
    glow = smoothstep(0.5, 0.9, glow * glow);
  }

  return vec2(dO, glow);
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

vec3 renderOne(vec3 rayOrigin, vec3 rayDirection) {
  vec2 rm = rayMarch(rayOrigin, rayDirection);
  float d = rm.x;
  float glow = rm.y;

  // TODO ::: add glow
  vec3 col;
  float dif = 0.0;
  float dif1 = 0.0;

  if(d < MAX_DIST) {
    vec3 p = rayOrigin + rayDirection * d;
    vec3 n = GetNormal(p);
    vec3 r = reflect(rayDirection, n);

    float mat = sceneMaterial(p);

    dif = clamp(mat - 1.5, 0.0, 1.0) * 2.0;
    // dif *= mat;

    if (mat == 0.0) {
      vec3 shiftpoint = p +
        vec3(
          cos(u_time / 20.0 + 1.3255),
          u_time / 20.0,
          sin(u_time / 20.0 + 2.5342)
        );

      float shift = pbm_simplex_noise3(shiftpoint * 10.0);
      col = mix(vec3(0.8, 1.0, 0.9), vec3(0.4, 0.6, 0.9), shift) *
        max((0.2 - length(p) / 10.0), 0.0);
      vec3 reflectDirection = normalize(r * vec3(0.5, 1.0, 0.5)) +
        vec3(shift) * 0.2;
      vec3 reflectOrigin = p + reflectDirection * SURF_DIST  + 0.02;

      vec2 rm2 = rayMarch(reflectOrigin, reflectDirection);
      float d1 = rm2.x;
      float glow1 = rm2.y;

      if (d1 < MAX_DIST) {
        vec3 p1 = reflectOrigin + reflectDirection * d1;
        vec3 n1 = GetNormal(p1);
        float matu = sceneMaterial(p1);
        // dif += clamp(matu - 1.5, 0.0, 1.0) * 2.0;
        col += hsl2rgb(vec3(smoothstep(1.0, 2.0, matu), 1.0, 0.6));
        col *= glow1 * 1.0;
      }
    } else {
      // TODO ::: tweak shit shit

      float fac = dot(n, normalize(vec3(0.0, 1.0, 0.0))) * 0.5 + 0.5;

      col += hsl2rgb(vec3(smoothstep(1.0, 2.0, mat), 1.0, 0.6));

      col *= (0.8 - fac*fac*fac);
      col *= glow * 2.0;
    }
  }

  return col;
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

  vec3 col = renderOne(rayOrigin, rayDirection);


  //vec3 col = vec3(dif);
  //col=pow(col, vec3(0.5 + 2.0 * u_gamma));
  FragColor = vec4(col, 1.0);
}
