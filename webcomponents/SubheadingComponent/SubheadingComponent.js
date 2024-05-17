import { fetchData } from "/scripts/fetchData.js";
import { handleThemeChange } from "/scripts/theme.js";

class ArticleSubheading extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
    initSubheading(this);
  }

  loadStyles() {
    let styleElement = this.shadowRoot.querySelector("style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      this.shadowRoot.appendChild(styleElement);
    }
    const styles = `
    :host {
      --title-font: "Lucida Bright", "Palatino Linotype", "Book Antiqua", Palatino,
    "Times New Roman", Times, Georgia, serif;
    }
    .heading {
      margin: 0;
      text-align: center;
      font-family: var(--title-font);
    }
    h2 {
      color: var(--text-color);
      font-size: 2em;
    }
    h4 {
      font-size: 1.5em;
      color: grey;
    }
    `;
    styleElement.textContent = styles;
  }

  renderHeading(elementId, data) {
    const headingEl = this.shadowRoot.getElementById(elementId);
    if (!headingEl) {
      console.error("Element not found:", elementId);
      return;
    }
    headingEl.textContent = data;
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <h2 id="heading" class="heading"></h2>
      <h4 id="subheading" class="heading"></h4>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

async function initSubheading(component) {
  const path = window.location.pathname.split("-");
  let url = path[0].endsWith("misc")
    ? `/articles/misc/data/misc.json`
    : `/articles/new/data/new.json`;
  const response = await fetchData(url);
  if (response) {
    const id = parseInt(path[1]);
    const articleInfo = response.find((article) => article.id === id) || {
      subheading: "(No subheading for this article)",
    };
    component.renderHeading("heading", articleInfo.title);
    component.renderHeading("subheading", articleInfo.subheading);
  }
}

if (!customElements.get("berry-heading")) {
  customElements.define("berry-heading", ArticleSubheading);
}

export default ArticleSubheading;
