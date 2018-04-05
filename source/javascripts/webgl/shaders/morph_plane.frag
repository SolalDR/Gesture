precision mediump float;

uniform float time;
uniform sampler2D texture;
uniform sampler2D noise;
uniform vec2 boundaries;

uniform vec3 speed;
uniform vec3 spreadSpeed;
uniform vec3 spread;
uniform float opacity;

void main(){
  vec2 uv = gl_FragCoord.xy / boundaries;
  //vec4 color = texture2D(texture, uv);
  
  vec4 noiseR = texture2D(noise, vec2(uv.x*spreadSpeed.x, mod(uv.y*spreadSpeed.z + time*speed.x, 1.))) - 0.5;
  vec4 noiseG = texture2D(noise, vec2(uv.x*spreadSpeed.y, mod(uv.y*spreadSpeed.y + time*speed.y, 1.))) - 0.5;
  vec4 noiseB = texture2D(noise, vec2(uv.x*spreadSpeed.z, mod(uv.y*spreadSpeed.x + time*speed.z, 1.))) - 0.5;
  
  vec4 imageR = texture2D(texture, uv + noiseR.xy*spread.x);
  vec4 imageG = texture2D(texture, uv + noiseG.xy*spread.y);
  vec4 imageB = texture2D(texture, uv + noiseB.xy*spread.z);
  
  vec3 color = vec3(imageR.x, imageG.y, imageB.z);// + noise.xyz;

  float sum  = color.x + color.y + color.z;
  if( sum > 2.98 ) {
    gl_FragColor = vec4(color.xyz, max(0., .95 - (sum / 3.))*opacity);
  } else {
    gl_FragColor = vec4(color.xyz, .95*opacity);
  }
  
}
