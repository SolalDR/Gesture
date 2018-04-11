export default {
  get hidden() {
    return this._hidden;
  },

  set hidden(v) {
    v = !!v;

    if(v !== this.hidden) {
      this._hidden = v;
      var method = v ? 'add' : 'remove';
      this.lines.forEach(line => line.classList[method]('grid-bg__line--hidden'));
    }
  },

  show({delay = 0} = {}) {
    if(delay) setTimeout(() => this.show(), delay);
    else this.hidden = false;
  },

  hide({delay = 0} = {}) {
    if(delay) setTimeout(() => this.hide(), delay);
    else this.hidden = true;
  },

  init: function() {
    this._hidden = true;
    this.svg = document.querySelector('#grid-bg')
    this.lines = this.svg.querySelectorAll('.grid-bg__line');

    return this;
  }
}
