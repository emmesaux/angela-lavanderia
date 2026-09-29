(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- Stato aperto/chiuso in tempo reale (ora italiana) ---------- */
  // Minuti dalla mezzanotte, per giorno (0 = domenica). Le festività non sono gestite.
  const MORNING = [480, 780];      // 08:00–13:00
  const AFTERNOON = [960, 1140];   // 16:00–19:00
  const HOURS = { 1: [MORNING, AFTERNOON], 2: [MORNING], 3: [MORNING, AFTERNOON], 4: [MORNING], 5: [MORNING, AFTERNOON] };
  const DAYS = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const romeNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
      min: Number(get('hour')) * 60 + Number(get('minute')),
    };
  };
  const updateStatus = () => {
    const { day, min } = romeNow();
    const slots = HOURS[day] || [];
    const current = slots.find(([a, b]) => min >= a && min < b);
    const later = slots.find(([a]) => min < a);
    let open = false, text;
    if (current) { open = true; text = `Aperto ora · chiude alle ${fmt(current[1])}`; }
    else if (later) { text = `Chiuso · riapre oggi alle ${fmt(later[0])}`; }
    else {
      let d = day, next;
      for (let i = 1; i <= 7; i++) { d = (day + i) % 7; if (HOURS[d]) { next = HOURS[d][0]; break; } }
      text = `Chiuso · apre ${d === (day + 1) % 7 ? 'domani' : DAYS[d]} alle ${fmt(next[0])}`;
    }
    document.querySelectorAll('[data-status]').forEach((el) => {
      el.textContent = text;
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-closed', !open);
      el.hidden = false;
    });
    // righe orari: 0=lun … 4=ven, 5=sabato/domenica
    const rows = document.querySelectorAll('.orario-item');
    const todayIdx = day >= 1 && day <= 5 ? day - 1 : 5;
    rows.forEach((r, i) => r.classList.toggle('is-today', i === todayIdx));
  };
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Nav: barra piena nell'hero, pillola flottante dopo ---------- */
  const nav = document.getElementById('nav');
  const setPill = () => nav.classList.toggle('is-pill', window.scrollY > window.innerHeight * 0.6);
  setPill();
  window.addEventListener('scroll', setPill, { passive: true });

  /* ---------- Movimento (saltato senza GSAP o con reduced motion) ---------- */
  if (!hasGsap || reduce) { root.classList.remove('js'); return; }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  if (typeof window.Lenis !== 'undefined') {
    const lenis = new window.Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const target = id.length > 1 && document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: id === '#home' ? 0 : -90 });
      });
    });
  }

  /* intro dell'hero */
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from(nav, { y: -32, opacity: 0, duration: 1.1 }, 0)
    .to('[data-hero="line"]', { y: 0, duration: 1.4, stagger: 0.12 }, 0.2)
    .to('.hero [data-hero="fade"]:not(.hero-visual)', { opacity: 1, duration: 1, stagger: 0.1 }, 0.6)
    .fromTo('.hero-photo', { y: 70, rotate: 8 }, { y: 0, rotate: 2, duration: 1.6 }, 0.4)
    .to('.hero-visual', { opacity: 1, duration: 1 }, 0.4)
    .fromTo('.hero-card', { y: 60, opacity: 0, rotate: -12 }, { y: 0, opacity: 1, rotate: -4, duration: 1.6 }, 0.9);

  /* la foto e la card scorrono in parallasse */
  gsap.to('.hero-photo', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-card', { yPercent: -40, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* rivelazioni a gruppi, con leggero sfalsamento */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  /* frase "chi siamo": le parole si accendono mentre scorri */
  document.querySelectorAll('[data-split]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.3 }, {
      opacity: 1, stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
    });
  });
})();
