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
uniform float u_control6;
uniform float u_control7;
uniform float u_control8;

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

float mod289(in float x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

vec2 mod289(in vec2 x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

vec3 mod289(in vec3 x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

vec4 mod289(in vec4 x) {
  return x - floor(x * (1. / 289.)) * 289.;
}

float permute(in float x) {
     return mod289(((x * 34.) + 1.)*x);
}

vec3 permute(in vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 permute(in vec4 x) {
     return mod289(((x * 34.) + 1.)*x);
}

float taylorInvSqrt(in float r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 taylorInvSqrt(in vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(in vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float SpiralNoiseC(vec3 p)
{
  const float nudge = 0.739513;	// size of perpendicular vector
  float normalizer = 1.0 / sqrt(1.0 + nudge * nudge);	// pythagorean theorem on that perpendicular to maintain scale

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
    iter *= 1.54325;
  }
  return n;
}

float SpiralNoise3D(vec3 p)
{
  float nudge = 0.34324;	// size of perpendicular vector
  float normalizer = 1.0 / sqrt(1.0 + nudge * nudge);	// pythagorean theorem on that perpendicular to maintain scale

  float n = 0.0;
  float iter = 1.0;
  for (int i = 0; i < 5; i++)
  {
    n += (sin(p.y * iter) + cos(p.x * iter)) / iter;
    p.xz += vec2(p.z, -p.x) * nudge;
    p.xz *= normalizer;
    iter *= 0.66313 ;
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
  final += SpiralNoiseC(p.zxy * 0.5123 + 100.0) * 4.12515;
  // very smooth large scale noise
  // more large scale features, but 3d
  final -= SpiralNoise3D(p);
  final += snoise(p * 3.0) * 0.8;
  return final;
}

// combination of noises around (0.0, 30.0)
float mapNebulaDensity(vec3 p)
{
  // NebulaNoise around (-30, 10)
  float NebNoise = abs(NebulaNoise(p / 0.5) * 0.5);
  return NebNoise + 0.03;
}

float densityFunction2(vec3 p) {
  float noise = mapNebulaDensity(3.0 * p + vec3(1.0));

  return clamp(map2(noise, -2.5 + 5.0, 8.0, 0.0, 1.0), 0.0, 1.0); // * densitySphere(p);
  // return densitySphere(p);
}

float Noise31(vec3 p){
  p = fract(p * vec3(123.344314, 234.542341, 123.432423));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y * p.z);
}

vec3 stars(vec3 p) {
  float n = Noise31(floor(p));
  p = fract(p);
  vec3 shift = vec3(n - 0.5, fract(n * 10.0), fract(n * 100.0));
  float d = length(p - shift);
  float m = smoothstep(0.2 * n, 0.0, d) * n;
  float bas = sin(n * 213.131);
  return m * vec3(
    1.0 * fract(bas * 0.123552),
    1.0 * fract(bas * 0.535235),
    1.0 * fract(bas * 0.231223)
  );
}

void main()
{
  vec2 uv1 = uv * 1.6;

  vec3 pos = vec3(
    sin(uv1.x) * cos(uv1.y),
    cos(uv1.x) * cos(uv1.y),
    sin(uv1.y)
  );

  // vec3 col = vec3(Noise31(floor(pos * 20.0)) * 0.3);

  vec3 col = vec3(0.0);

  // check spiral noise
  float neb = NebulaNoise(pos * 14.0 );
  float fog = (1.0 - neb) * 0.01 + 0.4;

  col = mix(vec3(0.6, 0.1, 0.8), vec3(0.9, 0.4, 0.2), fog);

  vec3 st = stars(pos * 15.0) * 2.0;
  col += st;

  st = stars(pos * 40.0) * 1.5;
  col += st;

  st = stars(pos * 80.0) * 1.5;
  col += st;

  col = clamp(col, 0.0, 1.0);

  FragColor = vec4(col, 1.0);
}
