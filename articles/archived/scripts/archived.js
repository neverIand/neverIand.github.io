// IIFE
(function () {
  // 'use strict'
  const darkmodeCSS = "./styles/dark-mode-theme.css";
  const lightmodeCSS = "./styles/light-mode-theme.css";

  let imgs = null;
  const html = document.documentElement;
  const scrollTopBtn = document.querySelector("#scrollToTop");

  // select the theme automatically
  document.addEventListener("DOMContentLoaded", function () {
    // check for imgs that appears above
    lazyLoad(document.querySelectorAll("img"));

    let themeToggleBtn = document.querySelector("#theme-toggle");
    let themeToggleCheckbox = document.querySelector("#toggle");

    // Without this, by default the checkbox will bound to be checked after clicked!
    themeToggleCheckbox.addEventListener("click", function (event) {
      event.preventDefault();
    });

    //console.log('storage when page load: ' + sessionStorage.getItem('darkmode'))

    if (sessionStorage.getItem("darkmode") === null) {
      //console.log('first time enter')
      // set the initial value for darkmode
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        sessionStorage.setItem("darkmode", "true");
      } else {
        sessionStorage.setItem("darkmode", "false");
      }
    }

    if (sessionStorage.getItem("darkmode") === "true") {
      darkmode();
    } else {
      lightmode();
    }

    // Toggle switch for light/dark mode
    themeToggleBtn.addEventListener("click", function () {
      // problem could be this line
      let theme = document.querySelector("#theme-link");

      if (theme.getAttribute("href") === lightmodeCSS) {
        darkmode();
      } else {
        lightmode();
      }
    });

    // fetch the date
    if (exists("#article-date")) {
      if (isOtherArticle()) {
        fetch("./data/other-articles-list.json")
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            // console.log(data);
            data.response.articles.forEach(function (article) {
              if ( // the whitespace in the string causes issue
                article.article_name.trim() ==
                document.querySelector("article h1").textContent.trim()
              ) {
                document.querySelector(
                  "#article-date"
                ).innerHTML = `<time datetime="${article.date}">${article.date}</time>`;
              }
            });
          });
      } else {
        fetch("./data/recent-articles-list.json")
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            //console.log(data)
            data.response.articles.forEach(function (article) {
              if (article.article_name.trim() == document.querySelector("article h1").textContent.trim()) {
                document.querySelector(
                  "#article-date"
                ).innerHTML = `<time datetime="${article.date}">${article.date}</time>`;
                // there is a glitch here where path is '/', the date of the first article will not be displayed
              }
            });
          });
      }
    }
  });

  // move it to domcontentloaded?
  if (exists(".responsive-img")) {
    imgs = document.querySelectorAll(".responsive-img");
    // console.log(imgs);

    // lazy load
    window.addEventListener("scroll", function () {
      lazyLoad(document.querySelectorAll("img"));
    });

    imgs.forEach(function (img) {
      // console.log(img);

      img.querySelector("img").addEventListener("click", function () {
        // console.log('clicked')
        // display the zoomed image
        let zoomSection = img.querySelector(".zoomed-img");
        let top = 0;
        if (zoomSection.style.display === "none") {
          zoomSection.style.display = "flex";
          // prevent the scroll event
          top = preventBodyScroll(true, top); // record the current value
        }

        // close the zoomed image
        zoomSection.addEventListener("click", function () {
          zoomSection.style.display = "none";
          // restore the scroll event
          preventBodyScroll(false, top);
        });
      });
    });
  }

  // scroll event
  // try not put variables declarations in scroll event
  document.addEventListener("scroll", function () {
    // percentage:
    // let scrolled = html.scrollTop  / (html.scrollHeight - html.clientHeight)

    // distance:
    let scrolled = html.scrollTop;

    // declaration is here in case the browser window changes
    // performance?
    let clientHeight = html.clientHeight;
    // console.log('clientHeight: ', clientHeight)

    // hide/show the scrolltop btn
    if (scrolled > clientHeight) {
      // scrollTopBtn.style.display = 'flex'
      scrollTopBtn.style.zIndex = "50";
      scrollTopBtn.style.opacity = "1";
    } else {
      scrollTopBtn.style.opacity = "0";
      scrollTopBtn.style.zIndex = "-50";
      // scrollTopBtn.style.display = 'none'
      // scrollTopBtn.style.pointerEvents
    }
  });

  scrollTopBtn.addEventListener("click", function () {
    scrollToElement("#top-anchor");
    // window.scrollTo({
    //   left: 0,
    //   top: 0,
    //   behavior: 'smooth',
    // })
  });

  // Toggle switch for the foldable sidebar
  if (exists("#recent-article-button")) {
    const recentArticleBtn = document.querySelector("#recent-article-button");
    const recentArticleList = document.querySelector("#recent-article-list");

    const otherArticleBtn = document.querySelector("#other-article-button");
    const otherArticleList = document.querySelector("#other-article-list");

    const sidebarHeight = "200px";

    if (isOtherArticle()) {
      expandList(
        otherArticleBtn,
        otherArticleList,
        recentArticleBtn,
        recentArticleList,
        sidebarHeight
      );
    } else {
      expandList(
        recentArticleBtn,
        recentArticleList,
        otherArticleBtn,
        otherArticleList,
        sidebarHeight
      );
    }

    recentArticleBtn.addEventListener("click", function () {
      // console.log(recentArticleList.style.height + ' ' +
      //   typeof (recentArticleList.style.height))

      if (recentArticleList.style.height === sidebarHeight) {
        expandList(
          otherArticleBtn,
          otherArticleList,
          recentArticleBtn,
          recentArticleList,
          sidebarHeight
        );
      } else {
        expandList(
          recentArticleBtn,
          recentArticleList,
          otherArticleBtn,
          otherArticleList,
          sidebarHeight
        );
      }
    });

    otherArticleBtn.addEventListener("click", function () {
      // console.log(otherArticleList.style.height + ' ' +
      //   typeof (otherArticleList.style.height))

      if (otherArticleList.style.height === sidebarHeight) {
        expandList(
          recentArticleBtn,
          recentArticleList,
          otherArticleBtn,
          otherArticleList,
          sidebarHeight
        );
      } else {
        expandList(
          otherArticleBtn,
          otherArticleList,
          recentArticleBtn,
          recentArticleList,
          sidebarHeight
        );
      }
    });
  }

  // helper functions

  // prevent the scroll event when displaying the image
  function preventBodyScroll(isFixed, top) {
    let body = document.body;

    if (isFixed) {
      top = window.scrollY;

      body.style.position = "fixed";
      body.style.top = -top + "px";
      //console.log('top: ' + top)
    } else {
      body.style.position = "";
      //body.style.top = ''
      //console.log('top: ' + top)
      window.scrollTo(0, top);
    }
    return top;
  }

  function exists(element) {
    if (document.querySelector(element)) {
      return true;
    }
    return false;
  }

  function isOtherArticle() {
    // console.log('current path: ', window.location.pathname)
    const oRegex = /\/others/;
    const sRegex = /\/serious/;
    if (oRegex.test(window.location.pathname)) {
      //other articles folder
      return true;
    } else if (sRegex.test(window.location.pathname)) {
      //serious article folder
      return false;
    } else {
      //main folder
      console.log("main");
      return false;
    }
  }

  function expandList(expandBtn, expandTarget, foldBtn, foldTarget, height) {
    const plusIcon = "far fa-plus-square";
    const minusIcon = "far fa-minus-square";

    foldTarget.style.height = "0px";
    // change the icon to plus
    foldBtn.className = plusIcon;
    // expand another list
    expandTarget.style.height = height;
    expandBtn.className = minusIcon;
  }

  // Toggle darkmode
  function darkmode() {
    let theme = document.querySelector("#theme-link");
    let themeToggleCheckbox = document.querySelector("#toggle");
    theme.href = darkmodeCSS;
    themeToggleCheckbox.checked = true;
    sessionStorage.setItem("darkmode", "true");
    console.log("darkmode: " + sessionStorage.getItem("darkmode"));
  }

  function lightmode() {
    let theme = document.querySelector("#theme-link");
    let themeToggleCheckbox = document.querySelector("#toggle");
    theme.href = lightmodeCSS;
    themeToggleCheckbox.checked = false;
    sessionStorage.setItem("darkmode", "false");
    console.log("darkmode: " + sessionStorage.getItem("darkmode"));
  }

  function scrollToElement(t) {
    const target = document.querySelector(t);
    //target.scrollIntoView()
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  function getTop(e) {
    let T = e.offsetTop;
    while ((e = e.offsetParent)) {
      T += e.offsetTop;
    }
    return T;
  }

  function lazyLoad(imgs) {
    let H = html.clientHeight; // get visible area's height
    let S = html.scrollTop || document.body.scrollTop;
    for (let i = 0; i < imgs.length; i++) {
      if (H + S > getTop(imgs[i])) {
        imgs[i].src = imgs[i].getAttribute("data-src");
        imgs[i].style.opacity = "1";
      }
    }
  }
})();
