// This is where it all goes :)
import Asap from "asap-js"
window.Asap = Asap;

import Scene from "./webgl/Scene.js"
import GridBg from "./components/GridBg.js"
import Title from "./components/Title.js"
import Content from "./components/Content.js"
import Timeline from "./components/Timeline.js"
import Button from "./components/Button.js"
import Article from "./components/Article.js"

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

    if( this.currentPage === "timeline" ){
      this.timeline = new Timeline(this.main.querySelector(".timeline"));
    }

    if( this.currentPage === 'article' ){
      this.article = new Article(this.main.querySelector('.article'));
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
   * Shows all the HTML elements
   */
  showElements(timeout = 0) {
    this.gridBg.show();
    setTimeout(()=> {
      this.scene.plane.loadPreset("default", 4);
      this.title.show();
      if(this.article) this.article.show();
      this.contents.forEach((content, i) => content.show({
        delay: i*400
      }));
      this.buttons.forEach((btn, i) => btn.show({
        delay: i*400 + 500
      }));
      if( this.timeline ){
        this.timeline.show({
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
    this.showElements();
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
        this.showElements(1000)
        this.preloadBackgrounds();
      }
    });
  }
}

window.addEventListener("load", function(){
  Asap.start({
    sourceSelector: ".main",
   	targetSelector: ".main"
  });

  window.app = new App();

})
