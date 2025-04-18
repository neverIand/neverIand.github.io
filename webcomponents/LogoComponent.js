import { handleThemeChange } from "/scripts/theme.js";

// 1. Create a shared, constructable stylesheet
const logoStyles = new CSSStyleSheet();
logoStyles.replaceSync(`
:host {
  display: block;
  aspect-ratio: 1 / 1;
  --logo-color: rgb(121, 0, 142);
  opacity: 1;
  transition: opacity 0.5s;
}
.square {
  background-color: var(--bg-color, white);
  border: var(--logo-border-width, 9.6px) solid var(--logo-color);
  border-radius: var(--logo-border-radius, 6.4px);
}
.outline {
  position: relative;
  width: var(--length, 240px);
  height: var(--length, 240px);
  overflow: hidden;
}
.left-square, .right-square, .core {
  position: absolute;
}
.left-square {
  top: calc(var(--length) * 0.3);
  left: calc(0px - var(--length) / 3);
  width: var(--logo-left-square-width);
  height: var(--logo-left-square-width);
  z-index: 100;
  animation: transformLeft 4s infinite linear;
}
.right-square {
  top: calc(var(--length) * (1 / 15));
  left: calc(var(--length) * (11 / 15));
  width: var(--logo-right-square-width);
  height: var(--logo-right-square-width);
  z-index: 50;
  transform: rotateZ(60deg);
  animation: transformLeft 4s infinite linear;
}
.core {
  position: relative;
  width: var(--logo-core-width);
  height: var(--logo-core-width);
  top: calc(var(--logo-core-width) - var(--logo-border-width) / 2);
  margin: auto;
  border: var(--logo-border-width) solid var(--text-color, black);
}
.start-animation .left-square,
.start-animation .right-square {
  animation-play-state: running;
}
@keyframes transformLeft {
  from {
    transform: translateX(calc(-1.467 * var(--length))) rotateZ(60deg);
  }
  to {
    transform: translateX(calc(1.733 * var(--length))) rotateZ(-300deg);
  }
}
`);

class LogoComponent extends HTMLElement {
  static get observedAttributes() {
    return ["size", "animate", "muted"];
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.shadowRoot.adoptedStyleSheets = [logoStyles];
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  // All styling changes are in updateStyles() at the moment
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "muted" && this.getAttribute("muted") !== "true") {
      this.classList.remove("muted");
    } else if (name === "muted") {
      this.classList.add("muted");
    }
    this.updateStyles();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const tpl = document.createElement("template");
    tpl.innerHTML = `
      <div class="outline square" role="presentation" aria-hidden="true">
        <div class="square left-square"></div>
        <div class="square right-square"></div>
        <div class="square core"></div>
      </div>
    `;
    this.shadowRoot.appendChild(tpl.content.cloneNode(true));
    this.updateStyles();
  }

  updateStyles() {
    const length = parseInt(this.getAttribute("size") || "240", 10);
    const borderWidth = length * 0.04;

    // Only update CSS custom properties at runtime
    this.style.setProperty("--length", `${length}px`);
    this.style.setProperty("--logo-border-width", `${borderWidth}px`);
    this.style.setProperty("--logo-border-radius", `${length * (2 / 75)}px`);
    this.style.setProperty("--logo-left-square-width", `${length * (2 / 3)}px`);
    this.style.setProperty("--logo-right-square-width", `${length / 2}px`);
    this.style.setProperty("--logo-core-width", `${length / 3}px`);

    // Optionally disable animation
    if (this.getAttribute("animate") === "false") {
      this.classList.remove("start-animation");
    }
  }
}

if (!customElements.get("berry-logo")) {
  customElements.define("berry-logo", LogoComponent);
}

export default LogoComponent;
