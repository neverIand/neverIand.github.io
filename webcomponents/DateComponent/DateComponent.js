import { fetchData } from "/scripts/fetchData.js";

class CustomDate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
  }

  connectedCallback() {
    this.render();
  }

  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "/webcomponents/DateComponent/DateComponent.css"
    );
    this.shadowRoot.appendChild(styles);
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
