import { getTheme, handleThemeChange } from "/scripts/theme.js";
import { attachShadowStylesheet } from "/scripts/style-utils.js";

class CustomFooter extends HTMLElement {
  constructor() {
    super();
    const sr = this.attachShadow({
      mode: "open",
    });
    attachShadowStylesheet(
      sr,
      new URL("./FooterComponent.css", import.meta.url).href
    );
    this.setAttribute("data-theme", getTheme()); // for iOS 15
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <footer id="footer">
        <ul>
          <li><a target="_blank" href="https://github.com/neverIand">Github</a></li>
          <li><a target="_blank" href="mailto:contact@tangyizhe.dev">Email</a></li>
          <li><a target="_blank" href="https://www.youtube.com/@ratch3t673">Youtube</a></li>
        </ul>
    </footer>
`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-footer")) {
  customElements.define("berry-footer", CustomFooter);
}

export default CustomFooter;
