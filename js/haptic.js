// ============================================
// RRK SHARED HAPTIC — vibration + sound FX
// Used by main.js (public) and admin.js (CMS)
// ============================================
var hapticCtx = null;
function getHapticCtx() {
  if (!hapticCtx) {
    try { hapticCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return hapticCtx;
}
(function initHapticUnlock() {
  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    var ctx = getHapticCtx();
    if (!ctx) return;
    unlocked = true;
    if (ctx.state === 'suspended') ctx.resume();
    var buf = ctx.createBuffer(1,1,22050);
    var src = ctx.createBufferSource(); src.buffer = buf;
    src.connect(ctx.destination); src.start(0);
  }
  document.addEventListener('click', unlock, {once: true});
  document.addEventListener('touchstart', unlock, {once: true});
  document.addEventListener('keydown', unlock, {once: true});
})();
function tapVibe(dur) {
  try { if (navigator.vibrate) navigator.vibrate(dur || 15); } catch(e) {}
}
function softClick() {
  try { if (navigator.vibrate) navigator.vibrate(10); } catch(e) {}
}
function heavyVibe() {
  try { if (navigator.vibrate) navigator.vibrate([20,40,20]); } catch(e) {}
}
var hapticLast = 0;
function playHaptic(type) {
  var now = Date.now();
  if (now - hapticLast < 50) return;
  hapticLast = now;
  tapVibe();
  try {
    var ctx = getHapticCtx(); if (!ctx) return;
    if (ctx.state === 'suspended') { ctx.resume(); return; }
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    var now = ctx.currentTime;
    switch (type) {
      case 'click':
        o.type = 'sine'; o.frequency.setValueAtTime(800, now);
        o.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
        g.gain.setValueAtTime(0.25, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        o.start(now); o.stop(now + 0.07);
        break;
      case 'add':
        o.type = 'sine'; o.frequency.setValueAtTime(500, now);
        o.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
        g.gain.setValueAtTime(0.30, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.10);
        o.start(now); o.stop(now + 0.10);
        break;
      case 'remove':
        o.type = 'triangle'; o.frequency.setValueAtTime(900, now);
        o.frequency.exponentialRampToValueAtTime(350, now + 0.10);
        g.gain.setValueAtTime(0.22, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        o.start(now); o.stop(now + 0.12);
        break;
      case 'confirm':
        o.type = 'sine';
        o.frequency.setValueAtTime(587, now); o.frequency.setValueAtTime(740, now + 0.08);
        o.frequency.setValueAtTime(880, now + 0.16);
        g.gain.setValueAtTime(0.28, now); g.gain.setValueAtTime(0.28, now + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        o.start(now); o.stop(now + 0.28);
        break;
      case 'open':
        o.type = 'sine'; o.frequency.setValueAtTime(350, now);
        o.frequency.exponentialRampToValueAtTime(900, now + 0.12);
        g.gain.setValueAtTime(0.18, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.start(now); o.stop(now + 0.15);
        break;
      case 'close':
        o.type = 'sine'; o.frequency.setValueAtTime(600, now);
        o.frequency.exponentialRampToValueAtTime(250, now + 0.06);
        g.gain.setValueAtTime(0.20, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        o.start(now); o.stop(now + 0.08);
        break;
      case 'error':
        o.type = 'square'; o.frequency.setValueAtTime(180, now);
        g.gain.setValueAtTime(0.14, now); g.gain.setValueAtTime(0.14, now + 0.10);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        o.start(now); o.stop(now + 0.15);
        break;
    }
  } catch(e) {}
}

// Admin alias — same function, separate global
function adminHaptic(type) { playHaptic(type); }
