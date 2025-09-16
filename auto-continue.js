(function(){
  const COOLDOWN_MS = 2500;
  let lastClick = 0;

  function clickIfFound() {
    const now = Date.now();
    if (now - lastClick < COOLDOWN_MS) return;

    // Continue
    const continueBtn = Array.from(
      document.querySelectorAll('a.monaco-button[role="button"], button.monaco-button')
    ).find(el => {
      const hasContinueText = /continue/i.test(el.textContent?.trim());
      const isRebaseButton = /rebase/i.test(el.getAttribute('aria-label') || '');
      return hasContinueText && !isRebaseButton;
    });
    
    if (continueBtn) {
      continueBtn.click();
      lastClick = now;
      console.log('[auto] Clicked Continue');
    }

    // Keep
    const keepBtn = Array.from(
      document.querySelectorAll('a.action-label[role="button"]')
    ).find(el => /^keep$/i.test(el.textContent?.trim()));
    if (keepBtn) {
      keepBtn.click();
      lastClick = now;
      console.log('[auto] Clicked Keep');
    }
  }

  const intervalId = setInterval(clickIfFound, 1000);
  const observer   = new MutationObserver(clickIfFound);
  observer.observe(document.body, { childList: true, subtree: true });

  window.stopAutoContinue = () => {
    clearInterval(intervalId);
    observer.disconnect();
    console.log('[auto] stopped.');
  };
})();
