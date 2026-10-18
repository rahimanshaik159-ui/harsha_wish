/* Harsha thammudu birthday — state machine, cake art, fireworks, audio */
(() => {
  'use strict';

  const ORDER = ['welcome', 'wishes', 'letter', 'cake', 'blowing', 'fireworks', 'cutting', 'finale'];
  const $ = (s, r = document) => r.querySelector(s);
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = () => innerWidth < 700;
  const T = ms => (rm ? Math.min(ms, 1200) : ms);
  const rand = (a, b) => a + Math.random() * (b - a);

  const scenes = {};
  document.querySelectorAll('.scene').forEach(el => (scenes[el.dataset.scene] = el));
  const navItems = [...document.querySelectorAll('#nav li')];

  /* ---------- Timers (all pending work is tracked so Replay can cancel it) ---------- */
  const timers = new Set();
  const after = (fn, ms) => {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
  };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };

  /* ---------- Cake art ---------- */
  function cakeSVG(p) {
    const xs = [110, 155, 200, 245, 290], ys = [168, 176, 178, 176, 168];
    const candles = xs.map((x, i) => {
      const y = ys[i], d = (i * 0.16).toFixed(2) + 's';
      return `<g data-x="${x}" data-y="${y - 66}">
        <rect x="${x - 5}" y="${y - 58}" width="10" height="58" rx="2" fill="url(#${p}-stripe)" stroke="#bbb" stroke-width=".6"/>
        <circle class="glow" style="--d:${d}" cx="${x}" cy="${y - 76}" r="24" fill="url(#${p}-glow)"/>
        <g class="flame" style="--d:${d}">
          <path d="M${x} ${y - 60}c-9-9-8-22 0-34 8 12 9 25 0 34z" fill="#f4a23a"/>
          <path d="M${x} ${y - 61}c-4-5-4-11 0-17 4 6 4 12 0 17z" fill="#fff2c4"/>
        </g></g>`;
    }).join('');
    let rosettes = '';
    for (let x = 84; x <= 316; x += 29) rosettes += `<circle cx="${x}" cy="${290 + Math.abs(x - 200) / 40}" r="10" fill="#2b170d"/><circle cx="${x - 3}" cy="${287 + Math.abs(x - 200) / 40}" r="3" fill="#6a4630" opacity=".7"/>`;
    const drips = [[84, 24], [122, 38], [168, 18], [228, 34], [270, 22], [308, 30]]
      .map(([x, h]) => `<rect x="${x - 7}" y="186" width="14" height="${h + 8}" rx="7" fill="#2b170d"/>`).join('');
    return `<svg class="cake" viewBox="0 0 400 340" role="img" aria-label="Chocolate birthday cake with five candles">
      <defs>
        <pattern id="${p}-stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="8" height="8" fill="#fff"/><rect width="4" height="8" fill="#c9c9c6"/></pattern>
        <radialGradient id="${p}-glow"><stop offset="0" stop-color="#ffd37a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd37a" stop-opacity="0"/></radialGradient>
        <linearGradient id="${p}-body" x1="0" x2="1"><stop offset="0" stop-color="#4a2a1a"/><stop offset=".45" stop-color="#7a4b30"/><stop offset="1" stop-color="#43261a"/></linearGradient>
      </defs>
      <ellipse cx="200" cy="304" rx="192" ry="28" fill="#000" opacity=".12"/>
      <ellipse cx="200" cy="298" rx="188" ry="27" fill="#ecece9" stroke="#d0d0cc"/>
      <ellipse cx="200" cy="296" rx="150" ry="20" fill="#f8f8f6"/>
      <path d="M60 178V282Q60 304 200 306Q340 304 340 282V178Z" fill="url(#${p}-body)"/>
      ${drips}
      <ellipse cx="200" cy="178" rx="140" ry="34" fill="#2b170d"/>
      <ellipse cx="200" cy="174" rx="112" ry="24" fill="#3b2113"/>
      <ellipse cx="170" cy="168" rx="40" ry="6" fill="#fff" opacity=".1"/>
      ${rosettes}
      <g>${candles}</g>
      <g class="smoke"></g>
    </svg>`;
  }

  function cutSVG() {
    const left = '0,0 282,0 218,320 0,320', right = '282,0 420,0 420,320 218,320';
    let ros = '';
    for (let x = 80; x <= 340; x += 32) ros += `<circle cx="${x}" cy="${262 + Math.abs(x - 210) / 45}" r="11" fill="#2b170d"/><circle cx="${x - 3}" cy="${259 + Math.abs(x - 210) / 45}" r="3.5" fill="#6a4630" opacity=".7"/>`;
    const drips = [90, 140, 190, 250, 300, 345].map((x, i) => `<rect x="${x - 7}" y="140" width="14" height="${26 + (i * 13) % 30}" rx="7" fill="#2b170d"/>`).join('');
    const crumbs = [[250, 262, 10], [236, 268, 34], [262, 270, 20], [226, 258, -10], [270, 258, 46]]
      .map(([x, y, dx], i) => `<circle class="crumb" style="--d:${(i * 0.12).toFixed(2)}s;--dx:${dx}px" cx="${x}" cy="${y}" r="${3 + (i % 2)}"/>`).join('');
    return `<svg class="cut-svg" viewBox="0 0 420 330" role="img" aria-label="A chocolate cake being cut, with one slice separating">
      <defs>
        <linearGradient id="c-body" x1="0" x2="1"><stop offset="0" stop-color="#4a2a1a"/><stop offset=".5" stop-color="#7a4b30"/><stop offset="1" stop-color="#43261a"/></linearGradient>
        <linearGradient id="c-blade" x1="0" x2="1"><stop offset="0" stop-color="#8d8d8d"/><stop offset=".5" stop-color="#f2f2f2"/><stop offset="1" stop-color="#a9a9a9"/></linearGradient>
        <clipPath id="c-left"><polygon points="${left}"/></clipPath>
        <clipPath id="c-right"><polygon points="${right}"/></clipPath>
        <g id="c-full">
          <path d="M50 128V262Q50 284 210 286Q370 284 370 262V128Z" fill="url(#c-body)"/>${drips}
          <ellipse cx="210" cy="128" rx="160" ry="32" fill="#2b170d"/><ellipse cx="210" cy="125" rx="130" ry="23" fill="#3b2113"/>
          <ellipse cx="170" cy="119" rx="46" ry="6" fill="#fff" opacity=".1"/>${ros}
        </g>
      </defs>
      <ellipse cx="210" cy="284" rx="204" ry="32" fill="#000" opacity=".12"/>
      <ellipse cx="210" cy="278" rx="200" ry="31" fill="#ecece9" stroke="#d0d0cc"/>
      <ellipse cx="210" cy="276" rx="160" ry="22" fill="#f8f8f6"/>
      <g clip-path="url(#c-left)"><use href="#c-full"/></g>
      <g class="face"><polygon points="258,128 244,128 213,272 227.6,272" fill="#8a5a3b"/><path d="M251 175 220 175M241 220 217 220" stroke="#eadcc3" stroke-width="3"/></g>
      <g class="slice">
        <g clip-path="url(#c-right)"><use href="#c-full"/></g>
        <g class="face"><polygon points="258,128 272,128 241.6,272 227.6,272" fill="#8a5a3b"/><path d="M262 175 248 175M253 220 236 220" stroke="#eadcc3" stroke-width="3"/></g>
      </g>
      ${crumbs}
      <g class="spark"><path d="M250 80l-8-22M270 86l8-24M232 96l-22-12"/></g>
      <g class="knife"><path d="M-8-130H8V-8L0 0Z" fill="url(#c-blade)" stroke="#8d8d8d" stroke-width=".6"/><rect x="-7" y="-196" width="14" height="66" rx="5" fill="#161616"/><circle cx="0" cy="-176" r="2" fill="#aaa"/><circle cx="0" cy="-150" r="2" fill="#aaa"/></g>
    </svg>`;
  }

  const cakeHosts = { a: $('#cake-a'), b: $('#cake-b'), c: $('#cake-c') };
  function buildArt() {
    cakeHosts.a.innerHTML = cakeSVG('a');
    cakeHosts.b.querySelector('svg')?.remove();
    $('#floaters').innerHTML = '';
    cakeHosts.b.insertAdjacentHTML('afterbegin', cakeSVG('b'));
    cakeHosts.c.className = 'cut-wrap';
    cakeHosts.c.innerHTML = cutSVG();
    $('#confetti').innerHTML = '';
  }

  /* ---------- Scene effects ---------- */
  function blowCandles() {
    const svg = $('svg', cakeHosts.b), smoke = $('.smoke', svg);
    after(() => {
      svg.classList.add('out');
      svg.querySelectorAll('g[data-x]').forEach((g, i) => {
        for (let k = 0; k < 3; k++) {
          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          c.setAttribute('class', 'puff');
          c.setAttribute('cx', g.dataset.x); c.setAttribute('cy', +g.dataset.y - 4); c.setAttribute('r', 5);
          c.style.setProperty('--d', (0.35 + i * 0.16 + k * 0.5).toFixed(2) + 's');
          c.style.setProperty('--dx', (rand(-18, 18)).toFixed(0) + 'px');
          smoke.appendChild(c);
        }
      });
      floaters();
    }, T(800));
    after(() => scenes.blowing.classList.add('show'), T(1700));
    after(() => go('fireworks'), T(6000));
  }

  function floaters() {
    const box = $('#floaters'), n = small() ? 8 : 14;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'fl'; s.textContent = i % 3 ? '·' : '♡';
      s.style.cssText = `left:${rand(8, 92)}%;--s:${rand(16, 30).toFixed(0)}px;--t:${rand(3, 5).toFixed(1)}s;--d:${rand(0.4, 2.5).toFixed(1)}s;--dx:${rand(-30, 30).toFixed(0)}px`;
      box.appendChild(s);
    }
  }

  function confetti() {
    const box = $('#confetti'), n = small() ? 12 : 22;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span'), dot = i % 3 === 0;
      s.className = 'cf' + (dot ? ' dot' : ''); s.textContent = dot ? '' : '♡';
      s.style.cssText = `left:${rand(2, 98)}%;--s:${dot ? rand(5, 9).toFixed(0) : rand(14, 24).toFixed(0)}px;--t:${rand(7, 12).toFixed(1)}s;--d:${rand(0, 8).toFixed(1)}s`;
      box.appendChild(s);
    }
  }

  function cutCake() {
    after(() => cakeHosts.c.classList.add('cutting'), T(400));
    after(() => cakeHosts.c.classList.add('apart'), T(2700));
    after(() => go('finale'), T(6800));
  }

  /* ---------- Fireworks (canvas) ---------- */
  const FX = {
    cvs: $('#fx'), ctx: null, raf: 0, run: false, t0: 0, last: 0, nextLaunch: 0, rockets: [], parts: [], w: 0, h: 0,
    colors: ['#ffffff', '#f0f0f0', '#d6d6d6', '#b8b8b8', '#8e8e8e'],
    size() {
      const dpr = Math.min(devicePixelRatio || 1, 2), r = this.cvs.getBoundingClientRect();
      this.w = r.width; this.h = r.height;
      this.cvs.width = Math.round(r.width * dpr); this.cvs.height = Math.round(r.height * dpr);
      this.ctx = this.cvs.getContext('2d'); this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    start(duration) {
      this.stop(); this.size();
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.run = true; this.t0 = this.last = performance.now(); this.nextLaunch = 300; this.duration = duration;
      this.raf = requestAnimationFrame(t => this.loop(t));
    },
    stop() {
      this.run = false; cancelAnimationFrame(this.raf);
      this.rockets = []; this.parts = [];
      if (this.ctx) this.ctx.clearRect(0, 0, this.w, this.h);
    },
    launch() {
      this.rockets.push({ x: rand(0.15, 0.85) * this.w, y: this.h, ty: rand(0.12, 0.45) * this.h, vy: -rand(7, 10) });
    },
    burst(x, y) {
      const n = small() ? 38 : 72, c = this.colors[(Math.random() * this.colors.length) | 0], sc = small() ? 0.75 : 1;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05), s = rand(1.2, 4.2) * sc;
        this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: rand(0.008, 0.016), r: rand(1, 2.2), c: Math.random() < 0.7 ? c : '#ffffff' });
      }
    },
    loop(now) {
      if (!this.run) return;
      const f = Math.min((now - this.last) / 16.67, 3), el = now - this.t0; this.last = now;
      const g = this.ctx;
      g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(0, 0, this.w, this.h);
      g.globalCompositeOperation = 'source-over';
      if (el < this.duration - 1400 && el > this.nextLaunch) { this.launch(); this.nextLaunch = el + rand(500, 850); }
      this.rockets = this.rockets.filter(r => {
        r.y += r.vy * f; r.vy *= 0.985;
        g.fillStyle = '#fff'; g.globalAlpha = 0.9; g.fillRect(r.x, r.y, 2, 6);
        if (r.y <= r.ty || r.vy > -1.2) { this.burst(r.x, r.y); return false; }
        return true;
      });
      this.parts = this.parts.filter(p => {
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.04 * f; p.x += p.vx * f; p.y += p.vy * f; p.life -= p.decay * f;
        if (p.life <= 0) return false;
        g.globalAlpha = Math.max(p.life, 0); g.fillStyle = p.c;
        g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.2832); g.fill();
        return true;
      });
      g.globalAlpha = 1;
      this.raf = requestAnimationFrame(t => this.loop(t));
    }
  };
  addEventListener('resize', () => { if (FX.run) FX.size(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(FX.raf); } else if (FX.run) { FX.last = performance.now(); FX.raf = requestAnimationFrame(t => FX.loop(t)); } });

  /* ---------- Audio (one instance, user-initiated) ---------- */
  const audio = $('#birthday-audio');
  let pending = false;
  const note = msg => { $('#audio-note').textContent = msg; };
  function setPlaying(on) {
    const b = $('#btn-music');
    b.setAttribute('aria-pressed', String(on));
    $('#music-label').textContent = on ? 'Pause Birthday Song' : (audio && audio.currentTime > 0.5 && !audio.ended ? 'Resume Birthday Song' : 'Play Birthday Song');
    $('.mi', b).textContent = on ? '❚❚' : '▶';
  }
  async function toggleMusic() {
    if (pending) return;
    if (!audio.paused) { audio.pause(); return; }
    playMusic();
  }
  function playMusic() {
    if (pending || !audio.paused) return;
    pending = true;
    audio.play()
      .then(() => note(''))
      .catch(error => {
        console.error('Birthday audio playback failed:', error);
        setPlaying(false);
        note("Music couldn't start. Use Play Birthday Song on the Cake screen to try again.");
      })
      .finally(() => { pending = false; });
  }
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => { audio.currentTime = 0; setPlaying(false); });
  audio.addEventListener('error', event => {
    console.error('Birthday audio failed to load:', event);
    note("The song couldn't load. Check that assets/audio.mp3 exists, then try again.");
    setPlaying(false);
  });

  /* ---------- State machine ---------- */
  let idx = 0;
  const enter = {
    blowing: blowCandles,
    fireworks() { const d = T(7200); FX.start(rm ? 2500 : d); after(() => go('cutting'), T(7200)); },
    cutting: cutCake,
    finale: confetti
  };

  function show(name) {
    idx = ORDER.indexOf(name);
    Object.entries(scenes).forEach(([n, el]) => {
      const on = n === name;
      el.classList.toggle('active', on);
      el.inert = !on;
      el.setAttribute('aria-hidden', String(!on));
    });
    document.body.dataset.theme = name === 'blowing' || name === 'fireworks' ? 'dark' : 'light';
    navItems.forEach(li => {
      const on = li.dataset.for.split(',').includes(name);
      li.classList.toggle('on', on);
      on ? li.setAttribute('aria-current', 'step') : li.removeAttribute('aria-current');
    });
    scenes[name].scrollTop = 0;
    if (name !== 'fireworks') FX.stop();
    const h = scenes[name].querySelector('h1,h2');
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    enter[name] && enter[name]();
  }

  // Only the next scene in order is accepted, so double clicks and stray timers cannot skip or repeat steps.
  function go(to) {
    const t = ORDER.indexOf(to);
    const ok = t === idx + 1 || (to === 'welcome' && idx === ORDER.length - 1);
    if (!ok) return false;
    show(to);
    return true;
  }

  function replay() {
    if (idx !== ORDER.length - 1) return;
    clearTimers(); FX.stop();
    Object.values(scenes).forEach(el => el.classList.remove('show'));
    buildArt();
    go('welcome');
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const a = b.dataset.action;
    if (a === 'next') {
      if (idx === 0) playMusic();
      go(ORDER[idx + 1]);
    }
    else if (a === 'music') toggleMusic();
    else if (a === 'replay') replay();
  });

  buildArt();
  show('welcome');
})();
