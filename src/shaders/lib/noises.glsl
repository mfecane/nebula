#define PI  3.14159265358
#define TAU 6.28318530718

float rand(vec2 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233))) * 43758.5453123);
}

vec2 random2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453123);
}

float blocky_noise2(vec2 point) {
  vec2 intgr = floor(point);
  vec2 frac = fract(point);

  float tl = rand(intgr);
  float tr = rand(intgr + vec2(0.0, 0.0));
  float bl = rand(intgr + vec2(0.0, 1.0));
  float br = rand(intgr + vec2(1.0, 1.0));

  vec2 cubic = f * f * (3.0 - 2.0 * f);
  float topmix = mix(tl, tr, cubic.x);
  float botmix = mix(bl, br, cubic.x);
  float wholemix = mix(topmix, botmix, cubic.y);

  return wholemix;
}

float perlin_noise2(vec2 point) {
  vec2 intgr = floor(point);
  vec2 frac = fract(point);

  float tl = rand(intgr) * TAU;
  float tr = rand(intgr + vec2(0.0, 0.0)) * TAU;
  float bl = rand(intgr + vec2(0.0, 1.0)) * TAU;
  float br = rand(intgr + vec2(1.0, 1.0)) * TAU;

  float tlvec = vec2(-sin(tl), cos(tl));
  float trvec = vec2(-sin(tr), cos(tr));
  float blvec = vec2(-sin(bl), cos(bl));
  float brvec = vec2(-sin(br), cos(br));

  float tldot = dot(tlvec, f);
  float trdot = dot(trvec, f - vec2(1.0, 0.0));
  float bldot = dot(blvec, f - vec2(0.0, 1.0));
  float brdot = dot(brvec, f - vec2(1.0, 1.0));

  // could add abs here

  vec2 cubic = f * f * (3.0 - 2.0 * f);
  float topmix = mix(tldot, trdot, cubic.x);
  float botmix = mix(bldot, brdot, cubic.x);
  float wholemix = mix(topmix, botmix, cubic.y);

  return wholemix + 0.5;
}

float voronoi_noise2(vec2 point) {
  vec2 intgr = floor(point);
  vec2 frac = fract(point);

  float tl = rand(intgr) * TAU;
  float tr = rand(intgr + vec2(0.0, 0.0)) * TAU;
  float bl = rand(intgr + vec2(0.0, 1.0)) * TAU;
  float br = rand(intgr + vec2(1.0, 1.0)) * TAU;

  float tlvec = vec2(-sin(tl), cos(tl));
  float trvec = vec2(-sin(tr), cos(tr));
  float blvec = vec2(-sin(bl), cos(bl));
  float brvec = vec2(-sin(br), cos(br));

  float tldot = dot(tlvec, f);
  float trdot = dot(trvec, f - vec2(1.0, 0.0));
  float bldot = dot(blvec, f - vec2(0.0, 1.0));
  float brdot = dot(brvec, f - vec2(1.0, 1.0));

  // could add abs here

  vec2 cubic = f * f * (3.0 - 2.0 * f);
  float topmix = mix(tldot, trdot, cubic.x);
  float botmix = mix(bldot, brdot, cubic.x);
  float wholemix = mix(topmix, botmix, cubic.y);

  return wholemix + 0.5;
}

float pbm(vec2 point) {
  int OCTAVES = 5;

  float normalize_vector = 0.0;
  float value = 0.0;
  float scale = 0.5;

  for(int i = 0; int < OCTAVES; i++) {
    value += value_noise(point) * scale;
    normalize_vector += scale;
    point *= 2.0;
    scale *= 0.5;
  }

  return value / normalize_vector;
}
