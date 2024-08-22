import "../LogoComponent.js";
import "../ToggleComponent/ToggleComponent.js";
import { dispatchThemeChangeEvent, getTheme,handleThemeChange  } from "../../scripts/theme.js";
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
  }

  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "/webcomponents/HeaderComponent/HeaderComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  // TODO: replace ul with a hamburger menu on mobile
  render() {
    // in case more than 1 header on the same page
    const disableThemeToggle = this.getAttribute("disable-theme-toggle") === "";
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <header>
        <div id="logo">
        <a href="/" title="home page">
          <berry-logo size="50" animate="true"></berry-logo>
        </a>
          <a href="/" title="home page"><h1>neverIand</h1></a>
        </div>
        <nav id="links">
          <ul>
            <li><a title="about" href='/articles/misc/profile.html'>about</a></li>
            <li><a title="archived articles" href="/articles/archived/index.html" title="archived articles">archived</a></li>
            <li><berry-toggle data-label="🌙" ${
              getTheme() === "light" ? "" : "data-checked"
            }></berry-toggle></li>
          </ul>
        </nav>
      </header>
  `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    if (!disableThemeToggle) {
      this.addToggleListener();
    }
  }

  addToggleListener() {
    const toggle = this.shadowRoot.querySelector("berry-toggle");
    if (!toggle) {
      return;
    }
    toggle.addEventListener("click", () => {
      dispatchThemeChangeEvent();
    });
  }
}

if (!customElements.get("berry-header")) {
  customElements.define("berry-header", CustomHeader);
}

export default CustomHeader;
