class CustomDate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
  }

  connectedCallback() {
    this.render();
  }

  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "/webcomponents/DateComponent/DateComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  render() {
    const date = this.getAttribute("datetime");
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
      <time datetime="${date}">
        ${date}
      </time>
  `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-date")) {
  customElements.define("berry-date", CustomDate);
}

export default CustomDate;
