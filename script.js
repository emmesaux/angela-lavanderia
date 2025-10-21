function onReady(cb) {
  if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cb, { once: true });
  } else {
  cb();
  }
}

// Menu hamburger responsivo e gestione nav attiva
onReady(() => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // animate hamburger lines (add/remove .open)
    hamburger.classList.toggle('open');
  });

  const navAnchors = navLinks.querySelectorAll('a');
  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navAnchors.forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const navLink = navLinks.querySelector(`a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navAnchors.forEach(x => x.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach(section => sectionObserver.observe(section));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Animazioni sezioni
const revealElements = () => {
  const elements = document.querySelectorAll('.servizio-card, .prezzo-card, .info-box');
  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    if (elementTop < window.innerHeight && elementBottom > 0) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
};

const initializeElements = () => {
  const elements = document.querySelectorAll('.servizio-card, .prezzo-card, .info-box');
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
};

onReady(() => {
  initializeElements();
  revealElements();
  window.addEventListener('scroll', revealElements);
});

/* ----------------------------------------------------------------- */
/* Cookie consent banner (GDPR) con preferenze                        */
/* ----------------------------------------------------------------- */
// Toggle to use Iubenda's solution instead of the local banner.
// Set to `true` to prefer Iubenda (we'll keep local code for now but it won't run).
const USE_IUBENDA = true;
const defaultConsent = { necessary: true, functional: false, analytics: false, marketing: false };

// Known services for cookie management
const servicesMeta = [
  { id: 'cloudflare', name: 'Cloudflare', desc: 'Content Delivery Network per performance e sicurezza.', category: 'necessary' },
  { id: 'fastly', name: 'Fastly CDN', desc: 'Content Delivery Network per caching e performance.', category: 'necessary' },
  { id: 'github_pages', name: 'GitHub Pages', desc: 'Hosting del sito statico.', category: 'necessary' },
  { id: 'fontawesome', name: 'Font Awesome', desc: 'Libreria di icone per elementi grafici.', category: 'functional' },
  { id: 'google_maps', name: 'Google Maps Widget', desc: 'Incorpora la mappa interattiva di Google (terze parti).', category: 'functional' }
];

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  // Only set Secure on HTTPS to allow testing on http/localhost
  let cookieStr = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
  if (location.protocol === 'https:') cookieStr += '; Secure';
  document.cookie = cookieStr;
  console.debug('Set cookie:', name, value);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getConsent() {
  // Try cookie first
  const raw = getCookie('cookie_consent');
  if (raw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw));
      return { ...defaultConsent, ...parsed };
    } catch (err) {
      console.warn('Unable to parse cookie consent value from cookie, trying localStorage.', err);
    }
  }
  // Fallback to localStorage
  try {
    const rawLS = localStorage.getItem('cookie_consent');
    console.debug('Read cookie_consent from localStorage:', rawLS);
    if (rawLS) return { ...defaultConsent, ...JSON.parse(rawLS) };
  } catch (err) {}
  return null;
}

function isConsentConfirmedAndTimestamped() {
  let confirmed = getCookie('cookie_consent_confirmed');
  let ts = getCookie('cookie_consent_ts');
  try { if (!confirmed) confirmed = localStorage.getItem('cookie_consent_confirmed'); } catch (e) {}
  try { if (!ts) ts = localStorage.getItem('cookie_consent_ts'); } catch (e) {}
  return !!confirmed && !!ts;
}

function saveConsent(consent) {
  const ts = new Date().toISOString();
  const normalized = { ...defaultConsent, ...consent, ts };
  setCookie('cookie_consent', encodeURIComponent(JSON.stringify(normalized)), 365);
  // mark consent as confirmed (prevents accidental hiding on reload)
  try { setCookie('cookie_consent_confirmed', '1', 365); localStorage.setItem('cookie_consent_confirmed', '1'); } catch (e) {}
  try { setCookie('cookie_consent_ts', ts, 365); localStorage.setItem('cookie_consent_ts', ts); } catch (e) {}
  setCategoryCookies(normalized);
  // Also persist in localStorage as fallback when cookies cannot be set
  try { localStorage.setItem('cookie_consent', JSON.stringify(normalized)); } catch (e) {}
  console.info('Consent saved:', normalized);
  // Apply immediate effects
  handleConsentEffects();
}

 
function deleteCategoryCookies() {
  setCookie('consent_functional', '', -1);
  setCookie('consent_analytics', '', -1);
  setCookie('theme', '', -1);
  setCookie('analytics_enabled', '', -1);
  try { localStorage.removeItem('consent_functional'); localStorage.removeItem('consent_analytics'); localStorage.removeItem('theme'); localStorage.removeItem('analytics_enabled'); } catch (e) {}
}

function setCategoryCookies(consent) {
  setCookie('consent_functional', consent.functional ? '1' : '0', 365);
  setCookie('consent_analytics', consent.analytics ? '1' : '0', 365);
  setCookie('consent_marketing', consent.marketing ? '1' : '0', 365);
  console.debug('Category cookies set: functional=', consent.functional, 'analytics=', consent.analytics);
  try { localStorage.setItem('consent_functional', consent.functional ? '1' : '0'); localStorage.setItem('consent_analytics', consent.analytics ? '1' : '0'); } catch (e) {}
  if (consent.functional) {
    try { const t = localStorage.getItem('theme'); if (t) setCookie('theme', t, 365); } catch (e) {}
  } else {
    setCookie('theme', '', -1);
  }
  if (consent.analytics) {
    setCookie('analytics_enabled', '1', 365);
    try { localStorage.setItem('analytics_enabled', '1'); } catch (e) {}
  } else {
    setCookie('analytics_enabled', '', -1);
    try { localStorage.removeItem('analytics_enabled'); } catch (e) {}
  }
  if (!consent.marketing) {
    try { setCookie('marketing_enabled', '', -1); localStorage.removeItem('marketing_enabled'); } catch (e) {}
  } else {
    try { setCookie('marketing_enabled', '1', 365); localStorage.setItem('marketing_enabled', '1'); } catch (e) {}
  }
}

function hasConsent(category) {
  const consent = getConsent();
  if (!consent) return false;
  return !!consent[category];
}

function removeCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
    // only remove banner if consent has been set (cookie or localStorage)
  const consentCookie = getCookie('cookie_consent');
  let consentStored = false;
  if (consentCookie) consentStored = true;
  try { if (!consentStored && localStorage.getItem('cookie_consent')) consentStored = true; } catch (e) {}
  if (!consentStored) {
    // don't remove the banner unless the user set consent
    return;
  }
  // ensure consent was explicitly confirmed with timestamp
  let confirmed = getCookie('cookie_consent_confirmed');
  let ts = getCookie('cookie_consent_ts');
  try { if (!confirmed) confirmed = localStorage.getItem('cookie_consent_confirmed'); } catch (e) {}
  try { if (!ts) ts = localStorage.getItem('cookie_consent_ts'); } catch (e) {}
  if (!confirmed || !ts) return;
  // do not remove the banner if it's currently forced open (user hasn't completed a choice)
  if (banner.dataset.forced === '1') return;
  // Avoid removing immediately after showing (guard against accidental close)
  const shownAt = banner.dataset.shownAt ? parseInt(banner.dataset.shownAt, 10) : 0;
  const elapsed = Date.now() - shownAt;
  const minVisible = 1200; // ms
  if (elapsed < minVisible) {
    setTimeout(removeCookieBanner, Math.max(50, minVisible - elapsed));
    return;
  }
  const card = banner.querySelector('.cookie-card');
  if (card) {
    card.style.transform = 'translateY(110%)';
    card.style.opacity = '0';
    setTimeout(() => { try { banner.remove(); } catch (e) {} }, 380);
  } else {
    try { banner.remove(); } catch (e) {}
  }
}

function showCookieBanner(force = false) {
  if (USE_IUBENDA) return; // local banner disabled because Iubenda is active
  const consentValue = getConsent();
  // Check whether consent was previously confirmed (some older states may have cookie_consent without confirmation)
  let confirmed = getCookie('cookie_consent_confirmed');
  try { if (!confirmed) confirmed = localStorage.getItem('cookie_consent_confirmed'); } catch (e) {}
  // If consent already exists and was explicitly confirmed (and we're not forcing), apply and don't show banner
  if (consentValue && !force && confirmed) {
    runPostConsent();
    return;
  }
  // Use persisted consent as initial UI state when available
  const existing = consentValue ? { ...defaultConsent, ...consentValue } : { ...defaultConsent };

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  const card = document.createElement('div');
  card.className = 'cookie-card';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.setAttribute('aria-modal', 'true');
  card.innerHTML = `
    <div class="cookie-message">
      <div class="cookie-logo"><img src="images/logo.png" alt="Angela Lavanderia"></div>
      <div class="cookie-text">
        <strong>Preferenze cookie</strong>
        <div class="cookie-desc">Usiamo i cookie per personalizzare i contenuti e analizzare il traffico. Scegli quali abilitare.</div>
        <div class="cookie-links">
          <a href="privacy.html" class="cookie-link">Privacy</a>
          <a href="cookie.html" class="cookie-link">Cookie Policy</a>
        </div>
      </div>
    </div>
      <div class="cookie-categories-compact">
      <label>Necessari <input type="checkbox" data-category="necessary" disabled checked></label>
      <label>Funzionali <input type="checkbox" data-category="functional"></label>
      <label>Statistiche <input type="checkbox" data-category="analytics"></label>
      <label>Marketing <input type="checkbox" data-category="marketing"></label>
      <a href="#" class="cookie-details">Mostra dettagli</a>
    </div>
      <div class="cookie-actions">
        <button type="button" class="btn btn-primary" id="cookie-accept">Consenti tutti</button>
        <button type="button" class="btn btn-ghost" id="cookie-reject">Rifiuta</button>
      </div>
  `;

  // Preferences panel (will be shown below the card if toggled)
  const prefPanelEl = document.createElement('div');
  prefPanelEl.className = 'cookie-preferences';
  prefPanelEl.hidden = true;
  prefPanelEl.innerHTML = `
    <p class="cookie-pref-title">Categorie opzionali</p>
    <div class="categories-row">
      <label>Necessari <input type="checkbox" data-category="necessary" disabled checked></label>
      <label>Funzionali <input type="checkbox" data-category="functional"></label>
      <label>Statistiche <input type="checkbox" data-category="analytics"></label>
      <label>Marketing <input type="checkbox" data-category="marketing"></label>
    </div>
    <div class="services-list"></div>
    <div class="cookie-pref-actions">
      <button type="button" class="btn btn-primary" id="cookie-save">Salva preferenze</button>
    </div>
  `;
  // place preferences panel inside the card so it displays below the main row
  card.appendChild(prefPanelEl);
  banner.appendChild(card);
  document.body.appendChild(banner);
  // record shown timestamp for minimum-visible guard
  try { banner.dataset.shownAt = String(Date.now()); } catch (e) {}
  banner.dataset.forced = '1';
  // entrance animation (slide from bottom)
  card.style.transform = 'translateY(110%)';
  card.style.opacity = '0';
  requestAnimationFrame(() => {
    card.style.transition = 'transform 320ms cubic-bezier(.2,.8,.2,1), opacity 320ms ease-out';
    card.style.transform = 'translateY(0)';
    card.style.opacity = '1';
  });

  const prefPanel = prefPanelEl;
  // populate services
  const servicesListEl = prefPanelEl.querySelector('.services-list');
  servicesMeta.forEach(s => {
    const div = document.createElement('div');
    div.className = 'service';
    const info = document.createElement('div');
    info.className = 'service-info';
    info.innerHTML = `<strong>${s.name}</strong><p>${s.desc}</p>`;
    const action = document.createElement('div');
    action.className = 'service-action';
    if (s.category === 'necessary') {
      // show a non-removable checked box and label for necessary cookies
      const lbl = document.createElement('label');
      lbl.className = 'mandatory';
      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = true;
      chk.disabled = true;
      chk.setAttribute('aria-label', 'Obbligatorio');
      const txt = document.createElement('span');
      txt.className = 'mandatory-text';
      txt.textContent = 'Obbligatorio';
      lbl.appendChild(chk);
      lbl.appendChild(txt);
      action.appendChild(lbl);
    } else {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('data-service', s.id);
      // initialize state from existing service cookie or category default
      const servicePref = getServicePreference(s.id, !!existing[s.category]);
      input.checked = !!servicePref;
      action.appendChild(input);
    }
    div.appendChild(info);
    div.appendChild(action);
    servicesListEl.appendChild(div);
  });

    // initialize the category toggles
    const catInputs = prefPanel.querySelectorAll('.categories-row input[type="checkbox"]');
    catInputs.forEach(ci => {
      const cat = ci.getAttribute('data-category');
      if (cat) {
        ci.checked = !!existing[cat];
        ci.addEventListener('change', () => {
          // toggle all service checkboxes in that category
          prefPanel.querySelectorAll(`input[data-service]`).forEach(si => {
            const sid = si.getAttribute('data-service');
            const serviceMeta = servicesMeta.find(sm => sm.id === sid);
            if (serviceMeta && serviceMeta.category === cat) {
              si.checked = ci.checked;
            }
          });
        });
      }
    });

  // The preferences panel is exposed via the "Mostra dettagli" link only.

  // Il link 'Mostra dettagli' apre il pannello delle preferenze
  const detailsLink = card.querySelector('.cookie-details');
  if (detailsLink) {
    detailsLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (prefPanel.hasAttribute('hidden')) prefPanel.removeAttribute('hidden');
      else prefPanel.setAttribute('hidden', '');
      prefPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  card.querySelector('#cookie-accept').addEventListener('click', () => {
    // check all non-necessary services
    prefPanel.querySelectorAll('input[data-service]').forEach(i => i.checked = true);
    const services = collectServiceSelections(prefPanel);
    saveConsent({ necessary: true, functional: true, analytics: true, marketing: true });
    setServiceCookiesFromSelections(services);
    // allow removal now
    banner.dataset.forced = '0';
    removeCookieBanner();
    runPostConsent();
  });

  card.querySelector('#cookie-reject').addEventListener('click', () => {
    // uncheck all optional services
    prefPanel.querySelectorAll('input[data-service]').forEach(i => i.checked = false);
    const services = collectServiceSelections(prefPanel);
    saveConsent({ necessary: true, functional: false, analytics: false, marketing: false });
    setServiceCookiesFromSelections(services);
    banner.dataset.forced = '0';
    removeCookieBanner();
    runPostConsent();
  });

  card.querySelector('#cookie-save').addEventListener('click', () => {
  const services = collectServiceSelections(prefPanel);
    const selections = { necessary: true };
    // derive categories based on selected services
    selections.functional = servicesMeta.some(s => s.category === 'functional' && services[s.id]);
    selections.analytics = servicesMeta.some(s => s.category === 'analytics' && services[s.id]);
    selections.marketing = servicesMeta.some(s => s.category === 'marketing' && services[s.id]);
    saveConsent(selections);
    setServiceCookiesFromSelections(services);
    banner.dataset.forced = '0';
    removeCookieBanner();
    runPostConsent();
  });

  // Keep banner visible during scroll until user makes a choice
  const ensureVisible = () => {
    const b = document.querySelector('.cookie-banner');
    // remain visible until consent is explicitly confirmed with a timestamp
    if (b && !isConsentConfirmedAndTimestamped()) {
      b.style.display = '';
      b.style.opacity = '1';
      b.style.bottom = '0';
      b.style.pointerEvents = 'auto';
    }
  };
  window.addEventListener('scroll', ensureVisible);
  window.addEventListener('resize', ensureVisible);
  window.addEventListener('orientationchange', ensureVisible);

  
}

function collectServiceSelections(card) {
  const result = {};
  card.querySelectorAll('input[data-service]').forEach(i => {
    result[i.getAttribute('data-service')] = !!i.checked;
  });
  return result;
}

function getServicePreference(id, defaultValue) {
  const cookieName = 'service_' + id;
  const c = getCookie(cookieName);
  if (c !== null) return c === '1';
  try {
    const ls = localStorage.getItem(cookieName);
    if (ls !== null) return ls === '1';
  } catch (e) {}
  return !!defaultValue;
}

function setServiceCookiesFromSelections(selections) {
  Object.keys(selections).forEach(id => {
    const cookieName = 'service_' + id;
    setCookie(cookieName, selections[id] ? '1' : '0', 365);
    try { localStorage.setItem(cookieName, selections[id] ? '1' : '0'); } catch (e) {}
  });
}

function handleConsentEffects() {
  const consent = getConsent();
  if (!consent) return;

  if (!consent.functional) {
    try { localStorage.removeItem('theme'); } catch (e) {}
    applyTheme(getPreferredTheme());
  }

  if (consent.analytics) {
    console.log('Analytics consent granted – ready to initialize tracking.');
  }
}

function runPostConsent() {
  handleConsentEffects();
  // remove or deactivate services the user has not consented to
  removeUnconsentedServices(getConsent() || {});
  // initialize analytics if consent granted
  if (hasConsent('analytics')) loadAnalytics();
  // Map is embedded in HTML; no action needed for functional consent
}

function loadAnalytics() {
  if (document.getElementById('ga-script')) return; // already loaded
  // Example stub for Google Analytics (gtag)
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-000000-0';
  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-000000-0');
  };
  document.head.appendChild(script);
}

function removeUnconsentedServices(consent) {
  // Remove cookies and localStorage entries for services that are not consented
  Object.keys(consent).forEach(k => {
    // skip necessary
  });
  // remove analytics script if not consented
  if (!consent.analytics) {
    const ga = document.getElementById('ga-script');
    if (ga) ga.remove();
    // clear analytics cookies
    try { setCookie('_ga', '', -1); setCookie('_gid', '', -1); } catch (e) {}
  }
}

onReady(() => {
  const consent = getConsent();
  let confirmed = getCookie('cookie_consent_confirmed');
  let ts = getCookie('cookie_consent_ts');
  try { if (!confirmed) confirmed = localStorage.getItem('cookie_consent_confirmed'); } catch (e) {}
  try { if (!ts) ts = localStorage.getItem('cookie_consent_ts'); } catch (e) {}
  if (consent && confirmed && ts) {
    runPostConsent();
  } else {
    // Show local banner only when explicitly forced (default is to use Iubenda)
    showCookieBanner();
  }
  const manageLink = document.getElementById('cookie-manage');
  if (manageLink) {
    manageLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.iub !== 'undefined' && window.iub && window.iub.cs) {
        // Open iubenda cookie preferences panel if available
        try { window.iub.cs.open(); } catch (e) { console.warn('Unable to open Iubenda CS panel', e); }
        return;
      }
      // Fallback: toggle our local banner if Iubenda is not available
      const banner = document.querySelector('.cookie-banner');
      if (banner) {
        const pref = banner.querySelector('.cookie-preferences');
        if (pref) {
          if (pref.hasAttribute('hidden')) {
            pref.removeAttribute('hidden');
            pref.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            pref.setAttribute('hidden', '');
          }
          return;
        }
      } else {
        // force true to ensure banner appears even if consent exists
        showCookieBanner(true);
        // after banner created, open preferences panel
        setTimeout(() => {
          const b = document.querySelector('.cookie-banner');
          if (b) {
            const p = b.querySelector('.cookie-preferences');
            if (p) { p.removeAttribute('hidden'); }
          }
        }, 50);
      }
    });
  }
});

/* ----------------------------------------------------------------- */
/* Theme handling (only store preference if consent is given)         */
/* ----------------------------------------------------------------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function getStoredTheme() {
  // store theme only if cookie consent definito e abilitato per i cookie funzionali
  if (hasConsent('functional')) {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  return null;
}

function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored) return stored;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function setTheme(theme) {
  applyTheme(theme);
  if (hasConsent('functional')) {
    try { localStorage.setItem('theme', theme); } catch (e) {}
  } else {
    try { localStorage.removeItem('theme'); } catch (e) {}
  }
}

onReady(function() {
  applyTheme(getPreferredTheme());
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }
});

// Gestisci la visibilità del navbar
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

console.log('Angela Lavanderia - Sito web caricato correttamente!');

async function loadInstagramFeed() {
  const el = document.getElementById('insta-feed');
  if (!el) return;

  try {
    // Carica i dati Instagram dal file JSON generato da GitHub Actions
    const response = await fetch('./data/instagram.json');

    if (!response.ok) {
      throw new Error(`Failed to load Instagram data: ${response.status}`);
    }

    const data = await response.json();
    const posts = data.items || [];

    if (!posts.length) {
      el.innerHTML = '<p class="insta-fallback">Nessun post disponibile. <a href="https://www.instagram.com/lavanderia_angela_/" target="_blank">Visita il nostro profilo</a></p>';
      return;
    }

    const items = posts.slice(0, 3);
    el.innerHTML = '';
    
    items.forEach(post => {
      const a = document.createElement('a');
      a.className = 'insta-item';

      const preferredLink = post.link && post.link.includes('/p/') ? post.link : null;
      const fallbackLink = post.shortcode ? `https://www.instagram.com/p/${post.shortcode}/` : null;
      a.href = preferredLink || post.permalink || fallbackLink || 'https://www.instagram.com/lavanderia_angela_/';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('role', 'listitem');
      if (post.caption) a.setAttribute('aria-label', post.caption.substring(0, 100));
      
      const img = document.createElement('img');
      img.loading = 'lazy';

      const captionText = (post.caption || '').trim();
      img.alt = captionText ? captionText.substring(0, 120) : 'Post Instagram Lavanderia Angela';

      const fallbackSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3C/svg%3E';
      const candidates = [
        post.image,
        post.media_url,
        post.thumbnail_url,
        post.display_url,
        post.media?.image_url,
        post.shortcode ? `https://www.instagram.com/p/${post.shortcode}/media/?size=l` : null
      ].filter(Boolean);

      let candidateIndex = 0;
      const tryNext = () => {
        if (candidateIndex < candidates.length) {
          img.src = candidates[candidateIndex];
          candidateIndex += 1;
        } else {
          img.src = fallbackSvg;
        }
      };

      img.addEventListener('error', tryNext);
      tryNext();
      
      a.appendChild(img);
      el.appendChild(a);
    });

    console.log('Instagram feed loaded:', posts.length, 'posts');
  } catch (err) {
    console.error('Instagram feed error:', err);
    el.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p style="margin-bottom: 1rem; color: #666;">Segui i nostri ultimi post su Instagram!</p>
        <a href="https://www.instagram.com/lavanderia_angela_/" target="_blank" class="btn btn-primary">Visita il nostro profilo</a>
      </div>
    `;
  }
}

// Cookie scanner: scans document.cookie for visible cookies and categorizes them
  function scanCookies() {
    const resultsEl = document.getElementById('cookie-scan-results');
    if (!resultsEl) return;
    const raw = document.cookie || '';
    if (!raw) {
      resultsEl.innerHTML = '<p>Nessun cookie rilevabile via JavaScript (OK per conformità iniziale).</p>';
      return;
    }
    const pairs = raw.split('; ').map(s => s.split('='));
    const cookies = pairs.map(p => ({ name: p[0], value: decodeURIComponent(p[1] || '') }));

    // Simple heuristics mapping for known cookie names -> categories
    const mapping = {
      session: 'necessary',
      PHPSESSID: 'necessary',
      cookie_consent: 'necessary',
      consent_functional: 'functional',
      consent_analytics: 'analytics',
      analytics_enabled: 'analytics',
      _ga: 'analytics',
      _gid: 'analytics',
      _gat: 'analytics',
      collect: 'analytics'
    };

    const list = document.createElement('ul');
    cookies.forEach(c => {
      const li = document.createElement('li');
      const cat = mapping[c.name] || 'unknown';
      li.textContent = `${c.name}: ${c.value} - categoria: ${cat}`;
      list.appendChild(li);
    });
    resultsEl.innerHTML = '';
    resultsEl.appendChild(list);
  }

onReady(() => {
  const scanBtn = document.getElementById('scan-cookies');
  if (scanBtn) scanBtn.addEventListener('click', scanCookies);
});

// Ensure Instagram feed is loaded after DOM is ready
onReady(() => {
  try {
    loadInstagramFeed();
  } catch (e) {
    console.warn('Error calling loadInstagramFeed onReady:', e);
  }
});
