import{dispatchThemeChangeEvent,getTheme,handleThemeChange}from"../../scripts/theme.js";import"../LogoComponent.js";import"../ToggleComponent/ToggleComponent.js";const CSS='\n  :host {\n    display: block;\n    --header-height: 60px;\n    background: var(--header-bg-color, white);\n  }\n  header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 1em;\n    padding: 0 1em;\n    height: var(--header-height);\n  }\n  #logo {\n    display: flex;\n    align-items: center;\n    gap: 0.5em;\n  }\n  #links ul {\n    display: flex;\n    gap: 1em;\n    margin: 0;\n    padding: 0;\n    list-style: none;\n  }\n  #links ul > li {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n  #logo > a,\n  #links a {\n    color: var(--text-color);\n    text-decoration: none;\n  }\n  #logo > a:hover,\n  #links a:hover {\n    text-decoration: underline;\n  }\n  #menu-toggle { display: none; }\n  .menu-icon {\n    display: none;\n    width: 30px;\n    height: 24px;\n    flex-shrink: 0;\n    cursor: pointer;\n    position: relative;\n  }\n  .menu-icon span,\n  .menu-icon span::before,\n  .menu-icon span::after {\n    content: "";\n    display: block;\n    width: 100%;\n    height: 3px;\n    background: var(--text-color);\n    border-radius: 2px;\n    position: absolute;\n  }\n  .menu-icon span::before { top: 8px; }\n  .menu-icon span::after  { top: 16px; }\n  .nav-menu { display: flex; gap: 1em; }\n  @media (max-width: 768px) {\n    header h1 { display: none; } /* hide title */\n    .menu-icon { display: block; }\n    .nav-menu {\n      display: none;\n      position: absolute;\n      top: var(--header-height);\n      right: 0;\n      background: var(--header-bg-color, white);\n      flex-direction: column;\n      padding: 1em;\n      box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n    }\n    #menu-toggle:checked ~ .nav-menu {\n      display: flex;\n    }\n    #menu-toggle:checked ~ .nav-menu ul {\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: flex-start;\n    }\n  }\n',headerStyles=new CSSStyleSheet;headerStyles.replaceSync(CSS);class CustomHeader extends HTMLElement{constructor(){super();const e=this.attachShadow({mode:"open"});if("adoptedStyleSheets"in e)e.adoptedStyleSheets=[headerStyles];else{const n=document.createElement("style");n.textContent=headerStyles.cssText||CSS,e.appendChild(n)}document.addEventListener("berry-theme",(e=>handleThemeChange(e,this)))}connectedCallback(){this.render()}render(){const e=this.hasAttribute("disable-theme-toggle"),n=document.createElement("template");n.innerHTML=`\n      <header>\n        <div id="logo">\n          <a href="/" title="home"><berry-logo size="50"></berry-logo></a>\n          <a href="/" title="home"><h1>neverIand</h1></a>\n        </div>\n        <input type="checkbox" id="menu-toggle">\n        <label for="menu-toggle" class="menu-icon" aria-label="Toggle navigation">\n          <span></span>\n        </label>\n        <nav id="links" class="nav-menu">\n          <ul>\n            <li><a href="/articles/misc/profile.html">about</a></li>\n            <li><a href="/articles/archived/index.html">archived</a></li>\n            <li><berry-toggle data-label="🌙" ${"dark"===getTheme()?"data-checked":""}></berry-toggle></li>\n          </ul>\n        </nav>\n      </header>\n    `,this.shadowRoot.appendChild(n.content.cloneNode(!0)),e||this.addThemeListener()}addThemeListener(){const e=this.shadowRoot.querySelector("berry-toggle");e&&e.addEventListener("click",(()=>dispatchThemeChangeEvent()))}}customElements.get("berry-header")||customElements.define("berry-header",CustomHeader);export default CustomHeader;