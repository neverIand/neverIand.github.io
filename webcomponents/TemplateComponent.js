import { handleThemeChange } from "/scripts/theme.js";

const CSS = `
:host {
  display: block;
}
`;

const canConstruct =
  typeof CSSStyleSheet !== "undefined" &&
  typeof CSSStyleSheet.prototype.replaceSync === "function";

const canAdopt =
  typeof ShadowRoot !== "undefined" &&
  "adoptedStyleSheets" in ShadowRoot.prototype;

let sharedSheet;
if (canConstruct) {
  sharedSheet = new CSSStyleSheet();
  sharedSheet.replaceSync(CSS);
}

class TemplateComponent extends HTMLElement {
  constructor() {
    super();
    const sr = this.attachShadow({
      mode: "open",
    });
    if (canAdopt && sharedSheet) {
      sr.adoptedStyleSheets = [sharedSheet];
    } else {
      const styleEl = document.createElement("style");
      styleEl.textContent = CSS;
      sr.appendChild(styleEl);
    }
    // this.setAttribute("data-theme", getTheme()); 
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const tpl = document.createElement("template");
    tpl.innerHTML = `
      <div>
      </div>
    `;
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }
}

if (!customElements.get("berry-template")) {
  customElements.define("berry-template", TemplateComponent);
}

export default TemplateComponent;
