const CSS = `
:host {
  display: block;
  --title-font: "Lucida Bright", "Palatino Linotype", "Book Antiqua", Palatino, "Times New Roman", Times, Georgia, serif;
}
.sidebar {
  max-width: 400px;
  padding: 20px;
  background-color: #f4f4f4;
  line-height: 160%;
  border-radius: 10px;
}
h2 {
  border-bottom: 1px solid;
}
#archive-list {
  margin-top: 20px;
}
.archive-category > ul {
  list-style: none;
  margin: 0;
}
h2,
h3 {
  margin: 0;
  font-family: var(--title-font);
}
a {
  padding: 4px 8px;
  color: black;
  font-family: consolas, "Menlo", "Monaco", "Courier New", monospace;
  text-decoration: none;
  border-radius: 4px;
}
a:hover,
a:focus {
  color: #ff6600;
  text-decoration: underline;
}
a:visited {
  color: #7744aa;
}
@media (max-width: 992px) {
  .article-list {
    grid-template-columns: 1fr;
  }
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

class CustomArchivedList extends HTMLElement {
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
    // TODO
    // document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
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
    component.renderArchiveList(
      "archived-list-coding",
      codingArticlesData.response
    );
  }
  if (otherArticlesData) {
    component.renderArchiveList(
      "archived-list-others",
      otherArticlesData.response
    );
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
