import{handleThemeChange}from"/scripts/theme.js";class ToastComponent extends HTMLElement{toastQueue=[];isToastVisible=!1;constructor(){super(),this.attachShadow({mode:"open"}),document.addEventListener("berry-theme",(t=>handleThemeChange(t,this)))}connectedCallback(){this.render()}render(){const t=document.createElement("template");t.innerHTML='\n        <style>\n          :host {\n            position: fixed;\n            top: 0;\n            left: 0;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            width: 100%;\n            transform: translateY(-200%);\n            z-index: 500;\n          }\n          .toast-container {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            width: 100%;\n            padding: 10px;\n            box-sizing: border-box;\n            transform: translateY(calc(200% + 70px));\n          }\n          .toast {\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            padding: 10px 20px;\n            color: var(--bg-color);\n            background-color: var(--text-color);\n            transition: all 0.3s;\n            opacity: 1;\n            user-select: none;\n            pointer-events: none;\n          }\n          .toast.show {\n            transform: translateY(0);\n          }\n          .toast.hide {\n            transform: translateY(-200%);\n            opacity: 0;\n          }\n          .toast.error {\n            background-color: red;\n          }\n          .toast.warning {\n            background-color: orange;\n          }\n        </style>\n        <div class="toast-container"></div>\n        ',this.shadowRoot.appendChild(t.content.cloneNode(!0)),this.addCopyEventListener()}addCopyEventListener(){document.addEventListener("berry-toast",function(t){this.addToQueue(t.detail.message,t.detail.type)}.bind(this))}addToQueue(t,e){this.toastQueue.push({message:t,type:e}),this.isToastVisible||this.processQueue()}processQueue(){if(this.toastQueue.length>0){const{message:t,type:e}=this.toastQueue.shift();this.showToast(t,e)}}showToast(t,e){const n=this.getAttribute("timeout")||2e3,s=this.shadowRoot.querySelector(".toast-container"),o=document.createElement("div");o.classList.add("toast","show",e),o.textContent=t,s.appendChild(o),setTimeout((()=>{o.classList.remove("show"),o.classList.add("hide"),setTimeout((()=>{s.removeChild(o)}),300)}),n)}}customElements.get("berry-toast")||customElements.define("berry-toast",ToastComponent);export default ToastComponent;