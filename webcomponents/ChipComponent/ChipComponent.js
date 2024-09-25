import { handleThemeChange } from "/scripts/theme.js";
class ChipComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <div>
    chip
    </div>
`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-chip")) {
  customElements.define("berry-chip", ChipComponent);
}

export default ChipComponent;
