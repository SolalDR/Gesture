varying float alpha;
varying vec4 color;

void main(){
  gl_FragColor = vec4(color.xyz, alpha);
}
