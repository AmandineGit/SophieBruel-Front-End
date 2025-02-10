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

// Création des boutons de filtres et intégration dans le DOM
ListUniqueCategory.push({id:0, name: "Tous"});
ListUniqueCategory.sort((a, b) => a.id - b.id);
const sectionFilter = document.querySelector(".navFilter");
const ulCategory = document.createElement("ul");
sectionFilter.appendChild(ulCategory);

for (let i = 0; i< ListUniqueCategory.length; i++) {
    const category = ListUniqueCategory[i];
    const liCategory = document.createElement("li");
    const buttonCategory = document.createElement("button");
    buttonCategory.classList.add('btnFiltre');
    buttonCategory.type = "submit";
    const nameCategory = document.createElement("span");
    nameCategory.innerText = category.name;
    
    ulCategory.appendChild(liCategory);
    liCategory.appendChild(buttonCategory);
    buttonCategory.appendChild(nameCategory);
}


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

// gestion des boutons de filtre
const btnsFiltrer = document.querySelectorAll(".btnFiltre");
const typeFiltre = "Tous";   // Par défaut, on affiche tous les travaux
// Ecoute des boutons de filtre                                                                   
btnsFiltrer.forEach(btn=> {
    btn.addEventListener("click", function() {
        const typeFiltre = btn.innerText;
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

// Fonction de logout
function logout() {
    window.localStorage.removeItem('token');
    window.location.href = 'http://localhost:8080/login.html';
}

// Ecoute du bouton logout pour déconnecter l'utilisateur
document.getElementById('log').addEventListener('click', async (event) => {
    event.preventDefault();
    logout();
});

// Test de l'authentification
if (window.localStorage.getItem('token') !== null) {
    console.log('Vous êtes connecté');
        // Récupération de l'élément du DOM qui accueillera le logout
        const sectionLog = document.querySelector('#log');
        // Afficher Logout dans le menu
        sectionLog.textContent = 'logout';
        sectionLog.setAttribute('href', '#');
        // Ajout du bouton "modifier" pour les works    
        const sectionPortfolio = document.querySelector("#portfolio");
        const buttonEdit = document.createElement("button");
        buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';
        buttonEdit.classList.add("editButton");
        buttonEdit.id = "openModalBtn";
        const sectionNavFilter = sectionPortfolio.querySelector('nav');
        sectionPortfolio.insertBefore(buttonEdit, sectionNavFilter);  
        // Suppression des filtres
        sectionNavFilter.innerHTML="";

} else {
    console.log('Vous n\'êtes pas connecté');

} 

if (window.localStorage.getItem('token') !== null) {
    // Gestion de la fenetre modale
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const modalOverlay = document.getElementById("myModalOverlay");
    const closeBtn = document.querySelector(".close");
    
    // Récupération de l'élément du DOM qui accueillera les travaux
    const modalGrid = document.querySelector(".modalGrid");
    modalGrid.innerHTML = "";
    
    // Fonction pour ouvrir la modale
    function openModal() {
        modal.style.display = "block";
        modalOverlay.style.display = "block";
        openModalGrid(listWorks);
        // Ecouteurs d'événements pour supprimer les travaux
        const buttons = document.querySelectorAll('.btnSuppr'); 
        const arrayButtons = Array.from(buttons);
        arrayButtons.forEach(button => {
            button.addEventListener('click', async function(event) {
                const icon = button.querySelector('i'); // Sélectionne l'icône à l’intérieur du bouton
                const id = icon.getAttribute('data-id');
                await deleteWork(id);
            });
        });
        // Ecouteurs d'événements pour ajouter les travaux
        const buttonAdd = document.querySelector('.btnAdd'); 
        buttonAdd.addEventListener("click", openFormAdd);
    }

    // Fonction pour créer le grid de la modale
    function openModalGrid(listWorks) {   
        modalGrid.innerHTML = "";     
    for (let i = 0; i< listWorks.length; i++) {
        const worksGrid = listWorks[i];
        //creation de la balise qui contiendra les img des travaux et l'icon de suppression 
        const liGrid = document.createElement("li");
        // Création des balises qui contiendront les images 
        const imgWork = document.createElement("img");
        imgWork.src = worksGrid.imageUrl;
        // Récu^ération de l'ID du travail pour la suppression
        const idWork = worksGrid.id ;
        // Création de l'icone de suppression
        const btnSuppr = document.createElement("button");  
        btnSuppr.innerHTML = `<i class='fa-solid fa-trash-can' data-id='${worksGrid.id}'></i>`;
        btnSuppr.classList.add("btnSuppr");
            
        // On rattache les travaux a la section gallery
        modalGrid.appendChild(liGrid);
        liGrid.appendChild(imgWork);
        liGrid.appendChild(btnSuppr);
        }
    }

    //fonction pour supprimer un work par son ID
    async function deleteWork(id) {
        const token = window.localStorage.getItem('token');
        await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Ajout du token dans les headers
            }
          })
            .then(response => {
              if (response.ok) {
                console.log(`L'élément avec l'ID ${id} a été supprimé.`);
              } else {
                console.error(`Erreur lors de la suppression : ${response.status}`);
              }
            })
            .catch(error => console.error('Erreur réseau :', error));
        openModalGrid(listWorks);
    }

    // Fonction pour lancer le form Ajouter une photo
    function openFormAdd() {  
        const titreBtnAdd = document.querySelector('.modal-content h3');  
        titreBtnAdd.innerHTML = "Ajouter une photo";    
        modalGrid.innerHTML = "";
        const formAdd = document.createElement("form");
        formAdd.id = "formAdd";
        formAdd.innerHTML = `       
            <label for="imageUrl">URL de l'image</label>
            <input type="url" id="imageUrl" name="imageUrl" required>
            <label for="title">Titre</label>
            <input type="text" id="title" name="title" required>
            <label for="category">Catégorie</label>
            <select id="category" name="category" required>
                <option value="1">Objets</option>
                <option value="2">Appartements</option>
                <option value="3">Hotels & restaurants</option>     
            </select>
            <button type="submit">Ajouter</button>
        `;
        modalGrid.appendChild(formAdd);
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.style.display = "none";
        modalOverlay.style.display = "none";
    }

    // Écouteurs d'événements pour ouvrir et fermer la modale
    openModalBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);

    // Fermer la modale si l'utilisateur clique en dehors de son contenu
    const overlay = document.querySelector('.modal-overlay'); 
    window.addEventListener("click", function(event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    // Fermer la modale si l'utilisateur appuie sur la touche "Echap"

} 