class TimelineItem {
  /**
   * @constructor
   * @param {name: String, slug: String, date: String} datas : JSON datas of a single item
   * @param {*} timeline : Timeline's reference
   * @prop {String} length : [0-1] part in the timeline
   */
  constructor(datas, timeline) {
    this.timeline = timeline;
    this.name = datas.name;
    this.slug = datas.slug;
    this.length = 0;
    this.date = new Date(datas.date);

    this.generateBubble();
    this.generateSvg();
    this.initEvents();
  }

  /**
   * Return the date formated for displaying
   */
  get dateFormated() {
    var dd = (this.date.getDate() < 10 ? '0' : '') + this.date.getDate();
    var MM = ((this.date.getMonth() + 1) < 10 ? '0' : '') + (this.date.getMonth() + 1);
    var yyyy = this.date.getFullYear();
    return (dd + "-" + MM + "-" + yyyy);
  }


  /**
   * Compute position in svg
   * @return (NULL || {x: Float, y: Float})
   */
  get position() {
    //this.timeline.config.duration
    if( this.date.getTime() > this.timeline.currentDate.getTime() ){
      var diff = this.timeline.currentDate.getTime() - this.date.getTime();
      this.length = diff/this.timeline.config.duration;
      if(length < 1){
        this._position = this.timeline.getPointAt(this.length);
        return this._position;
      }
    }
    this._position = null;
    return null;
  }

  get hidden() {
    return this.bubble.classList.contains('timeline__bubble--hidden');
  }

  set hidden(v) {
    this.bubble.classList[v ? 'add' : 'remove']('timeline__bubble--hidden');
  }

  get pointHidden() {
    return this.point.classList.contains('timeline__point--hidden');
  }

  set pointHidden(v) {
    this.point.classList[v ? 'add' : 'remove']('timeline__point--hidden');
  }

  /**
   * Setup mouseenter & mouseleave events
   */
  initEvents() {
    this.point.addEventListener("mouseenter", ()=>{
      this.timeline.select(this);
    })
  }

  /**
   * Generate HTML SVG Point
   */
  generateSvg() {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", 10);
    circle.setAttribute("class", "timeline__point timeline__point--hidden");
    circle.setAttribute("id", "circle-"+this.slug);
    circle.setAttribute("transform", "circle-"+this.slug);

    this.point = circle;
    this.updatePosition();
    this.hidePoint();
    this.timeline.svg.appendChild(this.point);
  }

  /**
   * Generate HTML for a bubble
   */
  generateBubble() {
    var proto = `<a href="/timeline/${this.slug}/" class="timeline__bubble timeline__bubble--hidden">
        <p class="timeline__bubble-title">${this.name}</p>
        <p class="timeline__bubble-date">${this.dateFormated}</p>
      </a>`
    var container = document.createElement("fragment");
    container.innerHTML = proto;
    this.bubble = container.firstChild;
    this.timeline.bubblesContainer.appendChild(this.bubble);
  }

  updatePosition() {
    var p = this.position;
    if(p !== null ) {
      this.point.setAttribute("cx", p.x);
      this.point.setAttribute("cy", p.y);
      p.x -= 10;
      p.y += 5;
      var origin = this.timeline.getCoordInPercent(p);
      this.point.style.transformOrigin = `${origin.x*100}% ${origin.y*100}%`;
      this.bubble.style["top"] = origin.y*100 + "%"
      this.bubble.style["left"] = origin.x*100 + "%"

      if( this.pointHidden ) this.showPoint();
      if( this.length > 1) this.hidePoint();

    } else {
      this.hidePoint();
      this.hide();
    }
  }

  showPoint({delay = 0} = {}) {
    if(delay) setTimeout(() => this.showPoint(), delay)
    else this.pointHidden = false;
  }

  hidePoint({delay = 0} = {}) {
    if(delay) setTimeout(() => this.hidePoint(), delay)
    else this.pointHidden = true;
  }

  show({delay = 0} = {}) {
    if(delay) setTimeout(() => this.show(), delay)
    else this.hidden = false;
  }

  hide({delay = 0} = {}) {
    if(delay) setTimeout(() => this.hide(), delay)
    else this.hidden = true;
  }
}

export default TimelineItem;
