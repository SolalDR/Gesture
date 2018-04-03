export default {

  hide: function(){
    this.lines.forEach((line)=>{
      line.classList.add("grid-bg__line--hide");
    })
  },

  show: function(){
      this.lines.forEach((line)=>{
        line.classList.remove("grid-bg__line--hide");
      })
  },

  init: function(){
    this.svg = document.querySelector("#grid-bg")
    this.lines = this.svg.querySelectorAll(".grid-bg__line");
    this.show();
    return this;
  }

}
