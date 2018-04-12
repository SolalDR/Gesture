class BackButton {
  constructor(element){
    this.element = element;
  }

  get hidden() {
    return this.element.classList.contains('back-btn--hidden');
  }

  set hidden(v) {
    this.element.classList[v ? 'add' : 'remove']('back-btn--hidden');
  }

  get available() {
    return !!this.element;
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

export default BackButton;
