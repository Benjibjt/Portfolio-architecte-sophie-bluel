
// Sélection des éléments HTML
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rafraîchissement de la page après soumission du formulaire (et permet la redirection après connexion, ou d'afficher les messages d'identifiants incorrects, etc)      

    // Validation des champs d'entrée (pas forcément utile car il y a déjà l'attribut required)
    if (!email.value.trim() || !password.value.trim()) {
        errorMessage.textContent = 'Veuillez remplir tous les champs.';
           return;
        }

    // Si la validation passe, lancer la requête POST
    await submitLogin(email.value, password.value);
});

// Fonction pour gérer la connexion
async function submitLogin(email, password) {
    try {
        const response = await fetch('http://localhost:5678/api/users/login', { // URL de l'API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        // Vérifie la réponse du serveur
        const data = await response.json(); //data correspond au contenu du corps de la réponse après traitement par response.json()
        if (response.ok) {
            console.log('Connexion réussie', data);

            // Stocker le token reçu dans le localStorage
            localStorage.setItem("token", data.token);

            window.location.href = 'index.html'; // Redirection vers la page d'accueil
        } else {
            if (errorMessage) {
                errorMessage.textContent = 'Identifiants incorrects.';
            }
            console.error('Identifiants incorrects', data.message);
        }
    } catch (error) {
        console.error('Erreur lors de la requête', error);
        if (errorMessage) {
            errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
        }
    }
}

const token = localStorage.getItem("token");