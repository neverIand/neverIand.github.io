import "/webcomponents/LogoComponent.js";
import "/webcomponents/HeaderComponent/HeaderComponent.js";
import "/webcomponents/FooterComponent/FooterComponent.js";
import "/webcomponents/DisclaimerComponent/DisclaimerComponent.js";
import "/webcomponents/ImageComponent/ImageComponent.js";
import '/webcomponents/ToolbarComponent/ToolbarComponent.js'
document.addEventListener("blockScroll", function (e) {
  if (e.detail.block) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});
