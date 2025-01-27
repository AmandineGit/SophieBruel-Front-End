/**
 * script.js
 * -------------
 * Description : Script de récupération des works par l'API .
 * Auteur : Amandine Verstrepen
 * Date : 2025-01-27
 * Version : 1.0
 */

// Récupération des works depuis l'API
const reponse = await fetch('http://localhost:5678/api/works');
const listWorks = await reponse.json();
console.log(listWorks);

// Fonction de création des fiches de travaux et intégration dans le DOM
function createWorks(listWorks) {
    for (let i = 0; i< listWorks.length; i++) {
        const figure = listWorks[i];
        // Récupération de l'élément du DOM qui accueillera les travaux
        const sectionGallery = document.querySelector(".gallery");
        //creation de la balise qui contiendra les travaux
        const divWork = document.createElement("figure");
        // Création des balises qui contiendront les images et titre des travaux
        const imgWork = document.createElement("img");
        imgWork.src = figure.imageUrl;
        const figcaption = document.createElement("figcaption");
        figcaption.innerText = figure.title;

        // On rattache les travaux a la section gallery
        sectionGallery.appendChild(divWork);
        divWork.appendChild(imgWork);
        divWork.appendChild(figcaption);
    }
}

// Appel de la fonction
createWorks(listWorks);

// gestion du bouton de tri "Tous"
const btnTrier = document.querySelector(".btnTrier");

btnTrier.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    createWorks(listWorks);
});

// gestion du bouton de tri "Objets"
const btnTrierObjets = document.querySelector(".btnTrierObjets");

btnTrierObjets.addEventListener("click", function() {
        const listObjets = listWorks.filter(function(figure) {
            return figure.category.id === 1;
        });
        document.querySelector(".gallery").innerHTML = "";
        createWorks(listObjets);
});

// gestion du bouton de tri "Appartements"
const btnTrierAppt = document.querySelector(".btnTrierAppt");

btnTrierAppt.addEventListener("click", function() {
        const listAppt = listWorks.filter(function(figure) {
            return figure.category.id === 2;
        });
        document.querySelector(".gallery").innerHTML = "";
        createWorks(listAppt);
});

// gestion du bouton de tri "Hotels et restaurants"
const btnTrierHotelsRest = document.querySelector(".btnTrierHotelsRest");

btnTrierHotelsRest.addEventListener("click", function() {
        const listHoRest = listWorks.filter(function(figure) {
            return figure.category.id === 3;
        });
        document.querySelector(".gallery").innerHTML = "";
        createWorks(listHoRest);
});