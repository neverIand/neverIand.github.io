import { fetchData } from "/scripts/fetchData.js";
import "/webcomponents/ArchivedListComponent/ArchivedListComponent.js";
import "/webcomponents/ArticleComponent/ArticleComponent.js";

function initHomePage() {
  console.info("Hello World");
  initArticleList();
}

async function initArticleList() {
  const response = await fetchData("/articles/new/data/new.json");
  if (response) {
    renderArticleList("article-list", response);
  }
}

function renderArticleList(elementId, data) {
  const listEl = document.getElementById(elementId);
  if (!listEl) {
    console.error("Element not found:", elementId);
    return;
  }
  // TODO: replace with an ordinary for loop
  data.reverse().forEach((article) => {
    // TODO: <berry-article>
    // const articleEl = document.createElement("div");
    // articleEl.innerHTML = `
    //   <a href=${article.filename}><h4>${article.title}</h4></a>`;
    const articleEl = document.createElement("berry-article");
    articleEl.setAttribute("data-title", article.title);
    articleEl.setAttribute("data-url", article.filename);
    articleEl.setAttribute("data-subheading", article.subheading);
    listEl.appendChild(articleEl);
  });
}

document.addEventListener("DOMContentLoaded", initHomePage);
