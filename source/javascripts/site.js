// This is where it all goes :)
import Scene from "./webgl/Scene.js"
import GridBg from "./GridBg.js"


class App {
  constructor(){
    this.scene = new Scene();
    this.gridBg = GridBg.init();
  }
}


window.addEventListener("load", function(){
  new App();
  
})
