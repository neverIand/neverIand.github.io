import{handleThemeChange}from"/scripts/theme.js";class ChipComponent extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render()}render(){const e=document.createElement("template");e.innerHTML="\n    <div>\n    chip\n    </div>\n",this.shadowRoot.appendChild(e.content.cloneNode(!0))}}customElements.get("berry-chip")||customElements.define("berry-chip",ChipComponent);export default ChipComponent;