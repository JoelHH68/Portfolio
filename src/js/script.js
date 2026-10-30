let canvas = document.querySelector("#fond");
let ctx = canvas.getContext("2d");
let w, h;

let particules = [];

tailleCanvas();

for (let i = 0; i < 150; i++){
    particules.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

window.addEventListener("resize", tailleCanvas);
window.requestAnimationFrame(affichage);

function tailleCanvas(){
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // ramène les particules dans le cadre si la fenêtre rétrécit
    particules.forEach(p => {
        p.x = Math.min(p.x, w);
        p.y = Math.min(p.y, h);
    });
}

function affichage(){
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#3B82F6";
    ctx.globalAlpha = 0.5;

    particules.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    window.requestAnimationFrame(affichage);
}



function creerNuage(){
    let canvasNuage = document.querySelector("#nuage");
    let ctxNuage = canvasNuage.getContext("2d");
    let wN, hN;

    const bleus = ["#1683FF", "#4DA3FF"];
    const doree = "#D4AF37";
    let particulesNuage = [];

    tailleNuage();
    window.addEventListener("resize", tailleNuage);

    for (let i = 0; i < 300; i++){
        particulesNuage.push({
            angle: Math.random() * Math.PI * 2,
            distance: Math.pow(Math.random(), 2),
            // flottement autour de la position de base
            phase: Math.random() * Math.PI * 2,
            vitesse: Math.random() * 0.01 + 0.003,
            amplitude: Math.random() * 6 + 2,
            taille: Math.random() * 2.5 + 0.5,
            alpha: Math.random() * 0.6 + 0.4,
            couleur: Math.random() < 0.15
                ? doree
                : bleus[Math.floor(Math.random() * bleus.length)]
        });
    }

    window.requestAnimationFrame(afficherNuage);

    function tailleNuage(){
        wN = canvasNuage.clientWidth;
        hN = canvasNuage.clientHeight;
        canvasNuage.width = wN;
        canvasNuage.height = hN;
    }

    function afficherNuage(){
        ctxNuage.clearRect(0, 0, wN, hN);

        particulesNuage.forEach(p => {
            p.phase += p.vitesse;

            // position de base (fixe) + petit mouvement propre à chaque particule
            let x = wN * 0.4 + Math.cos(p.angle) * p.distance * wN * 0.45
                    + Math.cos(p.phase) * p.amplitude;
            let y = hN * 0.4 + Math.sin(p.angle) * p.distance * hN * 0.4
                    + Math.sin(p.phase * 1.3) * p.amplitude;

            ctxNuage.globalAlpha = p.alpha;
            ctxNuage.fillStyle = p.couleur;
            ctxNuage.beginPath();
            ctxNuage.arc(x, y, p.taille, 0, Math.PI * 2);
            ctxNuage.fill();
        });

        window.requestAnimationFrame(afficherNuage);
    }
}

creerNuage();