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
