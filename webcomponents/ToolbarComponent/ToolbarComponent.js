class ToolbarComponent extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.addScrollEventListener(),this.addButtonEventListener()}render(){const t=document.createElement("template");t.innerHTML='\n          <style>\n            :host {\n              position: fixed;\n              bottom: 4em;\n              right: 10px;\n            }\n            #toolbar {\n              visibility: hidden;\n              opacity: 0;\n              padding: 10px;\n              background-color: white;\n              transition: all 0.5s;\n              border: 1px solid;\n            }\n            #top {\n              cursor: pointer;\n            }\n            a:hover {\n              text-decoration: underline;\n            }\n            #toolbar.show {\n              visibility: visible;\n              opacity: 1; \n            }\n          </style>\n          <div id="toolbar">\n            <a id="top">Top</a>\n          </div>\n          ',this.shadowRoot.appendChild(t.content.cloneNode(!0))}addScrollEventListener(){const t=this.shadowRoot.getElementById("toolbar");document.addEventListener("scroll",(()=>{document.documentElement.scrollTop>window.innerHeight?t.setAttribute("class","show"):t.setAttribute("class","")}))}addButtonEventListener(){this.shadowRoot.getElementById("top").addEventListener("click",(()=>{window.scrollTo({top:0,behavior:"smooth"})}))}}customElements.get("berry-toolbar")||customElements.define("berry-toolbar",ToolbarComponent);export default ToolbarComponent;