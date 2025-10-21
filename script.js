// Menu hamburger responsivo
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Chiudi menu quando clicchi su un link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Aggiungi gestione stato active per i link di navigazione
const navAnchors = document.querySelectorAll('.nav-links a');
navAnchors.forEach(a => {
    a.addEventListener('click', () => {
        navAnchors.forEach(x => x.classList.remove('active'));
        a.classList.add('active');
    });
});

// IntersectionObserver per aggiornare il link attivo mentre si scorre
const sections = document.querySelectorAll('section[id]');
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (entry.isIntersecting) {
            navAnchors.forEach(x => x.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}, observerOptions);
sections.forEach(section => sectionObserver.observe(section));

// Scroll smooth per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animazione di scroll rivela elementi
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

// Aggiungi stili iniziali agli elementi
const initializeElements = () => {
    const elements = document.querySelectorAll('.servizio-card, .prezzo-card, .info-box');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
};

window.addEventListener('scroll', revealElements);
window.addEventListener('load', () => {
    initializeElements();
    revealElements();
});

/* ----------------------------------------------------------------- */
/* Cookie consent banner (GDPR)                                       */
/* ----------------------------------------------------------------- */
function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
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

function hasCookieConsent() {
  return getCookie('cookie_consent') !== null;
}

function isConsentAccepted() {
  return getCookie('cookie_consent') === 'all';
}

function showCookieBanner() {
  if (hasCookieConsent()) return;
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML = `
    <div class="cookie-message">
      <strong>Usiamo i cookie</strong>
      <span>Questo sito utilizza cookie per migliorare l'esperienza. Puoi accettare o rifiutare i cookie non essenziali.</span>
      <a href="/cookie.html" class="cookie-link">Cookie Policy</a>
    </div>
    <div class="cookie-actions">
      <button class="btn btn-primary" id="cookie-accept">Accetta</button>
      <button class="btn btn-outline" id="cookie-reject">Rifiuta</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookie-accept').addEventListener('click', () => {
    setCookie('cookie_consent', 'all', 365);
    removeCookieBanner();
    runPostConsent();
  });
  document.getElementById('cookie-reject').addEventListener('click', () => {
    setCookie('cookie_consent', 'none', 365);
    removeCookieBanner();
  });
}

function removeCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (banner) banner.remove();
}

function runPostConsent() {
  // Placeholder: initialize analytics or other non-essential scripts
  if (isConsentAccepted()) {
    // e.g. loadAnalytics();
    console.log('Cookie consent accepted — you may initialize analytics.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showCookieBanner();
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
  // store theme only if cookie consent defined and accepted
  if (isConsentAccepted()) {
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
  if (isConsentAccepted()) {
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }
}

document.addEventListener('DOMContentLoaded', function() {
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
document.addEventListener('DOMContentLoaded', loadInstagramFeed);

// Lazy-load Google Maps iframe only after consent or manual click
function loadMapIfAllowed() {
  const wrapper = document.getElementById('map-wrapper');
  if (!wrapper) return;
  const mapSrc = wrapper.getAttribute('data-map-src');
  if (!mapSrc) return;
  if (isConsentAccepted()) {
    const iframe = document.createElement('iframe');
    iframe.src = mapSrc;
    iframe.width = '600';
    iframe.height = '450';
    iframe.style.border = '0';
    iframe.loading = 'lazy';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadMapIfAllowed();
  const btn = document.getElementById('load-map');
  if (btn) btn.addEventListener('click', () => {
    const wrapper = document.getElementById('map-wrapper');
    const mapSrc = wrapper.getAttribute('data-map-src');
    const iframe = document.createElement('iframe');
    iframe.src = mapSrc;
    iframe.width = '600';
    iframe.height = '450';
    iframe.style.border = '0';
    iframe.loading = 'lazy';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
  });
});
