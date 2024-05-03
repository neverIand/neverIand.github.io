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
        // TODO: feedback
        console.log("Code copied to clipboard!");
      })
      .catch((err) => console.error("Failed to copy code: ", err));
  }
}

if (!customElements.get("berry-code")) {
  customElements.define("berry-code", CodeSnippet);
}

export default CodeSnippet;
