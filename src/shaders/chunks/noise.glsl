float Noise31(vec3 p){
  p = fract(p * vec3(123.344314, 234.542341, 123.432423));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y * p.z);
}

float Noise21(vec2 p){
  p = fract(p * vec2(123.344314, 234.542341));
  p += dot(p, p + 23.4123);
  return fract(p.x * p.y);
}
