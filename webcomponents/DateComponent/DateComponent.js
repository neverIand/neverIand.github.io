import { fetchData } from "/scripts/fetchData.js";
import { handleThemeChange } from "/scripts/theme.js";

const CSS = `
:host {
  display: block;
}
time {
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  font-style: italic;
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

class CustomDate extends HTMLElement {
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
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
  }

  renderArticleDate(data) {
    const timeEl = this.shadowRoot.querySelector("time");

    const dateEl = this.shadowRoot.getElementById("date");
    if (!data || !data.date) {
      dateEl.textContent = "Unknown date";
      return;
    }
    timeEl.setAttribute("datetime", data.date);
    dateEl.textContent = data.date;

    if (data.lastUpdate) {
      const updEl = document.createElement("span");
      updEl.textContent = `Last updated: ${data.lastUpdate}`;
      timeEl.appendChild(updEl);
    }
  }

  render() {
    const date = this.getAttribute("datetime");
    const lastUpdated = this.getAttribute("last-update");
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <time datetime="${date}">
        <span id="date">${date}</span>
        ${lastUpdated ? `<span>Last updated: ${lastUpdated}</span>` : ""}
      </time>
  `;
    if (!date) {
      initArticleDate(this);
    }

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

async function initArticleDate(component) {
  const path = window.location.pathname.split("-");
  let url = path[0].endsWith("misc")
    ? `/articles/misc/data/misc.json`
    : `/articles/new/data/new.json`;
  const response = await fetchData(url);
  if (response) {
    const id = parseInt(path[1]);
    const articleInfo = response.find((article) => article.id === id);
    component.renderArticleDate(articleInfo);
  }
}

if (!customElements.get("berry-date")) {
  customElements.define("berry-date", CustomDate);
}

export default CustomDate;
