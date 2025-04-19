import { handleThemeChange } from "/scripts/theme.js";

const CSS = `
:host {
  display: block;
}
`;

const templateStyles = new CSSStyleSheet();
templateStyles.replaceSync(CSS);

class TemplateComponent extends HTMLElement {
  constructor() {
    super();
    const sr = this.attachShadow({
      mode: "open",
    });
    if ("adoptedStyleSheets" in sr) {
      sr.adoptedStyleSheets = [templateStyles];
    } else {
      const style = document.createElement("style");
      style.textContent = headerStyles.cssText || CSS;
      sr.appendChild(style);
    }
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
