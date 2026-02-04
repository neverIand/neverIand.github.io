import { getTheme, handleThemeChange } from "/scripts/theme.js";
import { attachShadowStylesheet } from "/scripts/style-utils.js";

class LogoComponent extends HTMLElement {
  static get observedAttributes() {
    return ["size", "animate", "muted"];
  }
  constructor() {
    super();
    const sr = this.attachShadow({
      mode: "open",
    });
    attachShadowStylesheet(
      sr,
      new URL("./LogoComponent.css", import.meta.url).href
    );

    // this.setAttribute("data-theme", getTheme()); // for iOS 15
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
