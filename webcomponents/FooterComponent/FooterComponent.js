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
      "../../webcomponents/FooterComponent/FooterComponent.css"
    );
    this.shadowRoot.appendChild(styles);
  }

  render() {
    // Create and append the footer template
    const template = document.createElement("template");
    template.innerHTML = /*html*/ `
    <footer id="footer">
        <ul>
            <li><slot name="github">Default GitHub Link</slot></li>
            <li><slot name="email">Default Email Link</slot></li>
            <li><slot name="youtube">Default YouTube Link</slot></li>
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
