class TimelineItem {
  
  /**
   * @constructor 
   * @param {name: String, slug: String, date: String} datas : JSON datas of a single item  
   * @param {*} timeline : Timeline's reference
   */
  constructor(datas, timeline) {
    this.timeline = timeline;
    this.name = datas.name; 
    this.slug = datas.slug; 
    this.date = new Date(datas.date); 

    this.genBubble();
    this.genSvg();
    this.displayMarker();
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
    if( this.date.getTime() > this.timeline.config.dateStart.getTime() ){
      var diff = this.timeline.config.dateStart.getTime() - this.date.getTime();
      var length = diff/this.timeline.config.duration; 
      if(length < 1){
        this._position = this.timeline.getPointAt(length);
        return this._position;
      }
    }
    this._position = null;
    return null;
  }

  /**
   * Setup mouseenter & mouseleave events
   */
  initEvents() {
    this.marker.addEventListener("mouseenter", ()=>{
      this.timeline.select(this);
    })
  }

  /**
   * Generate HTML SVG Marker
   */
  genSvg() {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", 10);
    circle.setAttribute("class", "timeline__point timeline__point--hide"); 
    circle.setAttribute("id", "circle-"+this.slug);
    circle.setAttribute("transform", "circle-"+this.slug);

    this.marker = circle; 
    this.updatePosition();
    this.timeline.svg.appendChild(this.marker);
  }

  /**
   * Generate HTML for a bubble
   */
  genBubble() {
    var proto = `<a href="/timeline/${this.slug}/" class="timeline__bubble timeline__bubble--hide">
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
    this.marker.setAttribute("cx", p.x);
    this.marker.setAttribute("cy", p.y);
    var origin = this.timeline.getCoordInPercent(p);
    this.marker.style.transformOrigin = `${origin.x*100}% ${origin.y*100}%`;
    this.bubble.style["top"] = origin.y*100 + "%"
    this.bubble.style["left"] = origin.x*100 + "%"
  }

  displayMarker(){
    this.marker.classList.remove("timeline__point--hide");
  }

  hideMarker() {
    this.marker.classList.add("timeline__point--hide");
  }

  display(){
    this.bubble.classList.remove("timeline__bubble--hide")
  }

  hide() {
    this.bubble.classList.add("timeline__bubble--hide")
  }

}

export default TimelineItem;
