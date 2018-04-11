class Title {
  constructor(element) {
    this.element = element;
    this.crops = this.element.querySelectorAll('.title__crop');
  }

  get hidden() {
    return this._hidden;
  }

  set hidden(v) {
    this._hidden = !!v;
    var method = this.hidden ? 'add' : 'remove';
    this.crops.forEach(crop => crop.classList[method]('title__crop--hidden'))
  }

  show({delay = 0} = {}) {
    console.log("Show",  this);
    if(delay) setTimeout(() => this.show(), delay)
    else this.hidden = false;
  }

  hide({delay = 0} = {}) {
    console.log("Hide",  this);
    if(delay) setTimeout(() => this.hide(), delay)
    else this.hidden = true;
  }
}

export default Title;
