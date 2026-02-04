const criticalStyles = [
  "/webcomponents/HeaderComponent/HeaderComponent.css",
  "/webcomponents/LogoComponent.css",
];

const head = document.head;
if (head) {
  criticalStyles.forEach((href) => {
    const existing = head.querySelector(
      `link[rel="preload"][href="${href}"]`
    );
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = href;
    head.appendChild(link);
  });
}
