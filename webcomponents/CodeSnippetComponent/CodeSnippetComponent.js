import{handleThemeChange}from"/scripts/theme.js";class CodeSnippet extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.loadStyles(),document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render(),this.addCopyButtonEventListener(),this.updateLineNumbers()}loadStyles(){const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","/webcomponents/CodeSnippetComponent/CodeSnippetComponent.css"),this.shadowRoot.appendChild(e)}render(){const e=""===this.getAttribute("nohighlight"),t=""===this.getAttribute("runnable"),n=this.getAttribute("data-title")||"Code Snippet",o=document.createElement("template");if(o.innerHTML=`\n    <div class="snippet-container">\n        <div class="snippet-header">\n          ${n}\n          <div class="btn-wrapper">\n            ${e?"":'<input type="checkbox" id="og-btn" data-hl="true" checked /><label for="og-btn">Highlight</label>'}\n            <button id="copy-btn">Copy</button>\n          </div>\n        </div>\n        <div class="snippet-content">\n            <div class="line-numbers text"></div>\n            <slot name="code">If you can't see the code snippet, it's likely that you are in Safari's reader mode. You'll need to exit reader mode to view or copy the code.</slot>\n        </div>\n    </div>\n    ${t?'\n      <div class="snippet-container">\n        <div class="snippet-header">\n          Result\n          <button id="run-btn">Run</button>\n        </div>\n        <div id="result" class="snippet-content text">\n        </div>\n      </div>':""}\n    `,this.shadowRoot.appendChild(o.content.cloneNode(!0)),!e){this.querySelector("pre").style.display="none",this.highlightCode(),this.addShowOGEventListener()}t&&this.addRunButtonEventListener()}updateLineNumbers(){const e=this.shadowRoot.querySelector("slot[name='code']").assignedNodes({flatten:!0}).find((e=>e.nodeType===Node.TEXT_NODE||"PRE"===e.tagName)),t=(e?e.textContent:"").split("\n"),n=this.shadowRoot.querySelector(".line-numbers"),o=document.createDocumentFragment();for(let e=0;e<t.length;e++){const t=document.createElement("br"),n=document.createElement("span");n.textContent=`${e+1}`,o.appendChild(n),o.appendChild(t)}n.appendChild(o)}addShowOGEventListener(){const e=this.shadowRoot.getElementById("og-btn");e.addEventListener("click",(()=>{const t=this.querySelector("pre"),n=this.shadowRoot.querySelector("pre");"true"===e.getAttribute("data-hl")?(t.style.display="block",n.style.display="none",e.setAttribute("data-hl",!1)):(t.style.display="none",n.style.display="block",e.setAttribute("data-hl",!0))}))}addCopyButtonEventListener(){this.shadowRoot.getElementById("copy-btn").addEventListener("click",(()=>{this.copyCodeToClipboard()}))}copyCodeToClipboard(){const e=this.shadowRoot.querySelector('slot[name="code"]').assignedNodes({flatten:!0}).map((e=>e.textContent)).join("\n");navigator.clipboard.writeText(e).then((()=>{const e="Code copied to clipboard!";console.log(e);const t=new CustomEvent("berry-toast",{detail:{type:"success",message:e}});document.dispatchEvent(t)})).catch((e=>{const t=`Failed to copy code: ${e}`;console.error(t);const n=new CustomEvent("berry-toast",{detail:{type:"error",message:t}});document.dispatchEvent(n)}))}highlightCode(){const e=this.shadowRoot.querySelector('slot[name="code"]');if(!e)return void console.error("Code slot not found");let t=Array.from(e.assignedNodes({flatten:!0})).map((e=>e.nodeType===Node.TEXT_NODE?e.textContent:e.outerHTML)).join("");t=t.replace(new RegExp("\\b(if|else|switch|case|for|while|do|break|continue|function|return|class|constructor|extends|super|new|delete|typeof|instanceof|try|catch|finally|throw|let|const|async|await|import|export|this|null|true|false|undefined|var)\\b","g"),'<span class="keyword">$1</span>'),t=t.replace(/(\/\/.*$)/gm,'<span class="comment">$1</span>'),t=t.replace(/(\/\*[\s\S]*?\*\/)/gm,'<span class="comment">$1</span>'),e.insertAdjacentHTML("beforebegin",t),this.shadowRoot.querySelector("pre").style.display="block"}addRunButtonEventListener(){const e=this.shadowRoot.getElementById("run-btn");e&&e.addEventListener("click",(()=>this.runCode()))}runCode(){const e=this.shadowRoot.querySelector('slot[name="code"]').assignedNodes({flatten:!0}).map((e=>e.textContent)).join("\n"),t=this.shadowRoot.getElementById("result");t.innerHTML="";const n=console.log;console.log=(...e)=>{t.innerHTML+=e.join(" ")+"<br>"};try{new Function(e)()}catch(e){t.innerHTML=`<span style="color: red;">Error: ${e.message}</span>`}console.log=n}}customElements.get("berry-code")||customElements.define("berry-code",CodeSnippet);export default CodeSnippet;