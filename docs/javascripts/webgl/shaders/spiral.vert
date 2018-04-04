uniform float u_time; 
uniform float u_rotation; 
uniform float u_speed;
uniform float u_spread;
uniform float u_radius; 
uniform vec2 u_strength;
uniform sampler2D u_bg;


//uniform float u_start_fade; // [0, 1]
//uniform float u_start_fade; // [0, 1]

attribute float advance;
attribute float opacity;
attribute vec3 spread;


varying float alpha;
varying vec4 color;

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

//  Simplex 3D Noise 
//  by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}


vec3 fermat(float angle, float coef) {
  return vec3(
    sin(coef) * abs(coef) * sqrt(angle) * cos(angle),
    sin(coef) * abs(coef) * sqrt(angle) * sin(angle),
    0);
}

vec3 archimede(float angle, vec2 radius) {
  return vec3(
    cos(angle) * radius.x,
    sin(angle) * radius.y,
    0);
}


void main() {

  // [0 : 1] More we are close to 1, the less we are close to the center
  float intensity =  cubicOut(mod(advance + u_time*u_speed, 1.));

  // Angle compute from rotation limit 
  float angle = intensity * u_rotation;

  // Spiral coord
  vec3 newPosition = archimede(angle, u_strength * angle * intensity * 2. + spread.x/80.);
  vec3 newPositionSpread = newPosition;

  // Compute 
  float startFade = 0.25;
  if( intensity < startFade ){
    newPositionSpread += newPosition * spread * (startFade - intensity)*3.;
  }

  color = texture2D(u_bg, (newPosition.xy + 5.) / 10.);
  // float alphaSpread = 1.;
  float alphaSpread = color.x;

  // newPositionSpread += newPosition * spread * intensity * 2.;
  // alphaSpread = 1. - min(1., distance(newPositionSpread, newPosition)/0.5 );
  

  float alphaAngle = (1. - intensity) * (max(0., distance(newPosition, vec3(0.)) + 0.5*3.) /3.);
  alpha = opacity * alphaAngle * alphaSpread;


  gl_PointSize = 2.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPositionSpread, 1.0);
}




