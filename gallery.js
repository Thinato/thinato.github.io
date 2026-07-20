/* ============================================================
   GALLERY DATA + LOGIC
   ============================================================

   HOW TO ADD A PICTURE:
   1. Drop your image file into the  images/gallery/  folder
      (e.g. images/gallery/my-climb.jpg)
   2. Add an entry to the GALLERY array below:
        {
          src: 'images/gallery/my-climb.jpg',
          title: 'Sending my project',
          description: 'A short blurb. Shows up to 4 lines under the
                        thumbnail, then gets cut off with an ellipsis.'
        }
   3. Commit + push. That's it — the grid builds itself.

   The example entries below use generated placeholder images so the
   page works out of the box. Delete them once you add real photos.
   ============================================================ */

// --- helper: builds a retro placeholder image as an SVG data URI ---
function placeholder(label, bg, fg) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>` +
    `<rect width='400' height='300' fill='${bg}'/>` +
    `<rect x='6' y='6' width='388' height='288' fill='none' stroke='${fg}' stroke-width='4'/>` +
    `<text x='200' y='150' font-family='monospace' font-size='26' fill='${fg}' ` +
    `text-anchor='middle' dominant-baseline='middle'>${label}</text>` +
    `<text x='200' y='185' font-family='monospace' font-size='13' fill='${fg}' ` +
    `text-anchor='middle' dominant-baseline='middle'>drop a photo here</text>` +
    `</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// ---- EDIT ME: your pictures live here ----
const GALLERY = [
  {
    src: placeholder('PHOTO 01', '#000000', '#ff00ff'),
    title: 'Climbing @ Caverna',
    description: 'Hanging off plastic rocks like it is 1999. This is where the example caption would go — write up to four lines about the shot and anything past that gets politely truncated with an ellipsis so the grid stays tidy.'
  },
  {
    src: placeholder('PHOTO 02', '#000000', '#00ffff'),
    title: 'Phonk Night',
    description: 'Ribcage-rattling bass and questionable lighting. Replace this placeholder by dropping a real image into images/gallery/ and pointing src at it.'
  },
  {
    src: placeholder('PHOTO 03', '#000000', '#ffff00'),
    title: 'Cafezinho o clock',
    description: 'Fuel of champions and overnight Claude Code sessions.'
  },
  {
    src: placeholder('PHOTO 04', '#000000', '#00ff00'),
    title: 'The Helix Config',
    description: 'A photo of a screen of a config I no longer understand. Four lines of glory. Line two. Line three, still going strong. Line four is the last one you will ever see before the ellipsis swoops in and cuts the rest of this rambling description off for good.'
  }
];

// --- missing-file fallback (if a real src 404s) ---
const BROKEN = placeholder('MISSING', '#000000', '#ff0000');

// ------------------------------------------------------------
let currentIndex = 0;
const grid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbCounter = document.getElementById('lb-counter');

function buildGrid() {
  if (!GALLERY.length) {
    grid.innerHTML = '<div class="gallery-empty">✨ no pictures yet — check back soon!! ✨</div>';
    return;
  }
  GALLERY.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Open picture: ' + (item.title || ('photo ' + (idx + 1))));

    const img = document.createElement('img');
    img.className = 'thumb';
    img.src = item.src;
    img.alt = item.title || ('Picture ' + (idx + 1));
    img.loading = 'lazy';
    img.onerror = () => { img.onerror = null; img.src = BROKEN; };

    const cap = document.createElement('div');
    cap.className = 'gallery-caption';
    cap.innerHTML =
      (item.title ? '<span class="cap-title">' + escapeHtml(item.title) + '</span>' : '') +
      escapeHtml(item.description || '');

    card.appendChild(img);
    card.appendChild(cap);
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); }
    });
    grid.appendChild(card);
  });
}

function openLightbox(idx) {
  currentIndex = idx;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function step(delta) {
  currentIndex = (currentIndex + delta + GALLERY.length) % GALLERY.length;
  renderLightbox();
}

function renderLightbox() {
  const item = GALLERY[currentIndex];
  lbImg.src = item.src;
  lbImg.alt = item.title || ('Picture ' + (currentIndex + 1));
  lbImg.onerror = () => { lbImg.onerror = null; lbImg.src = BROKEN; };
  lbCaption.innerHTML =
    (item.title ? '<span class="cap-title">' + escapeHtml(item.title) + '</span>' : '') +
    escapeHtml(item.description || '');
  lbCounter.textContent = (currentIndex + 1) + ' / ' + GALLERY.length;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// wire up controls
document.getElementById('lb-prev').addEventListener('click', () => step(-1));
document.getElementById('lb-next').addEventListener('click', () => step(1));
document.getElementById('lb-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === 'ArrowRight') step(1);
});

buildGrid();
