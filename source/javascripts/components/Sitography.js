class Sitography {
  constructor(element){
    this.element = element;
  }

  get hidden() {
    return this.element.classList.contains('sitography--hidden');
  }

  set hidden(v) {
    this.element.classList[v ? 'add' : 'remove']('sitography--hidden');
  }

  show({delay = 0} = {}) {
    if(delay) setTimeout(() => this.show(), delay);
    else this.hidden = false;
  }

  hide({delay = 0} = {}) {
    if(delay) setTimeout(() => this.hide(), delay);
    else this.hidden = true;
  }
}

export default Sitography;
