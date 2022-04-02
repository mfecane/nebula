float sdGyroid(vec3 p, float scale, float bias) {
  p *= scale;
  return abs(dot(sin(p), cos(p.zxy))) / scale - bias;
}

float sdBox(vec3 p, vec3 s) {
  p = abs(p) - s;
  return length(max(p, 0.0)) + min(max(p.x, max(p.y, p.z)), 0.0);
}

float sdSphere(vec3 p, float radius) {
  return (length(p) - radius);
}

float sdSphere2(vec3 p, float radius, float bias) {
  return abs((length(p) - radius)) - bias;
}
