vec4 generic_desaturate(vec3 color, float factor)
{
	// vec3 lum = vec3(0.299, 0.587, 0.114);
	vec3 lum = vec3(0.587, 0.587, 0.114);
	vec3 gray = vec3(dot(lum, color));
	return vec4(mix(color, gray, factor), 1.0);
}
