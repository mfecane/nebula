#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

// source https://www.shadertoy.com/view/MsVXWW

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

#define ROTATION
//#define MOUSE_CAMERA_CONTROL

#define DITHERING
#define BACKGROUND
#define MAX_STEPS 200
#define MAX_DIST 3.0
#define SURF_DIST 0.00001 // hit distance

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
    n += (sin(p.y * iter) + cos(p.x * iter)) / iter;
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
float mapNebulaDensity(vec3 p)
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

float Noise31(vec3 p){
  p = fract(p * vec3(123.344314, 234.542341, 123.432423));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y * p.z);
}

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 perm(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float noise3d(vec3 p) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
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
  return abs(dot(sin(p), cos(p.zxy))) / scale - 0.16;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float SmoothNoise(vec2 p) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(p);
  vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(p));
	return mix(
    mix(rand(b), rand(b + d.yx), f.x),
    mix(rand(b + d.xy), rand(b + d.yy), f.x)
    , f.y
  );
}

float sdSphere(vec3 p, float radius) {
  return (length(p) - radius);
}

float GetDist(vec3 p) {
  // float box = sdBox(p - vec3(0.0, 1.0, 0.0), vec3(1.0));

  // float angle = (1.0 - p.y) * (-PI + u_control5 * TAU);
  // p = vec3(
  //   p.x * sin(angle) + p.z * cos(angle),
  //   p.y * u_control3,
  //   p.x * - cos(angle) + p.z * sin(angle)
  // );

  // float sphereDist = sdSphere(p, 0.5);
  // float gyroid = sdGyroid(p, 1.0 + u_control2 * 8.0);
  // float d = smin(sphereDist, gyroid * 0.9, -0.07);
  // return d;

  return length(p.xz) - 0.005;
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
    if (abs(dS) < SURF_DIST) {
      return 1.0;
    }
    if (dO > MAX_DIST) {
      0.0;
    }
  }
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

float densitySphere(vec3 p) {
  if (length(p) < 1.0) {
    return 1.0 - length(p);
  }
  return 0.0;
}

float densityFunction2(vec3 p) {
  float noise = mapNebulaDensity(3.0 * p + vec3(1.0));

  return clamp(map2(noise, -2.5 + 5.0 * u_control3, u_control4 * 8.0, 0.0, 1.0), 0.0, 1.0); // * densitySphere(p);
  // return densitySphere(p);
}

float densityFunction(vec3 p) {
  float noise = mapNebulaDensity(3.0 * p + vec3(1.0));

  return clamp(map2(noise, u_control3 * -10.0, u_control4 * 10.0, 0.0, 1.0), 0.0, 1.0); // * densitySphere(p);
  // return densitySphere(p);
}

float rayMarchLight(vec3 rayOrigin, vec3 rayDirection) {
  float distanceStep = 0.03;

  float maxDistance = 0.0;
  float minDistance = 0.0;
  float radius = 1.0;

  bool isIntersecting = RaySphereIntersect(
    rayOrigin, rayDirection, radius, minDistance, maxDistance
  );

  if(isIntersecting) {
    float totalDensity = 1.0;
    float rayLength = 0.0;
    vec3 p = rayOrigin;
    for(int i = 0; i < MAX_STEPS && rayLength < maxDistance; i++) {
      float density = densityFunction(p) * distanceStep;
      totalDensity *= (1.0 - density * 5.0 * u_control1); // absorption
      if (totalDensity < 0.1) {
        break;
      }
      rayLength += distanceStep;
      p = rayOrigin + rayDirection * rayLength;
    }

    return totalDensity;
  }

  return 0.0;
}

float rayMarchDensity(vec3 rayOrigin, vec3 rayDirection) {
  float distanceStep = 0.05;
  vec3 lightPos = normalize(vec3(
    0.5 * (cos(TAU) - sin(TAU)),
    0.5,
    0.5 * (sin(TAU) + cos(TAU))
  ));

  float maxDistance = 0.0;
  float minDistance = 0.0;
  float radius = 1.0;

  bool isIntersecting = RaySphereIntersect(
    rayOrigin, rayDirection, radius, minDistance, maxDistance
  );

  if(isIntersecting) {
    float totalTranslucence = 1.0;
    float color = 0.0;
    float rayLength = minDistance;

    vec3 p = rayOrigin;
    for(int i = 0; i < MAX_STEPS && rayLength < maxDistance; i++) {

      float density = densityFunction(p) * distanceStep;

      if (density > 0.8) {
        break;
      }

      float light = rayMarchLight(p, lightPos);

      totalTranslucence *= (1.0 - density * 60.0 * u_control5);
      color += density * (1.0 - totalTranslucence) * light;
      rayLength += distanceStep;
      p = rayOrigin + rayDirection * rayLength;
    }

    return color;
  }

  return 0.0;
}


vec4 debug3dNoise(vec2 uv) {
  vec3 dummyPoint = vec3(uv.x, uv.y, 2.0 * u_control3) * 10.0;
  float noise = mapNebulaDensity(dummyPoint);
  noise = map2(noise, -2.0, 7.0, 0.1, 1.0);
  return vec4(noise, noise, noise, 1.0);
}

float drawLine (vec2 p1, vec2 p2, vec2 uv, float a)
{
    float r = 0.;
    float one_px = 1.; //not really one px

    // get dist between points
    float d = distance(p1, p2);

    // get dist between current pixel and p1
    float duv = distance(p1, uv);

    //if point is on line, according to dist, it should match current uv
    r = 1.-floor(1.-(a*one_px)+distance (mix(p1, p2, clamp(duv/d, 0., 1.)),  uv));

    return r;
}

vec3 nebulaMarch(vec3 rayOrigin, vec3 rayDirection) {
  // DITHERING
	vec2 seed = fract(uv * 2.0) / 2.0 + sin(u_time / 2.0);

	// w: weighting factor
	float localDensity = 0.0, totalDensity = 0.0, w = 0.0;

	// t: length of the ray
	// d: distance function
	float dist = 1.0;
  float rayLength = 0.0;

  float hitDist = 0.3 * u_control1; // tweak this smaller, gives volume

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
    for (int i = 0; i < 56; i++)
    {
      vec3 pos = rayOrigin + rayLength * rayDirection;

      // t > 10.0 - clipping
      // d < 0.1 * rayLength - was mistake gets cutoff effect
      if (totalDensity > 0.9 || rayLength > 10.0 || sum.a > 0.99 || rayLength > max_dist) {
        break;
      }

      // evaluate distance function
      dist = densityFunction2(pos);

      // change this string to control density
      // d = max(d, 0.5 * u_control1);

      // point light calculations
      vec3 ldst = vec3(0.0) - pos;
      float lDist = max(length(ldst), 0.001);

      // star in center
      vec3 lightColor = vec3(1.0, 0.6 + pos.z * 0.3, 0.4 + pos.x * 0.2);
      // star itself and bloom around the light
      sum.rgb += (lightColor / (pow(lDist, 1.5)) / (80.0 * u_control5));

      if (dist < hitDist)
      {

        // compute local density
        localDensity = hitDist - dist;

        // compute weighting factor
        w = (1.0 - totalDensity) * localDensity;

        // accumulate density
        totalDensity += w + 1.0 / (100.0); // minor effect

        vec4 col = vec4(computeColor(totalDensity, lDist), totalDensity);

        // uniform scale density
        col.a *= 0.01; // this shit is lower is better
        // colour by alpha
        col.rgb *= col.a;
        // alpha blend in contribution
        sum = sum + col * (1.0 - sum.a);
      }

      // still add density, even if not hit
      // 40.0 is ok
      // this is like fog
      totalDensity += 1.0/(40.0);

      // enforce minimum stepsize
      // minor effect
      dist = max(dist, 0.1);

      // DITHERING
      dist = abs(dist) * (0.8 + 0.2 * rand(seed * vec2(i)));

      // trying to optimize step size near the camera and near the light source
      rayLength +=
        max(
          dist * 0.3 *
            max(
              min(
                length(ldst),
                length(rayOrigin)
              ),
              1.0
            ),
          0.02
        );
    }
    // simple scattering
	  sum *= 1.0 / exp(localDensity * 0.2) * 0.6;
   	sum = clamp(sum, 0.0, 1.0);
    // this make s it burn
    sum.a = totalDensity;
    sum.xyz = sum.xyz * sum.xyz * (3.0 - 2.0 * sum.xyz);
	}

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
//   //   map2(mapNebulaDensity(polar4) * 4.0, 0.0, 30.0, 0.0, 1.0)
//   // );

  // // MY STARS
  vec3 polar1 = cartesianToPolar(rayDirection.xzy);

  vec2 starzProj = vec2(
    (polar1.z) / TAU + 0.5,
    (polar1.y) / TAU + 0.5
  );
  vec4 strz = texture(u_Sampler, starzProj, 0.0);

  // TODO ::: try optimize
  // float strz = stars(polarNormalize(polar1).yz, 5.43141);
  // strz += stars(polarNormalize(polar2).yz, 6.4324);
  // strz += stars(polarNormalize(polar3).yz, 7.11231);


  return mix(sum.xyz, strz.rgb, 1.0 - sum.a);
  // return vec3(strz.rgb);
}

void main()
{
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 0.0, -(0.5 + u_scrollValue * 1.0));

  const float mouseFactor = 0.002;
  R(rayDirection.yz, -u_mouseY * mouseFactor * PI * 2.0);
  R(rayDirection.xz, u_mouseX * mouseFactor * PI * 2.0);
  R(rayOrigin.yz, -u_mouseY * mouseFactor * PI * 2.0);
  R(rayOrigin.xz, u_mouseX * mouseFactor * PI * 2.0);

  // float denisityIntegral = rayMarchDensity(rayOrigin, rayDirection);
  // vec3 col = vec3(denisityIntegral);

  // draw line
  // col += rayMarch(rayOrigin, rayDirection);

  vec3 col = nebulaMarch(rayOrigin, rayDirection);

  // TESTS

  // 1.0 test noise
  // FragColor = debug3dNoise(uv);

  FragColor = vec4(col, 1.0);
}
