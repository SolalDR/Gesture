class Title {
  constructor(el) {
    if( el && el.className.match("title") ) {
      this.el = el;
      this.crops = this.el.querySelectorAll(".title__crop");
    }
  }

  display() {
    if( this.crops ) this.crops.forEach(title => title.classList.remove("title__crop--hide"));
  }

  hide() {
    if( this.crops ) this.crops.forEach(title => title.classList.add("title__crop--hide"));
  }
}

export default Title;
