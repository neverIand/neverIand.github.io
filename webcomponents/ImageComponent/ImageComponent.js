class ImageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  // or just use arrow function
  addFullScreenEventListener(src) {
    const img = this.shadowRoot.getElementById("image");
    img.addEventListener(
      "click",
      function () {
        this.toggleFullscreen(img, src);
      }.bind(this)
    );
  }

  render() {
    const title = this.getAttribute("data-title") || "";
    const placeholder = this.getAttribute("data-alt") || title;
    const width = this.getAttribute("data-width") || "auto";

    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <style>
        :host {
          display: block;
        }
        #container {
          position: relative;
          width: 100%;
          max-width: ${width};
          margin-top: 0.5em;
        }
        p {
          margin: 0;
          text-align: center;
        }
        img {
          opacity: 0;
          width: 100%;
          height: auto;
          transition: opacity 0.5s;
        }
        #modal {
          display: none;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 9999;
        }
        #modal img{
          opacity: 1;
          max-width: 100%;
          aspect-ratio: auto;
        }
      </style>
      <div id="container">
        <img id="image" title="${title}" alt="${placeholder}"></img>
        <p>${title}<p>
      </div>
      <div id="modal">
        <img></img>
      </div>
      `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const src = this.getAttribute("data-src");
    this.addFullScreenEventListener(src);
    this.observeImage(src);
  }

  observeImage(src) {
    const img = this.shadowRoot.getElementById("image");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src || "/articles/images/NoMediaAvailable.png";
            img.onload = () => (img.style.opacity = "1"); // Fade in the image once loaded
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(img);
  }

  toggleFullscreen(img, src) {
    // this.showModal(src);
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) {
        img.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
          );
          this.showModal(src); // Show modal on fullscreen error
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } else {
      this.showModal(src); // Show modal if fullscreen is not supported
    }
  }

  showModal(src) {
    const modal = this.shadowRoot.getElementById("modal");
    modal.style.display = "flex";
    const img = modal.querySelector("img");
    img.src = src;
    img.addEventListener("click", function () {
      modal.style.display = "none";
      const blockScrollEvent = new CustomEvent("blockScroll", {
        detail: { block: false },
      });
      document.dispatchEvent(blockScrollEvent);
    });
    const blockScrollEvent = new CustomEvent("blockScroll", {
      detail: { block: true },
    });
    document.dispatchEvent(blockScrollEvent);
  }
}

if (!customElements.get("berry-img")) {
  customElements.define("berry-img", ImageComponent);
}

export default ImageComponent;
