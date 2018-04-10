import fragmentShader from "./shaders/morph_plane.frag"
import vertexShader from "./shaders/morph_plane.vert"


class MorphPlane {
  /**
   * Register attributes & launch initialization
   * @constructor
   * @prop {THREE.Clock} clock : THREE.js timer
   * @prop {DatGui} gui : Dat.GUI Controller
   * @prop {Function} regl : REGL Constructor
   * @prop {Array} textures : List of all textures loaded
   * @prop {Array} presets : List of presets
   * @prop {REGL.Texture} noise : Noise texture
   * @prop {Object} preset : Current preset
   * @prop {Object} animation : Used to create animation between two preset
   */
  constructor(args) {
    this.clock = args.clock;
    this.regl = args.regl;
    this.textures = {};
    this.presets = [];
    this.scene = args.scene;

    this.noise = null;
    this.texture = null;
    this.preset = null;
    this.animation = null;

    this.init(args.page);
    this.initGui(args.gui);
  }

  getUrl(pageName) {
    return 'images/backgrounds/bg_' + pageName + '.jpg';
  }

  /**
   * First initialization
   */
  init(page) {
    this.registerPreset();
    this.loadPreset("hide");

    // Load noise
    var noise = new Image();
    noise.src = 'images/noise_3d.jpg';

    noise.onload = ()=>{
      this.noise = this.regl.texture(noise);
      // Load first background
      this.load(page, (texture)=>{
        this.select(page);
        this.scene.onload.call(this.scene)
      });
    }
  }

  select(page){
    this.texture = this.textures[page] ? this.textures[page] : this.textures["home"];
    this.registerCommand();
  }

  /**
   * Load an image asynchronously and add it to the textures
   * @param {String} src : Image path
   * @param {String} name : Name (used as id)
   * @param {Function} callback : function executed when image is ready
   */
  load(name, callback ) {
    // If a texture with this name already exist
    if( this.textures[name] ) {
      if( callback ) callback.call(this, this.textures[name]);
      return;
    }

    // Else
    var image = new Image();
    image.src = this.getUrl(name);
    image.onload = () => {
      // Set texture from image and save it
      var texture = this.regl.texture(image);
      this.textures[name] = texture
      if(callback) callback.call(this, texture);
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
      //blend: { enable: true, func: { src: 'src alpha', dst: 'one minus src alpha' }},

      // Params
      uniforms: {
        speed: () => { return this.preset.speed },
        spread: () => { return this.preset.spread },
        spreadSpeed: () => { return this.preset.spreadSpeed },
        opacity: () => { return this.preset.opacity },
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
   * @param {Dat.GUI} gui
   */
  initGui(gui){
    var folder = gui.addFolder('Fragment');
    folder.add(this.preset.speed, 0).name("Speed Red")
    folder.add(this.preset.speed, 1).name("Speed Green")
    folder.add(this.preset.speed, 2).name("Speed Blue")

    folder.add(this.preset.spread, 0).name("Spread Red")
    folder.add(this.preset.spread, 1).name("Spread Green")
    folder.add(this.preset.spread, 2).name("Spread Blue")

    folder.add(this.preset.spreadSpeed, 0).name("SpeedS Red")
    folder.add(this.preset.spreadSpeed, 1).name("SpeedS Green")
    folder.add(this.preset.spreadSpeed, 2).name("SpeedS Blue")
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
      this.animation.advancement =(this.clock.elapsedTime - this.animation.start) / this.animation.duration

      if( this.animation.advancement >= 1 ){
        this.animation.active = false;
        this.animation.advancement = 1;
      }

      this.animation.advancement = easeInOut(this.animation.advancement);

      this.preset.opacity = mix(this.animation.from.opacity, this.animation.to.opacity, this.animation.advancement)

      this.preset.spread[0] = mix(this.animation.from.spread[0], this.animation.to.spread[0], this.animation.advancement)
      this.preset.spread[1] = mix(this.animation.from.spread[1], this.animation.to.spread[1], this.animation.advancement)
      this.preset.spread[2] = mix(this.animation.from.spread[2], this.animation.to.spread[2], this.animation.advancement)

      this.preset.spreadSpeed[0] = mix(this.animation.from.spreadSpeed[0], this.animation.to.spreadSpeed[0], this.animation.advancement)
      this.preset.spreadSpeed[1] = mix(this.animation.from.spreadSpeed[1], this.animation.to.spreadSpeed[1], this.animation.advancement)
      this.preset.spreadSpeed[2] = mix(this.animation.from.spreadSpeed[2], this.animation.to.spreadSpeed[2], this.animation.advancement)

    }
  }

  /**
   * Load a preset, set an animation if needed
   * @param {String} name
   * @param {Float} duration
   * @param {Function} callback
   */
  loadPreset(name, duration = null, callback = null) {
    if( !this.presets[name] ) {
      console.warn(`Preset "${name}" don't exist.`);
      return;
    }

    var p = this.presets[name];
    var preset =  p[0] ? p[Math.floor(p.length*Math.random())] : p;
    console.log(preset);
    if( duration ){

      this.animation = {
        from: JSON.parse(JSON.stringify(this.preset)),
        to: JSON.parse(JSON.stringify(preset)),
        active: true,
        advancement: 0,
        start: this.clock.elapsedTime,
        end: this.clock.elapsedTime + duration,
        duration: duration,
        callback: callback ? callback : null
      };

    } else {
      this.preset = JSON.parse(JSON.stringify(preset))
    }

    return this.preset;
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
      "hide": [
        {
          speed: [0.0111, 0.0125, 0.0142],
          spreadSpeed: [0.5, 0.5, 0.5],
          spread: [2.4, 2.4, 2.4],
          opacity: 0
        },
        {
          speed: [0.0142, 0.0111, 0.0125],
          spreadSpeed: [0.4, 0.6, 0.4],
          spread: [-2.4, 2.4, -2.4],
          opacity: 0
        },
        {
          speed: [0.0125, 0.0142, 0.0111],
          spreadSpeed: [0.5, 0.4, 0.6],
          spread: [2.4, -2.4, -2.4],
          opacity: 0
        }
      ]
    }
  }
}

export default MorphPlane;
