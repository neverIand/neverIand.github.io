import"/webcomponents/DateComponent/DateComponent.js";import"/webcomponents/SubheadingComponent/SubheadingComponent.js";import"/webcomponents/CodeSnippetComponent/CodeSnippetComponent.js";import"/webcomponents/ToastComponent/ToastComponent.js";import{getTheme}from"./theme.js";function replaceColor(e,o){return e.replace(/bgcol=([0-9A-Fa-f]{6})/,`bgcol=${o}`)}function updatePlayerTheme(e,o){const t="dark"===o?"333333":"ffffff";e.src=replaceColor(e.src,t)}document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".bandcamp-player");e&&(updatePlayerTheme(e,getTheme()),document.addEventListener("berry-theme",(o=>{updatePlayerTheme(e,o.detail.theme)})))}));