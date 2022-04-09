#version 300 es

precision highp float;

out vec4 FragColor;
in vec2 uv;

uniform float u_time;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_scrollValue;

uniform float u_control1;
uniform float u_control2;
uniform float u_control3;
uniform float u_control4;
uniform float u_control5;
uniform float u_control6;
uniform float u_control7;
uniform float u_control8;

$lib
$distances
$noise
$simplex-noise

#define PI  3.14159265358
#define TAU 6.28318530718

#define MAX_STEPS 512
#define MAX_DIST 8.0
#define SURF_DIST 0.0000001 // hit distance

#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)

vec4 orb;

vec3 twistSpace(vec3 point) {
  float angle = (1.0 - point.y) * (-PI + u_control5 * TAU);

  return vec3(
    point.x * sin(angle) + point.z * cos(angle),
    point.y * u_control3,
    point.x * - cos(angle) + point.z * sin(angle)
  );
}

vec3 pixelateSpace(vec3 point) {
  vec3 n = vec3(
    pbm_simplex_noise3(point * 1.0),
    pbm_simplex_noise3(point * 1.0 + 1.251),
    pbm_simplex_noise3(point * 1.0 + 2.1414)
  );

  point.x = point.x + point.x * cos(n.x * 3.0 * u_control1) * u_control2 - point.z * sin(n.x * 3.0 * u_control1) * u_control2;
  point.z = point.z + point.x * sin(n.x * 3.0 * u_control1) * u_control2 + point.z * cos(n.x * 3.0 * u_control1) * u_control2;

  return point;
}

float map(vec3 p)
{
	float scale = 1.0;
	orb = vec4(1000.0);
	for( int i = 0; i < 9; i++ )
	{
		p = -1.0 + 2.0 * fract(0.5 * p + 0.5);
		float r2 = dot(p, p);
    orb = min(orb, vec4(abs(p), r2));
		float k = 2.0 *  u_control1 / r2;
		p *= k;
		scale *= k;
	}
	return 0.25 * abs(p.y) / scale;
}

float trace( in vec3 ro, in vec3 rd )
{
	float maxd = 30.0;
    float t = 0.01;
    for( int i=0; i<512; i++ )
    {
	    float precis = 0.001 * t;

	    float h = map( ro+rd*t);
        if( h<precis||t>maxd ) break;
        t += h;
    }

    if( t>maxd ) t=-1.0;
    return t;
}


vec3 calcNormal(in vec3 pos, in float t)
{
    float precis = 0.001 * t;

    vec2 e = vec2(1.0,-1.0)*precis;
    return normalize( e.xyy*map( pos + e.xyy ) +
					  e.yyx*map( pos + e.yyx ) +
					  e.yxy*map( pos + e.yxy ) +
                      e.xxx*map( pos + e.xxx ) );
}

vec3 render( in vec3 ro, in vec3 rd)
{
  // trace
  vec3 col = vec3(0.0);
  float t = trace( ro, rd );
  if( t>0.0 ) {
    vec4 tra = orb;
    vec3 pos = ro + t*rd;
    vec3 nor = calcNormal( pos, t );

    // lighting
    vec3  light1 = vec3(  0.577, 0.577, -0.577 );
    vec3  light2 = vec3( -0.707, 0.000,  0.707 );
    float key = clamp( dot( light1, nor ), 0.0, 1.0 );
    float bac = clamp( 0.2 + 0.8*dot( light2, nor ), 0.0, 1.0 );
    float amb = (0.7+0.3*nor.y);
    float ao = pow( clamp(tra.w*2.0,0.0,1.0), 1.2 );

    vec3 brdf  = 1.0*vec3(0.40,0.40,0.40)*amb*ao;
    brdf += 1.0*vec3(1.00,1.00,1.00)*key*ao;
    brdf += 1.0*vec3(0.40,0.40,0.40)*bac*ao;

    // material
    vec3 rgb = vec3(1.0);
    rgb = mix( rgb, vec3(1.0,0.80,0.2), clamp(6.0*tra.y,0.0,1.0) );
    rgb = mix( rgb, vec3(1.0,0.55,0.0), pow(clamp(1.0-2.0*tra.z,0.0,1.0),8.0) );

    // color
    col = rgb*brdf*exp(-0.2*t);
  }

  return sqrt(col);
}

float sceneDistance(vec3 point) {
  // float box = sdBox(p - vec3(0.0, 1.0, 0.0), vec3(1.0));
  point = twistSpace(point);
  // point = pixelateSpace(point);

  // float sphereDist = sdSphere(point, 1.0);
  // float gyroid = sdGyroid(point, 5.0);
  // float d = smin(sphereDist, gyroid * 0.9, 0.07);

  return map(point);
}

vec3 GetNormal(vec3 p) {
  float d = sceneDistance(p);
  vec2 e = vec2(0.001, 0.0);
  vec3 n = d - vec3(
    sceneDistance(p - e.xyy),
    sceneDistance(p - e.yxy),
    sceneDistance(p - e.yyx)
  );

  return normalize(n);
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = sceneDistance(p);
    dO += dS;
    if (dO > MAX_DIST || abs(dS) < SURF_DIST) {
      break;
    }
  }

  return dO;
}

void main() {
  const float mouseFactor = 0.0005;
  vec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));
	vec3 rayOrigin = vec3(0.0, 0.0, -0.5 - u_scrollValue * 4.0);

  vec2 rot = vec2(
    u_mouseY * mouseFactor * PI * 2.0,
    u_mouseX * mouseFactor * PI * 2.0
  );

  R(rayDirection.yz, -rot.x);
  R(rayDirection.xz, rot.y);
  R(rayOrigin.yz, -rot.x);
  R(rayOrigin.xz, rot.y);
  vec3 col = render(rayOrigin, rayDirection);


  // if(d < MAX_DIST) {
  //     vec3 p = rayOrigin + rayDirection * d;
  //     vec3 n = GetNormal(p);
  //     vec3 r = reflect(rayDirection, n);

  //     float dif = dot(n, normalize(vec3(1.0, 2.0, 3.0))) * 0.5 + 0.5;
  //     col = vec3(dif);
  // }

  FragColor = vec4(col, 1.0);
}
