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
