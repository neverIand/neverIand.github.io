class ToastComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
        <style>
          :host {
            position: fixed;
            top: 0;
            left: 10px;
            transform: translateY(-200%);
          }
          #toast {
            padding: 10px 20px;
            color: white;
            background-color: black;
            transition: all 0.5s;
          }
          .show {
            transform: translateY(200%);
          }
        </style>
        <div id="toast">
          toast
        </div>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addCopyEventListener();
  }

  addCopyEventListener() {
    document.addEventListener(
      "berry-copy",
      function (e) {
        this.showToast(e);
      }.bind(this)
    );
  }

  showToast(e) {
    const t = this.shadowRoot.getElementById("toast");
    t.textContent = e.detail.message;
    t.classList.add("show");
    // TODO: toast type
    setTimeout(function () {
      t.classList.remove("show");
    }, 2000);
  }
}

if (!customElements.get("berry-toast")) {
  customElements.define("berry-toast", ToastComponent);
}

export default ToastComponent;
