class CustomHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
  }

  connectedCallback() {
    this.render();
  }

  // TODO: add data-theme
  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "../../webcomponents/HeaderComponent/HeaderComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  // TODO: add data-theme
  render() {
    // Create and append the footer template
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <header>
        <div id="logo">
            <slot name="logo">neverIand.github.io</slot>
        </div>
        <a href="."><h1>neveriand.github.io</h1></a>
      </header>
  `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-header")) {
  customElements.define("berry-header", CustomHeader);
}

export default CustomHeader;
