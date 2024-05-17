export function getTheme() {
  const storedTheme = localStorage.getItem("berry-theme");
  if (storedTheme) return storedTheme;

  if (window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }

  return "light";
}

export function setTheme(theme) {
  try {
    localStorage.setItem("berry-theme", theme);
    return theme;
  } catch (e) {
    console.error(e);
    const errEvent = new CustomEvent("berry-toast", {
      detail: { type: "error", message: e },
    });
    document.dispatchEvent(errEvent);
  }
}

export function getInverseTheme() {
  return getTheme() === "light" ? "dark" : "light";
}

export function dispatchThemeChangeEvent() {
  const result = setTheme(getInverseTheme());
  if (result) {
    const themeEvent = new CustomEvent("berry-theme", {
      detail: { theme: result },
    });
    document.dispatchEvent(themeEvent);
  }
}
