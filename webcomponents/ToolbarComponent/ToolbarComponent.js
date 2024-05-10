class ToolbarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addScrollEventListener();
    this.addButtonEventListener();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
          <style>
            :host {
              position: fixed;
              bottom: 4em;
              right: 10px;
            }
            #toolbar {
              visibility: hidden;
              opacity: 0;
              padding: 10px;
              background-color: white;
              transition: all 0.5s;
              border: 1px solid;
            }
            #top {
              cursor: pointer;
            }
            a:hover {
              text-decoration: underline;
            }
            #toolbar.show {
              visibility: visible;
              opacity: 1; 
            }
          </style>
          <div id="toolbar">
            <a id="top">Top</a>
          </div>
          `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  addScrollEventListener() {
    const toolbar = this.shadowRoot.getElementById("toolbar");
    document.addEventListener("scroll", () => {
      if (document.documentElement.scrollTop > window.innerHeight) {
        toolbar.setAttribute("class", "show");
      } else {
        toolbar.setAttribute("class", "");
      }
    });
  }

  addButtonEventListener() {
    const anchor = this.shadowRoot.getElementById("top");
    anchor.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

if (!customElements.get("berry-toolbar")) {
  customElements.define("berry-toolbar", ToolbarComponent);
}

export default ToolbarComponent;
