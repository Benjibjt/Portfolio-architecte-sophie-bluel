// Fonction pour afficher les éléments du portfolio dans la galerie
function displayPortfolio(projects) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Vider la galerie pour éviter la duplication

    // Utilisation d'une boucle for pour parcourir les projets
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]; // Accède à chaque projet

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = project.imageUrl;
        img.alt = project.title;
        figcaption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}



// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(projects, categoryId) {
    let filteredProjects;

    // Si la catégorie est 0, afficher tous les projets
    if (categoryId === 0) {
        filteredProjects = projects;
    } else {
        // Sinon, filtrer les projets selon l'ID de la catégorie
        filteredProjects = projects.filter(function(project) {
            return project.categoryId === categoryId;
        });
    }

    // Afficher les projets filtrés dans la galerie
    displayPortfolio(filteredProjects);
}

// Fonction pour afficher les boutons de filtres par catégorie
function displayFilterButtons(filterButtons) {
    const buttonMenu = document.getElementById('button-menu');


    // Ajout du bouton "Tous"
    const allButton = document.createElement('button');
    allButton.classList.add('filter-button', 'category-button');//ajout de la classe filter-button + category-button qui servira pour affichage ou non
    allButton.classList.add('active');
    allButton.classList.add('all-button'); //applique une classe supplémentaire à ce bouton
    allButton.setAttribute('data-category', 0);
    allButton.textContent = "Tous";
    buttonMenu.appendChild(allButton);

    // Ajout des autres boutons de filtres
    filterButtons.forEach((button, index) => {
        const ButtonFilter = document.createElement('button');
        ButtonFilter.classList.add('filter-button', 'category-button'); //ajout de la classe filter-button + category-button qui servira pour affichage ou non
        ButtonFilter.setAttribute('data-category', button.id);
        ButtonFilter.textContent = button.name;
        buttonMenu.appendChild(ButtonFilter);

        switch (index) {
            case 0:
                ButtonFilter.classList.add('filter-0');
                break;
            case 1:
                ButtonFilter.classList.add('filter-1');
                break;
            case 2:
                ButtonFilter.classList.add('filter-2');
                break;
        }

    });
}

// Fonction pour récupérer les boutons de filtres depuis l'API
async function fetchFilterButtons(projects) {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const filterButtons = await response.json();
        displayFilterButtons(filterButtons);
        setupFilters(projects); // Configure les filtres après l'ajout dynamique des boutons
    } catch (error) {
        console.error('Erreur lors de la récupération des boutons :', error);
    }
}

// Fonction pour configurer les filtres
function setupFilters(projects) {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const categoryId = Number(this.getAttribute('data-category'));
            filterProjectsByCategory(projects, categoryId);
        });
    });
}   




// Récupère tous les liens du menu
const links = document.querySelectorAll('ul li a');

// Parcours chaque lien pour vérifier s'il correspond à l'URL actuelle
links.forEach(link => {
    if (link.href === window.location.href) {
        // Ajoute la classe 'active' au lien correspondant à la page active
        link.classList.add('nav-active');
    }
});


//* Chargement des éléments du DOM + prise en compte des éléments liés à la connexion / déconnexion + récupération des projets depuis l'API
window.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments nécessaires après le chargement de la page
    const modifyButton = document.getElementById('modify-button');
    const topBar = document.getElementById('topBar'); 
    const overlay = document.getElementById('overlay');
    const loginLink = document.querySelector('nav ul li a[href="Login.html"]');

    // Fonction pour mettre à jour la page d'accueil en fonction du token (plutôt que de faire 1 fonction pour chaque élément)
    function updateLogin() {
        const token = localStorage.getItem('token');

        if (token) {
            topBar.classList.add('show');
            modifyButton.classList.add('shown');
            alternateCategoryButtons(false); // Cache les boutons de catégorie

            // MAJ lien de connexion / déconnexion
            loginLink.textContent = 'logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', handleLogout); // Ajoute l'écouteur de Logout

            // Affichage de l'overlay si le bouton modifier est cliqué
            modifyButton.addEventListener('click', () => {
            overlay.style.display = 'block';
            });

        } else {
            topBar.classList.remove('show');
            modifyButton.classList.remove('shown');
            alternateCategoryButtons(true); // Appel à la fonction alternateCategoryButtons

            // MAJ lien de connexion / déconnexion
            loginLink.textContent = 'login';
            loginLink.href = 'Login.html';
            loginLink.removeEventListener('click', handleLogout); // retire l'écouteur de logout

            // Retrait de l'overlay
            overlay.style.display = 'none';
        }
    }


    // Fonction pour afficher ou masquer les boutons de catégorie sur la page
    function alternateCategoryButtons(show) {
        const categoryButtons = document.querySelectorAll('.category-button');
        console.log(`Affichage des boutons de catégorie : ${show}`);
        categoryButtons.forEach(button => {
        button.style.display = show ? 'inline-block' : 'none'; // condition ternaire > condition ? true : false;
        });
    }
    
    // Fonction pour gérer la déconnexion
    async function handleLogout(event) {
        event.preventDefault(); // Empêche la redirection
        localStorage.removeItem('token'); // Supprime le token
        updateLogin();
    }

    


    // Fermer l'overlay si l'on clique en dehors de son popup
    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });


    // Fonction pour récupérer les projets depuis l'API
    async function fetchProjects() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            const portfolioProjects = await response.json();
            displayPortfolio(portfolioProjects);
            await fetchFilterButtons(portfolioProjects); // Assurer que les boutons sont chargés avant d'appeler updateLogin
            updateLogin(); // mise à jour de l'affichage après le chargement des filtres
        } catch (error) {
            console.error('Erreur lors de la récupération des projets :', error);
        }
    }

    // Appel de la fonction pour récupérer les projets du portfolio et les afficher
    fetchProjects();

});



// Fonction pour afficher les éléments du portfolio dans la galerie
function displayPortfolio(projects) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Vider la galerie pour éviter la duplication

    // Utilisation d'une boucle for pour parcourir les projets
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]; // Accède à chaque projet

        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = project.imageUrl;
        img.alt = project.title;
        figcaption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// Fonction pour afficher les éléments du portfolio dans la mini galerie de la modale (reprise sur la fonction displayPortfolio )
function displayMinigallery(projects) {
    const minigallery = document.getElementById('mini-gallery');
    minigallery.innerHTML = ''; // Vider la galerie pour éviter la duplication

    // Utilisation d'une boucle for pour parcourir les projets
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]; // Accède à chaque projet

        const figure = document.createElement('figure');
        figure.classList.add('gallery-item'); //Ajout de classe pour le style

        const img = document.createElement('img');
        const trashIcon = document.createElement('i') // créer l'élément pour l'icône de poubelle

        img.src = project.imageUrl;
        img.alt = project.title;

        // Configuration de l'icône de poubelle
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon'); // Ajoute les classes Font Awesome + la classe custom
        trashIcon.style.color = '#fcfcfd';

        figure.appendChild(img);
        figure.appendChild(trashIcon);
        minigallery.appendChild(figure);
    }
}

// Fonction pour récupérer les projets depuis l'API
async function fetchMinigallery() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const portfolioMinigallery = await response.json();
        displayMinigallery(portfolioMinigallery);

    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
    }
}

// Appel de la fonction pour récupérer les projets du portfolio et les afficher
fetchMinigallery();


// Sélectionner le bouton et les articles
const buttonAddPhoto = document.getElementById('button-addphoto');
const galleryModal = document.getElementById('gallery-modal');
const addPhotoModal = document.getElementById('addphoto-modal');

// Fonction pour ouvrir la modale d'ajout de photo
function openAddPhotoModal() {
    // Masquer la galerie et afficher la modale d'ajout de photo
    galleryModal.style.display = 'none';
    addPhotoModal.classList.remove('hidden');
    addPhotoModal.classList.add('modal');

    addPhotoModal.innerHTML = `
    <h2>Ajout photo</>
    <form id="add-photo-form">
        <input type="file" id="photo-file" name="photo-file accept="image/*" required><br>
        <label for="photo-title">Titre:</label><br>
        <input type="text" id="photo-title" name="photo-title" required><br>
        <label for="category">Catégorie:</label><br>
        <input type="text" id="category" name="category" required><br>
        <button type="submit">Valider</button>
    </form>
    `;

}

buttonAddPhoto.addEventListener('click', openAddPhotoModal);

