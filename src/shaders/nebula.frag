#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

// source https://www.shadertoy.com/view/MsVXWW

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

uniform float u_control1;
uniform float u_control2;
uniform float u_control3;
uniform float u_control4;
uniform float u_control5;

#define ROTATION
//#define MOUSE_CAMERA_CONTROL

#define DITHERING
#define BACKGROUND
#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURF_DIST 0.001 // hit distance

//#define TONEMAPPING

//-------------------
#define PI  3.14159265358
#define TAU 6.28318530718
#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

float map2(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 map2(vec3 value, float min1, float max1, float min2, float max2) {
  return vec3(
    map2(value.x, min1, max1, min2, max2),
    map2(value.y, min1, max1, min2, max2),
    map2(value.z, min1, max1, min2, max2)
  );
}

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

float rand(vec2 co)
{
	return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);
}

//=====================================
// otaviogood's noise from https://www.shadertoy.com/view/ld2SzK
//--------------------------------------------------------------
// This spiral noise works by successively adding and rotating sin waves while increasing frequency.
// It should work the same on all computers since it's not based on a hash function like some other noises.
// It can be much faster than other noise functions if you're ok with some repetition.

const float nudge = 0.739513;	// size of perpendicular vector

float normalizer = 1.0 / sqrt(1.0 + nudge * nudge);	// pythagorean theorem on that perpendicular to maintain scale

float SpiralNoiseC(vec3 p)
{
  float n = 0.0;	// noise amount
  float iter = 1.0;
  for (int i = 0; i < 8; i++)
  {
    // add sin and cos scaled inverse with the frequency
    n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;	// abs for a ridged look
    // rotate by adding perpendicular and scaling down
    p.xy += vec2(p.y, -p.x) * nudge;
    p.xy *= normalizer;
    // rotate on other axis
    p.xz += vec2(p.z, -p.x) * nudge;
    p.xz *= normalizer;
    // increase the frequency
    iter *= 1.733733;
  }
  return n;
}

float SpiralNoise3D(vec3 p)
{
  float n = 0.0;
  float iter = 1.0;
  for (int i = 0; i < 5; i++)
  {
    n += (sin(p.y * iter + u_control1 * 1.313) + cos(p.x * iter + u_control1)) / iter;
    p.xz += vec2(p.z, -p.x) * nudge;
    p.xz *= normalizer;
    iter *= 1.33733;
  }
  return n;
}

float NebulaNoise(vec3 p)
{
  float final = p.y + 4.5;
  // frequent from (-5, 0);
  // mid-range noise
  final -= SpiralNoiseC(p.xyz);
  // less frequent noise (-12, - 2)
  // large scale features
  final += SpiralNoiseC(p.zxy * 0.5123 + 100.0) * 4.0;
  // very smooth large scale noise
  // more large scale features, but 3d
  final -= SpiralNoise3D(p);

  return final;
}

// combination of noises around (0.0, 30.0)
float map(vec3 p)
{
  // NebulaNoise around (-30, 10)
  float NebNoise = abs(NebulaNoise(p / 0.5) * 0.5);
  return NebNoise + 0.03;
}
//--------------------------------------------------------------

// assign color to the media
vec3 computeColor( float density, float radius )
{
	// color based on density alone, gives impression of occlusion within
	// the media
	vec3 result = mix(vec3(1.0, 0.9, 0.8), vec3(0.4, 0.15, 0.1), density);

	// color added to the media
	vec3 colCenter = 7.0 * vec3(0.8, 1.0, 1.0);
	vec3 colEdge = 1.5 * vec3(0.48, 0.53, 0.5);
	result *= mix(colCenter, colEdge, min((radius + 0.05) / 0.9, 1.15));

	return result;
}

bool RaySphereIntersect(vec3 org, vec3 dir, out float near, out float far)
{
  float b = dot(dir, org);
  float c = dot(org, org) - 8.;
  float delta = b * b - c;
  if(delta < 0.0){
    return false;
  }
  float deltasqrt = sqrt(delta);
  near = -b - deltasqrt;
  far = -b + deltasqrt;
  return far > 0.0;
}

// Applies the filmic curve from John Hable's presentation
// More details at : http://filmicgames.com/archives/75
vec3 ToneMapFilmicALU(vec3 _color)
{
	_color = max(vec3(0), _color - vec3(0.004));
	_color = (_color * (6.2 * _color + vec3(0.5))) / (_color * (6.2 * _color + vec3(1.7)) + vec3(0.06));
	return _color;
}

float easeInOutQuad(float x) {
  float two = 2.0;
  return x < 0.5 ?
    two * x * x :
    1.0 - (-two * x + two) * (-two * x + two) / two;
}

float Noise21(vec2 p){
  p = fract(p * vec2(123.344314, 234.542341));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y);
}

float stars(vec2 p, float seed) {
  p *= 5.0 * seed;
  float n = Noise21(floor(p));

  p = fract(p);
  vec2 shift = vec2(n - 0.5, fract(n * 10.0));
  float d = length(p - shift);
  float m = smoothstep(0.02 * n * sqrt(seed), 0.0, d) * n;
  return m;
}

vec3 polarNormalize (vec3 polar) {
  return vec3(polar.x, asin(polar.y / PI) * PI, polar.z);
}

float SpherePlane(vec3 p) {
  vec4 s = vec4(0, 1, 6, 1);

  float sphereDist = length(p - s.xyz) - s.w;
  float planeDist = p.y;

  float d = min(sphereDist, planeDist);

  return d;
}

mat2 Rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

float sdBox(vec3 p, vec3 s) {
  p = abs(p) - s;
  return length(max(p, 0.0)) + min(max(p.x, max(p.y, p.z)), 0.0);
}

float sdGyroid(vec3 p, float scale) {
  p *= scale;
  return abs(dot(sin(p), cos(p.zxy))) / scale - 0.08;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdSphere(vec3 p, float radius) {
  float fact = (1.0 + Noise21(floor(p.xy * 50.0)) * u_control3);
  return (length(p / fact) - radius) * fact;
}

float GetDist(vec3 p) {
  // float box = sdBox(p - vec3(0.0, 1.0, 0.0), vec3(1.0));
  float sphereDist = sdSphere(p, 0.8 + u_control1 * 0.5);
  float gyroid = sdGyroid(p, 4.0 + u_control2 * 4.0);
  float d = smin(sphereDist, gyroid * 0.9, -0.07);

  return d;
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 f = normalize(l - p);
  vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));
  vec3 u = cross(f, r);
  vec3 c = p + f * z;
  vec3 i = c + uv.x * r + uv.y * u;
  vec3 d = normalize(i - p);
  return d;
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = GetDist(p);
    dO += dS;
    if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
      break;
    }
  }

  return dO;
}

vec3 GetNormal(vec3 p) {
  float d = GetDist(p);
  vec2 e = vec2(0.001, 0.0);
  vec3 n = d - vec3(
    GetDist(p - e.xyy),
    GetDist(p - e.yxy),
    GetDist(p - e.yyx)
  );

  return normalize(n);
}

void main()
{
//   vec3 debugColor;
// 	vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
// 	vec3 rayOrigin = vec3(0.0, 0.0, -u_scrollValue);

const float mouseFactor = 0.002;
//   R(rayDirection.yz, -u_mouseY * mouseFactor * PI * 2.0);
//   R(rayDirection.xz, u_mouseX * mouseFactor * PI * 2.0);
//   R(rayOrigin.yz, -u_mouseY * mouseFactor * PI * 2.0);
//   R(rayOrigin.xz, u_mouseX * mouseFactor * PI * 2.0);

//   // DITHERING
// 	vec2 seed = fract(uv * 2.0) / 2.0 + sin(u_time / 2.0);

// 	// w: weighting factor
// 	float localDensity = 0.0, totalDensity = 0.0, w = 0.0;

// 	// t: length of the ray
// 	// d: distance function
// 	float d = 1.0, t = 0.0;

//   const float h = 0.1;

// 	vec4 sum = vec4(0.0);

//   float min_dist = 0.0, max_dist = 0.0;


//   // march ray to the sphere
//   if (RaySphereIntersect(rayOrigin, rayDirection, min_dist, max_dist))
//   {
//     // if t < min_dist return 0
//     // if t >= min_dist return 1
// 	  t = min_dist * step(t, min_dist);

//     // raymarch loop
//     for (int i = 0; i < 56; i++)
//     {
//       vec3 pos = rayOrigin + t * rayDirection;

//       // t > 10.0 - clipping
//       if (totalDensity > 0.9 || d < 0.1 * t || t > 10.0 || sum.a > 0.99 || t > max_dist) {
//         break;
//       }

//       // evaluate distance function
//       float d = map(pos);

//       // change this string to control density
//       d = max(d, 0.07);

//       // point light calculations
//       vec3 ldst = vec3(0.0) - pos;
//       float lDist = max(length(ldst), 0.001);

//       // star in center
//       vec3 lightColor = vec3(1.0, 0.5, 0.25);
//       // star itself and bloom around the light
//       sum.rgb += (lightColor / (lDist * lDist) / 30.0);

//       if (d < h)
//       {

//         // compute local density
//         localDensity = h - d;

//         // compute weighting factor
//         w = (1.0 - totalDensity) * localDensity;

//         // accumulate density
//         totalDensity += w + 1.0/200.0;

//         vec4 col = vec4(computeColor(totalDensity, lDist), totalDensity);

//         // uniform scale density
//         col.a *= 0.185;
//         // colour by alpha
//         col.rgb *= col.a;
//         // alpha blend in contribution
//         sum = sum + col*(1.0 - sum.a);
//       }

//       // still add density, even if not hit
//       totalDensity += 1.0/70.0;

//       // enforce minimum stepsize
//       d = max(d, 0.04);

//       // DITHERING
//       d = abs(d) * (0.8 + 0.2 * rand(seed * vec2(i)));

//       // trying to optimize step size near the camera and near the light source
//       t += max(d * 0.1 * max(min(length(ldst), length(rayOrigin)), 1.0), 0.02);
//     }
//     // simple scattering
// 	  sum *= 1.0 / exp(localDensity * 0.2) * 0.6;
//    	sum = clamp(sum, 0.0, 1.0);
//     sum.xyz = sum.xyz * sum.xyz * (3.0 - 2.0 * sum.xyz);
// 	}

//   debugColor = sum.xyz;

//   // BACKGROUND
//   // if (totalDensity < 0.8)
//   // {
//   //   vec3 stars = vec3(Noise21(rayDirection.yz));
//   //   vec3 starbg = vec3(0.0);
//   //   starbg = mix(
//   //     starbg,
//   //     vec3(0.8, 0.9, 1.0),
//   //     smoothstep(0.99, 1.0, stars) * clamp(dot(vec3(0.0), rayDirection) + 0.75, 0.0, 1.0)
//   //   );
//   //   starbg = clamp(starbg, 0.0, 1.0);
//   //   sum.xyz += stars;
//   // }

//   // TONEMAPPING
//   debugColor = ToneMapFilmicALU(sum.xyz * 2.2);

//   // debug noise
//   // vec3 polar4 = cartesianToPolar(rayDirection.xzy);
//   // polar4.x = u_scrollValue;
//   // debugColor = vec3(
//   //   map2(map(polar4) * 4.0, 0.0, 30.0, 0.0, 1.0)
//   // );

//   // // MY STARS
//   vec3 polar1 = cartesianToPolar(rayDirection.xzy);
//   vec3 polar2 = cartesianToPolar(rayDirection.xyz);
//   R(rayDirection.yz, PI / 2.0);
//   vec3 polar3 = cartesianToPolar(rayDirection.xyz);
//   // TODO ::: try optimize
//   debugColor += stars(polarNormalize(polar1).yz, 5.43141);
//   debugColor += stars(polarNormalize(polar2).yz, 6.4324);
//   debugColor += stars(polarNormalize(polar3).yz, 7.11231);
  vec3 col = vec3(0.0);

  // art of code' ro and rd
  // vec3 rayOrigin = vec3(0.0, 2.0, -2.0);
  // rayOrigin.yz *= Rot(-u_mouseY * mouseFactor * PI + 1.0);
  // rayOrigin.xz *= Rot(-u_mouseX * mouseFactor * TAU);
  // vec3 rayDirection = GetRayDir(uv, rayOrigin, vec3(0.0, 1.0, 0.0), 1.0);

  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 0.0, -u_scrollValue);
  R(rayDirection.yz, -u_mouseY * mouseFactor * PI * 2.0);
  R(rayDirection.xz, u_mouseX * mouseFactor * PI * 2.0);
  R(rayOrigin.yz, -u_mouseY * mouseFactor * PI * 2.0);
  R(rayOrigin.xz, u_mouseX * mouseFactor * PI * 2.0);

  float d = rayMarch(rayOrigin, rayDirection);

  if(d<MAX_DIST) {
      vec3 p = rayOrigin + rayDirection * d;
      vec3 n = GetNormal(p);
      vec3 r = reflect(rayDirection, n);

      float dif = dot(n, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
      col = vec3(dif);
  }

  d /= 6.0;
  FragColor = vec4(col, 1.0);
}
