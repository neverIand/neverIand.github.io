import{fetchData}from"/scripts/fetchData.js";import{handleThemeChange}from"/scripts/theme.js";class ArticleSubheading extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.loadStyles(),document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render(),initSubheading(this)}loadStyles(){let e=this.shadowRoot.querySelector("style");e||(e=document.createElement("style"),this.shadowRoot.appendChild(e));e.textContent='\n    :host {\n      --title-font: "Lucida Bright", "Palatino Linotype", "Book Antiqua", Palatino,\n    "Times New Roman", Times, Georgia, serif;\n    }\n    .heading {\n      margin: 0;\n      text-align: center;\n      font-family: var(--title-font);\n    }\n    h2 {\n      color: var(--text-color);\n      font-size: 2em;\n    }\n    h4 {\n      font-size: 1.5em;\n      color: grey;\n    }\n    '}renderHeading(e,t){const n=this.shadowRoot.getElementById(e);n?n.textContent=t:console.error("Element not found:",e)}render(){const e=document.createElement("template");e.innerHTML='\n      <h2 id="heading" class="heading"></h2>\n      <h4 id="subheading" class="heading"></h4>\n    ',this.shadowRoot.appendChild(e.content.cloneNode(!0))}}async function initSubheading(e){const t=window.location.pathname.split("-");let n=t[0].endsWith("misc")?"/articles/misc/data/misc.json":"/articles/new/data/new.json";const i=await fetchData(n);if(i){const n=parseInt(t[1]),a=i.find((e=>e.id===n))||{subheading:"(No subheading for this article)"};e.renderHeading("heading",a.title),e.renderHeading("subheading",a.subheading)}}customElements.get("berry-heading")||customElements.define("berry-heading",ArticleSubheading);export default ArticleSubheading;