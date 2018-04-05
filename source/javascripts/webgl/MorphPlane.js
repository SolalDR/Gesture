import fragmentShader from "./shaders/morph_plane.frag"
import vertexShader from "./shaders/morph_plane.vert"


class MorphPlane {

  /**
   * Register attributes & launch initialization
   * @constructor
   */
  constructor(args) {    
    this.clock = args.clock; 
    this.gui = args.gui;
    this.regl = args.regl;
    this.config = args.config ? args.config : {
      speed: [0.0111, 0.0125, 0.0142],
      spreadSpeed: [0.333, 0.05, 0.025],
      spread: [0.2, 0.1, 0.14],
      opacity: 1  
    }
    this.src = args.src;
    
    this.init();  
    window.plane = this; 
  }

  /**
   * First initialization
   */
  init() {
    this.registerPreset();
    this.initGui();

    // Load noise
    var noise = new Image()
    noise.src = document.location.href+"./../images/noise_3d.jpg";
    noise.onload = ()=>{
      this.noise = this.regl.texture(noise);
      // Load first background
      this.load(this.src);
    }
  }

  /**
   * Load an image asynchronously and update
   * @param {String} src 
   * @param {Object} config 
   */
  load(src, callback, config ) {
    var image = new Image()
    image.src = src
    if(config) this.config;
    image.onload = () => {
      this.texture = this.regl.texture(image)
      this.registerCommand();
    }
  }

  /**
   * Register a new webgl command from current config
   */
  registerCommand() {
    this.plane = this.regl({
      
      // Shaders
      frag: fragmentShader, 
      vert: vertexShader,

      // Simple plane 
      attributes: {
        position: this.regl.buffer(
          [[-1, -1], [1, -1], [-1,  1], [1,  -1], [-1,  1], [1,  1]]
        )
      },

      // Background transparent
      blend: { enable: true, func: { src: 'src alpha', dst: 'one minus src alpha' }},
      
      // Params
      uniforms: {
        speed: () => { return this.config.speed },
        spread: () => { return this.config.spread },
        spreadSpeed: () => { return this.config.spreadSpeed },
        opacity: () => { return this.config.opacity },
        time: () => { return this.clock.elapsedTime },
        texture: this.texture,
        noise: this.noise,
        
        boundaries: () => { return [window.innerWidth, window.innerHeight] },
      },

      // Nb of vertices
      count: 6
    })
  }

  /**
   * Setup GUI controller
   */
  initGui(){
    var folder = this.gui.addFolder('Fragment');
    folder.add(this.config.speed, 0).name("Speed Red")
    folder.add(this.config.speed, 1).name("Speed Green")
    folder.add(this.config.speed, 2).name("Speed Blue")

    folder.add(this.config.spread, 0).name("Spread Red")
    folder.add(this.config.spread, 1).name("Spread Green")
    folder.add(this.config.spread, 2).name("Spread Blue")

    folder.add(this.config.spreadSpeed, 0).name("SpeedS Red")
    folder.add(this.config.spreadSpeed, 1).name("SpeedS Green")
    folder.add(this.config.spreadSpeed, 2).name("SpeedS Blue")
  }

  /**
   * Raf method
   */
  render() {
    if( this.plane ) this.plane();
    this.renderAnimation();
  }



  renderAnimation() {
    function easeInOut (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }
    function mix(i, o, a){ return (o - i)*a + i; }

    if(this.animation && this.animation.active) {
      this.animation.advancement = easeInOut((this.clock.elapsedTime - this.animation.start) / this.animation.duration)
      if( this.animation.advancement >= 1 ){
        this.animation.active = false; 
        this.animation.advancement = 1; 
      }

      this.config.opacity = mix(this.animation.from.opacity, this.animation.to.opacity, this.animation.advancement)
    
      this.config.spread[0] = mix(this.animation.from.spread[0], this.animation.to.spread[0], this.animation.advancement)
      this.config.spread[1] = mix(this.animation.from.spread[1], this.animation.to.spread[1], this.animation.advancement)
      this.config.spread[2] = mix(this.animation.from.spread[2], this.animation.to.spread[2], this.animation.advancement)
      
      this.config.spreadSpeed[0] = mix(this.animation.from.spreadSpeed[0], this.animation.to.spreadSpeed[0], this.animation.advancement)
      this.config.spreadSpeed[1] = mix(this.animation.from.spreadSpeed[1], this.animation.to.spreadSpeed[1], this.animation.advancement)
      this.config.spreadSpeed[2] = mix(this.animation.from.spreadSpeed[2], this.animation.to.spreadSpeed[2], this.animation.advancement)
      
    }
  }

  loadPreset(name, args) {
    this.animation = {
      from: JSON.parse(JSON.stringify(this.config)),
      to: JSON.parse(JSON.stringify(this.presets[name])),
      active: true,
      advancement: 0,
      start: this.clock.elapsedTime,
      end: this.clock.elapsedTime + args,
      duration: args
    };
  }

  /**
   * A list of pattern
   */
  registerPreset() {
    this.presets = {
      // Classic
      "default":  {
        speed: [0.0111, 0.0125, 0.0142],
        spreadSpeed: [0.333, 0.05, 0.025],
        spread: [0.2, 0.1, 0.14],
        opacity: 1
      },
      // Speed & Spread 
      "dancing": {
        speed: [0.1, 0.11, 0.12],
        spreadSpeed: [0.12, 0.12, 0.12],
        spread: [0.3, 0.3, 0.3],
        opacity: 1
      },
      // Huge spread & Opacity
      "hide": {
        speed: [0.0111, 0.0125, 0.0142],
        spreadSpeed: [0.5, 0.5, 0.5],
        spread: [2.4, 2.4, 2.4],
        opacity: 0
      }
    } 
  }
}

export default MorphPlane;
