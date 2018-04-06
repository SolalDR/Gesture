class Content {
  
  constructor(el, args) {
    if( el && el.className.match("content") ) {
      this.el = el; 
    }
  }

  display(args) {
    if( !args ) var args = { delay: 0 };
    if( args.delay > 0 ) {
      setTimeout(() => this.display(), args.delay);
      return; 
    }
    this.el.classList.remove("content--hide");
  }

  hide(args) {
    if( !args ) var args = { delay: 0 };
    if( args.delay > 0 ) {
      setTimeout(() => this.hide(), args.delay);
      return; 
    }
    this.el.classList.add("content--hide");
  }

}


export default Content;
