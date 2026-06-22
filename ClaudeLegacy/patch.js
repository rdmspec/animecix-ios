(function () {
  const BASE_URL = window.location.origin;

  window.LegacyTranspiler.init({
    BASE_URL,
    runScript: (code) => {
      window.webkit.messageHandlers.patchScript.postMessage(code);
    },
    target: {
      platform: 'iOS',
      version: iosVersion
    }
  });

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.tagName === "SCRIPT" && node.src && (node.src.includes('main') || node.src.includes('polyfills') || node.src.includes('index'))) {
          node.type = "javascript/blocked";
          const src = node.src;
          window.LegacyTranspiler.loadCode(src)
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
