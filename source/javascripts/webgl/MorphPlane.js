import fragmentShader from "./shaders/morph_plane.frag"
import vertexShader from "./shaders/morph_plane.vert"


class MorphPlane {
  constructor(clock, gui) {
    
    this.clock = clock; 
    this.gui = gui;

    this.genGeometry();
    this.genMaterial();
    this.genMesh();

  }

  genGeometry(){
    this.geometry = new THREE.PlaneGeometry( 20, 20, 32 );
  }

  genMaterial(){
    this.material = new THREE.ShaderMaterial( {
      uniforms: {
        u_time: { type: "f", value: 0 },
        u_texture_red: { type: "t", value: THREE.ImageUtils.loadTexture("/images/lot_1/red.png") },
        u_texture_blue: { type: "t", value: THREE.ImageUtils.loadTexture("/images/lot_1/blue.png") },
        u_texture_green: { type: "t", value: THREE.ImageUtils.loadTexture("/images/lot_1/green.png") }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide
    } );
  }

  genMesh(){
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    console.log(this.mesh);
    this.mesh.rotation.x = -3;  
  }
}

export default MorphPlane;
