import "../LogoComponent.js";

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
      "/webcomponents/HeaderComponent/HeaderComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  // TODO: add data-theme
  // TODO: replace ul with a hamburger menu
  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <header>
        <div id="logo">
          <berry-logo size="50" animate="false"></berry-logo>
          <a href="/"><h1>neverIand</h1></a>
        </div>
        <div id="links">
          <ul>
            <li><a href='/articles/misc/profile.html'>profile</a></li>
            <li><a href="/articles/archived/index.html" title="archived articles">archived</a></li>
          </ul>
        </div>
      </header>
  `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-header")) {
  customElements.define("berry-header", CustomHeader);
}

export default CustomHeader;
