import { handleThemeChange } from "/scripts/theme.js";
import { attachShadowStylesheet } from "/scripts/style-utils.js";

class ArticleList extends HTMLElement {
  constructor() {
    super();
    const sr = this.attachShadow({
      mode: "open",
    });
    attachShadowStylesheet(
      sr,
      new URL("./ArticleComponent.css", import.meta.url).href
    );
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
