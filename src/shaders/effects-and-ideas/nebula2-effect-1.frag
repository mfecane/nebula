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

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

$rand
$simplex-noise
$space

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

float densityFunction(vec3 point) {
  float n = pbm_simplex_noise3(point);
  point = twistSpace(
    point, 0.08
  );

  return abs(dot(point, vec3(sin(n), sin(n), 1.0)) - 0.5);
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

  // smaller > gives volume, default = 0.2
  float hitDist = 0.1;

	vec4 sum = vec4(0.0);

  float min_dist = 0.0;
  float max_dist = 0.0;

  // march ray to the sphere
  if (RaySphereIntersect(rayOrigin, rayDirection, 4.0, min_dist, max_dist))
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

      if (dist < 0.08 * rayLength) {
        // totalDensity = smoothstep(dist, 0.08 * rayLength, 0.0);
        totalDensity = smoothstep(dist, 0.08 * rayLength + 0.02, 0.08 * rayLength);
        break;
      }

      // evaluate distance function
      dist = densityFunction(pos);

      // change this string to control density
      dist = max(dist, 0.08);

      // point light calculations
      vec3 ldst = vec3(0.0) - pos;
      float lDist = max(length(ldst), 0.001);

      // star in center
      vec3 lightColor = vec3(1.0, 0.6 + pos.z * 0.3, 0.4 + pos.x * 0.2);

      // star itself and bloom around the light
      // star itself
      // sum.rgb += (vec3(0.67, 0.75, 1.00) / (lDist * lDist * 10.0) / 80.0);
      // bloom
      sum.rgb += (lightColor / exp(lDist * lDist * lDist * 0.08) / 30.0);

      if (dist < hitDist)
      {

        // compute local density
        localDensity = hitDist - dist;

        // compute weighting factor
        w = (1.0 - totalDensity) * localDensity;

        // accumulate density
        totalDensity += w + 1.0 / 200.0; // minor effect

        vec4 col = vec4(computeColor(totalDensity, lDist), totalDensity);

        // emission
        col += col.a * vec4(col.rgb, 0.0) * 0.2;

        // uniform scale density
        col.a *= 0.2; // this shit is lower is better
        // colour by alpha
        col.rgb *= col.a;
        // alpha blend in contribution
        sum = sum + col * (1.0 - sum.a);
      }

      // still add density, even if not hit
      // 40.0 is ok
      // this is like fog
      totalDensity += 1.0 / (70.0);

      // enforce minimum stepsize
      // minor effect
      dist = max(dist, 0.04);

      // DITHERING
      // dist = abs(dist) * (0.8 + 0.2 * rand(seed * vec2(i)));
      // new version
      // vec2 uv1 = dot(uv, vec2(120.0, 280.0));
      // dist = abs(dist) * (0.8 + 0.08 * texture(iChannel2, vec2(uv1.y, -uv1.x + 0.5 * sin(4.0 * iTime + uv1.y * 4.0))).r);

      // trying to optimize step size near the camera and near the light source
      rayLength +=
        max(
          dist * 0.1 *
            max(
              min(
                length(ldst),
                length(rayOrigin)
              ),
              1.0
            ),
          0.01
        );
    }
    // simple scattering
	  sum *= 1.0 / exp(localDensity * 0.2) * 0.6;
   	sum = clamp(sum, 0.0, 1.0);
    // this make s it burn
    sum.a = totalDensity;
    sum.xyz = sum.xyz * sum.xyz * (3.0 - 2.0 * sum.xyz);
	}

  //   // TONEMAPPING
  //   debugColor = ToneMapFilmicALU(sum.xyz * 2.2);

  vec3 polar = cartesianToPolar(rayDirection.xzy);
  vec2 starzProj = vec2(
    (polar.z) / TAU + 0.5,
    (polar.y) / TAU + 0.5
  );
  vec4 strz = texture(u_Sampler, starzProj, 0.0);

  return mix(sum.rgb, strz.rgb, 1.0 - sum.a);
}

void main()
{
  vec3 rayDirection = normalize(vec3(-uv.x, -uv.y, -1.0));
  // wow
	// vec3 rayOrigin = normalize(vec3(-2.0 + 4.0 *  u_control1, -0.4, 2.0)) * (0.5 + u_scrollValue * 1.5);
	vec3 rayOrigin = vec3(0, 0, (0.5 + u_scrollValue * 1.5)) ;

  const float mouseFactor = 0.002;

  float angl1 = -u_mouseY - 15.0, angl2 = (u_mouseX + 25.0);

  R(rayDirection.yz, angl1 * mouseFactor * PI * 2.0);
  R(rayDirection.xz, angl2 * mouseFactor * PI * 2.0);
  R(rayOrigin.yz, angl1 * mouseFactor * PI * 2.0);
  R(rayOrigin.xz, angl2 * mouseFactor * PI * 2.0);

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
