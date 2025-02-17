/**
 * login.js
 * -------------
 * Description : Script d'authentification via l'API .
 * Auteur : Amandine Verstrepen
 * Date : 2025-02-02
 * Version : 1.0
 */

// Ecoute du bouton soumettre pour récupérer les données du formulaire
document.getElementById('formLogIn').addEventListener('submit', async (event) => {
    event.preventDefault();

// Récupération des valeurs des champs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const data = {
        email: email,
        password: password      
    };
    
    console.log(data);

    // Envoi des données d'authentification à l'API
    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        // Supprime les anciens messages d'erreur d'authentification si besoin
        const lien = document.querySelector('form a');
        if (lien) {
            lien.remove(); 
        }

        //Gestion de l'authentification réussi et renvoi sur la page d'accueil
        if (response.status === 200) {
            let userObject = await response.json();
            const userToken = userObject.token
            // Récupération du token et enregistrement dans le sessionStorage
            window.sessionStorage.setItem('token',userToken);
            window.location.href = 'http://localhost:8080/index.html';
        }

        //Gestion des erreurs de connexion avec affichage
        else if (response.status === 404) {
            console.log("pb de login");
            const loginError = "Il y a une erreur dans le couple email/mot de passe. Veuillez réessayer.";
            const sectionFormLogIn = document.getElementById('formLogIn');
            const aformLogIn = document.createElement("a");
            aformLogIn.innerText = loginError;
            sectionFormLogIn.appendChild(aformLogIn);
        } 
        else if (response.status === 401) {
            console.log("pb password");
            const pwdError = "Le mot de passe est erroné. Veuillez réessayer.";
            const sectionFormLogIn = document.getElementById('formLogIn');
            const aformLogIn = document.createElement("a");
            aformLogIn.innerText = pwdError;
            sectionFormLogIn.appendChild(aformLogIn);
        } 
        else {
            console.log('Erreur lors de la connexion');
            const connexionError = "Il y a eu une erreur de connexion. Veuillez réessayer.";
            const sectionFormLogIn = document.getElementById('formLogIn');
            const aformLogIn = document.createElement("a");
            aformLogIn.innerText = connexionError;
            sectionFormLogIn.appendChild(aformLogIn);
        }
    } catch (error) {     
        console.error("error : "+ error);
    }    
    
});



