import{handleThemeChange}from"/scripts/theme.js";class ChipComponent extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render()}render(){const e=this.getAttribute("data-label")||"",n=document.createElement("template");n.innerHTML=`\n    <span title="${e}">${e}</span>\n`,this.styles=document.createElement("style"),this.styles.innerHTML="\n    :host{\n      display: inline-block;\n    }\n    span{\n      margin: 0 4px;\n      padding: 0 8px;\n      color: white;\n      background-color: rgb(100, 100, 100);\n      border-radius: 4px;\n      cursor: default;\n    }\n    ",this.shadowRoot.appendChild(this.styles.cloneNode(!0)),this.shadowRoot.appendChild(n.content.cloneNode(!0))}}customElements.get("berry-chip")||customElements.define("berry-chip",ChipComponent);export default ChipComponent;