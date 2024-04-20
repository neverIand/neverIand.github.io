function initHomePage() {
  console.log("Hello World");
  initArchiveList();
}

async function initArchiveList() {
  // the json structure is so ugly
  // load category 1
  const codingArticlesPromise = fetchArchiveListData(
    "./articles/archived/data/recent-articles-list.json"
  );

  // load category 2
  const otherArticlesPromise = fetchArchiveListData(
    "./articles/archived/data/other-articles-list.json"
  );
  // handle each promise independently
  const results = await Promise.allSettled([
    codingArticlesPromise,
    otherArticlesPromise,
  ]);

  const codingArticlesData =
    results[0].status === "fulfilled" ? results[0].value : null;

  const otherArticlesData =
    results[1].status === "fulfilled" ? results[1].value : null;

  // render the list if data exists
  if (codingArticlesData) {
    renderArchiveList("archived-list-coding", codingArticlesData.response);
  }
  if (otherArticlesData) {
    renderArchiveList("archived-list-others", otherArticlesData.response);
  }
}

function renderArchiveList(elementId, data) {
  const ul = document.getElementById(elementId);
  if (!ul) {
    console.error("Element not found:", elementId);
    return;
  }
  data.articles.forEach((article, index) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = article.new_url;
    a.textContent = article.article_name;

    li.appendChild(a);
    ul.appendChild(li);
  });
}

async function fetchArchiveListData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error, status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", initHomePage);
