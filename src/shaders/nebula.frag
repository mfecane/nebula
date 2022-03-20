#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_mouseX;
uniform float u_mouseY;

#define ROTATION
//#define MOUSE_CAMERA_CONTROL

#define DITHERING
#define BACKGROUND

//#define TONEMAPPING

//-------------------
#define pi 3.14159265
#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

// iq's noise
float noise( in vec3 x )
{
  vec3 p = floor(x);
  vec3 f = fract(x);
	f = f * f * (3.0 - 2.0 * f);
	vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
	return 1.0 - 0.82 * mix(0.0, 0.0, f.z);
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
float normalizer = 1.0 / sqrt(1.0 + nudge*nudge);	// pythagorean theorem on that perpendicular to maintain scale
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
  final -= SpiralNoiseC(p.xyz);   // mid-range noise
  final += SpiralNoiseC(p.zxy * 0.5123 + 100.0) * 4.0;   // large scale features
  final -= SpiralNoise3D(p);   // more large scale features, but 3d

  return final;
}

float map(vec3 p)
{
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
	float delta = b*b - c;
	if( delta < 0.0)
		return false;
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
	_color = (_color * (6.2*_color + vec3(0.5))) / (_color * (6.2 * _color + vec3(1.7)) + vec3(0.06));
	return _color;
}

void main()
{
  vec3 debugColor;
  float seed = 1.3;
  //   const float KEY_1 = 49.5/256.0;
	// const float KEY_2 = 50.5/256.0;
	// const float KEY_3 = 51.5/256.0;
  float key = 0.0;
  // key += 0.7*texture(iChannel1, vec2(KEY_1,0.25)).x;
  // key += 0.7*texture(iChannel1, vec2(KEY_2,0.25)).x;
  // key += 0.7*texture(iChannel1, vec2(KEY_3,0.25)).x;

	// ro: ray origin
	// rd: direction of the ray
	// vec3 rd = normalize(vec3((gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y, 1.));
	vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 0.0, -3.0);

  //   #ifdef MOUSE_CAMERA_CONTROL
  const float mouseFactor = 0.002;
  R(rayDirection.yz, -u_mouseY * mouseFactor * pi * 2.0);
  R(rayDirection.xz, u_mouseX * mouseFactor * pi * 2.0);
  R(rayOrigin.yz, -u_mouseY * mouseFactor * pi * 2.0);
  R(rayOrigin.xz, u_mouseX * mouseFactor * pi * 2.0);
  //   #else
  //   R(rayDirection.yz, -pi*3.93);
  //   R(rayDirection.xz, pi*3.2);
  //   R(rayOrigin.yz, -pi*3.93);
  //  	R(rayOrigin.xz, pi*3.2);
  //   #endif

  //   #ifdef DITHERING
	// vec2 dpos = ( fragCoord.xy / iResolution.xy );
	// vec2 seed = dpos + fract(iTime);
	// #endif

	// ld, totalDensity: local, total density
	// w: weighting factor
	float localDensity = 0.0, totalDensity = 0.0, w = 0.0;

	// t: length of the ray
	// d: distance function
	float d = 1.0, t = 0.0;

  const float h = 0.1;

	vec4 sum = vec4(0.0);

  float min_dist = 0.0, max_dist = 0.0;


  // march ray to the sphere
  if (RaySphereIntersect(rayOrigin, rayDirection, min_dist, max_dist))
  {
	  t = min_dist * step(t, min_dist);

    // raymarch loop
    for (int i = 0; i < 56; i++)
    {
      vec3 pos = rayOrigin + t * rayDirection;

      if (totalDensity > 0.9 || d < 0.1 * t || t > 10.0 || sum.a > 0.99 || t > max_dist) break;

      // evaluate distance function
      float d = map(pos);

  // change this string to control density
      d = max(d, 0.07);

      // point light calculations
      vec3 ldst = vec3(0.0)-pos;
      float lDist = max(length(ldst), 0.001);

      // star in center
      vec3 lightColor=vec3(1.0, 0.5, 0.25);
      sum.rgb += (lightColor / (lDist * lDist) / 30.0); // star itself and bloom around the light

      if (d < h)
      {
        // compute local density
        localDensity = h - d;

              // compute weighting factor
        w = (1.0 - totalDensity) * localDensity;

        // accumulate density
        totalDensity += w + 1./200.;

        vec4 col = vec4( computeColor(totalDensity, lDist), totalDensity );

        // uniform scale density
        col.a *= 0.185;
        // colour by alpha
        col.rgb *= col.a;
        // alpha blend in contribution
        sum = sum + col*(1.0 - sum.a);

      }

      totalDensity += 1./70.;

      // enforce minimum stepsize
      d = max(d, 0.04);

      // #ifdef DITHERING
      // // add in noise to reduce banding and create fuzz
      // d=abs(d)*(.8+0.2*rand(seed*vec2(i)));
      // #endif

      // trying to optimize step size near the camera and near the light source
      t += max(d * 0.1 * max(min(length(ldst), length(rayOrigin)), 1.0), 0.02);
    }
    debugColor = vec3(sum);

    // simple scattering
	  sum *= 1.0 / exp( localDensity * 0.2 ) * 0.6;
   	sum = clamp( sum, 0.0, 1.0 );
    sum.xyz = sum.xyz * sum.xyz * (3.0 - 2.0 * sum.xyz);
	}

    // #ifdef BACKGROUND
    // // stars background
    // if (totalDensity<.8)
    // {
    //     vec3 stars = vec3(noise(rayDirection*500.0)*0.5+0.5);
    //     vec3 starbg = vec3(0.0);
    //     starbg = mix(starbg, vec3(0.8,0.9,1.0), smoothstep(0.99, 1.0, stars)*clamp(dot(vec3(0.0),rayDirection)+0.75,0.0,1.0));
    //     starbg = clamp(starbg, 0.0, 1.0);
    //     sum.xyz += starbg;
    // }

	// #endif
    // FragColor = vec4(sum.xyz, 1.0);
  FragColor = vec4(vec3(debugColor), 1.0);

  //   #ifdef TONEMAPPING
  //   fragColor = vec4(ToneMapFilmicALU(sum.xyz*2.2),1.0);
	// #else
  //   fragColor = vec4(sum.xyz,1.0);
	// #endif
}
