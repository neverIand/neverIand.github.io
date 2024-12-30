export function preloadStyles(href) {
  const preloadLink = document.createElement("link");
  preloadLink.setAttribute("rel", "preload");
  preloadLink.setAttribute("as", "style");
  preloadLink.setAttribute("href", href);
  document.head.appendChild(preloadLink);
}
