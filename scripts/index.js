import { fetchData } from "/scripts/fetchData.js";
import "/webcomponents/ArticleComponent/ArticleComponent.js";

function initHomePage() {
  console.info("Hello World");
  initArticleList();
  initArticleList("misc");
}

async function initArticleList(type) {
  switch (type) {
    case "misc":
      {
        const response = await fetchData("/articles/misc/data/misc.json");
        if (response) {
          renderArticleList("misc-list", response);
        }
      }
      break;
    default:
      {
        const response = await fetchData("/articles/new/data/new.json");
        if (response) {
          renderArticleList("article-list", response);
        }
      }
      break;
  }
}

function renderArticleList(elementId, data) {
  const listEl = document.getElementById(elementId);
  if (!listEl) {
    console.error("Element not found:", elementId);
    return;
  }
  data.reverse().forEach((article) => {
    const articleEl = document.createElement("berry-article");
    articleEl.setAttribute("data-title", article.title);
    articleEl.setAttribute("data-url", article.filename);
    articleEl.setAttribute("data-subheading", article.subheading);
    listEl.appendChild(articleEl);
  });
}

document.addEventListener("DOMContentLoaded", initHomePage);
