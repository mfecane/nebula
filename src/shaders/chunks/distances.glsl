float sdGyroid(vec3 p, float scale) {
  p *= scale;
  return abs(dot(sin(p), cos(p.zxy)) - 0.7) / scale - 0.7;
}

float sdBox(vec3 p, vec3 s) {
  p = abs(p) - s;
  return length(max(p, 0.0)) + min(max(p.x, max(p.y, p.z)), 0.0);
}

float sdSphere(vec3 p, float radius) {
  return (length(p) - radius);
}
