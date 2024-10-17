
// Sélection des éléments HTML
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rafraîchissement de la page après soumission du formulaire        

    // Validation des champs d'entrée
    if (!email.value.trim() || !password.value.trim()) {
        errorMessage.textContent = 'Veuillez remplir tous les champs.';
        return;
    }

    // Si la validation passe, lancer la requête POST
    await handleLogin(email.value, password.value);
});

// Fonction pour gérer la connexion
async function handleLogin(email, password) {
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
        const data = await response.json();
        if (response.ok) {
            console.log('Connexion réussie', data);
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