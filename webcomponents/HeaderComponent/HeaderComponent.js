import {
  dispatchThemeChangeEvent,
  getTheme,
  handleThemeChange,
} from "../../scripts/theme.js";
import "../LogoComponent.js";
import "../ToggleComponent/ToggleComponent.js";

const CSS = `
  :host {
    display: block;
    --header-height: 60px;
    background: var(--header-bg-color, white);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
    padding: 0 1em;
    height: var(--header-height);
  }
  #logo {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  #links ul {
    display: flex;
    gap: 1em;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  #links ul > li {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #logo > a,
  #links a {
    color: var(--text-color);
    text-decoration: none;
  }
  #logo > a:hover,
  #links a:hover {
    text-decoration: underline;
  }
  #menu-toggle { display: none; }
  .menu-icon {
    display: none;
    width: 30px;
    height: 24px;
    flex-shrink: 0;
    cursor: pointer;
    position: relative;
  }
  .menu-icon span,
  .menu-icon span::before,
  .menu-icon span::after {
    content: "";
    display: block;
    width: 100%;
    height: 3px;
    background: var(--text-color);
    border-radius: 2px;
    position: absolute;
  }
  .menu-icon span::before { top: 8px; }
  .menu-icon span::after  { top: 16px; }
  .nav-menu { display: flex; gap: 1em; }
  @media (max-width: 768px) {
    header h1 { display: none; } /* hide title */
    .menu-icon { display: block; }
    .nav-menu {
      display: none;
      position: absolute;
      top: var(--header-height);
      right: 0;
      background: var(--bg-color, white);
      flex-direction: column;
      padding: 1em;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    #menu-toggle:checked ~ .nav-menu {
      display: flex;
    }
    #menu-toggle:checked ~ .nav-menu ul {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
  }
`;

// Constructable Stylesheet supported?
const canConstruct =
  typeof CSSStyleSheet !== "undefined" &&
  typeof CSSStyleSheet.prototype.replaceSync === "function";

// adoptedStyleSheets supported?
const canAdopt =
  typeof ShadowRoot !== "undefined" &&
  "adoptedStyleSheets" in ShadowRoot.prototype;

let sharedSheet;
if (canConstruct) {
  sharedSheet = new CSSStyleSheet();
  sharedSheet.replaceSync(CSS);
}

class CustomHeader extends HTMLElement {
  constructor() {
    super();
    const sr = this.attachShadow({ mode: "open" });
    if (canAdopt && sharedSheet) {
      // Modern browsers (Chrome, Firefox, Safari 16.4+, iOS 16.4+)
      sr.adoptedStyleSheets = [sharedSheet];
    } else {
      // Fallback for iOS 15 and older: inject a <style> tag
      const styleEl = document.createElement("style");
      styleEl.textContent = CSS;
      sr.appendChild(styleEl);
    }
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
          <a href="/" title="home"><h1>neverIand</h1></a>
        </div>
        <input type="checkbox" id="menu-toggle">
        <label for="menu-toggle" class="menu-icon" aria-label="Toggle navigation">
          <span></span>
        </label>
        <nav id="links" class="nav-menu">
          <ul>
            <li><a href="/articles/misc/profile.html">about</a></li>
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
