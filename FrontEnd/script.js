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

// Fonction pour récupérer les projets depuis l'API
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const portfolioProjects = await response.json();
        displayPortfolio(portfolioProjects);
        fetchFilterButtons(portfolioProjects); // Passe les projets pour configurer les filtres
    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
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


// Appel de la fonction pour récupérer les projets du portfolio et les afficher
fetchProjects();


// Récupère tous les liens du menu
const links = document.querySelectorAll('ul li a');

// Parcours chaque lien pour vérifier s'il correspond à l'URL actuelle
links.forEach(link => {
    if (link.href === window.location.href) {
        // Ajoute la classe 'active' au lien correspondant à la page active
        link.classList.add('nav-active');
    }
});


//* Gestion de la TopBar et de la Div Modify au Login et au Logout
window.addEventListener('DOMContentLoaded', () => {
    const modify = document.getElementById('modify');
    const topBar = document.getElementById('topBar'); // Sélectionne l'élément avec l'id 'topBar'
   

    // Fonction pour mettre à jour la visibilité de la topBar et modify en fonction du token (plutôt que de faire 1 fonction pour chaque élément)
    function updateUI() {
        const token = localStorage.getItem('token');// Récupère le token dans localStorage
        const categoryButtons = document.querySelectorAll('.category-button'); // Constante pour sélectionner tous les boutons qui ont la classe category-button
    
        if (token) {
            topBar.classList.add('show');
            modify.classList.add('shown'); // Affiche la div modify
            // Masquer les boutons de catégories
            categoryButtons.forEach(button => button.style.display = 'none');
        } else {
            topBar.classList.remove('show');
            modify.classList.remove('shown'); // Cache la div modify

            // Afficher les boutons de catégories
            categoryButtons.forEach(button => button.style.display = 'inline-block');
        }
    }

    // Appel initial pour afficher/cacher la topBar + la Div Modify au chargement de la page
    updateUI();

 

    // Vérifie toutes les 500ms si le token a été supprimé & permet de MAJ à la fois la TopBar + la Div Modify
    setInterval(() => {
        updateUI();
    }, 500);

    

});






