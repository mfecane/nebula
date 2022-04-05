float voronoi(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);

  float id = 0.0;
	vec3 ming, minr;
  float mind = 8.0;

  for(int k = -1; k <= 1; k++)
    for(int j = -1; j <= 1; j++)
      for(int i = -1; i <= 1; i++)
        {
          vec3 grid = vec3(float(i), float(j), float(k));
          vec3 targetPoint = hash(p + grid);
          // if (targetPoint.y > 1.0) {
          //   res = 100.0;

          // }
          vec3 r = vec3(grid) - f + targetPoint;
          // float d = dot(r, r);
          float d = dot(abs(r), vec3(1.0));
          if(d < mind)
          {
            mind = d;
            minr = r;
            ming = grid;
          }
        }

  mind = 8.0;
  for(int k = -2; k <= 2; k++)
    for(int j = -2; j <= 2; j++)
      for(int i = -2; i <= 2; i++)
        {
          vec3 grid = ming + vec3(float(i), float(j), float(k));
          vec3 o = hash(p + grid);
          vec3 r = grid + o - f;

          if (dot(minr - r, minr - r) > 0.00001) {
            mind = min(mind, dot(0.5 * (minr + r), normalize(r - minr)));
          }
        }

  return mind / 2.0;
}
