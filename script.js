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
//Création de la liste des catégory pour les filtres
const listNameCategory = new Set();
for (let i = 0; i< listWorks.length; i++) {
    const figure = listWorks[i];
    listNameCategory.add(figure.category.name);
}
const categoryMap = new Map();

for (let figure of listWorks) {
  const cat = figure.category;
  // On associe "cat.id" à lID de l'objet cat
  categoryMap.set(cat.id, cat);
}
// Puis on peut récupérer un tableau d'objets uniques :
const ListUniqueCategory = Array.from(categoryMap.values());
console.log(ListUniqueCategory);
console.log(listNameCategory);



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
    };
};

// Appel de la fonction
createWorks(listWorks);

// gestion des boutons de filtre
const btnsFiltrer = document.querySelectorAll(".btnFiltre");
const typeFiltre = "Tous";   // Par défaut, on affiche tous les travaux
// Ecoute des boutons de filtre                                                                   
btnsFiltrer.forEach(btn=> {
    btn.addEventListener("click", function() {
        const typeFiltre = btn.innerText;
        console.log(typeFiltre);
    // Suppression des travaux actuels
    document.querySelector(".gallery").innerHTML = "";
    // Affichage des travaux selon le filtre
    if (typeFiltre === "Tous") {
        createWorks(listWorks);
    }  else if (typeFiltre === "Objets") {
        createWorks(listWorks.filter(figure => figure.category.id === 1));
    }  else if (typeFiltre === "Appartements") {
        createWorks(listWorks.filter(figure => figure.category.id === 2));
    }  else if (typeFiltre === "Hotels & restaurants") {
        createWorks(listWorks.filter(figure => figure.category.id === 3));
    }  else {
        console.log("Erreur de tri, il doit y avir un souci avec votre appel API");
    }
    });
});