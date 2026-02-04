export function attachShadowStylesheet(
  shadowRoot,
  href,
  { preload = false } = {}
) {
  if (!shadowRoot || !href) return;

  if (preload && document?.head) {
    const existingPreload = document.head.querySelector(
      `link[rel="preload"][href="${href}"]`
    );
    if (!existingPreload) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "style";
      preloadLink.href = href;
      document.head.appendChild(preloadLink);
    }
  }

  const existingLink = shadowRoot.querySelector(
    `link[rel="stylesheet"][href="${href}"]`
  );
  if (existingLink) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  shadowRoot.appendChild(link);
}
