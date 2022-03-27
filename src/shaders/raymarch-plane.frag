#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;
uniform sampler2D u_Sampler;

uniform float u_control1;
uniform float u_control2;
uniform float u_control3;
uniform float u_control4;
uniform float u_control5;
uniform float u_control6;
uniform float u_control7;
uniform float u_control8;

#define PI  3.14159265358
#define TAU 6.28318530718
#define MAX_DIST 3.0

$simplex-noise
$space

#define DITHERING
#define BACKGROUND

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float rand(vec2 co)
{
	return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);
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

// assign color to the media
vec3 computeColor( float density, float radius )
{
	// color based on density alone, gives impression of occlusion within
	// the media
	vec3 result = mix(vec3(1.0, 0.2, 0.8), vec3(0.4, 0.15, 0.1), density);

	// color added to the media
	vec3 colCenter = 7.0 * vec3(0.8, 1.0, 1.0);
	vec3 colEdge = 1.5 * vec3(0.48, 0.53, 0.5);
	result *= mix(colCenter, colEdge, min((radius + 0.05) / 0.9, 1.15));

	return result;
}

float densityFunction(vec3 point) {
  // shift space by noise
  float n = pbm_simplex_noise3(2.0 * point + vec3(u_time * 0.4));
  point = point + 1.1345 * n;

  // twist space
  point = twistSpace(point.xyz, u_control3 * 2.0);

  // plane
  float dist = length(
    dot(point, vec3(1.0, 1.0, 1.0) + 3.0)
   ) + 0.2;

  return dist * (1.0 - length(point) / 2.5);
}


vec3 addLight(vec3 pos, vec3 lightPos, vec3 lightColor) {
  vec3 ldst = vec3(lightPos) - pos;
  float lDist = max(length(ldst), 0.01);
  return (lightColor / (pow(lDist, 2.0))) * 1.8;
}

vec3 nebulaMarch(vec3 rayOrigin, vec3 rayDirection) {
  // DITHERING
	vec2 seed = fract(uv * 2.0) / 2.0 + sin(u_time / 2.0);

  float totalTranslucency = 1.0;
  float localTranslucency = 0.0;

	// t: length of the ray
	// d: distance function
	float dist = 1.0;
  float rayLength = 0.0;

  float hitDist = 0.004; // tweak this smaller, gives volume

	vec4 sum = vec4(0.0);

  float min_dist = 0.0;
  float max_dist = 0.0;

  // march ray to the sphere
  if (RaySphereIntersect(rayOrigin, rayDirection, 2.5, min_dist, max_dist))
  {
    // if t < min_dist return 0
    // if t >= min_dist return 1
	  rayLength = min_dist * step(rayLength, min_dist);

    // raymarch loop
    for (int i = 0; i < 56; i++) {
      vec3 pos = rayOrigin + rayLength * rayDirection;

      if (totalTranslucency < 0.1 || rayLength > MAX_DIST || sum.a > 0.99 || rayLength > max_dist) {
        break;
      }

      // evaluate distance function
      // float pixelate = 100.0 * u_control7;
      // dist = densityFunction(floor(pos * pixelate + 0.5) / pixelate);
      dist = densityFunction(pos) * 0.1;
      totalTranslucency -= dist;
    }
    sum.rgb += vec3(1.0, 0.0, 0.0) * totalTranslucency;
  }
  return sum.rgb;
}

void main()
{
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(-0.3, 0.5, -(0.1 + u_scrollValue * 2.0));

  const float mouseFactor = 0.002;
  R(rayDirection.yz, -u_mouseY * mouseFactor * PI * 2.0);
  R(rayDirection.xz, u_mouseX * mouseFactor * PI * 2.0);
  R(rayOrigin.yz, -u_mouseY * mouseFactor * PI * 2.0);
  R(rayOrigin.xz, u_mouseX * mouseFactor * PI * 2.0);

  vec3 col = nebulaMarch(rayOrigin, rayDirection);

  FragColor = vec4(col, 1.0);
}
