vec3 cartesianToPolar (vec3 v)
{
	vec3 polar;
  float HALF_PI = PI / 2.0;
	polar[0] = length(v);

	if (v[2] > 0.0f) {
		polar[1] = atan(sqrt (v[0] * v[0]+ v[1] * v[1]) / v[2]);
	}
	else if (v[2] < 0.0f) {
		polar[1] = atan(sqrt(v[0] * v[0]+ v[1] * v[1]) / v[2]) + PI;
	}
	else {
		polar[1] = PI * 0.5f;
	}
	polar[ 1 ] -= HALF_PI;
	if (v[0] != 0.0f) {
        polar[2] = clamp(atan (v[1], v[0]), -PI, PI);
    }
	else if (v[1] > 0.0) {
		polar[2] = PI * 0.5f;
	}
	else {
		polar[2] = -PI * 0.5;
	}
	return polar;
}

vec3 twistSpace(vec3 point, float amount) {
  float angle = point.y * PI * amount;

  return vec3(
    point.x * sin(angle) + point.z * cos(angle),
    point.y,
    point.x * - cos(angle) + point.z * sin(angle)
  );
}

vec3 polarTocartesian(vec3 point) {
  vec3 pos = vec3(
    point.x * sin(point.y * PI + PI / 2.0) * cos(point.z * PI),
    point.x * cos(point.y * PI + PI / 2.0) * cos(point.z * PI),
    point.x * sin(point.z * PI)
  );

  return pos;
}

vec3 shwankSpace(vec3 p, float amount) {

  // abs space
  // return vec3(
  //   abs(p.x) + length(p) * amount,
  //   abs(p.y) + length(p) * amount,
  //   abs(p.z) + length(p) * amount
  // );

  // abs space
  // return vec3(
  //   p.x / (1.0 + abs(p.z) * amount),
  //   p.y / (1.0 + abs(p.x) * amount),
  //   p.z / (1.0 + abs(p.y) * amount)
  // );

  return p;









}

vec3 shwistSpace(vec3 point, float amount) {
  float angle = sin(point.y / 2.0) * PI * amount;

  return vec3(
    point.x * sin(angle) + point.z * cos(angle),
    point.y,
    point.x * - cos(angle) + point.z * sin(angle)
  );
}

vec3 pixelateSpace(vec3 p, float scale) {
  float sc = 10.0 * scale;
  // multiply this by 2.0 to get cool diagonal lines
  // return (floor((p - 0.5) * sc) + 0.5) / sc * 2.0;
  return (floor((p - 0.5) * sc) + 0.5) / sc;
}
