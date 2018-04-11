precision mediump float;

uniform float time;
uniform sampler2D texture;
uniform sampler2D noise;
uniform vec2 boundaries;
uniform vec2 mouse;

uniform vec3 speed;
uniform vec3 spreadSpeed;
uniform vec3 spread;
uniform float opacity;

void main(){
  vec2 uv = vec2(gl_FragCoord.x / boundaries.x, -gl_FragCoord.y / boundaries.y + 1.);

  float intensity = (1. - min(1.,  distance(uv, mouse)/0.25)) * 0.3;
  //intensity = intensity*intensity;
  vec2 diffMouse = uv - mouse;


  vec4 noiseR = texture2D(noise, vec2(uv.x*spreadSpeed.x, mod(uv.y*spreadSpeed.z + time*speed.x, 1.))) - 0.5;
  vec4 noiseG = texture2D(noise, vec2(uv.x*spreadSpeed.y, mod(uv.y*spreadSpeed.y + time*speed.y, 1.))) - 0.5;
  vec4 noiseB = texture2D(noise, vec2(uv.x*spreadSpeed.z, mod(uv.y*spreadSpeed.x + time*speed.z, 1.))) - 0.5;

  vec4 imageR = texture2D(texture, uv + noiseR.xy*spread.x + noiseR.xy*intensity);
  vec4 imageG = texture2D(texture, uv + noiseG.xy*spread.y + noiseG.xy*intensity);
  vec4 imageB = texture2D(texture, uv + noiseB.xy*spread.z + noiseB.xy*intensity);
  

  vec3 color = vec3(imageR.x, imageG.y, imageB.z);// + noise.xyz; 

  gl_FragColor = vec4(color.xyz, opacity);
}
