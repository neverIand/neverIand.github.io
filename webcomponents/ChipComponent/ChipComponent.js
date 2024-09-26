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

  // TODO? clickable option
  render() {
    const label = this.getAttribute("data-label") || "";
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <span title="${label}">${label}</span>
`;
    // TODO: hover state
    this.styles = document.createElement("style");
    this.styles.innerHTML = `
    :host{
      display: inline-block;
    }
    span{
      margin: 0 4px;
      padding: 0 8px;
      color: white;
      background-color: rgb(100, 100, 100);
      border-radius: 4px;
      cursor: default;
    }
    `;

    this.shadowRoot.appendChild(this.styles.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-chip")) {
  customElements.define("berry-chip", ChipComponent);
}

export default ChipComponent;
