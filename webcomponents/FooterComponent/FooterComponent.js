import { getTheme, handleThemeChange } from "/scripts/theme.js";

const CSS = `
:host {
  display: block;
}
ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 0;
  padding: 10px;
  list-style: none;
}
a {
  padding: 4px 8px;
  color: var(--link-color);
  font-family: consolas, "Menlo", "Monaco", "Courier New", monospace;
  text-decoration: none;
  border-radius: 4px;
  transition: color 0.3s, background-color 0.3s;
}
a:hover,
a:focus {
  color: #ff6600;
  text-decoration: none;
  background-color: #f2f2f2;
}
a:visited {
  color: var(--link-visited-color);
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

class CustomFooter extends HTMLElement {
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

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <footer id="footer">
        <ul>
          <li><a href="https://github.com/neverIand">Github</a></li>
          <li><a href="mailto:rickytang2019@gmail.com">Email</a></li>
          <li><a href="https://www.youtube.com/@ratch3t673">Youtube</a></li>
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
