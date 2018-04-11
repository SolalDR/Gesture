import TimelineItem from "./TimelineItem.js";
var path = require("svg-path-properties");

class Timeline {
  /**
   * @constructor
   * @prop {Node} el : Timeline block element
   * @prop {Array} items : A list of item with attribute "name", "date", "slug"
   * @prop {SVG Element} svg : Main svg element
   * @prop {SVG Path} path : Main svg element
   * @prop {SVG PathProperty} pathProperties : Utils to used deprecated method as getPointsAtLength
   */
  constructor(el) {
    this.el = el;
    this.items = [];
    this.svg;
    this.path;
    this.pathProperties;
    this.bubblesContainer = this.el.querySelector(".timeline__bubbles");
    this.selectedItem;
    this.config = {
      dateStart: new Date("2017-09-01"),
      duration: new Date("2017-09-01").getTime() - new Date("2018-04-01").getTime()
    }
    this.initSvg();
    this.initItems();
  }

  get hidden() {
    return this.el.classList.contains('timeline--hidden');
  }

  set hidden(v) {
    this.el.classList[v ? 'add' : 'remove']('timeline--hidden');

    if(v) {
      this.items.forEach(item => {
        item.hide();
        item.hidePoint((1 - this.items.length)*2500);
      });
    }
    else this.items.forEach(item => item.showPoint(this.items.length*2500));
  }

  /**
   * Init svg elements
   */
  initSvg() {
    this.svg = this.el.querySelector("svg");
    this.path = this.svg.querySelector("path");
    this.pathProperties = path.svgPathProperties(this.path.getAttribute("d"));
  }

  /**
   * Parse raw datas and instantiate TimelineItem
   */
  initItems() {
    var datas = JSON.parse(this.el.querySelector(".timeline__data").innerHTML);
    datas.forEach(d => this.items.push(new TimelineItem(d, this)));
    window.Asap.addLinks(document.querySelector(".timeline__bubbles"));
  }

  /**
   * Return points coord at
   * @param {Float} percent [0-1]
   */
  getPointAt(percent) {
    var l = percent*this.pathProperties.getTotalLength();
    return this.pathProperties.getPointAtLength(l)
  }

  /**
   * Return coord based on the viewbox
   * @param {x: Float, y: Float} coord
   * @return {x: Float, y: Float} [0-1]
   */
  getCoordInPercent(coord) {
    return {
      x: coord.x/this.svg.viewBox.baseVal.width,
      y: coord.y/this.svg.viewBox.baseVal.height
    }
  }

  select(item) {
    if( this.selectedItem && this.selectedItem != item ) this.unselect();
    this.selectedItem = item;
    this.selectedItem.show();
  }

  unselect() {
    this.selectedItem.hide();
    this.selectedItem = null;
  }

  /**
   * Display timeline
   * @param {Object} delay
   */
  show({delay = 0} = {}) {
    if(delay) setTimeout(() => this.show(), delay);
    else this.hidden = false;
  }

  /**
   * Hide timeline
   * @param {Object} delay
   */
  hide({delay = 0} = {}) {
    if(delay) setTimeout(() => this.show(), delay);
    else this.hidden = true;
  }
}


export default Timeline;
