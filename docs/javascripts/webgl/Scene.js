import * as REGL from "regl"
import MorphPlane from "./MorphPlane.js";
import Dat from "dat-gui";
import fragment from "./shaders/morph_plane.frag"
import vertex from "./shaders/morph_plane.vert"

class Scene {
  
  constructor(){
    this.clock = new THREE.Clock();
    this.clock.start();
    this.gui = new Dat.GUI();

    this.canvas = document.querySelector("#canvas");
    console.log(this.canvas)
		this.computeSize();
		this.regl = REGL({
		  canvas: this.canvas, 
		  pixelRatio: window.innerHeight/window.innerHeight
    });

    this.regl._gl.disable(this.regl._gl.BLEND);
    this.regl._gl.enable(this.regl._gl.DEPTH_TEST);
  

    console.log(this.regl._gl);
    this.regl.frame(this.render.bind(this));
    
    window.addEventListener("resize", () => {
      this.computeSize();
    })
    this.addMorphPlane("/images/backgrounds/bg_article.jpg");
  }

  computeSize(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ratio = 1/(this.canvas.width/this.canvas.height);	
  }

  addMorphPlane(src){
    var image = new Image()
    image.src = src
    image.onload = () => {
      var imageTexture = this.regl.texture(image)
      this.plane = this.regl({
        frag: fragment, vert: vertex,
        attributes: {
          position: this.regl.buffer([
            [-1, -1],   
            [1, -1],
            [-1,  1],
            [1,  -1],
            [-1,  1],
            [1,  1]
          ])
        },
        blend: {
          enable: true,
          func: {
            src: 'src alpha',
            dst: 'one minus src alpha'
          }
        },
        uniforms: {
          time: () => { return this.clock.elapsedTime },
          texture: imageTexture,
          boundaries: () => { return [window.innerWidth, window.innerHeight] } ,
        },
        count: 6
      })
    }
  }


  render(){
    this.regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    })

    this.clock.getElapsedTime()
    
    if(this.plane )
      this.plane();
 
  }
}

export default Scene;
