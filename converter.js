   THE REALLY BAD AUDIO CONVERTER (tm)
   Converts literally any file into the exact same kalimba song,
   keeping the original filename (but as .mp3). Peak technology.
   ============================================================ */

const THE_SONG = 'audio/Mr_Scruff_Kalimba_32kbps.mp3';

const CONVERT_MSGS = [
  'Analyzing byte-level harmonics...',
  'Locating the melody hidden inside your file...',
  'Untangling quantum audio waveforms...',
  'Consulting the ancient kalimba spirits...',
  'Extracting rhythm from raw data...',
  'Applying patented QuantumAudio™ resonance...',
  'Aligning frequencies with the cosmos...',
  'Removing the non-musical parts (all of them)...',
  'Polishing each individual sound wave by hand...',
  'Almost there, this part is very real...'
];

const $ = (id) => document.getElementById(id);
const dropzone   = $('dropzone');
const fileInput  = $('fileInput');
const stageDrop     = $('stage-drop');
const stageUpload   = $('stage-upload');
const stageConvert  = $('stage-convert');
const stageDone     = $('stage-done');
const ALL_STAGES = [stageDrop, stageUpload, stageConvert, stageDone];

let objectUrl = null;

function humanSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function toMp3Name(name) {
  const dot = name.lastIndexOf('.');
  const base = (dot > 0) ? name.slice(0, dot) : name;
  const oldExt = (dot > 0) ? name.slice(dot) : '(none)';
  return { out: base + '.mp3', base, oldExt };
}

function show(stage) {
  ALL_STAGES.forEach(s => s.classList.remove('active'));
  stage.classList.add('active');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runBar(barEl, pctEl, noteEl, totalBytes, duration) {
  const start = Date.now();
  return new Promise(resolve => {
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      let pct = Math.min(100, Math.round((elapsed / duration) * 100));
      if (pct < 100) pct = Math.max(0, pct - Math.floor(Math.random() * 4));
      barEl.style.width = pct + '%';
      pctEl.textContent = pct + '%';
      if (noteEl) {
        const done = Math.round((pct / 100) * totalBytes);
        noteEl.textContent = humanSize(done) + ' / ' + humanSize(totalBytes);
      }
      if (elapsed >= duration) {
        clearInterval(id);
        barEl.style.width = '100%';
        pctEl.textContent = '100%';
        if (noteEl) noteEl.textContent = humanSize(totalBytes) + ' / ' + humanSize(totalBytes);
        resolve();
      }
    }, 60);
  });
}

async function convert(file) {
  const { out, oldExt } = toMp3Name(file.name);
  const size = file.size || 1;

  show(stageUpload);
  $('up-name').textContent = file.name;
  await runBar($('up-bar'), $('up-pct'), $('up-note'), size, 1900 + Math.random() * 900);
  await sleep(350);

  show(stageConvert);
  const statusEl = $('cv-status');
  const convDuration = 3200 + Math.random() * 1200;
  const msgTimer = setInterval(() => {
    statusEl.textContent = CONVERT_MSGS[Math.floor(Math.random() * CONVERT_MSGS.length)];
  }, 700);
  statusEl.textContent = CONVERT_MSGS[0];
  await runBar($('cv-bar'), $('cv-pct'), null, size, convDuration);
  clearInterval(msgTimer);
  await sleep(300);

  if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
  try {
    const resp = await fetch(THE_SONG);
    const blob = await resp.blob();
    objectUrl = URL.createObjectURL(blob);
  } catch (e) {
    objectUrl = THE_SONG;
  }

  $('done-base').textContent = out.slice(0, out.length - 4);
  $('done-oldext').textContent = oldExt;
  const dl = $('dl-btn');
  dl.href = objectUrl;
  dl.setAttribute('download', out);
  $('preview').src = THE_SONG;
  show(stageDone);
}

function handleFiles(files) {
  if (files && files.length) convert(files[0]);
}

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
});
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

['dragenter', 'dragover'].forEach(ev =>
  dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.add('dragover'); }));
['dragleave', 'drop'].forEach(ev =>
  dropzone.addEventListener(ev, (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); }));
dropzone.addEventListener('drop', (e) => {
  if (e.dataTransfer && e.dataTransfer.files) handleFiles(e.dataTransfer.files);
});

$('again-btn').addEventListener('click', () => {
  fileInput.value = '';
  $('up-bar').style.width = '0%'; $('up-pct').textContent = '0%'; $('up-note').textContent = '';
  $('cv-bar').style.width = '0%'; $('cv-pct').textContent = '0%';
  show(stageDrop);
});
