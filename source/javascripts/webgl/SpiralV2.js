import spiralVertex from "./shaders/spiral2.vert"
import spiralFragment from "./shaders/spiral2.frag"

class SpiralV2 {

  constructor(clock, gui){
    this.clock = clock;
    this.gui = gui.addFolder('Spiral');

    this.initConfig();
    this.genGeometry();
    this.genMaterial();
    this.genMesh();
  }

  initConfig() {

    this.config = {
      count: 100000,
      strength: new THREE.Vector2(0.12, 0.10),
      speed: 1,
      spread: 0.04,
      rotation: 50,
    }


    this.gui.add(this.config, "count").step(100).onChange(this.refreshGeometry.bind(this));
    this.gui.add(this.config.strength, "x", "X strength").step(0.01).onChange(this.refreshUniforms.bind(this));
    this.gui.add(this.config.strength, "y", "Y strength").step(0.01).onChange(this.refreshUniforms.bind(this));
    this.gui.add(this.config, "speed").step(0.1).onChange(this.refreshUniforms.bind(this));
    this.gui.add(this.config, "spread").step(0.01).onChange(this.refreshUniforms.bind(this));
    this.gui.add(this.config, "rotation").step(1).onChange(this.refreshUniforms.bind(this));

  }

  refreshUniforms(){
    this.material.uniforms.u_speed.value = this.config.speed
    this.material.uniforms.u_strength.value = this.config.strength
    this.material.uniforms.u_spread.value = this.config.spread
    this.material.uniforms.u_rotation.value = this.config.rotation
    this.material.uniforms.needsUpdate = true; 
  }

  refreshGeometry(){
    this.genGeometry();
    this.genMesh();
  }

  genMesh(){
    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  genMaterial(){
    this.material = new THREE.ShaderMaterial({
      uniforms: { 
        u_bg: {type: "t", value: THREE.ImageUtils.loadTexture( "/images/texture.png" ) },
      u_time: { type: "f", value: 0},
      u_speed: { type: "f", value: this.config.speed},
      u_spread: { type: "f", value: this.config.spread},
      u_strength: { type: "v2", value: this.config.strength},
        u_rotation: { type: "f", value: this.config.rotation}
      },
      vertexShader: spiralVertex,
      fragmentShader: spiralFragment,
      transparent: true
    })
  }

  genGeometry(){
    this.geometry = new THREE.BufferGeometry();
      
    var advances = [];
    var spreads = [];
    var positions = [];
    var alphas = [];
    var tmpSpread;
    for(var i=0; i<this.config.count; i++){
      advances.push(Math.random());
      tmpSpread = new THREE.Vector2(Math.cos(Math.random()*2*Math.PI), Math.cos(Math.random()*2*Math.PI));
      spreads.push(tmpSpread.x, tmpSpread.y);
      alphas.push((Math.cos(advances[i]*50)+1)/4 + 0.4) 
      positions.push(0, 0, 0); 
    }

    console.log(alphas)

    console.log(spreads)

    this.geometry.addAttribute('advance', new THREE.Float32BufferAttribute( advances, 1 ) );
    this.geometry.addAttribute('spread', new THREE.Float32BufferAttribute( spreads, 2 ) );
    this.geometry.addAttribute('opacity', new THREE.Float32BufferAttribute( alphas, 1 ) );
    this.geometry.addAttribute('position', new THREE.Float32BufferAttribute( positions, 3 ) );

  
  }

  render(){
    this.material.uniforms.u_time.value = this.clock.elapsedTime/1000;
    this.material.uniforms.needsUpdate = true;
  }

}

export default SpiralV2;
