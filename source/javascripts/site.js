// This is where it all goes :)
import Scene from "./webgl/Scene.js"
import GridBg from "./components/GridBg.js"
import Title from "./components/Title.js"


class App {

  /**
   * Get main node and inititialize common behaviours
   */
  init() {
    this.main = document.querySelector("main.main");
    this.title = new Title(this.main.querySelector(".title"));
  }

  constructor(){
    this.scene = new Scene();
    this.gridBg = GridBg.init();
    this.init();
  }
}


window.addEventListener("load", function(){
  window.app = new App();
})
