import{fetchData}from"/scripts/fetchData.js";import{handleThemeChange}from"/scripts/theme.js";class ArticleSubheading extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.loadStyles(),document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render(),initSubheading(this)}loadStyles(){let e=this.shadowRoot.querySelector("style");e||(e=document.createElement("style"),this.shadowRoot.appendChild(e));e.textContent='\n    :host {\n      width: 100%;\n      --title-font: "Lucida Bright", "Palatino Linotype", "Book Antiqua", Palatino,\n    "Times New Roman", Times, Georgia, serif;\n    }\n    .heading {\n      margin: 0;\n      text-align: center;\n      font-family: var(--title-font);\n    }\n    #link-container {\n      position: relative;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      gap: 1em;\n      width: 100%;\n      margin: 1em 0;\n    }\n    .prev {\n      padding-left: 2em;\n    }\n    .next {\n      text-align: right;\n      padding-right: 2em;\n    }\n    .prev:before, .next:after {\n      position: absolute;\n      top: 50%;\n      transform: translateY(-50%);\n    }\n    .prev:before {\n      content: \'←\';\n      left: 0;\n    }\n    .next:after {\n      content: \'→\';\n      right: 0;\n    }\n    h2 {\n      color: var(--text-color);\n      font-size: 2em;\n    }\n    h4 {\n      font-size: 1.5em;\n      color: grey;\n    }\n    a {\n      flex-basis: 40%;\n      color: var(--link-color);\n      text-decoration: none;\n    }\n    a:hover {\n      text-decoration: underline var(--text-color);\n    }\n    a:visited {\n      color: var(--link-visited-color);\n    }\n    '}renderHeading(e,n){const t=this.shadowRoot.getElementById(e);t?t.textContent=n:console.error("Element not found:",e)}renderLink(e,n){const t=this.shadowRoot.getElementById("link-container");if(e){const n=document.createElement("a");n.className="prev",n.href=e.filename,n.textContent=e.title,n.title=`Previous: ${e.title}`,t.appendChild(n)}if(n){const e=document.createElement("a");e.className="next",e.href=n.filename,e.textContent=n.title,e.title=`Next: ${n.title}`,t.appendChild(e)}}render(){const e=document.createElement("template");e.innerHTML='\n      <h2 id="heading" class="heading"></h2>\n      <h4 id="subheading" class="heading"></h4>\n      <div id="link-container">\n  \n      </div>\n    ',this.shadowRoot.appendChild(e.content.cloneNode(!0))}}async function initSubheading(e){const n=window.location.pathname.split("-");let t=n[0].endsWith("misc")?"/articles/misc/data/misc.json":"/articles/new/data/new.json";const i=await fetchData(t);if(i){const t=parseInt(n[1]),a=i.findIndex((e=>e.id===t));let o=-1===a?{title:null,subheading:null}:i[a];o.title&&e.renderHeading("heading",o.title),o.subheading&&e.renderHeading("subheading",o.subheading),e.renderLink(i[a-1],i[a+1])}}customElements.get("berry-heading")||customElements.define("berry-heading",ArticleSubheading);export default ArticleSubheading;