class CustomDisclaimer extends HTMLElement {
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

  // TODO? a shared css for components that conatins all variables
  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "/webcomponents/DisclaimerComponent/DisclaimerComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  render() {
    // Create and append the footer template
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <div id="disclaimer">
        <div class="header">
          <!-- icon by ChatGPT -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L1 21h22L12 2z" fill="#FFCC00" stroke="#000000" stroke-width="2"/>
            <path d="M11 9h2v5h-2V9zm0 6h2v2h-2v-2z" fill="#000000"/>
          </svg>
          <h2>Disclaimer</h2>
        </div>
        <div class="content">
          <p><slot name="disclaimer-text">Some of the content in this article could be outdated as it has been archived.</slot></p>
        </div>
      </div>
  `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-disclaimer")) {
  customElements.define("berry-disclaimer", CustomDisclaimer);
}

export default CustomDisclaimer;
