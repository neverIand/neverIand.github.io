import { getTheme, handleThemeChange } from "/scripts/theme.js";

const CSS = `
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
  transform: rotateZ(60deg);
}
.right-square {
  top: calc(var(--length) * (1 / 15));
  left: calc(var(--length) * (11 / 15));
  width: var(--logo-right-square-width);
  height: var(--logo-right-square-width);
  z-index: 50;
  transform: rotateZ(60deg);
}
.core {
  position: relative;
  width: var(--logo-core-width);
  height: var(--logo-core-width);
  top: calc(var(--logo-core-width) - var(--logo-border-width) / 2);
  margin: auto;
  border: var(--logo-border-width) solid var(--text-color, black);
}
:host(.animated) .left-square,
:host(.animated) .right-square {
  animation: transformLeft 4s infinite linear;
}
@keyframes transformLeft {
  from {
    transform: translateX(calc(-1.467 * var(--length))) rotateZ(60deg);
  }
  to {
    transform: translateX(calc(1.733 * var(--length))) rotateZ(-300deg);
  }
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

class LogoComponent extends HTMLElement {
  static get observedAttributes() {
    return ["size", "animate", "muted"];
  }
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

    this.setAttribute("data-theme", getTheme()); // for iOS 15
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

    // Toggle animation on/off
    const animate = this.getAttribute("animate");
    if (animate !== "false") {
      // console.log(this.classList);
      this.classList.add("animated");
    } else {
      this.classList.remove("animated");
    }
  }
}

if (!customElements.get("berry-logo")) {
  customElements.define("berry-logo", LogoComponent);
}

export default LogoComponent;
