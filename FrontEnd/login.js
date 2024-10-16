
// Sélection des éléments du DOM
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Vérifie que l'élément loginForm existe avant d'ajouter l'écouteur d'événements
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire

        // Validation des champs d'entrée
        if (!email.value.trim() || !password.value.trim()) {
            if (errorMessage) {
                errorMessage.textContent = 'Veuillez remplir tous les champs.';
            } else {
                console.error('Element error-message non trouvé');
            }
            return;
        }

        // Si la validation passe, possibilité de procéder avec la soumission ou d'autres actions
        handleLogin(email.value, password.value);
    });
} else {
    console.error('Element login-form non trouvé');
}