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
const defaultConsent = { necessary: true, functional: false, analytics: false };

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/; Secure; SameSite=Lax`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function getConsent() {
  const raw = getCookie('cookie_consent');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return { ...defaultConsent, ...parsed };
  } catch (err) {
    console.warn('Unable to parse cookie consent value, resetting.', err);
    return { ...defaultConsent };
  }
}

function saveConsent(consent) {
  const normalized = { ...defaultConsent, ...consent };
  setCookie('cookie_consent', encodeURIComponent(JSON.stringify(normalized)), 365);
}

function hasConsent(category) {
  const consent = getConsent();
  if (!consent) return false;
  return !!consent[category];
}

function removeCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (banner) banner.remove();
}

function showCookieBanner() {
  const existing = getConsent() || { ...defaultConsent };
  if (existing && existing.necessary && (existing.functional || existing.analytics)) {
    runPostConsent();
    return;
  }

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `
    <div class="cookie-message">
      <strong>Preferenze cookie</strong>
      <span>I cookie necessari sono sempre attivi. Seleziona le categorie opzionali che desideri abilitare.</span>
      <div class="cookie-links">
        <a href="/privacy.html" class="cookie-link">Privacy</a>
        <button type="button" class="cookie-preferences-toggle">Preferenze</button>
        <a href="/cookie.html" class="cookie-link">Cookie Policy</a>
      </div>
    </div>
    <div class="cookie-actions">
      <button type="button" class="btn btn-primary" id="cookie-accept">Accetta tutto</button>
      <button type="button" class="btn btn-outline" id="cookie-reject">Rifiuta</button>
    </div>
    <div class="cookie-preferences" hidden>
      <p class="cookie-pref-title">Categorie opzionali</p>
      <label>
        <input type="checkbox" data-category="functional">
        <span>Cookie funzionali (ricordano tema e impostazioni, abilitano contenuti avanzati).</span>
      </label>
      <label>
        <input type="checkbox" data-category="analytics">
        <span>Cookie statistici anonimi per migliorare il servizio.</span>
      </label>
      <div class="cookie-pref-actions">
        <button type="button" class="btn btn-primary" id="cookie-save">Salva preferenze</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  const prefPanel = banner.querySelector('.cookie-preferences');
  const prefInputs = banner.querySelectorAll('input[data-category]');
  prefInputs.forEach(input => {
    const cat = input.getAttribute('data-category');
    input.checked = !!existing[cat];
  });

  const toggleBtn = banner.querySelector('.cookie-preferences-toggle');
  toggleBtn.addEventListener('click', () => {
    const hidden = prefPanel.hasAttribute('hidden');
    if (hidden) {
      prefPanel.removeAttribute('hidden');
      prefPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      prefPanel.setAttribute('hidden', '');
    }
  });

  banner.querySelector('#cookie-accept').addEventListener('click', () => {
    saveConsent({ necessary: true, functional: true, analytics: true });
    removeCookieBanner();
    runPostConsent();
  });

  banner.querySelector('#cookie-reject').addEventListener('click', () => {
    saveConsent({ necessary: true, functional: false, analytics: false });
    removeCookieBanner();
    runPostConsent();
  });

  banner.querySelector('#cookie-save').addEventListener('click', () => {
    const selections = { necessary: true };
    prefInputs.forEach(input => {
      selections[input.getAttribute('data-category')] = input.checked;
    });
    saveConsent(selections);
    removeCookieBanner();
    runPostConsent();
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
}

onReady(() => {
  const consent = getConsent();
  if (consent) {
    runPostConsent();
  } else {
    showCookieBanner();
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
        <p style="margin-bottom: 1rem; color: #666;">
          Segui i nostri ultimi post su Instagram!
        </p>
        <a href="https://www.instagram.com/lavanderia_angela_/" target="_blank" class="btn btn-primary">
          Visita il nostro profilo
        </a>
      </div>
    `;
  }
}
onReady(loadInstagramFeed);
