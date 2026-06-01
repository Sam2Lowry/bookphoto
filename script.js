/* ================================================================
   SCRIPT.JS — Portfolio Photo Nature
   ----------------------------------------------------------------
   Sommaire :
     1. Année dynamique (footer)
     2. Curseur personnalisé
     3. Navbar au scroll
     4. Menu hamburger (mobile)
     5. Filtres de galerie
     6. Lightbox (+ fullscreen + compteur)
     7. Révélation au scroll
     8. Scrollspy (lien actif dans la nav)
     9. Blur-up (chargement progressif des images)
================================================================ */


/* ── 1. ANNÉE DYNAMIQUE ─────────────────────────────────────── */

document.getElementById('year').textContent = new Date().getFullYear();


/* ── Préférence de mouvement réduit ────────────────────────── */
/*    Partagée par le curseur, le reveal et le ring             */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ── 2. CURSEUR PERSONNALISÉ ────────────────────────────────── */
/*    Désactivé sur appareils tactiles (pointer: coarse)         */

if (!window.matchMedia('(pointer: coarse)').matches) {

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

  function animerRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animerRing);
  }

  if (!reduceMotion) animerRing();

}


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
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


/* ── 5. FILTRES DE GALERIE ──────────────────────────────────── */

const filterBtns   = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
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

const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxTitle   = document.getElementById('lightboxTitle');
const lightboxCat     = document.getElementById('lightboxCat');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentIdx   = 0;
let visibles     = [];
let dernierFocus = null;   /* Élément ayant le focus avant ouverture */

function getVisibles() {
  return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}

/* Mise à jour du compteur "3 / 11" */
function mettreAJourCompteur() {
  lightboxCounter.textContent = `${currentIdx + 1} / ${visibles.length}`;
}

/* Affichage avec préchargement et fondu */
function afficherPhoto(idx) {
  const item  = visibles[idx];
  const imgEl = item.querySelector('img');

  /* Fondu sortant */
  lightboxImg.style.opacity = '0';

  /* Récupérer la pleine résolution (data-src si blur-up, sinon src) */
  const newSrc = imgEl.dataset.src || imgEl.src;

  /* Précharger avant d'afficher */
  const preload = new Image();
  preload.onload = () => {
    lightboxImg.src = newSrc;
    lightboxImg.alt = imgEl.alt;
    lightboxImg.style.opacity = '1';
  };
  preload.src = newSrc;

  lightboxTitle.textContent = item.querySelector('h3').textContent;
  lightboxCat.textContent   = item.querySelector('p').textContent;
  mettreAJourCompteur();
}

function ouvrirLightbox(idx) {
  dernierFocus = document.activeElement;   /* Mémoriser pour restauration */
  visibles     = getVisibles();
  currentIdx   = idx;
  afficherPhoto(currentIdx);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  /* Déplacer le focus sur le bouton Fermer (accessibilité) */
  document.getElementById('lightboxClose').focus();
}

function fermerLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  /* Quitter le plein écran si actif */
  if (document.fullscreenElement) document.exitFullscreen();
  /* Restaurer le focus sur l'élément déclencheur */
  if (dernierFocus) dernierFocus.focus();
}

/* Ouverture au clic */
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

/* Navigation tactile (swipe) */
let touchStartX = 0;

lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 40) return;
  if (delta < 0) {
    currentIdx = (currentIdx + 1) % visibles.length;
  } else {
    currentIdx = (currentIdx - 1 + visibles.length) % visibles.length;
  }
  afficherPhoto(currentIdx);
});


/* ── 6b. FULLSCREEN LIGHTBOX ────────────────────────────────── */

const lightboxFullscreen = document.getElementById('lightboxFullscreen');

const iconeExpand = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
  <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
  <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
  <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
</svg>`;

const iconeCompress = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
  <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
  <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
  <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
</svg>`;

lightboxFullscreen.innerHTML = iconeExpand;

lightboxFullscreen.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    lightbox.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    lightboxFullscreen.innerHTML = iconeCompress;
    lightboxFullscreen.setAttribute('aria-label', 'Quitter le plein écran');
  } else {
    lightboxFullscreen.innerHTML = iconeExpand;
    lightboxFullscreen.setAttribute('aria-label', 'Plein écran');
  }
});


/* ── 7. RÉVÉLATION AU SCROLL ────────────────────────────────── */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = reduceMotion ? 0 : i * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── 8. SCROLLSPY ───────────────────────────────────────────── */

const sections   = document.querySelectorAll('section[id]');
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
  { rootMargin: '-20% 0px -50% 0px' }
);

sections.forEach(s => spyObserver.observe(s));


/* ── 9. BLUR-UP (chargement progressif) ─────────────────────── */
/*
   Principe :
   - src      = placeholder transparent → affichage immédiat, shimmer CSS visible
   - data-src = pleine résolution → chargée en arrière-plan via IntersectionObserver
   - Quand la pleine résolution est prête : swap src + classe .loaded → défloutage CSS
   - Pour des transitions encore plus douces : fournissez une version 30px wide dans
     images/thumbs/ et utilisez src="images/thumbs/ma-photo.jpg" à la place du placeholder.
*/

const blurUpObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img     = entry.target;
      const fullSrc = img.dataset.src;
      if (!fullSrc) return;

      const preload = new Image();
      preload.onload = () => {
        img.src = fullSrc;
        img.classList.add('loaded');
      };
      preload.onerror = () => {
        /* En cas d'erreur : rendre l'image visible quand même */
        img.classList.add('loaded');
      };
      preload.src = fullSrc;

      blurUpObserver.unobserve(img);
    });
  },
  { rootMargin: '200px 0px' } /* Précharge 200px avant l'entrée dans le viewport */
);

document.querySelectorAll('img.blur-up').forEach(img => blurUpObserver.observe(img));
