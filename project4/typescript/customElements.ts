class cReview extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const name = this.getAttribute("name");
    const reviewContent = this.getAttribute("reviewContent");
    const rating = this.getAttribute("rating");
    this.innerHTML = `<div>
        <h4>${name}:</h4>
        <p>- "${reviewContent}"</p>
        <h5>${rating}/5</h5>
        </div>
        `;
    }

}

customElements.define("c-review", cReview);