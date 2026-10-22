/* ================================================================
   SCRIPT.JS — Portfolio Photo Nature
   ----------------------------------------------------------------
   Sommaire :
     0. Génération de la galerie (depuis photos.js)
     1. Année dynamique (footer)
     2. Curseur personnalisé
     3. Navbar au scroll
     4. Menu hamburger (mobile)
     5. Filtres de galerie (thème / format / teinte)
     6. Lightbox (+ fullscreen + compteur)
     7. Révélation au scroll
     8. Scrollspy (lien actif dans la nav)
     9. Blur-up (chargement progressif des images)
   ----------------------------------------------------------------
   Chaque section est isolée dans un try/catch : une erreur dans
   une fonctionnalité (ex. un id renommé par erreur) n'empêche plus
   les autres fonctionnalités de la page de fonctionner.
================================================================ */


/* ── 0. GÉNÉRATION DE LA GALERIE ────────────────────────────── */
/*    Construit les .gallery-item à partir de la liste PHOTOS      */
/*    (photos.js). Doit s'exécuter AVANT les filtres, la lightbox  */
/*    et le blur-up, qui s'appliquent aux éléments créés ici.      */

try {
  const grid = document.querySelector('.gallery-grid');
  const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const fragment = document.createDocumentFragment();

  PHOTOS.forEach(p => {
    const item = document.createElement('div');
    item.className   = 'gallery-item';
    item.dataset.cat = p.cat;
    if (p.ratio)   item.dataset.ratio  = p.ratio;     /* sinon détecté (section 5) */
    if (p.couleur) item.dataset.teinte = p.couleur;   /* sinon détecté (section 5) */

    const img = document.createElement('img');
    img.className   = 'blur-up';
    img.src         = PLACEHOLDER;
    img.dataset.src = DOSSIER_PHOTOS + p.fichier;
    img.alt         = p.alt || p.titre;
    img.loading     = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';

    const caption = document.createElement('div');
    caption.className = 'gallery-caption';

    /* textContent (et non innerHTML) : apostrophes, & et < sont
       affichés tels quels, sans risque de casser le HTML */
    const titre = document.createElement('h3');
    titre.textContent = p.titre;

    const legende = document.createElement('p');
    /* " - " saisi dans photos.js devient un point médian à l'affichage
       (\u00B7 = « · »). Un « · » saisi directement reste accepté. */
    legende.textContent = (p.legende || '').split(' - ').join(' \u00B7 ');

    caption.append(titre, legende);
    overlay.append(caption);
    item.append(img, overlay);
    fragment.append(item);
  });

  grid.append(fragment);
} catch (err) {
  console.error('Erreur — génération de la galerie (photos.js chargé ?) :', err);
}


/* ── 1. ANNÉE DYNAMIQUE ─────────────────────────────────────── */

try {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
} catch (err) {
  console.error('Erreur — année dynamique :', err);
}


/* ── Préférence de mouvement réduit ────────────────────────── */
/*    Partagée par le curseur, le reveal et le ring             */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ── Classement d'une photo par format ─────────────────────── */
/*    Rapport largeur / hauteur : 3:2 → 1,5 · 4:3 → 1,33 · 1:1 → 1 */

function classerRatio(largeur, hauteur) {
  const r = largeur / hauteur;
  if (r >= 1.9)  return 'panorama';
  if (r >  1.15) return 'paysage';
  if (r >= 0.87) return 'carre';
  return 'portrait';
}


/* ── 2. CURSEUR PERSONNALISÉ ────────────────────────────────── */
/*    Désactivé sur appareils tactiles (pointer: coarse)         */

try {
  if (!window.matchMedia('(pointer: coarse)').matches) {

    document.body.classList.add('custom-cursor');

    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    /* translate(x,y) puis translate(-50%,-50%) : deux translations pures
       se cumulent quel que soit l'ordre, donc ça revient à centrer le
       point (x,y) sur l'élément — mais via transform (compositor-only,
       pas de reflow) plutôt que left/top (qui déclenchent du layout à
       chaque frame). */
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      /* Si les animations sont réduites, la boucle animerRing ne tourne
         jamais : sans ceci, l'anneau resterait figé en haut à gauche. */
      if (reduceMotion) {
        cursorRing.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    });

    function animerRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animerRing);
    }

    if (!reduceMotion) animerRing();

  }
} catch (err) {
  console.error('Erreur — curseur personnalisé :', err);
}


/* ── 3. NAVBAR AU SCROLL ────────────────────────────────────── */

try {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
} catch (err) {
  console.error('Erreur — navbar au scroll :', err);
}


/* ── 4. MENU HAMBURGER (mobile) ─────────────────────────────── */

try {
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
} catch (err) {
  console.error('Erreur — menu hamburger :', err);
}


/* ── 5. FILTRES DE GALERIE ──────────────────────────────────── */
/*    Trois filtres combinables : thème, format, teinte.          */
/*    Format et teinte sont lus dans photos.js s'ils y sont       */
/*    renseignés ; sinon ils sont détectés en chargeant l'image   */
/*    (une seule fois, au premier clic sur l'un de ces filtres).  */

try {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const vide         = document.getElementById('galleryEmpty');
  const etat         = { cat: 'all', ratio: 'all', teinte: 'all' };
  let canvasBloque   = false;

  /* Couleur ou N&B : l'image est réduite à 48 px de large, puis on mesure
     l'écart moyen entre les canaux R/V/B. Un écart quasi nul partout
     = noir & blanc. Renvoie null si le canvas est bloqué par le navigateur
     (ouverture du site en file:// — fonctionne sur un vrai serveur). */
  function detecterTeinte(img) {
    try {
      const W = 48;
      const H = Math.max(1, Math.round(W * img.naturalHeight / img.naturalWidth));
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, W, H);
      const px = ctx.getImageData(0, 0, W, H).data;
      let somme = 0, colores = 0;
      for (let i = 0; i < px.length; i += 4) {
        const ecart = Math.max(px[i], px[i+1], px[i+2]) - Math.min(px[i], px[i+1], px[i+2]);
        somme += ecart;
        if (ecart > 30) colores++;
      }
      const n = px.length / 4;
      return (somme / n < 10 && colores / n < 0.03) ? 'nb' : 'couleur';
    } catch (e) {
      return null;
    }
  }

  /* Renseigne data-ratio / data-teinte si absents */
  function analyserItem(item) {
    if (item.dataset.ratio && item.dataset.teinte) return Promise.resolve();
    return new Promise(resolve => {
      const im = new Image();
      im.onload = () => {
        if (!item.dataset.ratio) {
          item.dataset.ratio = classerRatio(im.naturalWidth, im.naturalHeight);
        }
        if (!item.dataset.teinte) {
          const t = detecterTeinte(im);
          if (!t && !canvasBloque) {
            canvasBloque = true;
            console.warn('Détection N&B impossible (canvas bloqué). Testez via un serveur local, ou ajoutez couleur: "nb" / "couleur" dans photos.js.');
          }
          item.dataset.teinte = t || 'couleur';
        }
        resolve();
      };
      im.onerror = resolve;
      im.src = item.querySelector('img').dataset.src;
    });
  }

  function appliquer() {
    let visibles = 0;
    galleryItems.forEach(item => {
      const ok = Object.keys(etat).every(g => etat[g] === 'all' || item.dataset[g] === etat[g]);
      item.classList.toggle('hidden', !ok);
      if (ok) visibles++;
    });
    if (vide) vide.hidden = visibles > 0;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const groupe = btn.dataset.group;

      document.querySelectorAll(`.filter-btn[data-group="${groupe}"]`).forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      etat[groupe] = btn.dataset.filter;

      /* Format / teinte : s'assurer que toutes les photos sont analysées */
      if (groupe !== 'cat' && etat[groupe] !== 'all') {
        await Promise.all(galleryItems.map(analyserItem));
      }
      appliquer();
    });
  });
} catch (err) {
  console.error('Erreur — filtres de galerie :', err);
}


/* ── 6. LIGHTBOX ────────────────────────────────────────────── */

try {
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxTitle   = document.getElementById('lightboxTitle');
  const lightboxCat     = document.getElementById('lightboxCat');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const galleryItems    = document.querySelectorAll('.gallery-item');

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
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    /* Restaurer le focus sur l'élément déclencheur */
    if (dernierFocus) dernierFocus.focus();
  }

  /* Ouverture au clic ET au clavier (accessibilité) */
  galleryItems.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    const titre = item.querySelector('h3')?.textContent || 'photo';
    item.setAttribute('aria-label', `Agrandir la photo : ${titre}`);

    const ouvrir = () => ouvrirLightbox(getVisibles().indexOf(item));

    item.addEventListener('click', ouvrir);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ouvrir();
      }
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

  /* Piège à focus : empêche le Tab de sortir de la lightbox pendant
     qu'elle est ouverte (sinon le focus s'échappe vers la nav, cachée
     derrière l'overlay). */
  function gererFocusLightbox(e) {
    if (e.key !== 'Tab') return;
    const focusables = lightbox.querySelectorAll('button:not([disabled])');
    const premier = focusables[0];
    const dernier  = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === premier) {
      e.preventDefault();
      dernier.focus();
    } else if (!e.shiftKey && document.activeElement === dernier) {
      e.preventDefault();
      premier.focus();
    }
  }

  /* Navigation clavier */
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     fermerLightbox();
    if (e.key === 'ArrowLeft')  { currentIdx = (currentIdx - 1 + visibles.length) % visibles.length; afficherPhoto(currentIdx); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % visibles.length; afficherPhoto(currentIdx); }
    gererFocusLightbox(e);
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


  /* ── 6b. FULLSCREEN LIGHTBOX ──────────────────────────────── */

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

  /* Pas besoin de forcer l'icône initiale : le SVG "expand" est déjà
     posé en dur dans le HTML, iconeExpand ne sert qu'à y revenir
     après un passage en plein écran. */

  lightboxFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      lightbox.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
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

} catch (err) {
  console.error('Erreur — lightbox :', err);
}


/* ── 7. RÉVÉLATION AU SCROLL ────────────────────────────────── */

try {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = reduceMotion ? 0 : i * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target); /* plus besoin d'observer une fois révélé */
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} catch (err) {
  console.error('Erreur — révélation au scroll :', err);
}


/* ── 8. SCROLLSPY ───────────────────────────────────────────── */

try {
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
} catch (err) {
  console.error('Erreur — scrollspy :', err);
}


/* ── 9. BLUR-UP (chargement progressif) ─────────────────────── */
/*
   Principe :
   - src      = placeholder transparent → affichage immédiat, shimmer CSS visible
   - data-src = pleine résolution → chargée en arrière-plan via IntersectionObserver
   - Quand la pleine résolution est prête : swap src + classe .loaded → défloutage CSS
   - Pour des transitions encore plus douces : fournissez une version 30px wide dans
     images/thumbs/ et utilisez src="images/thumbs/ma-photo.jpg" à la place du placeholder.
   - Pour les photos de la galerie (.gallery-item), le ratio réel de l'image
     (naturalWidth / naturalHeight) est appliqué dès qu'elle est chargée, afin de
     réserver la bonne hauteur et limiter les décalages de mise en page (CLS).
     Le ratio par défaut avant chargement est fixé dans le CSS (.gallery-item img).
     Le portrait de la section "À propos" garde volontairement son ratio fixe
     (3/4) défini en CSS, puisqu'il s'agit d'un cadrage choisi, pas d'une photo
     de galerie au format variable.
*/

try {
  const blurUpObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const img     = entry.target;
        const fullSrc = img.dataset.src;
        if (!fullSrc) return;

        const preload = new Image();
        preload.onload = () => {
          if (img.closest('.gallery-item')) {
            img.style.aspectRatio = `${preload.naturalWidth} / ${preload.naturalHeight}`;
            const it = img.closest('.gallery-item');
            if (!it.dataset.ratio) it.dataset.ratio = classerRatio(preload.naturalWidth, preload.naturalHeight);
          }
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
} catch (err) {
  console.error('Erreur — blur-up :', err);
}
