import { handleThemeChange } from "/scripts/theme.js";

const CSS = `
:host {
  display: block;
}
#article {
  padding: 10px 20px;
}
#article a {
  color: #000;
  text-decoration: none;
}
#article a:hover {
  text-decoration: underline var(--text-color);
}
#footer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1em;
}
h4,
h6 {
  margin: 0;
  font-family: var(--title-font);
}
h4 {
  color: var(--text-color);
  font-size: 1.5em;
}
h6 {
  color: grey;
  font-size: 1.2em;
}
p {
  margin: 0;
  margin-top: 0.5em;
  color: var(--text-color);
  font-size: 1em;
}
@media (max-width: 768px) {
  h4 {
    font-size: 1.25em;
  }
  h6 {
    font-size: 0.875em;
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

class ArticleList extends HTMLElement {
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
    // this.setAttribute("data-theme", getTheme());
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("data-title");
    const subheading = this.getAttribute("data-subheading") || "";
    const url = this.getAttribute("data-url") || "/404.html";
    const date = this.getAttribute("data-date") || "unknown date";
    const lastUpdate = this.getAttribute("data-lastupdate");
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
        <div id="article">
            <a href="${url}" title="${title}"><h4>${title}</h4></a>
            <h6>${subheading}</h6>
            <div id="footer">
              <p>${date}</p>
              ${lastUpdate ? `<p>Last updated: ${lastUpdate}</p>` : ""}
            </div>
        </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-article")) {
  customElements.define("berry-article", ArticleList);
}

export default ArticleList;
