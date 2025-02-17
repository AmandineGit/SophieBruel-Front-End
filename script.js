/**
 * script.js
 * -------------
 * Description : Script de récupération des works par l'API .
 * Auteur : Amandine Verstrepen
 * Date : 2025-01-27
 * Version : 1.0
 */

var hostBack = 'http://localhost:5678'
var listWorks = [];

//****** Fonctions de la page d'accueil**************************************/

//Fonction de récupération des works depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch(hostBack + '/api/works');
        return await response.json();
    }
    catch (error) {
        console.error('Erreur réseau :', error);
    }
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

// Fonction de logout
function logout() {
    window.sessionStorage.removeItem('token');
    windows.location.href = 'http://localhost:8080/login.html';
}

// ************Fonctions des pages modales************************************/

// Fonction pour ouvrir la modale
function openModal() {
    modal.style.display = "block";
    modalOverlay.style.display = "block";
}

//Fonction pour crée le corps de la modale
function openModalBody() {
    modalBody.innerHTML = "";
    // Création de la ligne de séparation
    const ligne = document.createElement("div");
    ligne.id= "ligne";
    ligne.classList.add("ligne");
    // Création du bouton pour ajouter une photo
    const btnAdd = document.createElement("button");
    btnAdd.classList.add("btnAdd");
    btnAdd.id= "btnAddWork";
    btnAdd.innerHTML = "Ajouter une photo";

    // On rattache les travaux a la section modalBody
    modalBody.appendChild(ligne);
    modalBody.appendChild(btnAdd);
}

// Fonction pour créer le grid et les btn suppr et modifier le titre  de la page modal 1
function openModalGrid(listWorks) {
    const titreAdd = document.querySelector('.modal-content h3');  
    titreAdd.innerHTML = "Galerie photo";    
    const modalGrid = document.createElement("ul");
    modalGrid.classList.add("modalGrid");     
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

    // On rattache les travaux a la section modalGrid puis au modalBody
    modalBody.prepend(modalGrid);
    modalGrid.appendChild(liGrid);
    liGrid.appendChild(imgWork);
    liGrid.appendChild(btnSuppr);
    }
}

//fonction pour supprimer un work par son ID
async function deleteWork(id) {
    const token = window.sessionStorage.getItem('token');
    await fetch(hostBack + `/api/works/${id}`, {
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
}

// Fonction pour créer le form et modifier le titre de la page modale 2
function openFormAdd() {  
    modalBody.innerHTML = "";
    const titreAdd = document.querySelector('.modal-content h3');  
    titreAdd.innerHTML = "Ajout photo"; 
    const formAdd = document.createElement("form");
    formAdd.id = "formAdd";
    
    //création du bouton ajouter photo
    const label1 = document.createElement("label");
    label1.classList.add("custom-file-label");
    label1.setAttribute('for', 'file-input');
    const icone = document.createElement("i");
    icone.classList.add("fa-regular", "fa-image");
    const div = document.createElement("div");
    div.id = "AddPict";
    div.innerText = "+ Ajouter photo";
    const span = document.createElement("span");
    span.innerText = "jpg, png : 4 Mo max";
    label1.appendChild(icone);
    label1.appendChild(div);
    label1.appendChild(span);
    formAdd.appendChild(label1);
    
    const inputPict = document.createElement("input");
    inputPict.type = "file";
    inputPict.id = "file-input";
    formAdd.appendChild(inputPict);

    //Ecouteur d'événement pour le bouton fileInput
    inputPict.addEventListener("change", function(event) {
        const customFileLabel = document.querySelector(".custom-file-label");
        customFileLabel.innerText = "";
        const customFileLabelIcone = document.createElement("i");
        customFileLabelIcone.classList.add("fa-solid", "fa-file");
        const customeFileLabelSpan = document.createElement("span");
        const nameFileInput = document.getElementById('file-input').files[0].name;
        customeFileLabelSpan.innerText = nameFileInput ;
        customFileLabel.appendChild(customFileLabelIcone);
        customFileLabel.appendChild(customeFileLabelSpan);
        const idFileInput = document.getElementById('btnCreateWorkInactif');
        idFileInput.id = "btnCreateWork";
    });
    
    
    // Création du reste du form avec le titre et le type de travail
    const label2 = document.createElement("label");
    label2.setAttribute('for','title');
    label2.innerText = "Titre";
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.id = "title";
    inputTitle.name = "title";
    inputTitle.required = true;
    formAdd.appendChild(label2);
    formAdd.appendChild(inputTitle);
    
    const label3 = document.createElement("label");
    label3.setAttribute('for','category');
    label3.innerText = "Catégorie";
    const selectForm = document.createElement("select");
    selectForm.id = "category";
    selectForm.name = "category";
    selectForm.required = true;
    const option1 = document.createElement("option");
    option1.value = "";
    option1.selected = true;
    const option2 = document.createElement("option");
    option2.value = 1;
    option2.innerText = "Objets";
    const option3 = document.createElement("option");
    option3.value = 2;
    option3.innerText = "Appartements";
    const option4 = document.createElement("option");
    option4.value = 3;
    option4.innerText = "Hotels & restaurants";
    formAdd.appendChild(label3);
    selectForm.appendChild(option1);
    selectForm.appendChild(option2);
    selectForm.appendChild(option3);
    selectForm.appendChild(option4);
    formAdd.appendChild(selectForm);
    
    //création de la ligne de séparation et du bouton submit
    const divLigne = document.createElement("div");
    divLigne.classList.add("ligne");
    const btnSubmit = document.createElement("button");
    btnSubmit.type = "submit";
    btnSubmit.type = "submit";
    btnSubmit.id = "btnCreateWorkInactif";
    btnSubmit.classList.add("btnAdd");
    btnSubmit.innerText = "Valider";
    formAdd.appendChild(divLigne);
    formAdd.appendChild(btnSubmit);

    modalBody.appendChild(formAdd);

}

// Fonction pour envoyer un nouveau work sur l'api
async function sendWork(data) {  
    const token = window.sessionStorage.getItem('token');
    try {
        const reponse = await fetch(hostBack + `/api/works`, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${token}` // Ajout du token dans les headers
        }
        });
        
        if (reponse.ok) {
            console.log(`L'élément a été créé.`);
            //* Attendre 500ms pour assurer que la réponse est bien traitée
            setTimeout(() => {
                location.reload();
            }, 500);
        } else {
            const errorResponse = await response.json();  // Si l'API retourne un message d'erreur
            console.error(`❌ Erreur lors de l'upload : ${reponse.status} - ${errorResponse.message}`);
          }
    } catch (error) {
        console.error('❌ Erreur réseau :', error);
    }
}

// Fonction pour fermer la modale
async function closeModal() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
    modalBody.innerHTML = "";                
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = "";
    listWorks = await fetchWorks();
    createWorks(listWorks);
}


//*************************** Code executable****************************** */

// Récupération des works depuis l'API
listWorks = await fetchWorks();

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

    //* Définition du bouton "Tous" comme "active" par défaut
    if (nameCategory.textContent === "Tous") {
        buttonCategory.classList.add("active");
    };
    
    ulCategory.appendChild(liCategory);
    liCategory.appendChild(buttonCategory);
    buttonCategory.appendChild(nameCategory);
}

// Appel de la fonction de récupération des works
createWorks(listWorks);

// gestion des boutons de filtre
const btnsFiltrer = document.querySelectorAll(".btnFiltre");
const typeFiltre = "Tous";   // Par défaut, on affiche tous les travaux

// Ecoute des boutons de filtre                                                                   
btnsFiltrer.forEach(btn=> {
    btn.addEventListener("click", function() {
        // Supprime la classe active de tous les boutons
        btnsFiltrer.forEach(btn => btn.classList.remove("active"));
        // Ajoute la classe active au bouton cliqué
        btn.classList.add("active");
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

// Ecoute du bouton logout pour déconnecter l'utilisateur
document.getElementById('log').addEventListener('click', async (event) => {
    event.preventDefault();
    logout();
});

// Test de l'authentification
if (window.sessionStorage.getItem('token') !== null) {
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

//*************Gestion de la fenetre modale*****************// 

// Récupération du DOM pour la modale
const modal = document.getElementById("myModal");
const modalContent = document.querySelector(".modal-content");
const openModalBtn = document.getElementById("openModalBtn");
const modalOverlay = document.getElementById("myModalOverlay");
const closeModalBtn = document.querySelector(".close");
const modalBody = document.querySelector(".modalBody"); 
const formAdd = document.getElementById("formAdd");
// Vidange du grid DOM qui accueillera les travaux
modalBody.innerHTML = "";

//************************Interface users authentifiés**************************************************************

if (window.sessionStorage.getItem('token') !== null) { 

    // ************Écouteurs d'événements des pages modales************

    // Écouteurs d'événements pour ouvrir la modale
    openModalBtn.addEventListener("click", async function() {
        openModal();
        openModalBody();
        openModalGrid(listWorks);

        // Ecouteurs d'événements pour supprimer les travaux
        const buttons = document.querySelectorAll('.btnSuppr'); 
        const arrayButtons = Array.from(buttons);
        arrayButtons.forEach(button => {
            button.addEventListener('click', async function(event) {
                const icon = button.querySelector('i'); 
                const id = icon.getAttribute('data-id');
                await deleteWork(id);
                modalBody.innerHTML = "";
                const newListWorks = await fetchWorks();
                openModalBody();
                openModalGrid(newListWorks);
            });
        });
    });

    // Ecouteurs d'événements pour ajouter les travaux sur la page modale 1
    document.body.addEventListener("click", function(event) {
        if (event.target && event.target.id === "btnAddWork") {
            openFormAdd();
        }
    });

    // Ecouteur d'événement pour le formulaire d'ajout sur la page modale 2

    document.body.addEventListener("click", async function(event) {
        if (event.target && event.target.id === "btnCreateWork") {     
            event.preventDefault(); // Empêche l'envoi classique du formulaire

            // Création d'un objet FormData
            const formData = new FormData();
    
            // Récupération des valeurs
            const fileInput = document.getElementById('file-input').files[0];
    
            // Gestion de l'erreur si aucun fichier n'est sélectionné
            if (!fileInput) {
                if (!document.getElementById("below-file-input")) {
                    const fileInput = document.getElementById('file-input');
                    const errorFile = document.createElement('div');
                    errorFile.id = 'below-file-input';
                    errorFile.innerHTML = "Veuillez sélectionner un fichier";
                    fileInput.insertAdjacentElement('afterend', errorFile);
                    console.error ("Aucun fichier sélectionné");
                }
            } 
    
            const title = document.getElementById('title').value;
            let category = document.getElementById('category').value;
            category = Number(category);
            // Ajout des données dans le formData
            formData.append('image', fileInput);
            formData.append('title', title);
            formData.append('category', category);
            
            // Envoi des données à l'API
            sendWork(formData);
        }
    });

    document.body.addEventListener("click", async function(event) {
        if (event.target && event.target.classList.contains("close")) { 
            closeModal();
            }
        });

    // Fermer la modale si l'utilisateur clique en dehors de son contenu
    const overlay = document.querySelector('.modal-overlay'); 
    window.addEventListener("click", async function(event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    // Fermer la modale si l'utilisateur appuie sur la touche "Echap"

} 