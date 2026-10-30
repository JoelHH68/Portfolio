// ---------- Projets : carte dépliable dans la grille ----------

const grilleProjets = document.querySelector(".liste-projet");
const cartesProjets = grilleProjets.querySelectorAll(".card-projet");
const ecranLarge = window.matchMedia("(min-width: 901px)");

// regroupe visuel, texte, liens et bouton dans un bloc "infos",
// pour que la méthodologie soit une colonne indépendante
cartesProjets.forEach(carte => {
    // ancien conteneur <div class="methodo"> : on en sort son contenu
    carte.querySelectorAll(":scope > .methodo").forEach(m => {
        m.replaceWith(...m.childNodes);
    });

    const infos = document.createElement("div");
    infos.className = "carte-infos";

    [...carte.children]
        .filter(el => !el.classList.contains("methodo-contenu"))
        .forEach(el => infos.appendChild(el));

    carte.prepend(infos);
});

function fermerCarte(carte) {
    carte.classList.remove("ouvert", "ouvert-gauche");
    carte.style.gridRow = "";
    carte.style.gridColumn = "";

    const bouton = carte.querySelector(".btn-methodo");
    if (bouton) bouton.setAttribute("aria-expanded", "false");
}

function ouvrirCarte(carte) {
    // on repart d'une grille sans carte ouverte pour mesurer la vraie position
    cartesProjets.forEach(fermerCarte);

    if (ecranLarge.matches) {
        const style = getComputedStyle(grilleProjets);
        const largeurs = style.gridTemplateColumns
            .split(" ")
            .map(parseFloat)
            .filter(l => l > 0);
        const gap = parseFloat(style.columnGap);

        const rectGrille = grilleProjets.getBoundingClientRect();
        const rectCarte = carte.getBoundingClientRect();

        // colonne de la carte (0 = première)
        const decalage = rectCarte.left - rectGrille.left;
        let position = 0;
        let colonne = 0;
        largeurs.forEach((l, i) => {
            if (Math.abs(position - decalage) < 2) colonne = i;
            position += l + gap;
        });

        // ligne de la carte (1 = première)
        const hauteurs = [...new Set(
            [...cartesProjets].map(c => Math.round(c.getBoundingClientRect().top))
        )].sort((a, b) => a - b);
        const ligne = hauteurs.indexOf(Math.round(rectCarte.top)) + 1;

        if (largeurs.length >= 2) {
            const derniere = colonne === largeurs.length - 1;

            carte.style.gridRow = ligne;
            // dernière colonne : on part de la colonne d'avant, sinon on garde la sienne
            carte.style.gridColumn = (derniere ? colonne : colonne + 1) + " / span 2";
            carte.classList.toggle("ouvert-gauche", derniere);
        }
    }

    carte.classList.add("ouvert");
    carte.querySelector(".btn-methodo").setAttribute("aria-expanded", "true");
    carte.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

cartesProjets.forEach(carte => {
    const bouton = carte.querySelector(".btn-methodo");
    if (!bouton) return;

    bouton.addEventListener("click", () => {
        if (carte.classList.contains("ouvert")) {
            fermerCarte(carte);
        } else {
            ouvrirCarte(carte);
        }
    });
});

// si la largeur change, la position calculée n'est plus valable : on referme
let largeurPrecedente = window.innerWidth;
window.addEventListener("resize", () => {
    if (window.innerWidth !== largeurPrecedente) {
        largeurPrecedente = window.innerWidth;
        cartesProjets.forEach(fermerCarte);
    }
});