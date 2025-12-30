const suits = ['♥', '♦', '♣', '♠'];
const values = ['A','2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];
let mesCartes = [];
let etapeJeu = 1; 
let perfectRun = true;

const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const controls2Btn = document.getElementById('controls-2-btn');
const controls4Btn = document.getElementById('controls-4-btn');

const btnHeart = document.getElementById('btn-heart');
const btnDiamond = document.getElementById('btn-diamond');
const btnSpade = document.getElementById('btn-spade');
const btnClub = document.getElementById('btn-club');

const popup = document.getElementById('result-popup');
const popupTitle = document.getElementById('popup-title');
const popupMessage = document.getElementById('popup-message');
const popupIcon = document.getElementById('popup-icon');
const btnPopupAction = document.getElementById('btn-popup-action'); 

function initJeu() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            let color = (suit === '♥' || suit === '♦') ? 'red' : 'black';
            deck.push({ suit, value, color });
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    mesCartes = deck.slice(0, 4);
    console.log("Cheat (Mes cartes):", mesCartes);
}
initJeu();

function resetJeu() {
    popup.classList.add('hidden');
    etapeJeu = 1;
    perfectRun = true;

    for(let i = 1; i <= 4; i++) {
        document.getElementById(`card-${i}-inner`).classList.remove('rotate-y-180');
    }

    controls4Btn.classList.remove('flex');
    controls4Btn.classList.add('hidden');
    controls2Btn.classList.remove('hidden');
    
    btnLeft.innerText = "ROUGE";
    btnLeft.className = "flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-full shadow-lg transition-all active:scale-95 border-b-4 border-red-800";
    
    btnRight.innerText = "NOIR";
    btnRight.className = "flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-full shadow-lg transition-all active:scale-95 border border-slate-600 border-b-4 border-slate-950";

    setTimeout(() => {
        initJeu();
    }, 500); 
}

function getValeur(carteValue) {
    const ordre = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return ordre.indexOf(carteValue) + 2; 
}

function jouer(choix) {
    if (etapeJeu === 1) verifierCarte1(choix);
    else if (etapeJeu === 2) verifierCarte2(choix);
    else if (etapeJeu === 3) verifierCarte3(choix);
    else if (etapeJeu === 4) verifierCarte4(choix);
}

function verifierCarte1(choix) {
    const carte = mesCartes[0];
    const estRouge = carte.color === 'red';
    retournerCarte(1, carte);

    setTimeout(() => {
        let gagne = (choix === 'rouge' && estRouge) || (choix === 'noir' && !estRouge);
        afficherResultat(gagne, 1);
    }, 800);
}

function verifierCarte2(choix) {
    const v1 = getValeur(mesCartes[0].value);
    const v2 = getValeur(mesCartes[1].value);
    retournerCarte(2, mesCartes[1]);

    setTimeout(() => {
        let gagne = false;
        if (v2 === v1) gagne = false; 
        else if (choix === 'plus' && v2 > v1) gagne = true;
        else if (choix === 'moins' && v2 < v1) gagne = true;
        afficherResultat(gagne, 2);
    }, 800);
}

function verifierCarte3(choix) {
    const v1 = getValeur(mesCartes[0].value);
    const v2 = getValeur(mesCartes[1].value);
    const v3 = getValeur(mesCartes[2].value);
    const min = Math.min(v1, v2);
    const max = Math.max(v1, v2);

    retournerCarte(3, mesCartes[2]);

    setTimeout(() => {
        let gagne = false;
        if (v3 === min || v3 === max) {
            gagne = false;
        } else {
            const estInterieur = (v3 > min && v3 < max);
            if (choix === 'interieur' && estInterieur) gagne = true;
            else if (choix === 'exterieur' && !estInterieur) gagne = true;
        }
        afficherResultat(gagne, 3);
    }, 800);
}

function verifierCarte4(choix) {
    const carte = mesCartes[3];
    retournerCarte(4, carte);

    setTimeout(() => {
        let gagne = (choix === carte.suit);
        afficherResultat(gagne, 4);
    }, 800);
}

function afficherResultat(gagne, gorgees) {
    popup.classList.remove('hidden');
    
    btnPopupAction.innerText = "OK";
    btnPopupAction.onclick = fermerPopup;
    btnPopupAction.className = "px-6 py-2 bg-blue-600 rounded-full font-bold hover:bg-blue-500 w-full transition-all";

    if (!gagne) {
        perfectRun = false;
        popupTitle.innerText = "PERDU !";
        popupTitle.className = "text-2xl font-bold mb-2 text-red-500";
        popupMessage.innerText = `Bois ${gorgees} gorgée(s) !`;
        popupIcon.innerText = "🍺";
    } else {
        if (etapeJeu === 4) {
            popupTitle.innerText = "VICTOIRE !";
            popupTitle.className = "text-2xl font-bold mb-2 text-yellow-400";
            
            let messageFinal = "Tu distribues 4 gorgées !";
            if (perfectRun) messageFinal += "\n🛡️ PERFECT ! Tu gagnes le BOUCLIER !";
            
            popupMessage.innerText = messageFinal;
            popupIcon.innerText = "👑";

            btnPopupAction.innerText = "REJOUER";
            btnPopupAction.className = "px-6 py-2 bg-green-600 rounded-full font-bold hover:bg-green-500 w-full transition-all animate-pulse";
            btnPopupAction.onclick = resetJeu; 

        } else {
            popupTitle.innerText = "GAGNÉ !";
            popupTitle.className = "text-2xl font-bold mb-2 text-green-400";
            popupMessage.innerText = "Bien joué !";
            popupIcon.innerText = "🎉";
        }
    }

    if (!gagne && etapeJeu === 4) {
        btnPopupAction.innerText = "REJOUER";
        btnPopupAction.className = "px-6 py-2 bg-green-600 rounded-full font-bold hover:bg-green-500 w-full transition-all animate-pulse";
        btnPopupAction.onclick = resetJeu;
    }
}

function fermerPopup() {
    popup.classList.add('hidden');
    
    if (etapeJeu === 1) {
        etapeJeu = 2;
        changerBoutons("PLUS (+)", "bg-green-600", "MOINS (-)", "bg-yellow-600");
    } 
    else if (etapeJeu === 2) {
        etapeJeu = 3;
        changerBoutons("INTÉRIEUR", "bg-purple-600", "EXTÉRIEUR", "bg-orange-600");
    }
    else if (etapeJeu === 3) {
        etapeJeu = 4;
        preparerInterfaceEtape4();
    }
};

function changerBoutons(txt1, color1, txt2, color2) {
    const baseClass = "flex-1 py-4 text-white font-bold text-lg rounded-full shadow-lg transition-all active:scale-95 border-b-4";
    btnLeft.innerText = txt1;
    btnLeft.className = `${baseClass} ${color1} border-white/20`;
    btnRight.innerText = txt2;
    btnRight.className = `${baseClass} ${color2} border-white/20`;
}

function preparerInterfaceEtape4() {
    controls2Btn.classList.add('hidden');
    controls4Btn.classList.remove('hidden');
    controls4Btn.classList.add('flex');
}

function retournerCarte(num, carte) {
    const cardInner = document.getElementById(`card-${num}-inner`);
    const cardFront = document.getElementById(`card-${num}-front`);
    const cssColor = carte.color === 'red' ? 'text-red-600' : 'text-black';
    cardFront.innerHTML = `<span class="${cssColor} text-4xl font-bold">${carte.suit} ${carte.value}</span>`;
    cardInner.classList.add('rotate-y-180');
}

btnLeft.addEventListener('click', () => {
    if(etapeJeu === 1) jouer('rouge');
    if(etapeJeu === 2) jouer('plus');
    if(etapeJeu === 3) jouer('interieur');
});

btnRight.addEventListener('click', () => {
    if(etapeJeu === 1) jouer('noir');
    if(etapeJeu === 2) jouer('moins');
    if(etapeJeu === 3) jouer('exterieur');
});

btnHeart.addEventListener('click', () => jouer('♥'));
btnDiamond.addEventListener('click', () => jouer('♦'));
btnSpade.addEventListener('click', () => jouer('♠'));
btnClub.addEventListener('click', () => jouer('♣'));