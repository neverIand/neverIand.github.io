import "/webcomponents/DateComponent/DateComponent.js";
import "/webcomponents/SubheadingComponent/SubheadingComponent.js";
import "/webcomponents/CodeSnippetComponent/CodeSnippetComponent.js";
import "/webcomponents/ToastComponent/ToastComponent.js";
import { getTheme } from "./theme.js";
// TODO? Change the browser's tab title

// change bandcamp player bg color by changing the url, listening to the theme change event. Note: this will interrupt the music because the iframe player reload
// ! bgcol is from bc player url
function replaceColor(input, newColor) {
  return input.replace(/bgcol=([0-9A-Fa-f]{6})/, `bgcol=${newColor}`);
}

function updatePlayerTheme(player, theme) {
  const color = theme === "dark" ? "333333" : "ffffff";
  player.src = replaceColor(player.src, color);
}

document.addEventListener("DOMContentLoaded", () => {
  const bandcampPlayer = document.querySelector(".bandcamp-player");
  if (bandcampPlayer) {
    // Initialize theme
    updatePlayerTheme(bandcampPlayer, getTheme());

    // Listen for theme changes
    document.addEventListener("berry-theme", (e) => {
      updatePlayerTheme(bandcampPlayer, e.detail.theme);
    });
  }
});

// TODO? similar mechanism for utterances?
