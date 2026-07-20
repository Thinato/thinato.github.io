// ANIMATED VISITOR COUNTER
let count = 1337;
setInterval(() => {
  count++;
  document.getElementById('counter').textContent =
    String(count).padStart(7, '0');
}, 4500);

// SPARKLE CURSOR TRAIL
const sparkles = ['✨','⭐','🌟','★','✦','✧','💫'];
let last = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - last < 50) return;
  last = now;
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.textContent = sparkles[Math.floor(Math.random()*sparkles.length)];
  s.style.left = e.clientX + 'px';
  s.style.top = e.clientY + 'px';
  s.style.color = `hsl(${Math.random()*360}, 100%, 70%)`;
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

// FAKE STATUS BAR MESSAGES (the kind that scrolled across the bottom in IE)
const statuses = [
  'Loading...',
  'Welcome to my homepage!',
  'Sign my guestbook!',
  'Best viewed in 800x600',
  'Powered by Notepad.exe ✨'
];
let i = 0;
setInterval(() => {
  document.title = '~*~ ' + statuses[i] + ' ~*~';
  i = (i + 1) % statuses.length;
}, 2500);
