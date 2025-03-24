import { handleThemeChange } from "/scripts/theme.js";
class LogoComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  static get observedAttributes() {
    return ["size", "animate", "muted"];
  }

  // All styling changes are in updateStyles() at the moment
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    // if (name === "size") {
    //   this.updateStyles();
    // }
    if ((name === "muted") & (this.getAttribute("muted") !== "true")) {
      this.classList.remove("muted");
    } else {
      this.classList.add("muted");
    }
    this.updateStyles();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <div class="square outline" role="presentation" aria-hidden="true">
        <div class="square left-square">
        </div>
        <div class="square right-square"></div>
        <div class="square core"></div>
    </div>
`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.updateStyles();
  }

  updateStyles(/* TODO: move parms here*/) {
    const size = this.getAttribute("size") || "240"; // Default size
    const isAnimated = this.getAttribute("animate") || "true";
    // const isMuted = this.getAttribute("muted") || "false";
    const length = parseInt(size);
    const borderWidth = length * 0.04;
    const borderRadius = length * (2 / 75);
    const leftSquareWidth = length * (2 / 3);
    const rightSquareWidth = length / 2;
    const coreWidth = length / 3;

    // TODO: use html attr in CSS and preload CSS
    let styleElement = this.shadowRoot.querySelector("style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      this.shadowRoot.appendChild(styleElement);
    }

    const styles = `
    :host {
        --length: ${length}px;
        --logo-border-width: ${borderWidth}px;
        --logo-border-radius: ${borderRadius}px;
        --logo-left-square-width: ${leftSquareWidth}px;
        --logo-right-square-width: ${rightSquareWidth}px;
        --logo-core-width: ${coreWidth}px;
        --logo-color: rgb(121,0,142);
        opacity: 1;
        transition: opacity 0.5s;
    }
    .square {
        background-color: var(--bg-color);
        border: var(--logo-border-width) solid var(--logo-color);
        border-radius: var(--logo-border-radius);
    }
    .outline {
        position: relative;
        width: var(--length);
        height: var(--length);
        z-index: 200;
        overflow: hidden;
    }
    .left-square {
        position: absolute;
        top: calc(var(--length) * 0.3);
        left: calc(0px - var(--length) / 3);
        width: var(--logo-left-square-width);
        height: var(--logo-left-square-width);
        z-index: 100;
        ${isAnimated === "true" ? "" : "transform: rotateZ(60deg);"}
        animation: ${
          isAnimated === "true" ? "transformLeft 4s infinite linear" : "inherit"
        };
    }
    .right-square {
        position: absolute;
        top: calc(var(--length) * calc(1 / 15));
        left: calc(var(--length) * calc(11 / 15));
        transform: rotateZ(60deg);
        width: var(--logo-right-square-width);
        height: var(--logo-right-square-width);
        z-index: 50;
        animation: ${
          isAnimated === "true" ? "transformLeft 4s infinite linear" : "none"
        };
    }
    .core {
        position: relative;
        top: calc(var(--logo-core-width) - var(--logo-border-width) / 2);
        width: var(--logo-core-width);
        height: var(--logo-core-width);
        margin: auto;
        border: var(--logo-border-width) solid var(--text-color);
    }
    /* TODO: add optional rotation animation */
    @keyframes transformLeft {
        from {
            transform: translateX(-${1.467 * length}px) rotateZ(60deg);
        }
        to {
            transform: translateX(${1.733 * length}px) rotateZ(-300deg);
        }
    }
`;
    styleElement.textContent = styles;
  }
}

if (!customElements.get("berry-logo")) {
  customElements.define("berry-logo", LogoComponent);
}

export default LogoComponent;
