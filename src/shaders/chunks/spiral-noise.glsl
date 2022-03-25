float chunkSpiralNoise3(vec3 p) {
  const int OCTAVES = 5;

  float normalize_vector = 0.0;
  float value = 0.0;
  float scale = 0.5;

  float nudge = 0.739513;	// size of perpendicular vector

  for (int i = 0; i < OCTAVES; i++)
  {
    // add sin and cos scaled inverse with the frequency
    value += (1.0 - abs(sin(p.y / scale) + cos(p.x / scale))) * scale;	// abs for a ridged look
    // rotate by adding perpendicular and scaling down

    nudge = 1.23525 + sin(1.31231 * scale);

    p.xy += vec2(p.y, -p.x) * nudge;
    // rotate on other axis
    p.xz += vec2(p.z, -p.x) * nudge;
    normalize_vector += nudge;
    scale /= (1.1234);
  }

  return value / normalize_vector + 0.3;
}
