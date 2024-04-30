import { fetchData } from "/scripts/fetchData.js";

class ArticleSubheading extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
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
    h4 {
      margin: 0;
      font-family: var(--title-font);
      font-size: 1.5em;
      color: grey;
      /* border: 1px solid; */
    }
    `;
    styleElement.textContent = styles;
  }

  renderSubheading(elementId, data) {
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
      <h4 id="subheading"></h4>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

async function initSubheading(component) {
  const response = await fetchData("/articles/new/data/new.json");
  if (response) {
    const id = parseInt(window.location.pathname.split("-")[1]);
    const articleInfo = response.find((article) => article.id === id) || {
      subheading: "(No subheading for this article)",
    };
    component.renderSubheading("subheading", articleInfo.subheading);
  }
}

if (!customElements.get("berry-subheading")) {
  customElements.define("berry-subheading", ArticleSubheading);
}

export default ArticleSubheading;
