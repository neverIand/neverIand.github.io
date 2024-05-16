import "../LogoComponent.js";
import "../ToggleComponent/ToggleComponent.js";

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
    this.addToggleListener();
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
        <a href="/">
          <berry-logo size="50" animate="false"></berry-logo>
        </a>
          <a href="/"><h1>neverIand</h1></a>
        </div>
        <div id="links">
          <ul>
            <li><a href='/articles/misc/profile.html'>about</a></li>
            <li><a href="/articles/archived/index.html" title="archived articles">archived</a></li>
            <!--<li><berry-toggle data-label="🌙"></berry-toggle></li>-->
          </ul>
        </div>
      </header>
  `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  addToggleListener() {
    const toggle = this.shadowRoot.querySelector("berry-toggle");
    if (!toggle) {
      return;
    }

  }
}

if (!customElements.get("berry-header")) {
  customElements.define("berry-header", CustomHeader);
}

export default CustomHeader;
