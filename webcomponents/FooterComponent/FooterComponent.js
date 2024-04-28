class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({
      mode: "open",
    });
    this.loadStyles();
  }

  connectedCallback() {
    this.render();
    // this.attachInfo();
  }

  loadStyles() {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute(
      "href",
      "/webcomponents/FooterComponent/FooterComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  render() {
    // Create and append the footer template
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <footer id="footer">
        <ul>
          <li><a href="https://github.com/neverIand">Github</a></li>
          <li><a href="mailto:rickytang2019@gmail.com">Email</a></li>
          <li><a href="https://www.youtube.com/@ratch3t673">Youtube</a></li>
        </ul>
    </footer>
`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

if (!customElements.get("berry-footer")) {
  customElements.define("berry-footer", CustomFooter);
}

export default CustomFooter;
