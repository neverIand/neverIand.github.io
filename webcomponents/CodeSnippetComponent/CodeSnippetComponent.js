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
    this.addCopyButtonEventListener();
    this.updateLineNumbers();
    this.highlightCode();
    this.addRunButtonEventListener();
    this.checkReader();
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
    //   const lang = this.getAttribute("code-lang")
    const shouldDemo = this.getAttribute("runnable");
    const title = this.getAttribute("data-title") || "Code Snippet";
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
    <div class="snippet-container">
        <div class="snippet-header">
          ${title}
          <button id="copy-btn">Copy</button>
        </div>
        <div class="snippet-content">
            <div class="line-numbers text"></div>
            <slot name="code"></slot>
        </div>
    </div>
    ${
      shouldDemo === ""
        ? `
      <div class="snippet-container">
        <div class="snippet-header">
          Result
          <button id="run-btn">Run</button>
        </div>
        <div id="result" class="snippet-content text">
        </div>
      </div>`
        : ""
    }
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
    for (let index = 0; index < lines.length; index++) {
      const brEl = document.createElement("br");
      const spanEl = document.createElement("span");
      spanEl.textContent = `${index + 1}`;
      fragment.appendChild(spanEl);
      fragment.appendChild(brEl);
    }
    // Clear existing content if any
    // lineNumberContainer.innerHTML = "";
    lineNumberContainer.appendChild(fragment); // Append all at once
  }

  addCopyButtonEventListener() {
    const button = this.shadowRoot.getElementById("copy-btn");
    button.addEventListener("click", () => {
      this.copyCodeToClipboard();
    });
  }

  copyCodeToClipboard() {
    const slot = this.shadowRoot.querySelector(`slot[name="code"]`);
    const codeContent = slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent)
      .join("\n");
    navigator.clipboard
      .writeText(codeContent)
      .then(() => {
        const msg = "Code copied to clipboard!";
        console.log(msg);
        const copyEvent = new CustomEvent("berry-copy", {
          detail: { type: "success", message: msg },
        });
        document.dispatchEvent(copyEvent);
      })
      .catch((err) => {
        const msg = `Failed to copy code: ${err}`;
        console.error(msg);
        const copyEvent = new CustomEvent("berry-copy", {
          detail: { type: "error", message: msg },
        });
        document.dispatchEvent(copyEvent);
      });
  }

  // in theory this can be put inside render()
  highlightCode() {
    const skipHighight = this.getAttribute("nohighlight");
    const slot = this.shadowRoot.querySelector('slot[name="code"]');
    if (!slot) {
      console.error("Code slot not found");
      return;
    }

    let codeContent = Array.from(slot.assignedNodes({ flatten: true }))
      .map((node) =>
        node.nodeType === Node.TEXT_NODE ? node.textContent : node.outerHTML
      )
      .join("");

    if (!skipHighight && skipHighight !== "") {
      const keywords =
        "\\b(if|else|switch|case|for|while|do|break|continue|function|return|class|constructor|extends|super|new|delete|typeof|instanceof|try|catch|finally|throw|let|const|async|await|import|export|this|null|true|false|undefined|var)\\b";
      codeContent = codeContent.replace(
        new RegExp(keywords, "g"),
        '<span class="keyword">$1</span>'
      );
      codeContent = codeContent.replace(
        /(\/\/.*$)/gm,
        '<span class="comment">$1</span>'
      );
      codeContent = codeContent.replace(
        /(\/\*[\s\S]*?\*\/)/gm,
        '<span class="comment">$1</span>'
      );
    }

    slot.insertAdjacentHTML("beforebegin", codeContent);
  }

  addRunButtonEventListener() {
    const runButton = this.shadowRoot.getElementById("run-btn");
    if (runButton) {
      runButton.addEventListener("click", () => this.runCode());
    }
  }

  runCode() {
    const slot = this.shadowRoot.querySelector('slot[name="code"]');
    const codeContent = slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent)
      .join("\n");

    const resultContainer = this.shadowRoot.getElementById("result");
    resultContainer.innerHTML = "";

    const originalConsoleLog = console.log;
    console.log = (...args) => {
      resultContainer.innerHTML += args.join(" ") + "<br>";
    };

    try {
      new Function(codeContent)(); // Execute the code
    } catch (error) {
      resultContainer.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }

    // Restore original console.log
    console.log = originalConsoleLog;
  }

  checkReader() {
    const snippet = this.shadowRoot.querySelector("pre");
    console.log(snippet);
    if (snippet.childElementCount === 0) {
      const slot = this.querySelector("pre");
      slot.style.display = "block";
    }
  }
}

if (!customElements.get("berry-code")) {
  customElements.define("berry-code", CodeSnippet);
}

export default CodeSnippet;
