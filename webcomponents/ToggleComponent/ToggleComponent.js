import { fetchData } from "/scripts/fetchData.js";

class ToggleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <style>
    :host {
        border: 1px solid red;
    }
    </style>
    <div>

    </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-toggle")) {
  customElements.define("berry-toggle", ToggleComponent);
}

export default ToggleComponent;
