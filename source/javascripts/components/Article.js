class Article {
  constructor(element){
    this.element = element;
    this.backBtn = document.querySelector(".article__back-btn");
  }

  get hidden() {
    return this.element.classList.contains('article--hidden');
  }

  set hidden(v) {
    this.element.classList[v ? 'add' : 'remove']('article--hidden');
    this.backBtn.classList[v ? 'add' : 'remove']('article__back-btn--hidden');
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
export default Article;
