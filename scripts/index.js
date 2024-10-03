import { fetchData } from "/scripts/fetchData.js";
import { getTheme } from "/scripts/theme.js";
import "/webcomponents/ArticleComponent/ArticleComponent.js";

function initHomePage() {
  console.info("Hello World");
  initArticleList();
  initArticleList("misc");
  highlightBanner();
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
  data
    .sort((a, b) => compareDate(a.lastUpdate || a.date, b.lastUpdate || b.date))
    .forEach((article) => {
      const articleEl = document.createElement("berry-article");
      articleEl.setAttribute("data-title", article.title);
      articleEl.setAttribute("data-url", article.filename);
      articleEl.setAttribute("data-subheading", article.subheading);
      articleEl.setAttribute("data-date", article.date);
      if (article.lastUpdate) {
        articleEl.setAttribute("data-lastupdate", article.lastUpdate);
      }
      articleEl.setAttribute("data-theme", getTheme());
      listEl.appendChild(articleEl);
    });
}

function compareDate(date1, date2) {
  return new Date(date2) - new Date(date1);
}

function highlightBanner() {
  const banner = document.getElementById("banner");
  const squares = banner.querySelectorAll("berry-logo");
  let startIndex = 0;
  squares.length > 0 &&
    setInterval(() => {
      squares.forEach((square) => {
        square.setAttribute("muted", true);
      });

      squares[startIndex].setAttribute("muted", false);

      startIndex++;
      if (startIndex === squares.length) {
        startIndex = 0;
      }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", initHomePage);
