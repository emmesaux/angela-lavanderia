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
      a.href = post.link;
      a.target = '_blank';
      a.rel = 'noopener';
      
      const img = document.createElement('img');
      img.src = post.image;
      img.alt = (post.caption || '').substring(0, 50);
      img.loading = 'lazy';
      img.onerror = () => { 
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3C/svg%3E'; 
      };
      
      a.appendChild(img);
      el.appendChild(a);
    });    console.log('Instagram feed loaded:', posts.length, 'posts');
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
