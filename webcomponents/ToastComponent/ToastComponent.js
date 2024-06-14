import { handleThemeChange } from "/scripts/theme.js";
class ToastComponent extends HTMLElement {
  toastQueue = [];
  isToastVisible = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    document.addEventListener("berry-theme", (e) => handleThemeChange(e, this));
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
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            transform: translateY(-200%);
            z-index: 500;
          }
          .toast-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
            transform: translateY(calc(200% + 70px));
          }
          .toast {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px 20px;
            color: var(--bg-color);
            background-color: var(--text-color);
            transition: all 0.3s;
            opacity: 1;
            user-select: none;
            pointer-events: none;
          }
          .toast.show {
            transform: translateY(0);
          }
          .toast.hide {
            transform: translateY(-200%);
            opacity: 0;
          }
          .toast.error {
            background-color: red;
          }
          .toast.warning {
            background-color: orange;
          }
        </style>
        <div class="toast-container"></div>
        `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.addCopyEventListener();
  }

  addCopyEventListener() {
    document.addEventListener(
      "berry-toast",
      function (e) {
        this.addToQueue(e.detail.message, e.detail.type);
      }.bind(this)
    );
  }

  addToQueue(message, type) {
    this.toastQueue.push({ message, type });
    if (!this.isToastVisible) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.toastQueue.length > 0) {
      const { message, type } = this.toastQueue.shift();
      this.showToast(message, type);
    }
  }

  showToast(message, type) {
    const timeout = this.getAttribute("timeout") || 2000;
    const container = this.shadowRoot.querySelector(".toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast", "show", type);
    toast.textContent = message;

    container.appendChild(toast);

    // TODO: improve enter animation
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
      setTimeout(() => {
        container.removeChild(toast);
      }, 300); // Match this duration with CSS transition duration
    }, timeout);
  }
}

if (!customElements.get("berry-toast")) {
  customElements.define("berry-toast", ToastComponent);
}

export default ToastComponent;
