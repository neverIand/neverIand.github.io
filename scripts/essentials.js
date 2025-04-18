import { getTheme, setTheme } from "./theme.js";
import { preloadStyles } from "./preloadStyles.js";
import "/webcomponents/LogoComponent.js";
import "/webcomponents/HeaderComponent/HeaderComponent.js";
import "/webcomponents/FooterComponent/FooterComponent.js";
import "/webcomponents/DisclaimerComponent/DisclaimerComponent.js";
import "/webcomponents/ImageComponent/ImageComponent.js";
import "/webcomponents/ToolbarComponent/ToolbarComponent.js";

(() => {
  // preload web component styles for components that have separate css
  preloadStyles("/webcomponents/FooterComponent/FooterComponent.css");
  preloadStyles("/webcomponents/DisclaimerComponent/DisclaimerComponent.css");

  document.addEventListener("DOMContentLoaded", function () {
    const currTheme = document.querySelector("html").getAttribute("data-theme");
    if (!currTheme) {
      setTheme(getTheme());
    }
  });

  document.addEventListener("berry-theme", function (e) {
    setTheme(e.detail.theme);
  });

  document.addEventListener("blockScroll", function (e) {
    if (e.detail.block) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  });
})();
