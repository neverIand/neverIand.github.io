class CustomFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        this.loadStyles();
    }

    connectedCallback() {
        this.render();
        // this.attachInfo();
    }

    loadStyles() {
        const styles = document.createElement("style");
        styles.textContent = `
:host {
width: 100%;
font-family: var(--font-main, sans-serif);
border: 1px solid;
}

.footer {

}

ul {
display: flex;
flex-wrap: wrap;
justify-content: center;
gap: 10px;
margin: 0;
padding: 10px;
list-style: none;
}
`;
        this.shadowRoot.appendChild(styles);
    }

    render() {
        // Create and append the footer template
        const template = document.createElement("template");
        template.innerHTML = /*html*/ `
<footer class="footer">
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