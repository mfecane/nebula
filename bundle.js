(()=>{var n={27:n=>{n.exports="#version 300 es\n\nprecision highp float;\n\nout vec4 FragColor;\nin vec2 uv;\n\n// source https://www.shadertoy.com/view/MsVXWW\n\nuniform float u_time;\nuniform float u_mouseX;\nuniform float u_mouseY;\nuniform float u_scrollValue;\n\n#define ROTATION\n//#define MOUSE_CAMERA_CONTROL\n\n#define DITHERING\n#define BACKGROUND\n\n//#define TONEMAPPING\n\n//-------------------\n#define pi 3.14159265\n#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)\n\n// iq's noise\nfloat noise( in vec3 x )\n{\n  vec3 p = floor(x);\n  vec3 f = fract(x);\n\tf = f * f * (3.0 - 2.0 * f);\n\tvec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;\n\treturn 1.0 - 0.82 * mix(0.0, 0.0, f.z);\n}\n\nfloat rand(vec2 co)\n{\n\treturn fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);\n}\n\n//=====================================\n// otaviogood's noise from https://www.shadertoy.com/view/ld2SzK\n//--------------------------------------------------------------\n// This spiral noise works by successively adding and rotating sin waves while increasing frequency.\n// It should work the same on all computers since it's not based on a hash function like some other noises.\n// It can be much faster than other noise functions if you're ok with some repetition.\nconst float nudge = 0.739513;\t// size of perpendicular vector\nfloat normalizer = 1.0 / sqrt(1.0 + nudge*nudge);\t// pythagorean theorem on that perpendicular to maintain scale\nfloat SpiralNoiseC(vec3 p)\n{\n  float n = 0.0;\t// noise amount\n  float iter = 1.0;\n  for (int i = 0; i < 8; i++)\n  {\n    // add sin and cos scaled inverse with the frequency\n    n += -abs(sin(p.y * iter) + cos(p.x * iter)) / iter;\t// abs for a ridged look\n    // rotate by adding perpendicular and scaling down\n    p.xy += vec2(p.y, -p.x) * nudge;\n    p.xy *= normalizer;\n    // rotate on other axis\n    p.xz += vec2(p.z, -p.x) * nudge;\n    p.xz *= normalizer;\n    // increase the frequency\n    iter *= 1.733733;\n  }\n  return n;\n}\n\nfloat SpiralNoise3D(vec3 p)\n{\n  float n = 0.0;\n  float iter = 1.0;\n  for (int i = 0; i < 5; i++)\n  {\n    n += (sin(p.y * iter) + cos(p.x * iter)) / iter;\n    p.xz += vec2(p.z, -p.x) * nudge;\n    p.xz *= normalizer;\n    iter *= 1.33733;\n  }\n  return n;\n}\n\nfloat NebulaNoise(vec3 p)\n{\n  float final = p.y + 4.5;\n  final -= SpiralNoiseC(p.xyz);   // mid-range noise\n  final += SpiralNoiseC(p.zxy * 0.5123 + 100.0) * 4.0;   // large scale features\n  final -= SpiralNoise3D(p);   // more large scale features, but 3d\n\n  return final;\n}\n\nfloat map(vec3 p)\n{\n  float NebNoise = abs(NebulaNoise(p / 0.5) * 0.5);\n  return NebNoise + 0.03;\n}\n//--------------------------------------------------------------\n\n// assign color to the media\nvec3 computeColor( float density, float radius )\n{\n\t// color based on density alone, gives impression of occlusion within\n\t// the media\n\tvec3 result = mix(vec3(1.0, 0.9, 0.8), vec3(0.4, 0.15, 0.1), density);\n\n\t// color added to the media\n\tvec3 colCenter = 7.0 * vec3(0.8, 1.0, 1.0);\n\tvec3 colEdge = 1.5 * vec3(0.48, 0.53, 0.5);\n\tresult *= mix(colCenter, colEdge, min((radius + 0.05) / 0.9, 1.15));\n\n\treturn result;\n}\n\nbool RaySphereIntersect(vec3 org, vec3 dir, out float near, out float far)\n{\n\tfloat b = dot(dir, org);\n\tfloat c = dot(org, org) - 8.;\n\tfloat delta = b * b - c;\n\tif( delta < 0.0)\n\t\treturn false;\n\tfloat deltasqrt = sqrt(delta);\n\tnear = -b - deltasqrt;\n\tfar = -b + deltasqrt;\n\treturn far > 0.0;\n}\n\n// Applies the filmic curve from John Hable's presentation\n// More details at : http://filmicgames.com/archives/75\nvec3 ToneMapFilmicALU(vec3 _color)\n{\n\t_color = max(vec3(0), _color - vec3(0.004));\n\t_color = (_color * (6.2 * _color + vec3(0.5))) / (_color * (6.2 * _color + vec3(1.7)) + vec3(0.06));\n\treturn _color;\n}\n\nvoid main()\n{\n  vec3 debugColor;\n  // float seed = 1.0;\n  //   const float KEY_1 = 49.5/256.0;\n\t// const float KEY_2 = 50.5/256.0;\n\t// const float KEY_3 = 51.5/256.0;\n  float key = 0.0;\n  // key += 0.7*texture(iChannel1, vec2(KEY_1,0.25)).x;\n  // key += 0.7*texture(iChannel1, vec2(KEY_2,0.25)).x;\n  // key += 0.7*texture(iChannel1, vec2(KEY_3,0.25)).x;\n\n\t// ro: ray origin\n\t// rd: direction of the ray\n\t// vec3 rd = normalize(vec3((gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y, 1.));\n\tvec3 rayDirection = normalize(vec3(uv.x, uv.y, 1.0));\n\tvec3 rayOrigin = vec3(0.0, 0.0, -u_scrollValue);\n\n  const float mouseFactor = 0.002;\n  R(rayDirection.yz, -u_mouseY * mouseFactor * pi * 2.0);\n  R(rayDirection.xz, u_mouseX * mouseFactor * pi * 2.0);\n  R(rayOrigin.yz, -u_mouseY * mouseFactor * pi * 2.0);\n  R(rayOrigin.xz, u_mouseX * mouseFactor * pi * 2.0);\n\n  // DITHERING\n\tvec2 seed = fract(uv * 2.0) / 2.0 + sin(u_time / 2.0);\n\n\t// ld, totalDensity: local, total density\n\t// w: weighting factor\n\tfloat localDensity = 0.0, totalDensity = 0.0, w = 0.0;\n\n\t// t: length of the ray\n\t// d: distance function\n\tfloat d = 1.0, t = 0.0;\n\n  const float h = 0.1;\n\n\tvec4 sum = vec4(0.0);\n\n  float min_dist = 0.0, max_dist = 0.0;\n\n\n  // march ray to the sphere\n  if (RaySphereIntersect(rayOrigin, rayDirection, min_dist, max_dist))\n  {\n\t  t = min_dist * step(t, min_dist);\n\n    // raymarch loop\n    for (int i = 0; i < 56; i++)\n    {\n      vec3 pos = rayOrigin + t * rayDirection;\n\n      if (totalDensity > 0.9 || d < 0.1 * t || t > 10.0 || sum.a > 0.99 || t > max_dist) break;\n\n      // evaluate distance function\n      float d = map(pos);\n\n      // change this string to control density\n      d = max(d, 0.07);\n\n      // point light calculations\n      vec3 ldst = vec3(0.0) - pos;\n      float lDist = max(length(ldst), 0.001);\n\n      // star in center\n      vec3 lightColor = vec3(1.0, 0.5, 0.25);\n      sum.rgb += (lightColor / (lDist * lDist) / 30.0); // star itself and bloom around the light\n\n      if (d < h)\n      {\n        // compute local density\n        localDensity = h - d;\n\n              // compute weighting factor\n        w = (1.0 - totalDensity) * localDensity;\n\n        // accumulate density\n        totalDensity += w + 1./200.;\n\n        vec4 col = vec4( computeColor(totalDensity, lDist), totalDensity );\n\n        // uniform scale density\n        col.a *= 0.185;\n        // colour by alpha\n        col.rgb *= col.a;\n        // alpha blend in contribution\n        sum = sum + col*(1.0 - sum.a);\n\n      }\n\n      totalDensity += 1./70.;\n\n      // enforce minimum stepsize\n      d = max(d, 0.04);\n\n      // DITHERING\n      d = abs(d) * (0.8 + 0.2 * rand(seed * vec2(i)));\n\n      // trying to optimize step size near the camera and near the light source\n      t += max(d * 0.1 * max(min(length(ldst), length(rayOrigin)), 1.0), 0.02);\n    }\n\n    // simple scattering\n\t  sum *= 1.0 / exp( localDensity * 0.2 ) * 0.6;\n   \tsum = clamp( sum, 0.0, 1.0 );\n    sum.xyz = sum.xyz * sum.xyz * (3.0 - 2.0 * sum.xyz);\n\t}\n\n  // BACKGROUND\n  // if (totalDensity < 0.8)\n  // {\n  //   vec3 stars = vec3(noise(rayDirection * 500.0) * 0.5 + 0.5);\n  //   vec3 starbg = vec3(0.0);\n  //   starbg = mix(starbg, vec3(0.8, 0.9, 1.0), smoothstep(0.99, 1.0, stars) * clamp(dot(vec3(0.0), rayDirection) + 0.75, 0.0, 1.0));\n  //   starbg = clamp(starbg, 0.0, 1.0);\n  //   sum.xyz += starbg;\n  // }\n\n  // FragColor = vec4(sum.xyz, 1.0);\n  // TONEMAPPING\n  debugColor = ToneMapFilmicALU(sum.xyz * 2.2);\n  FragColor = vec4(vec3(debugColor), 1.0);\n}\n"},919:n=>{n.exports="#version 300 es\n\nprecision highp float;\nlayout(location = 0) in vec2 aPos;\n\nout vec2 uv;\n\nuniform mat4 u_MVP;\n\nvoid main() {\n  gl_Position = vec4(aPos, .0f, 1.0f);\n  vec4 uv_out =  gl_Position * inverse(u_MVP);\n  uv = uv_out.xy;\n}\n"}},e={};function t(o){var r=e[o];if(void 0!==r)return r.exports;var i=e[o]={exports:{}};return n[o](i,i.exports,t),i.exports}t.n=n=>{var e=n&&n.__esModule?()=>n.default:()=>n;return t.d(e,{a:e}),e},t.d=(n,e)=>{for(var o in e)t.o(e,o)&&!t.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:e[o]})},t.o=(n,e)=>Object.prototype.hasOwnProperty.call(n,e),(()=>{"use strict";class n{constructor(n){this.gl=void 0,this.uniforms=[],this.positionLocation=null,this.program=null,this.gl=n}createProgram(n,e){const t=this.gl,o=t.createShader(t.VERTEX_SHADER),r=t.createShader(t.FRAGMENT_SHADER),i=t.shaderSource(o,n),a=t.shaderSource(r,e);t.compileShader(o,i),t.getShaderParameter(o,t.COMPILE_STATUS)||(alert("Error compiling vertex shader"),console.log(t.getShaderInfoLog(o))),t.compileShader(r,a),t.getShaderParameter(r,t.COMPILE_STATUS)||(alert("Error compiling fragment shader"),console.log(t.getShaderInfoLog(r)));const s=t.createProgram();t.attachShader(s,o),t.attachShader(s,r),t.linkProgram(s),t.validateProgram(s),t.getProgramParameter(s,t.VALIDATE_STATUS)?this.program=s:console.log("Error validating program ",t.getProgramInfoLog(s))}useProgram(){this.gl.useProgram(this.program)}addUniform(n,e){const t={name:n,type:e,uniform:this.gl.getUniformLocation(this.program,n)};this.uniforms.push(t)}setUniform(n,...e){const t=this.uniforms.find((e=>e.name===n));if(t)switch(t.type){case"4fv":return void this.gl.uniformMatrix4fv(t.uniform,!1,e[0]);case"1f":return void this.gl.uniform1f(t.uniform,e[0]);case"2f":return void this.gl.uniform2f(t.uniform,e[0],e[1]);case"4f":return void this.gl.uniform4f(t.uniform,e[0],e[1],e[2],e[3]);case"1i":return void this.gl.uniform1i(t.uniform,e[0])}}setPositions(n){this.positionLocation=this.gl.getAttribLocation(this.program,n),this.gl.enableVertexAttribArray(this.positionLocation),this.gl.vertexAttribPointer(this.positionLocation,2,this.gl.FLOAT,!1,0,0)}}var e=t(919),o=t.n(e),r=t(27),i=t.n(r);let a,s=0,c=0,l=0,u=0,d=0,f=0,m=0,g=1,p=1,h=0;const v=function(n){a=!0,s=n.screenX,c=n.screenY},y=function(){a=!1},_=function(n){if(a){const e=.01;d+=(n.screenX-s)*e,f+=(n.screenY-c)*e,s=n.screenX,c=n.screenY}},x=function(n){return Math.abs(n)>.1?.99*n:0},b=function(n){const e=n.deltaY;e>0&&p<4?p+=.25:e<0&&p>.5&&(p-=.25),m=g,h=0},E=function(){return[l,u,g]},w=function(){a||(d=x(d),f=x(f)),l+=d,u+=f,l<-2e3&&(l=-2e3),l>2e3&&(l=2e3),u<-2e3&&(u=-2e3),u>2e3&&(u=2e3),function(){if(Math.abs(m-p)<.1||h>100)return void(g=p);const n=(e=h/100,1-Math.pow(1-e,3));var e;g=m+n*(p-m),h+=1}(),requestAnimationFrame(w)};let A,D,R,P,S=null,z=0,C=0,F=Date.now(),N=F;const T=function(){z=D.clientWidth,C=D.clientHeight,A.width=z,A.height=C,A.style.width=`${z}px`,A.style.height=`${C}px`,S.viewport(0,0,z,C)},U=function(){!function(){const n=-z/C,e=z/C;P=[2/(e-n),0,0,-(e+n)/(e-n),0,1,0,-0,0,0,1,-0,0,0,0,1]}(),function(){S.bindFramebuffer(S.FRAMEBUFFER,null),R.useProgram(),R.setUniform("u_MVP",P);const[n,e,t]=E();N=(Date.now()-F)/1e3,R.setUniform("u_time",N),R.setUniform("u_mouseX",n),R.setUniform("u_mouseY",e),R.setUniform("u_scrollValue",t),S.clearColor(0,0,0,1),S.clear(S.COLOR_BUFFER_BIT),S.drawElements(S.TRIANGLES,6,S.UNSIGNED_SHORT,0)}(),requestAnimationFrame(U)};let I;window.onload=()=>{I=document.getElementById("canvas-container"),function(e){D=e,A=document.createElement("canvas"),e.appendChild(A),A.id="canvas",S=A.getContext("webgl2"),T(),window.addEventListener("resize",T),window.addEventListener("mousemove",_),window.addEventListener("mousedown",v),window.addEventListener("mouseup",y),document.addEventListener("wheel",b),w(),R=new n(S),R.createProgram(o(),i());const t=S.createBuffer();S.bindBuffer(S.ARRAY_BUFFER,t),S.bufferData(S.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,1]),S.STATIC_DRAW);const r=S.createBuffer();S.bindBuffer(S.ELEMENT_ARRAY_BUFFER,r),S.bufferData(S.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,2,3,0]),S.STATIC_DRAW),R.useProgram(),R.setPositions("aPos"),R.addUniform("u_MVP","4fv"),R.addUniform("u_time","1f"),R.addUniform("u_mouseX","1f"),R.addUniform("u_mouseY","1f"),R.addUniform("u_scrollValue","1f")}(I),U()}})()})();
//# sourceMappingURL=bundle.js.map