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
    const filteredProjects = categoryId === 0 ? projects : projects.filter(project => project.categoryId === categoryId);
    displayPortfolio(filteredProjects); // Affiche les projets filtrés
}

// Fonction pour afficher les boutons de filtres par catégorie
function displayFilterButtons(filterButtons) {
    const buttonMenu = document.getElementById('button-menu');


    // Ajout du bouton "Tous"
    const allButton = document.createElement('button');
    allButton.classList.add('filter-button');
    allButton.setAttribute('data-category', 0);
    allButton.textContent = "Tous";
    buttonMenu.appendChild(allButton);

    // Ajout des autres boutons de filtres
    filterButtons.forEach(button => {
        const ButtonFilter = document.createElement('button');
        ButtonFilter.classList.add('filter-button');
        ButtonFilter.setAttribute('data-category', button.id);
        ButtonFilter.textContent = button.name;
        buttonMenu.appendChild(ButtonFilter);
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


