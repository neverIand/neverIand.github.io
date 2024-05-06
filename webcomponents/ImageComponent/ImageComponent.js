class ImageComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // this.img = document.createElement("img");
    // this.img.addEventListener("click", () => this.toggleFullscreen());
  }

  connectedCallback() {
    this.render();
  }

  addFullScreenEventListener() {
    const img = this.shadowRoot.getElementById("image");
    img.addEventListener("click", this.toggleFullscreen());
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
        }
        p {
          margin: 0;
          text-align: center;
        }
        img {
          opacity: 0;
          width: 100%;
          max-width: ${width};
          height: auto;
          transition: opacity 0.5s;
        }
        #modal {
          display: none;
          justify-content: center;
          align-items: flex-start;
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

    this.observeImage();
  }

  observeImage() {
    const img = this.shadowRoot.getElementById("image");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src =
              this.getAttribute("data-src") ||
              "/articles/images/NoMediaAvailable.png";
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

  toggleFullscreen() {
    // this.showModal();
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) {
        this.img.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
          );
          this.showModal(); // Show modal on fullscreen error
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    } else {
      this.showModal(); // Show modal if fullscreen is not supported
    }
  }

  showModal() {
    const modal = this.shadowRoot.getElementById("modal");
    modal.style.display = "flex";
    const img = modal.querySelector("img");
    img.src = this.img.src;
    img.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }
}

if (!customElements.get("berry-img")) {
  customElements.define("berry-img", ImageComponent);
}

export default ImageComponent;
