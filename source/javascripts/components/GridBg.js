export default {
  hide: function(){
    if( !this.display ) return;
    this.lines.forEach((line)=>{
      line.classList.add("grid-bg__line--hide");
    })
    this.display = false;
  },

  show: function(){
    if( this.display ) return;
    this.lines.forEach((line)=>{
      line.classList.remove("grid-bg__line--hide");
    })
    this.display = true;
  },

  init: function(){
    this.display = false;
    this.svg = document.querySelector("#grid-bg")
    this.lines = this.svg.querySelectorAll(".grid-bg__line");
    return this;
  }
}
