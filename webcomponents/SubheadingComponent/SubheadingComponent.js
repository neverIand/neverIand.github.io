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
      width: 100%;
      --title-font: "Lucida Bright", "Palatino Linotype", "Book Antiqua", Palatino,
    "Times New Roman", Times, Georgia, serif;
    }
    .heading {
      margin: 0;
      text-align: center;
      font-family: var(--title-font);
    }
    #link-container {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1em;
      width: 100%;
      margin: 1em 0;
    }
    .prev {
      padding-left: 2em;
    }
    .next {
      padding-right: 2em;
    }
    .prev:before, .next:after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .prev:before {
      content: '←';
      left: 0;
    }
    .next:after {
      content: '→';
      right: 0;
    }
    h2 {
      color: var(--text-color);
      font-size: 2em;
    }
    h4 {
      font-size: 1.5em;
      color: grey;
    }
    a {
      flex-basis: 40%;
      color: var(--link-color);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline var(--text-color);
    }
    a:visited {
      color: var(--link-visited-color);
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

  renderLink(prevArticle, nextArticle) {
    const conatiner = this.shadowRoot.getElementById("link-container");
    if (prevArticle) {
      const linkEl = document.createElement("a");
      linkEl.className = "prev";
      linkEl.href = prevArticle.filename;
      linkEl.textContent = prevArticle.title;
      conatiner.appendChild(linkEl);
    }
    if (nextArticle) {
      const linkEl = document.createElement("a");
      linkEl.className = "next";
      linkEl.href = nextArticle.filename;
      linkEl.textContent = nextArticle.title;
      conatiner.appendChild(linkEl);
    }
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <h2 id="heading" class="heading"></h2>
      <h4 id="subheading" class="heading"></h4>
      <div id="link-container">
  
      </div>
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
    const articleIndex = response.findIndex((article) => article.id === id);
    let articleInfo =
      articleIndex === -1
        ? {
            title: null,
            subheading: null,
          }
        : response[articleIndex];

    if (articleInfo.title) {
      component.renderHeading("heading", articleInfo.title);
    }
    if (articleInfo.subheading) {
      component.renderHeading("subheading", articleInfo.subheading);
    }

    component.renderLink(
      response[articleIndex - 1],
      response[articleIndex + 1]
    );
  }
}

if (!customElements.get("berry-heading")) {
  customElements.define("berry-heading", ArticleSubheading);
}

export default ArticleSubheading;
