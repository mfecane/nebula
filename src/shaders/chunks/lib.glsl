float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 map3(vec3 value, float min1, float max1, float min2, float max2) {
  return vec3(
    map(value.y, min1, max1, min2, max2),
    map(value.x, min1, max1, min2, max2),
    map(value.z, min1, max1, min2, max2)
  );
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
