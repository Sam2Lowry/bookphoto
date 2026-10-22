/* ================================================================
   PHOTOS.JS — Liste des photos de la galerie
   ----------------------------------------------------------------
   C'est le SEUL fichier à modifier pour ajouter, retirer, renommer
   ou réordonner des photos. La galerie (HTML) est générée
   automatiquement par script.js à partir de cette liste.

   Pour ajouter une photo :
     1. Déposez le fichier dans le dossier  images/portfolio/
     2. Copiez-collez un bloc ci-dessous et modifiez-le
        (ou lancez  python3 ajouter-photos.py  qui le fait pour vous)

   Champs :
     fichier  → nom exact du fichier dans images/portfolio/
     titre    → titre affiché au survol et dans la visionneuse
     legende  → ligne sous le titre. Séparez les deux parties par " - "
                (tiret entouré d'espaces) : le site l'affiche avec un point
                médian. Ex : "Animalier - Jardin au printemps"
     cat      → filtre : "animalier", "route" ou "paysages"
                (pour une nouvelle catégorie, ajoutez aussi un bouton
                 .filter-btn avec le même data-filter dans index.html)
     alt      → description pour l'accessibilité (optionnel : si absent,
                le titre est utilisé)

   L'ordre de la liste = l'ordre d'affichage dans la galerie.
================================================================ */

const DOSSIER_PHOTOS = 'images/portfolio/';

const PHOTOS = [

  {
    fichier: "_dsf5564.jpg",
    titre:   "Chat curieux",
    legende: "Animalier - Jardins communaux",
    cat:     "animalier",
    alt:     "Chat curieux",
  },

  {
    fichier: "_dsf5524.jpg",
    titre:   "Aube dorée",
    legende: "Paysages matinaux - Berry",
    cat:     "paysages",
    alt:     "Aube sur l'étang communal",
  },

  {
    fichier: "_dsf6623.jpg",
    titre:   "Petit oiseau solitaire en hiver",
    legende: "Jardin en hiver - Berry",
    cat:     "animalier",
    alt:     "Oiseau solitaire",
  },

  {
    fichier: "_dsf6703.jpg",
    titre:   "Petite mésange vigilante",
    legende: "Animalier - Jardin au printemps",
    cat:     "animalier",
    alt:     "Mésange à la mangeoire",
  },

  {
    fichier: "_dsf5933.jpg",
    titre:   "Canal du Cher",
    legende: "Paysages - Châteauneuf-sur-Cher",
    cat:     "paysages",
    alt:     "Châteauneuf-sur-Cher",
  },

  {
    fichier: "_dsf5576.jpg",
    titre:   "Ciel d'hiver et migration",
    legende: "Animalier - Berry",
    cat:     "animalier",
    alt:     "Vol migratoire",
  },

  {
    fichier: "_dsf5693.jpg",
    titre:   "Papillon et romarin",
    legende: "Animalier - Jardin au printemps",
    cat:     "animalier",
    alt:     "Papillon et romarin",
  },

  {
    fichier: "_dsf5622.jpg",
    titre:   "Couple de cygnes en hiver",
    legende: "Animalier - Étang communal",
    cat:     "animalier",
    alt:     "Couple de cygnes en hiver",
  },

  {
    fichier: "_dsf5519.jpg",
    titre:   "Étang à l'aurore",
    legende: "Paysages - Berry",
    cat:     "paysages",
    alt:     "Étang à l'aurore",
  },

  {
    fichier: "_dsf5731.jpg",
    titre:   "Étang au petit matin",
    legende: "Paysages - Berry",
    cat:     "paysages",
    alt:     "Étang au petit matin",
  },

  {
    fichier: "dscf6349.jpg",
    titre:   "Voyage électrique",
    legende: "Sur la route - Indre",
    cat:     "route",
    alt:     "Route déserte",
  },

  {
    fichier: "dscf6337.jpg",
    titre:   "Voyage d'hiver",
    legende: "Sur la route - Berry",
    cat:     "route",
    alt:     "Route et brouillard",
  },
 {
    fichier: "DSC_1191.jpg",
    titre:   "La longue route",
    legende: "Sur la route - Berry",
    cat:     "route",
    alt:     "La longue route",
  },
   {
    fichier: "DSC_1230.jpg",
    titre:   "Nuance d'automne",
    legende: "Paysages - Berry",
    cat:     "paysages",
    alt:     "Route et brouillard",
  },
   {
    fichier: "DSC_1242.jpg",
    titre:   "Cabine matinale",
    legende: "Paysages - Berry",
    cat:     "paysages",
    alt:     "Cabine de pêche au petit matin",
  },
   {
    fichier: "DSC_1278.jpg",
    titre:   "Eol",
    legende: "Sur la route - Berry",
    cat:     "route",
    alt:     "Eoliennes",
  },
  // ▼▼ AJOUTEZ VOS NOUVELLES PHOTOS AU-DESSUS DE CETTE LIGNE ▼▼

];
