// Fonction pour afficher les éléments du portfolio dans la galerie
function displayPortfolio(projects) {
    const gallery = document.getElementById('gallery'); // Sélection de l'élément contenant la galerie
    gallery.innerHTML = ''; // Vider la galerie pour éviter la duplication des éléments (après clic sur un filtre, la galerie est réinitialisée avec la catégorie sélectionnée)

    // Boucle pour parcourir chaque projet
    for (let i = 0; i < projects.length; i++) {
        const figure = document.createElement('figure'); // Crée un élément <figure> pour chaque projet
        const img = document.createElement('img'); // Crée un élément <img> pour l'image du projet
        const figcaption = document.createElement('figcaption'); // Crée un élément <figcaption> pour le titre du projet

        // Assigner les données du projet aux éléments créés
        img.src = projects[i].imageUrl; // Définir l'URL de l'image à partir des données du projet
        img.alt = projects[i].title; // Définir l'attribut alt de l'image avec le titre du projet (pour l'accessibilité)
        figcaption.textContent = projects[i].title; // Assigner le titre du projet comme texte du figcaption

        // Ajout des éléments dans la structure DOM
        gallery.appendChild(figure); // Ajouter l'ensemble <figure> dans la galerie
        figure.appendChild(img); // Ajouter l'image au <figure>
        figure.appendChild(figcaption); // Ajouter le titre <figcaption> au <figure>

    }
}

// Fonction pour récupérer les projets depuis l'API
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const portfolioProjects = await response.json();
        displayPortfolio(portfolioProjects); // Affiche tous les projets par défaut
        setupFilters(portfolioProjects); // Configure les filtres
    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
    }
}

// Fonction pour filtrer les projets par catégorie
function filterProjectsByCategory(projects, categoryId) {
   // console.log('Filtre actif pour la catégorie :', categoryId);

    let filteredProjects;
    if (categoryId === 'Tous') {
        filteredProjects = projects; // Affiche tous les projets
    } else {
        filteredProjects = projects.filter(project => project.categoryId === parseInt(categoryId));
    }

    // console.log('Projets filtrés :', filteredProjects); // Debug
    displayPortfolio(filteredProjects); // Affiche les projets filtrés
}

// Fonction pour configurer les filtres
function setupFilters(projects) {
    const filterButtons = document.querySelectorAll('.filter-button'); // Sélectionne tous les boutons de filtre

    // Utilisation d'une boucle for pour ajouter l'écouteur d'événements à chaque bouton
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].addEventListener('click', function () {
            // Enlève la classe 'active' de tous les boutons
            for (let i = 0; i < filterButtons.length; i++) {
                filterButtons[i].classList.remove('active');
            }
            this.classList.add('active'); // Ajoute la classe 'active' au bouton cliqué

            const categoryId = this.getAttribute('data-category'); // Récupère la catégorie du bouton cliqué
            // console.log('Filtrage de la catégorie:', categoryId);

            // Filtre les projets
            filterProjectsByCategory(projects, categoryId); // Applique le filtre
        });
    }
}

// Appel de la fonction pour récupérer les projets du portfolio et les afficher
fetchProjects();


