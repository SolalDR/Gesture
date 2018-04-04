precision mediump float;

uniform float time;
uniform sampler2D texture;
uniform sampler2D noise_texture;
uniform vec2 boundaries;

void main(){
  vec2 uv = gl_FragCoord.xy / boundaries;
  vec4 color = texture2D(texture, uv);
  
  float sum  = color.x + color.y + color.z;
  if( sum > 2.98 ) {
    gl_FragColor = vec4(color.xyz, max(0., .95 - (sum / 3.)));
  } else {
    gl_FragColor = vec4(color.xyz, .95);
  }
  
}
