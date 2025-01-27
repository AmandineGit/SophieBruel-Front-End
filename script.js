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
const listeWorks = await reponse.json();
console.log(listeWorks);

// Fonction de création des fiches de travaux et intégration dans le DOM
function createWorks(listeWorks) {
    for (let i = 0; i< listeWorks.length; i++) {

        const figure = listeWorks[i];
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
createWorks(listeWorks);