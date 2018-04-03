import Spiral from "./Spiral.js"
import MorphPlane from "./MorphPlane.js";
import Dat from "dat-gui";

class Scene {
  
  constructor(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor( 0xffffff, 1);
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.clock = new THREE.Clock();
    this.clock.start();
    this.gui = new Dat.GUI();

    document.body.appendChild( this.renderer.domElement );

    this.addMorphPlane();
    this.camera.position.z = 5;

    this.render();
  }


  addSpiral(){
    this.spiral = new Spiral(this.clock, this.gui);
    this.scene.add( this.spiral.mesh );
  }

  addMorphPlane(){
    this.plane = new MorphPlane(this.clock, this.gui);
    
    this.scene.add( this.plane.mesh );
  }


  render(){
    requestAnimationFrame( this.render.bind(this) );

    this.clock.getElapsedTime()
    
    //count += 0.05;

    if(this.place )
      this.plane.render();

    if( this.spiral )
      this.spiral.render()  
    
    this.renderer.render(this.scene, this.camera);

  }

}

export default Scene;
