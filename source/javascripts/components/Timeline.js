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
   * @prop {HTML Node} date : Date indicator at center of timeline
   */
  constructor(el) {
    this.el = el;
    this.items = [];
    this.svg;
    this.path;
    this.pathProperties;
    this.bubblesContainer = this.el.querySelector(".timeline__bubbles");
    this.date = this.el.querySelector(".timeline__date");
    this.selectedItem;
    this.speed = 0;

    this.config = {
      dateStart: new Date("2017-09-01"),
      dateEnd: new Date("2018-03-20"),
      dateDiff: null,
      duration: new Date("2017-01-01").getTime() - new Date("2017-03-01").getTime()
    }
    this.config.dateDiff = new Date("2018-04-01").getTime() - new Date("2017-09-01").getTime();
    this.currentDate = new Date(this.config.dateStart.getTime());
    this.updateDate();

    this.initSvg();
    this.initItems();
    this.initEvents();
  }

  /**
   * Init Events
   */
  initEvents() {
    this.wheel = { current: 0, speed: 0 }
    document.body.addEventListener("wheel", (event) => {
      if( this.wheel.speed === 0 ) requestAnimationFrame(this.updateSpeedWheel.bind(this));

      this.wheel.speed = event.deltaY > 0 ? Math.min(2, event.deltaY) : Math.max(-2, event.deltaY);
      this.items.forEach(i => i.hide());
    })
  }

  get hidden() {
    return this.el.classList.contains('timeline--hidden');
  }

  set hidden(v) {
    this.date.classList[v ? 'add' : 'remove']("timeline__date--hidden");
    this.el.classList[v ? 'add' : 'remove']('timeline--hidden');

    if(v) {
      this.items.forEach(item => {
        item.hide();
        item.hidePoint({delay: (1 - item.length)*2500});
      });
    }
    else this.items.forEach(item => item.showPoint({delay: item.length*2500}));
  }

  updateDate() {
    var dd = (this.currentDate.getDate() < 10 ? '0' : '') + this.currentDate.getDate();
    var MM = ((this.currentDate.getMonth() + 1) < 10 ? '0' : '') + (this.currentDate.getMonth() + 1);
    var yyyy = this.currentDate.getFullYear();
    this.date.innerHTML = `<span class="timeline__date-line">${dd}.${MM}</span><span class="timeline__date-line">${yyyy}</span>`
  }

  /**
   * Raf
   */
  updateSpeedWheel(){
    var deltaDate = this.wheel.speed*1000*60*60*10;
    if( deltaDate ){
      this.currentDate.setTime(this.currentDate.getTime() + deltaDate);
      if(this.currentDate.getTime() < this.config.dateStart.getTime() ) {
        this.currentDate.setTime(this.config.dateStart.getTime());
      }
      if(this.currentDate.getTime() > this.config.dateEnd.getTime() ) {
        this.currentDate.setTime(this.config.dateEnd.getTime());
      }

      this.updateDate();
      this.items.forEach(i => i.updatePosition());

      this.wheel.speed = 0;
      requestAnimationFrame(this.updateSpeedWheel.bind(this));
    }
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
