import { handleThemeChange } from "/scripts/theme.js";
import "/webcomponents/ChipComponent/ChipComponent.js";
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
    const lang = this.getAttribute("code-lang") || "javascript";
    const skipHighlight = this.getAttribute("nohighlight") === "";
    const shouldDemo =
      this.getAttribute("runnable") === "" && lang === "javascript";
    const title = this.getAttribute("data-title") || "Code Snippet"; // TODO?: accessibility
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
    <div class="snippet-container">
        <div class="snippet-header">
          ${title}
          <div class="btn-wrapper">
            <berry-chip data-label="${lang}" variant="code"></berry-chip>
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
        <div class="snippet-header" style="justify-content: space-between;">
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
    if (!skipHighlight) {
      const slot = this.querySelector("pre");
      slot.style.display = "none";
      this.highlightCode();
      // this.addShowOGEventListener();
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
    // codeContent = codeContent
    //   .replace(/&/g, "&amp;")
    //   .replace(/</g, "&lt;")
    //   .replace(/>/g, "&gt;");

    // Unescape HTML entities in the code content
    codeContent = codeContent
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");

    let highlightedCode = "";

    if (lang === "html") {
      // Highlight comments
      codeContent = codeContent.replace(
        /(<!--[\s\S]*?-->)/g,
        '<span class="comment">$1</span>'
      );

      // Highlight tags and attributes
      codeContent = codeContent.replace(
        /(<\/?)([\w-]+)([^<>]*?)(\/?>)/g,
        function (match, p1, p2, p3, p4) {
          // Highlight tag name
          let result = p1 + '<span class="keyword">' + p2 + "</span>";

          // Highlight attributes within p3
          result += p3.replace(
            /([\w-]+)(=)("[^"]*"|'[^']*')/g,
            '<span class="attribute">$1</span>$2<span class="string">$3</span>'
          );
          return result + p4;
        }
      );

      highlightedCode = codeContent;

      // Escape code content but not the syntax highlighting tags
      highlightedCode = highlightedCode
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        // Unescape angle brackets in the syntax highlighting tags
        .replace(/&lt;(\/?span\b[^&]*?)&gt;/g, "<$1>");
    } else if (lang === "css") {
      // Process CSS code
      highlightedCode = codeContent
        // !FIXME Highlight comments
        // .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
        // Highlight strings
        .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
        // Highlight properties and values
        .replace(
          /(\b[\w-]+)(\s*:)([^;]*)(;)/g,
          '<span class="css-prop">$1</span>$2<span class="css-val">$3</span>$4'
        )
        // !FIXME Highlight selectors
        // .replace(/([^{\s][^{]*)(\s*\{)/g, '<span class="selector">$1</span>$2')
        // Highlight @rules
        .replace(/(@[\w-]+)/g, '<span class="keyword">$1</span>');
    } else {
      // Tokenize the code into strings, comments, and code
      const tokens = [];
      let regex;

      switch (lang) {
        case "python":
          regex =
            /(\"\"\"[\s\S]*?\"\"\"|'''.*?'''|".*?"|'.*?'|#.*?$)|[^"'#]+/gm;
          break;
        case "javascript": // applies to cpp, c java as well
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
            tokens.push({ type: "strOrComment", value: match[1] });
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
        } else if (token.type === "strOrComment") {
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
      highlightedCode = tokens.map((token) => token.value).join("");
    }

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
