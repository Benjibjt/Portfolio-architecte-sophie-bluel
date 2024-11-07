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
    const galleryModal = document.getElementById('gallery-modal');
    const addPhotoModal = document.getElementById('addphoto-modal');

    // Fonction pour mettre à jour la page d'accueil en fonction du token
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
    
            // Écouteur pour afficher l'overlay et la modal galleryModal lors d'un clic sur modifyButton
            modifyButton.addEventListener('click', () => {
                overlay.style.display = 'block';
                galleryModal.style.display = 'block'; // Assure que galleryModal est visible
                addPhotoModal.style.display = 'none'; // Masque addPhotoModal si elle est ouverte
            });
    
        } else {
            topBar.classList.remove('show');
            modifyButton.classList.remove('shown');
            alternateCategoryButtons(true);
    
            // MAJ lien de connexion / déconnexion
            loginLink.textContent = 'login';
            loginLink.href = 'Login.html';
            loginLink.removeEventListener('click', handleLogout);
    
            // Retrait de l'overlay
            overlay.style.display = 'none';
        }
    }

    // Fonction pour afficher ou masquer les boutons de catégorie sur la page
    function alternateCategoryButtons(show) {
        const categoryButtons = document.querySelectorAll('.category-button');
        console.log(`Affichage des boutons de catégorie : ${show}`);
        categoryButtons.forEach(button => {
            button.style.display = show ? 'inline-block' : 'none';
        });
    }
    
    // Fonction pour gérer la déconnexion
    async function handleLogout(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        updateLogin();
    }

    // Ferme l'overlay et la modale si clic extérieur modale ou sur la croix
    window.addEventListener('click', (event) => {
        const closeButtonGallery = document.querySelector('#gallery-modal .close-button');
        const closeButtonAddPhoto = document.querySelector('#addphoto-modal .close-button');

        // Condition pour fermer toutes les modales si l'on clique sur l'overlay ou le bouton de fermeture
        if (event.target === overlay || event.target.closest('.close-button')) {
            overlay.style.display = 'none';
            galleryModal.style.display = 'none';
            addPhotoModal.style.display = 'none';
        } else if (event.target.closest('#button-addphoto')) {
            // Si on clique sur le bouton d'ajout de photo, afficher addPhotoModal et masquer galleryModal
            overlay.style.display = 'block';
            addPhotoModal.style.display = 'block';
            galleryModal.style.display = 'none';
        } else if (event.target.closest('#gallery-button')) {
            // Si on clique sur le bouton de la galerie, afficher galleryModal et masquer addPhotoModal
            overlay.style.display = 'block';
            galleryModal.style.display = 'block';
            addPhotoModal.style.display = 'none';
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





// Fonction pour afficher les éléments du portfolio dans la mini galerie de la modale (reprise sur la fonction displayPortfolio )
function displayMinigallery(projects) {
    const minigallery = document.getElementById('mini-gallery');
    minigallery.innerHTML = ''; // Vider la galerie pour éviter la duplication

    // Utilisation d'une boucle for pour parcourir les projets
    projects.forEach(project => {
        const figure = document.createElement('figure');
        figure.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');
        trashIcon.style.color = '#fcfcfd';
        trashIcon.setAttribute('data-id', project.id); // Attribuer l'ID du projet

        // Ajouter l'icône de poubelle à la figure
        figure.appendChild(img);
        figure.appendChild(trashIcon);
        minigallery.appendChild(figure);
    })

    // Ecouteur de clic pour chaque icône de poubelle après l'affichage
    addTrashIconListeners();
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

    addPhotoModal.innerHTML = `
    <div class="close-div">
        <span class="arrow"><i class="fa-solid fa-arrow-left custom-arrow"></i></span>
        <span class="close-button"><i class="fa-solid fa-xmark"></i></span>
    </div>
    <h2>Ajout photo</h2>
    <form id="add-photo-form">
        <div class="addphoto-rectangle">
            <i class="fa-regular fa-image custom-icon" style="color: #b9c5cc;"></i>
            <div class="rectangle-button">
                <input type="file" id="photo-file" name="photo-file" accept="image/*" required style="display: none;"><br>
                <label for="photo-file" class="custom-file-label">+ Ajouter photo</label>
            </div>
            <p>jpg, png : 4mo max</p>
        </div>
        <label for="photo-title">Titre</label><br>
        <input type="text" id="photo-title" name="photo-title" required><br>
        <label for="category">Catégorie</label><br>
        <select id="category-selector" name="category" required>
            <option value=""></option>
        </select><br>
        <div class="horizontal-line"></div>
        <button id="validate-button" type="submit">Valider</button>
    </form>
    `;

    // Sélectionnez le formulaire et ajoutez un écouteur de soumission
    const addPhotoForm = document.getElementById('add-photo-form');
    addPhotoForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission
        await submitNewProject(); // Appel de la fonction pour soumettre un projet
    });

    // Remplir le bouton de catégories avec les catégories disponibles
    fetchCategorieSelect().then(categories => CategorySelector(categories));

    // Flèche de retour en arrière
    const arrowIcon = addPhotoModal.querySelector('.arrow');
    arrowIcon.addEventListener('click', () => {
        addPhotoModal.style.display = 'none'; // masque la partie ajout de photos de la modale
        galleryModal.style.display = 'block'; // affiche la partie galerie de la modale
    });
}

buttonAddPhoto.addEventListener('click', openAddPhotoModal);


async function submitNewProject() {
    const title = document.getElementById('photo-title').value;
    const categoryId = document.getElementById('category-selector').value;
    const fileInput = document.getElementById('photo-file');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', categoryId);
    formData.append('image', file);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const newProject = await response.json();
            displayNewProject(newProject);
            alert("Projet ajouté avec succès !");
            document.getElementById('add-photo-form').reset();
            addPhotoModal.style.display = 'none';
            overlay.style.display = 'none';
        } else {
            alert("Erreur lors de l'ajout du projet.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Erreur réseau lors de l'ajout du projet.");
    }
}

function displayNewProject(project) {
    const minigallery = document.getElementById('mini-gallery');

    const figure = document.createElement('figure');
    figure.classList.add('gallery-item');

    const img = document.createElement('img');
    img.src = project.imageUrl;
    img.alt = project.title;

    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash-icon');
    trashIcon.style.color = '#fcfcfd';
    trashIcon.setAttribute('data-id', project.id);

    trashIcon.addEventListener('click', () => {
        deleteProject(project.id);
    });

    figure.appendChild(img);
    figure.appendChild(trashIcon);
    minigallery.appendChild(figure);
}


// Fonction pour récupérer les catégories depuis l'API
async function fetchCategorieSelect() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
        return [];
    }
}

// Fonction pour remplir le sélecteur de catégories
function CategorySelector(categories) {
    const categorySelect = document.getElementById('category-selector');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}




// Fonction pour supprimer des projets
async function deleteProject(projectId) {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token d'authentification
        const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Si la suppression est réussie, retirer l'élément de la galerie
            const projectElement = document.querySelector(`.trash-icon[data-id="${projectId}"]`).closest('.gallery-item');
            if (projectElement) {
                projectElement.remove();
            }
            console.log('Projet supprimé avec succès');
        } else {
            console.error('Erreur lors de la suppression du projet');
        }
    } catch (error) {
        console.error('Erreur réseau lors de la suppression du projet :', error);
    }
}

// Fonction pour écouter les clics sur les poubelles
function addTrashIconListeners() {
    const trashIcons = document.querySelectorAll('.trash-icon');
    trashIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const projectId = event.target.getAttribute('data-id'); // Récupérer l'ID du projet
            deleteProject(projectId); // Appeler la fonction pour supprimer le projet
        });
    });
}





