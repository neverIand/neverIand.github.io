import {
  dispatchThemeChangeEvent,
  getTheme,
  handleThemeChange,
} from "../../scripts/theme.js";
import { attachShadowStylesheet } from "/scripts/style-utils.js";
import "../LogoComponent.js";
import "../ToggleComponent/ToggleComponent.js";

class CustomHeader extends HTMLElement {
  constructor() {
    super();
    const sr = this.attachShadow({ mode: "open" });
    attachShadowStylesheet(
      sr,
      new URL("./HeaderComponent.css", import.meta.url).href
    );
    // this.setAttribute("data-theme", getTheme()); // for iOS 15
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const disableToggle = this.hasAttribute("disable-theme-toggle");
    const tpl = document.createElement("template");
    tpl.innerHTML = `
      <header>
        <div id="logo">
          <a href="/" title="home"><berry-logo size="50"></berry-logo></a>
          <a href="/" title="home"><h1></h1></a>
        </div>
        <input type="checkbox" id="menu-toggle">
        <label for="menu-toggle" class="menu-icon" aria-label="Toggle navigation">
          <span></span>
        </label>
        <nav id="links" class="nav-menu">
          <ul>
            <li><a href="/articles/archived/index.html">archived</a></li>
            <li><berry-toggle data-label="🌙" ${
              getTheme() === "dark" ? "data-checked" : ""
            }></berry-toggle></li>
          </ul>
        </nav>
      </header>
    `;
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
    if (!disableToggle) this.addThemeListener();
  }

  addThemeListener() {
    const toggle = this.shadowRoot.querySelector("berry-toggle");
    if (toggle)
      toggle.addEventListener("click", () => dispatchThemeChangeEvent());
  }
}

if (!customElements.get("berry-header")) {
  customElements.define("berry-header", CustomHeader);
}

export default CustomHeader;
