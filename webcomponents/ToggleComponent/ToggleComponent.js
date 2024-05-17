class ToggleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
  }

  connectedCallback() {
    this.render();
    this.addClickListener();
  }

  // TODO: listen for theme-change event
  render() {
    const size = this.getAttribute("data-size") || "50px";
    const label = this.getAttribute("data-label") || "";
    const checked = this.getAttribute("data-checked") === "";
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <style>
    :host {
      --btn-width: ${size};
      --btn-height: calc(var(--btn-width) * 0.6);
      --toggle-diameter: calc(var(--btn-width) * 0.5);
      --toggle-shadow-offset: calc(var(--btn-width) * 0.02);
      --toggle-wide: calc(var(--toggle-diameter) * 1.2);
      --color-grey: #E9E9EA;
      --color-dark-grey: #39393D;
      --color-green: #30D158;
      --color-purple: rgb(121,0,142);
    }
    span {
      display: inline-block;
      position: relative;
      width: var(--btn-width);
      height: var(--btn-height);
      background-color: var(--color-grey);
      border: 1px solid var(--color-dark-grey);
      transition: .3s all ease-in-out;
      cursor: pointer;
    }
    span::after {
      position: absolute;
      top: 0;
      content: '${label}';
      display: inline-block;
      width: var(--toggle-diameter);
      height: var(--btn-height);
      background-color: #fff;
      transform: translateX(0px);
      box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.5);
      transition: .3s all ease-in-out;
    }
    input[type="checkbox"]:checked+span {
      background-color: var(--color-purple);
    }
    input[type="checkbox"]:checked + span::after {
      transform: translateX(calc(var(--btn-width) - var(--toggle-diameter)));
      box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.5);
    }
    input[type="checkbox"]:active + span::after {
      width: var(--toggle-wide);
    }
    input[type="checkbox"]:checked:active + span::after {
      transform: translateX(calc(var(--btn-width) - var(--toggle-wide)));
    }
    input[type="checkbox"] {
      /* display: none; */
    }
    </style>
    <label for="toggle">
      <input type="checkbox" id="toggle" ${checked ? "checked" : ""}>
      <span></span>
    </label>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  addClickListener() {
    const checkbox = this.shadowRoot.querySelector("input");
    checkbox.addEventListener("click", (e) => {
      this.setAttribute("data-checked", checkbox.checked);
      e.stopPropagation();
    });
  }
}

if (!customElements.get("berry-toggle")) {
  customElements.define("berry-toggle", ToggleComponent);
}

export default ToggleComponent;
