const MIN_NO_FULLSIZE = 250;
function detectIE() {
  var ua = window.navigator.userAgent;
  var ie = ua.search(/(MSIE|Trident|Edge)/);
  return ie > -1;
}
var isIE = detectIE();
if (isIE) {
  (function(d, script) {
    script = d.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.onload = function() {
      pageLoad();
    };
    script.src = "ie11.js";
    d.getElementsByTagName("head")[0].appendChild(script);
  })(document);
} else {
  pageLoad();
}
function pageLoad() {
  var isChrome = !!window.chrome && !!window.chrome.webstore;
  function evhandler(evt) {
    let path;
    let hasPath = evt.path || (evt.composedPath && evt.composedPath());
    if (hasPath) {
      if (!isChrome) {
        path = evt.target;
      } else {
        path = evt.path[0];
      }
    } else {
      path = evt.target;
    }
    if (path.hasAttribute("data-fullsize") &&
      !Array.from(path.classList).includes("done-loading")) {
      if (path.width > MIN_NO_FULLSIZE) {
        loadImage(path.dataset.fullsize).then(function(img) {
          path.classList.add("done-loading");
          path.src = img.src;
          setTimeout(function waitASmallBit() {
            path.classList.add("loaded");
            img = null; //eslint-disable-line
            evt = null; //eslint-disable-line
          }, 50); // TODO: only set timeout on firefox
        });
      } else {
        path.classList.add("done-loading");
        path.classList.add("loaded");
      }
    }
  }

  function loadImage(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function(evt) {
        resolve(img);
      };
      img.src = url;
    });
  }
  let imgs = Array.from(document.querySelectorAll("img"));
  imgs.forEach(function(img) {
    img.addEventListener("load", function(e) {
      setTimeout(function() {
        evhandler(e);
      }, 250);
    });
  });
}
