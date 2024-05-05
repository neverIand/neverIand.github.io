class CodeSnippet extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
  }

  connectedCallback() {
    this.render();
    this.updateLineNumbers();
    this.addCopyButtonEventListener();
    this.highlightCode();
  }

  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "/webcomponents/CodeSnippetComponent/CodeSnippetComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  render() {
    //   const shouldShowDemo = this.getAttribute("runnable");
    const title = this.getAttribute("data-title") || "Code Snippet";
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
    <div class="snippet-container">
        <div class="snippet-header">
          ${title}
          <button id="copy-btn">Copy</button>
        </div>
        <div class="snippet-content">
            <div class="line-numbers"></div>
            <pre><slot name="code"></slot></pre>
        </div>
    </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  updateLineNumbers() {
    const node = this.shadowRoot
      .querySelector("slot[name='code']")
      .assignedNodes({ flatten: true })
      .find(
        (node) => node.nodeType === Node.TEXT_NODE || node.tagName === "PRE"
      );
    const codeContent = node ? node.textContent : "";
    const lines = codeContent.split("\n");
    const lineNumberContainer = this.shadowRoot.querySelector(".line-numbers");

    const fragment = document.createDocumentFragment();

    lines.forEach((line, index) => {
      const brEl = document.createElement("br");
      const spanEl = document.createElement("span");
      spanEl.className = "line-number";
      spanEl.textContent = `${index + 1}`;
      fragment.appendChild(spanEl);
      fragment.appendChild(brEl);
    });

    // Clear existing content if any
    lineNumberContainer.innerHTML = "";
    lineNumberContainer.appendChild(fragment); // Append all at once
  }

  addCopyButtonEventListener() {
    const button = this.shadowRoot.getElementById("copy-btn");
    button.addEventListener("click", () => {
      this.copyCodeToClipboard();
    });
  }

  copyCodeToClipboard() {
    const slot = this.shadowRoot.querySelector('slot[name="code"]');
    const codeContent = slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent)
      .join("\n");
    navigator.clipboard
      .writeText(codeContent)
      .then(() => {
        console.log("Code copied to clipboard!");
      })
      .catch((err) => console.error("Failed to copy code: ", err));
  }

  // !codeContent has <pre> inside as a string, either we remove it from codeContent or replace this node (NOT setting innerHTML!)
  // in theory this can be put inside render() 
  highlightCode() {
    const codeSlot = this.shadowRoot.querySelector('slot[name="code"]');
    let codeContent = codeSlot
      .assignedNodes({ flatten: true })
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        } else if (node.tagName === "PRE") {
          return node.innerText; // Extracts only the text content, ignoring the <pre> tags
        } else {
          return node.outerHTML;
        }
      })
      .join("");

    codeContent = codeContent.replace(
      /(\/\/.*$)/gm,
      '<span class="comment">$1</span>'
    ); // Single-line comments
    codeContent = codeContent.replace(
      /(\/\*[\s\S]*?\*\/)/gm,
      '<span class="comment">$1</span>'
    ); // Multi-line comments

    // Ensure we are updating the existing <pre> element's innerHTML
    const preElement = this.shadowRoot.querySelector("pre");
    if (preElement) {
      preElement.innerHTML = codeContent;
    }
  }
}

if (!customElements.get("berry-code")) {
  customElements.define("berry-code", CodeSnippet);
}

export default CodeSnippet;
