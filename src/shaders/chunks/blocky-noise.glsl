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

float pbm_blocky_noise2(vec2 point) {
  int OCTAVES = 5;

  float normalize_vector = 0.0;
  float value = 0.0;
  float scale = 0.5;

  for(int i = 0; int < OCTAVES; i++) {
    value += blocky_noise2(point) * scale;
    normalize_vector += scale;
    point *= 2.0;
    scale *= 0.5;
  }

  return value / normalize_vector;
}
