import * as REGL from "regl"
import MorphPlane from "./MorphPlane.js";
import Dat from "dat-gui";

class Scene {
  
  /**
   * @constructor
   */
  constructor(){
    this.clock = new THREE.Clock();
    this.clock.start();
    this.gui = new Dat.GUI();
    this.canvas = document.querySelector("#canvas");
    this.onResize();

    this.initRegl();

    this.plane = new MorphPlane({
      gui: this.gui, 
      clock: this.clock,
      regl: this.regl, 
      src: document.location.href+"./../images/backgrounds/bg_article.jpg"
    })
  }

  /**
   * Register window events
   */
  initEvents() {
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  /**
   * Init WebGL context with Regl
   */
  initRegl() {
    this.regl = REGL({
		  canvas: this.canvas, 
		  pixelRatio: window.innerHeight/window.innerHeight
    });

    this.regl._gl.disable(this.regl._gl.BLEND);
    this.regl._gl.enable(this.regl._gl.DEPTH_TEST);
  
    this.regl.frame(this.render.bind(this));
  }

  /**
   * Update canvas boundaries on resize event
   */
  onResize(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ratio = 1/(this.canvas.width/this.canvas.height);	
  }

  /**
   * @TODO
   */
  onMouseMove() {}

  /**
   * RAF
   */
  render(){
    // Clear Backbuffer
    this.regl.clear({
      color: [0, 0, 0, 0],
      depth: 1
    })

    // Update clock 
    this.clock.getElapsedTime(); 
  
    this.plane.render(); 
  }
  
}

export default Scene;
