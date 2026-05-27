/* ================================================================
   SCRIPT.JS — Portfolio Photo Nature
   ----------------------------------------------------------------
   Ce fichier gère uniquement les interactions utilisateur.
   Tout le contenu est dans index.html, tout le style dans style.css.

   Sommaire :
     1. Année dynamique (footer)
     2. Curseur personnalisé
     3. Navbar au scroll
     4. Menu hamburger (mobile)
     5. Filtres de galerie
     6. Lightbox
     7. Révélation au scroll
================================================================ */


/* ── 1. ANNÉE DYNAMIQUE ─────────────────────────────────────── */

document.getElementById('year').textContent = new Date().getFullYear();


/* ── 2. CURSEUR PERSONNALISÉ ────────────────────────────────── */

/* Masquer le curseur natif et activer le curseur doré */
document.body.classList.add('custom-cursor');

const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

/* Le ring suit la souris avec un léger retard (effet inertie) */
function animerRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animerRing);
}
animerRing();


/* ── 3. NAVBAR AU SCROLL ────────────────────────────────────── */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


/* ── 4. MENU HAMBURGER (mobile) ─────────────────────────────── */

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

/* Fermer le menu au clic sur un lien */
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});


/* ── 5. FILTRES DE GALERIE ──────────────────────────────────── */

const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    /* Décocher tous, cocher le bouton cliqué */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filtre = btn.dataset.filter;

    galleryItems.forEach(item => {
      const masquer = filtre !== 'all' && item.dataset.cat !== filtre;
      item.classList.toggle('hidden', masquer);
    });
  });
});


/* ── 6. LIGHTBOX ────────────────────────────────────────────── */

const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCat   = document.getElementById('lightboxCat');

let currentIdx = 0;
let visibles   = [];

/* Retourne les photos actuellement affichées (filtre actif) */
function getVisibles() {
  return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}

/* Affiche la photo à l'index donné dans la lightbox */
function afficherPhoto(idx) {
  const item = visibles[idx];
  lightboxImg.src          = item.querySelector('img').src;
  lightboxImg.alt          = item.querySelector('img').alt;
  lightboxTitle.textContent = item.querySelector('h3').textContent;
  lightboxCat.textContent   = item.querySelector('p').textContent;
}

function ouvrirLightbox(idx) {
  visibles   = getVisibles();
  currentIdx = idx;
  afficherPhoto(currentIdx);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fermerLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/* Ouverture au clic sur une photo */
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    ouvrirLightbox(getVisibles().indexOf(item));
  });
});

/* Fermeture */
document.getElementById('lightboxClose').addEventListener('click', fermerLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) fermerLightbox();
});

/* Navigation précédent / suivant */
document.getElementById('lightboxPrev').addEventListener('click', () => {
  currentIdx = (currentIdx - 1 + visibles.length) % visibles.length;
  afficherPhoto(currentIdx);
});

document.getElementById('lightboxNext').addEventListener('click', () => {
  currentIdx = (currentIdx + 1) % visibles.length;
  afficherPhoto(currentIdx);
});

/* Navigation clavier */
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape')     fermerLightbox();
  if (e.key === 'ArrowLeft')  { currentIdx = (currentIdx - 1 + visibles.length) % visibles.length; afficherPhoto(currentIdx); }
  if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % visibles.length; afficherPhoto(currentIdx); }
});

/* Navigation tactile (swipe gauche / droite) */
let touchStartX = 0;

lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 40) return; /* trop court = tap, pas swipe */
  if (delta < 0) {
    currentIdx = (currentIdx + 1) % visibles.length;
  } else {
    currentIdx = (currentIdx - 1 + visibles.length) % visibles.length;
  }
  afficherPhoto(currentIdx);
});


/* ── 8. LIEN DE NAVIGATION ACTIF AU SCROLL (scrollspy) ──────── */

const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -55% 0px' } /* déclenche quand la section est au centre */
);

sections.forEach(s => spyObserver.observe(s));


/* ── 7. RÉVÉLATION AU SCROLL ────────────────────────────────── */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Léger décalage en cascade pour les éléments groupés */
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
