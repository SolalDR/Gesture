class Title {
  constructor(el) {
    if( el && el.className.match("title") ) {
      this.el = el;
      this.crops = this.el.querySelectorAll(".title__crop");
    }

  }

  display() {
    console.log("Display",  this);
    if( this.crops ) this.crops.forEach(title => title.classList.remove("title__crop--hide"));
  }

  hide() {
    console.log("Hide",  this);
    if( this.crops ) this.crops.forEach(title => title.classList.add("title__crop--hide"));
  }
}

export default Title;
