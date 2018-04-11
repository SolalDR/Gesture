class Article {
  constructor(element) {
    this.element = element;
  }

  get hidden() {
    return this.element.classList.contains('article--hidden');
  }

  set hidden(v) {
    this.element.classList[v ? 'add' : 'remove']('article--hidden');
  }

  show() {
    this.hidden = false;
  }

  hide() {
    this.hidden = true;
  }
}

export default Article;
