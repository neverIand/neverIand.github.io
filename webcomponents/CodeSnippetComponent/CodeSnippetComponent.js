import{handleThemeChange}from"/scripts/theme.js";import"/webcomponents/ChipComponent/ChipComponent.js";class CodeSnippet extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.loadStyles(),document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render(),this.addCopyButtonEventListener(),this.updateLineNumbers()}loadStyles(){const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","/webcomponents/CodeSnippetComponent/CodeSnippetComponent.css"),this.shadowRoot.appendChild(e)}render(){const e=this.getAttribute("code-lang")||"javascript",t=""===this.getAttribute("nohighlight"),n=""===this.getAttribute("runnable")&&"javascript"===e,o=this.getAttribute("data-title")||"Code Snippet",s=document.createElement("template");if(s.innerHTML=`\n    <div class="snippet-container">\n        <div class="snippet-header" data-title="${o}">\n          <berry-chip data-label="${e}" variant="code"></berry-chip>\n          <div class="btn-wrapper">\n            <button id="copy-btn">Copy</button>\n          </div>\n        </div>\n        <div class="snippet-content">\n            <div class="line-numbers text"></div>\n            <slot name="code">If you can't see the code snippet, it's likely that you are in Safari's reader mode. You'll need to exit reader mode to view or copy the code.</slot>\n        </div>\n    </div>\n    ${n?'\n      <div class="snippet-container">\n        <div class="snippet-header" style="justify-content: space-between;">\n          Result\n          <button id="run-btn">Run</button>\n        </div>\n        <div id="result" class="snippet-content text">\n        </div>\n      </div>':""}\n    `,this.shadowRoot.appendChild(s.content.cloneNode(!0)),!t){this.querySelector("pre").style.display="none",this.highlightCode()}n&&this.addRunButtonEventListener()}updateLineNumbers(){const e=this.shadowRoot.querySelector("slot[name='code']").assignedNodes({flatten:!0}).find((e=>e.nodeType===Node.TEXT_NODE||"PRE"===e.tagName)),t=(e?e.textContent:"").split("\n"),n=this.shadowRoot.querySelector(".line-numbers"),o=document.createDocumentFragment();for(let e=0;e<t.length;e++){const t=document.createElement("br"),n=document.createElement("span");n.textContent=`${e+1}`,o.appendChild(n),o.appendChild(t)}n.appendChild(o)}addCopyButtonEventListener(){this.shadowRoot.getElementById("copy-btn").addEventListener("click",(()=>{this.copyCodeToClipboard()}))}copyCodeToClipboard(){const e=this.shadowRoot.querySelector('slot[name="code"]').assignedNodes({flatten:!0}).map((e=>e.textContent)).join("\n");navigator.clipboard.writeText(e).then((()=>{const e="Code copied to clipboard!";console.log(e);const t=new CustomEvent("berry-toast",{detail:{type:"success",message:e}});document.dispatchEvent(t)})).catch((e=>{const t=`Failed to copy code: ${e}`;console.error(t);const n=new CustomEvent("berry-toast",{detail:{type:"error",message:t}});document.dispatchEvent(n)}))}highlightCode(){const e=this.shadowRoot.querySelector('slot[name="code"]');if(!e)return void console.error("Code slot not found");const t=e.assignedNodes({flatten:!0}).find((e=>e.nodeType===Node.TEXT_NODE||e.nodeType===Node.ELEMENT_NODE&&"PRE"===e.tagName));if(!t)return void console.error("No code node found in slot");let n=t.textContent;const o=this.getAttribute("code-lang")||"javascript";n=n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");let s="";if("css"===o)s=n.replace(/(".*?"|'.*?')/g,'<span class="string">$1</span>').replace(/(\b[\w-]+)(\s*:)([^;]*)(;)/g,'<span class="css-prop">$1</span>$2<span class="css-val">$3</span>$4').replace(/(@[\w-]+)/g,'<span class="keyword">$1</span>');else{const e=[];let t;switch(o){case"python":t=/(\"\"\"[\s\S]*?\"\"\"|'''.*?'''|".*?"|'.*?'|#.*?$)|[^"'#]+/gm;break;case"javascript":t=/(\".*?\"|'.*?'|`.*?`|\/\*[\s\S]*?\*\/|\/\/.*?$)|[^"'`\/]+/gm;break;default:e.push({type:"code",value:n})}if(t){let o;for(;null!==(o=t.exec(n));)o[1]?e.push({type:"strOrComment",value:o[1]}):e.push({type:"code",value:o[0]})}e.forEach((e=>{if("code"===e.type){const t={javascript:"\\b(?:if|else|switch|case|for|while|do|break|continue|function|return|class|constructor|extends|super|new|delete|typeof|instanceof|try|catch|finally|throw|let|const|async|await|import|export|this|null|true|false|undefined|var)\\b",python:"\\b(?:def|return|if|elif|else|for|while|break|continue|class|try|except|finally|with|as|import|from|lambda|pass|raise|yield|global|nonlocal|assert|True|False|None)\\b"}[o];t&&(e.value=e.value.replace(new RegExp(t,"g"),'<span class="keyword">$&</span>'))}else if("strOrComment"===e.type){const t=e.value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");e.value.startsWith('"')||e.value.startsWith("'")||e.value.startsWith("`")?e.value='<span class="string">'+t+"</span>":(e.value.startsWith("/*")||e.value.startsWith("//")||e.value.startsWith("#"))&&(e.value='<span class="comment">'+t+"</span>")}})),s=e.map((e=>e.value)).join("")}const a=document.createElement("pre");a.innerHTML=s,e.insertAdjacentElement("beforebegin",a),e.style.display="none"}addRunButtonEventListener(){const e=this.shadowRoot.getElementById("run-btn");e&&e.addEventListener("click",(()=>this.runCode()))}runCode(){const e=this.shadowRoot.querySelector('slot[name="code"]').assignedNodes({flatten:!0}).map((e=>e.textContent)).join("\n"),t=this.shadowRoot.getElementById("result");t.innerHTML="";const n=console.log;console.log=(...e)=>{t.innerHTML+=e.join(" ")+"<br>"};try{new Function(e)()}catch(e){t.innerHTML=`<span style="color: red;">Error: ${e.message}</span>`}console.log=n}}customElements.get("berry-code")||customElements.define("berry-code",CodeSnippet);export default CodeSnippet;