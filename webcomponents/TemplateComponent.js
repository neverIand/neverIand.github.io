import{handleThemeChange}from"/scripts/theme.js";const CSS="\n:host {\n  display: block;\n}\n",templateStyles=new CSSStyleSheet;templateStyles.replaceSync(CSS);class TemplateComponent extends HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"});if("adoptedStyleSheets"in e)e.adoptedStyleSheets=[templateStyles];else{const t=document.createElement("style");t.textContent=headerStyles.cssText||CSS,e.appendChild(t)}document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render()}render(){const e=document.createElement("template");e.innerHTML="\n      <div>\n      </div>\n    ",this.shadowRoot.appendChild(e.content.cloneNode(!0))}}customElements.get("berry-template")||customElements.define("berry-template",TemplateComponent);export default TemplateComponent;