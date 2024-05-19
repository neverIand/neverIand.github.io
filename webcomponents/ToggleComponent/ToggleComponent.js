class ToggleComponent extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.render(),this.addClickListener()}render(){const e=this.getAttribute("data-size")||"50px",t=this.getAttribute("data-label")||"",n=""===this.getAttribute("data-checked"),o=document.createElement("template");o.innerHTML=`\n    <style>\n    :host {\n      --btn-width: ${e};\n      --btn-height: calc(var(--btn-width) * 0.6);\n      --toggle-diameter: calc(var(--btn-width) * 0.5);\n      --toggle-shadow-offset: calc(var(--btn-width) * 0.02);\n      --toggle-wide: calc(var(--toggle-diameter) * 1.2);\n      --color-grey: #E9E9EA;\n      --color-dark-grey: #39393D;\n      --color-green: #30D158;\n      --color-purple: rgb(121,0,142);\n    }\n    span {\n      display: inline-block;\n      position: relative;\n      width: var(--btn-width);\n      height: var(--btn-height);\n      background-color: var(--color-grey);\n      border: 1px solid var(--color-dark-grey);\n      transition: .3s all ease-in-out;\n      cursor: pointer;\n    }\n    span::after {\n      position: absolute;\n      top: 0;\n      content: '${t}';\n      display: inline-block;\n      width: var(--toggle-diameter);\n      height: var(--btn-height);\n      background-color: #fff;\n      transform: translateX(0px);\n      box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.5);\n      transition: .3s all ease-in-out;\n    }\n    input[type="checkbox"]:checked+span {\n      background-color: var(--color-purple);\n    }\n    input[type="checkbox"]:checked + span::after {\n      transform: translateX(calc(var(--btn-width) - var(--toggle-diameter)));\n      box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0,0,0,0.5);\n    }\n    input[type="checkbox"]:active + span::after {\n      width: var(--toggle-wide);\n    }\n    input[type="checkbox"]:checked:active + span::after {\n      transform: translateX(calc(var(--btn-width) - var(--toggle-wide)));\n    }\n    input[type="checkbox"] {\n      display: none;\n    }\n    </style>\n    <label for="toggle">\n      <input type="checkbox" id="toggle" ${n?"checked":""}>\n      <span></span>\n    </label>\n    `,this.shadowRoot.appendChild(o.content.cloneNode(!0))}addClickListener(){const e=this.shadowRoot.querySelector("input");e.addEventListener("click",(t=>{this.setAttribute("data-checked",e.checked),t.stopPropagation()}))}}customElements.get("berry-toggle")||customElements.define("berry-toggle",ToggleComponent);export default ToggleComponent;