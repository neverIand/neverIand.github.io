import { handleThemeChange } from "/scripts/theme.js";
class CodeSnippet extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
  }

  connectedCallback() {
    this.render();
    this.addCopyButtonEventListener();
    this.updateLineNumbers();
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
    const skipHighight = this.getAttribute("nohighlight") === "";
    const shouldDemo = this.getAttribute("runnable") === "";
    const title = this.getAttribute("data-title") || "Code Snippet";
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
    <div class="snippet-container">
        <div class="snippet-header">
          ${title}
          <div class="btn-wrapper">
            ${
              skipHighight
                ? ""
                : `<input type="checkbox" id="og-btn" data-hl="true" checked /><label for="og-btn">Highlight</label>`
            }
            <button id="copy-btn">Copy</button>
          </div>
        </div>
        <div class="snippet-content">
            <div class="line-numbers text"></div>
            <slot name="code">If you can't see the code snippet, it's likely that you are in Safari's reader mode. You'll need to exit reader mode to view or copy the code.</slot>
        </div>
    </div>
    ${
      shouldDemo
        ? `
      <div class="snippet-container">
        <div class="snippet-header">
          Result
          <button id="run-btn">Run</button>
        </div>
        <!-- TODO? replace div with <samp> -->
        <div id="result" class="snippet-content text">
        </div>
      </div>`
        : ""
    }
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    if (!skipHighight) {
      const slot = this.querySelector("pre");
      slot.style.display = "none";
      this.highlightCode();
      this.addShowOGEventListener();
    }
    if (shouldDemo) {
      this.addRunButtonEventListener();
    }
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

  addShowOGEventListener() {
    const btn = this.shadowRoot.getElementById("og-btn");
    btn.addEventListener("click", () => {
      const slottedPre = this.querySelector(`pre`);
      const renderedPre = this.shadowRoot.querySelector("pre");
      if (btn.getAttribute("data-hl") === "true") {
        slottedPre.style.display = "block";
        renderedPre.style.display = "none";
        btn.setAttribute("data-hl", false);
      } else {
        slottedPre.style.display = "none";
        renderedPre.style.display = "block";
        btn.setAttribute("data-hl", true);
      }
    });
  }

  addCopyButtonEventListener() {
    const btn = this.shadowRoot.getElementById("copy-btn");
    btn.addEventListener("click", () => {
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
        const copyEvent = new CustomEvent("berry-toast", {
          detail: { type: "success", message: msg },
        });
        document.dispatchEvent(copyEvent);
      })
      .catch((err) => {
        const msg = `Failed to copy code: ${err}`;
        console.error(msg);
        const copyEvent = new CustomEvent("berry-toast", {
          detail: { type: "error", message: msg },
        });
        document.dispatchEvent(copyEvent);
      });
  }

  highlightCode() {
    const slot = this.shadowRoot.querySelector('slot[name="code"]');
    if (!slot) {
      console.error("Code slot not found");
      return;
    }

    // Find the code node within the slot
    // in many cases it will be an array with a single <pre> node
    const codeNode = slot
      .assignedNodes({ flatten: true })
      .find(
        (node) =>
          node.nodeType === Node.TEXT_NODE ||
          (node.nodeType === Node.ELEMENT_NODE && node.tagName === "PRE")
      );

    if (!codeNode) {
      console.error("No code node found in slot");
      return;
    }

    // Get the text content of the code node
    let codeContent = codeNode.textContent;

    const lang = this.getAttribute("code-lang") || "javascript";

    // Escape HTML characters in the code content
    codeContent = codeContent
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Tokenize the code into strings, comments, and code
    const tokens = [];
    let regex;

    // set regex to match strings, comments, or other code
    // !The regex patterns are simplified and may not cover all edge cases, such as nested comments or complex string literals with escaped quotes.
    switch (lang) {
      case "python":
        regex = /(\"\"\"[\s\S]*?\"\"\"|'''.*?'''|".*?"|'.*?'|#.*?$)|[^"'#]+/gm;
        break;
      case "javascript": // also applies to java, c, cpp
        regex = /(\".*?\"|'.*?'|`.*?`|\/\*[\s\S]*?\*\/|\/\/.*?$)|[^"'`\/]+/gm;
        break;

      default:
        // For other languages, treat the entire code as one token
        tokens.push({ type: "code", value: codeContent });
        break;
    }

    if (regex) {
      let match;
      while ((match = regex.exec(codeContent)) !== null) {
        if (match[1]) {
          // It's a string or comment
          tokens.push({ type: "stringOrComment", value: match[1] });
        } else {
          // It's code
          tokens.push({ type: "code", value: match[0] });
        }
      }
    }

    // Process tokens
    tokens.forEach((token) => {
      if (token.type === "code") {
        // Highlight keywords
        const keywordLists = {
          javascript:
            "\\b(?:if|else|switch|case|for|while|do|break|continue|function|return|class|constructor|extends|super|new|delete|typeof|instanceof|try|catch|finally|throw|let|const|async|await|import|export|this|null|true|false|undefined|var)\\b",
          python:
            "\\b(?:def|return|if|elif|else|for|while|break|continue|class|try|except|finally|with|as|import|from|lambda|pass|raise|yield|global|nonlocal|assert|True|False|None)\\b",
          // Add more languages as needed
        };

        const keywords = keywordLists[lang];

        if (keywords) {
          token.value = token.value.replace(
            new RegExp(keywords, "g"),
            '<span class="keyword">$&</span>'
          );
        }
      } else if (token.type === "stringOrComment") {
        // Escape HTML characters
        const escapedValue = token.value
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        if (
          token.value.startsWith('"') ||
          token.value.startsWith("'") ||
          token.value.startsWith("`")
        ) {
          // It's a string
          token.value = '<span class="string">' + escapedValue + "</span>";
        } else if (
          token.value.startsWith("/*") ||
          token.value.startsWith("//") ||
          token.value.startsWith("#")
        ) {
          // It's a comment
          token.value = '<span class="comment">' + escapedValue + "</span>";
        }
      }
    });

    // Reassemble the code
    const highlightedCode = tokens.map((token) => token.value).join("");

    // Insert the highlighted code safely into the DOM
    const preElement = document.createElement("pre");
    preElement.innerHTML = highlightedCode;
    slot.insertAdjacentElement("beforebegin", preElement);

    // Hide the original slot content
    slot.style.display = "none";
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
}

if (!customElements.get("berry-code")) {
  customElements.define("berry-code", CodeSnippet);
}

export default CodeSnippet;
