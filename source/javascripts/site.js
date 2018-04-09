// This is where it all goes :)
import Scene from "./webgl/Scene.js"
import GridBg from "./components/GridBg.js"
import Title from "./components/Title.js"
import Content from "./components/Content.js"
import Timeline from "./components/Timeline.js"
import Button from "./components/Button.js"
import Asap from "asap-js"

class App {

  /**
   * List of available pages
   */
  get PAGES_LIST() {
    return ["home", "timeline", "article"];
  }

  /**
   * Return the current page from the data-page attribute
   */
  get currentPage() {
    var page = this.main.querySelector("*[data-page]");
    return page ? page.getAttribute("data-page") : "home";
  }

  /**
   * Get main node and inititialize common behaviours
   */
  initElements() {
    this.main = document.querySelector("main.main");
    this.title = new Title(this.main.querySelector(".title"));
   
    if( this.currentPage == "timeline" ){
      this.timeline = new Timeline(this.main.querySelector(".timeline"));
    }

    this.contents = [];
    var contentsEl = document.querySelectorAll(".content");
    contentsEl.forEach(el => this.contents.push(new Content(el)));

    this.buttons = [];
    var buttonsEl = document.querySelectorAll(".btn");
    buttonsEl.forEach(el => this.buttons.push(new Button(el)));
  }

  /**
   * Load other backgrounds in prevision
   */
  preloadBackgrounds() {
    var pages = this.PAGES_LIST;
    pages.splice(this.PAGES_LIST.indexOf(this.currentPage), 1)
    pages.forEach(p => this.scene.plane.load(p));
  }

  /**
   * Display all the HTML elements 
   */
  displayElements(timeout = 0) {
    this.gridBg.show();
    setTimeout(()=> {
      this.scene.plane.loadPreset("default", 4);
      this.title.display();
      this.contents.forEach((content, i) => content.display({
        delay: i*400
      }));
      this.buttons.forEach((btn, i) => btn.display({
        delay: i*400 + 500
      }));
      if( this.timeline ){
        this.timeline.display({
          delay: 2000
        });
      }
    }, timeout)
  }

  hideElements() {
    this.scene.plane.loadPreset("hide", 4);
    this.title.hide();
    this.contents.forEach((content, i) => content.hide({
      delay: i*400
    }));
    this.buttons.forEach((btn, i) => btn.hide({
      delay: i*400 + 500
    }));
    if( this.timeline ){
      this.timeline.hide();
    }
  }


  load() {
    this.scene.plane.select(this.currentPage);
    this.initElements();
    this.displayElements();
  }

  beforeLoad(e) {
   
    e.preventDefault();
    this.hideElements();

    setTimeout(function(){
      e.detail.load();
    }, 2500) 
  }


  constructor(){
    this.initElements();
    this.gridBg = GridBg.init();
    document.addEventListener("asap:before-load", this.beforeLoad.bind(this));
    document.addEventListener("asap:load", this.load.bind(this));
    
    this.scene = new Scene({
      page: this.currentPage,
      onload: () => {
        this.displayElements(1000)
        this.preloadBackgrounds();
      }
    });
  }
}


window.addEventListener("load", function(){
  window.app = new App();
  Asap.start({
    sourceSelector: ".main",
   	targetSelector: ".main"
  });
})
