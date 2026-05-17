class projectExample extends HTMLElement {
    constructor() {
        super();
        const title = this.getAttribute("title");
        const description = this.getAttribute("image-alt");
        const link = this.getAttribute("link");
        const imageSrc = this.getAttribute("image-src");
        const imageAlt = this.getAttribute("image-alt");

        this.outerHTML = `
                <div>
                    <h3>${title}</h3>
                    <a href="${link}" target="_blank">
                    
                        <img
                        class="bakground"
                            src="${imageSrc}"
                            alt="${imageAlt}"
                        />
                        <img
                            src="${imageSrc}"
                            alt="${imageAlt}"
                            />
                            <span class ="description">
                            ${description}
                            </span>
                    </a>
                </div>`;
    }
}

customElements.define("project-example", projectExample);
