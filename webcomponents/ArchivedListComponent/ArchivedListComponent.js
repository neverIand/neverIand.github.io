class CustomArchivedList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
  }

  connectedCallback() {
    this.render();
    initArchiveList(this); // Pass 'this' to use it inside initArchiveList
  }

  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "/webcomponents/ArchivedListComponent/ArchivedListComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  renderArchiveList(elementId, data) {
    const ul = this.shadowRoot.getElementById(elementId);
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

  render() {
    // Create and append the footer template
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <aside class="sidebar" role="complementary">
        <h2>Archived Articles</h2>
        <div id="archive-list">
            <div class="archive-category">
                <h3>Coding</h3>
                <ul id="archived-list-coding">
                    <!--  -->
                </ul>
            </div>
            <div class="archive-category">
                <h3>Others</h3>
                <ul id="archived-list-others">
                    <!--  -->
                </ul>
            </div>
        </div>
    </aside>
  `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

async function initArchiveList(component) {
  // the json structure is so ugly
  // load category 1
  const codingArticlesPromise = fetchArchiveListData(
    "/articles/archived/data/recent-articles-list.json"
  );

  // load category 2
  const otherArticlesPromise = fetchArchiveListData(
    "/articles/archived/data/other-articles-list.json"
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
    component.renderArchiveList("archived-list-coding", codingArticlesData.response);
  }
  if (otherArticlesData) {
    component.renderArchiveList("archived-list-others", otherArticlesData.response);
  }
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

if (!customElements.get("berry-archive")) {
  customElements.define("berry-archive", CustomArchivedList);
}

export default CustomArchivedList;
