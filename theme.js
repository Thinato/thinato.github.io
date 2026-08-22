(function () {
  const KEY = 'lisecki-theme';
  const root = document.documentElement;


  const BANG_SRC = 'audio/flashbang.mp3';
  let bangAudio = null;
  try {
    bangAudio = new Audio(BANG_SRC);
    bangAudio.preload = 'auto';
    bangAudio.load();
    fetch(BANG_SRC).catch(() => {});
  } catch (e) {  }

  function isLight() { return root.classList.contains('light-mode'); }

  function updateLinks() {
    const label = isLight()
      ? '🌙 too bright?? switch back to dark mode'
      : '💡 switch to light mode';
    document.querySelectorAll('.theme-toggle').forEach(a => { a.textContent = label; });
  }

  const FLASH_DELAY = 1700;
  const FADE_OUT    = 9000;

  let busy = false;
  function flashToggle() {
    if (busy) return;
    busy = true;

    if (isLight()) {
      root.classList.remove('light-mode');
      try { localStorage.setItem(KEY, 'dark'); } catch (e) {}
      updateLinks();
      busy = false;
      return;
    }

    try {
      if (bangAudio) {
        bangAudio.currentTime = 0;
        bangAudio.volume = 1.0;
        bangAudio.play().catch(() => {});
      }
    } catch (e) {  }

    setTimeout(() => {
      let ov = document.getElementById('flash-overlay');
      if (!ov) {
        ov = document.createElement('div');
        ov.id = 'flash-overlay';
        root.appendChild(ov);
      }

      ov.style.transition = 'none';
      ov.style.opacity = '1';

      root.classList.add('light-mode');
      try { localStorage.setItem(KEY, 'light'); } catch (e) {}
      updateLinks();

      void ov.offsetWidth;
      ov.style.transition = 'opacity ' + FADE_OUT + 'ms ease-out';
      ov.style.opacity = '0';

      setTimeout(() => { busy = false; }, FADE_OUT + 100);
    }, FLASH_DELAY);
  }

  window.toggleTheme = flashToggle;

  document.querySelectorAll('.theme-toggle').forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); flashToggle(); });
  });
  updateLinks();
})();
