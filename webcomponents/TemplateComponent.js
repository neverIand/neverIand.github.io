import { handleThemeChange } from "/scripts/theme.js";
import { attachShadowStylesheet } from "/scripts/style-utils.js";

class TemplateComponent extends HTMLElement {
  constructor() {
    super();
    const sr = this.attachShadow({
      mode: "open",
    });
    attachShadowStylesheet(
      sr,
      new URL("./TemplateComponent.css", import.meta.url).href
    );
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
        hello world
      </div>
    `;
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
  }
}

if (!customElements.get("berry-template")) {
  customElements.define("berry-template", TemplateComponent);
}

export default TemplateComponent;
