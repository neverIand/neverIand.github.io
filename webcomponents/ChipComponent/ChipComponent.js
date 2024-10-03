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
    const variant = this.getAttribute("variant");
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <div title="${label}">${label}</div>
`;
    // TODO: hover state
    // TODO: default CSS variable
    this.styles = document.createElement("style");
    this.styles.innerHTML = `
    :host{
      display: flex;
    }
    div{
      padding: 2px 12px;
      font-size: 0.8em;
      font-family: ${variant === "code" ? "var(--code-font)" : "inherit"};
      color: var(--text-color);
      background-color: var(--chip-color);
      border-radius: 9999px;
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
