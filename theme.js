/* ============================================================
   LIGHT / DARK MODE TOGGLE  ::  with FLASHBANG
   Clicking the footer link plays a flashbang, fades the screen
   to pure white, flips the theme (color invert) behind the
   white, then fades back out into the new theme.
   ============================================================ */
(function () {
  const KEY = 'lisecki-theme';
  const root = document.documentElement;

  // (a saved light theme is applied pre-render by a tiny inline <head>
  //  script, so navigating between pages doesn't flash the dark theme)

  // Preload the flashbang on page load so it fires instantly on click and
  // the visual flash stays perfectly timed to the audio (no network delay).
  // The explicit fetch() downloads the bytes into the HTTP cache right away
  // (media-element preload alone gets deferred in background tabs); the
  // <audio> element then plays that cached copy instantly.
  const BANG_SRC = 'audio/flashbang.mp3';
  let bangAudio = null;
  try {
    bangAudio = new Audio(BANG_SRC);
    bangAudio.preload = 'auto';
    bangAudio.load();
    fetch(BANG_SRC).catch(() => {});
  } catch (e) { /* no audio, no problem */ }

  function isLight() { return root.classList.contains('light-mode'); }

  function updateLinks() {
    const label = isLight()
      ? '🌙 too bright?? switch back to dark mode'
      : '💡 switch to light mode';
    document.querySelectorAll('.theme-toggle').forEach(a => { a.textContent = label; });
  }

  const FLASH_DELAY = 1700;   // suspense before the bang
  const FADE_OUT    = 9000;   // slow reveal of light mode

  let busy = false;
  function flashToggle() {
    if (busy) return;
    busy = true;

    // Going back to DARK: instant, silent, no flashbang.
    if (isLight()) {
      root.classList.remove('light-mode');
      try { localStorage.setItem(KEY, 'dark'); } catch (e) {}
      updateLinks();
      busy = false;
      return;
    }

    // Entering LIGHT: start the preloaded flashbang NOW, on the click.
    // The clip has a wind-up, so the visual flash (FLASH_DELAY below) is
    // timed to land exactly on the audio's "bang".
    try {
      if (bangAudio) {
        bangAudio.currentTime = 0;
        bangAudio.volume = 1.0;
        bangAudio.play().catch(() => {});
      }
    } catch (e) { /* no audio, no problem */ }

    // ...then, after the wind-up, the FLASH.
    setTimeout(() => {
      // pure-white overlay; it's a child of <html>, and the light-mode
      // filter counter-inverts it (below) so it stays truly white.
      let ov = document.getElementById('flash-overlay');
      if (!ov) {
        ov = document.createElement('div');
        ov.id = 'flash-overlay';
        root.appendChild(ov);
      }

      // INSTANT full white (no fade-in) synced with the bang
      ov.style.transition = 'none';
      ov.style.opacity = '1';

      // flip to light mode, hidden behind the white
      root.classList.add('light-mode');
      try { localStorage.setItem(KEY, 'light'); } catch (e) {}
      updateLinks();

      // commit the instant-white frame, then slowly fade it out
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
