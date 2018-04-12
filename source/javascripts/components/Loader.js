class Loader {
  constructor() {
    this.element = document.querySelector("loader");
  }

  hide() {
    this.element.classList.add("loader--hidding");
    setTimeout(()=>{
      this.element.classList.add("loader--hidden")
    }, 600)
  }
}
