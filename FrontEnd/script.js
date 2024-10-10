
//Fonction en vue d'afficher les éléments du portfolio
function displayPortfolio(projects) {
    const gallery = document.getElementById('gallery');

    //Boucle pour parcourir les projets - projects 
    for (let i = 0; i < projects.length; i++) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        // En prévision de la récupération des données depuis la BDD
        img.src = `${projects[i].imageUrl}`; // à la place on aura un lien vers BDD pour récupérer les images. Du genre "projects[i].imageUrl"
        img.alt = `${projects[i].title}`; // le même que le figcaption. Idem on va récupérer ensuite les titres en BDD. Ex: "projects[i].title"
        figcaption.textContent = `${projects[i].title}`; // idem 

        // Assemble les éléments dans le DOM
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);

    }
    
}

// Fonction pour récupérer les projets du portfolio depuis l'API
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:5678/api/works'); // fetch vaut GET par défaut + les projets sont nommés works dans l'API
        const portfolioProjects = await response.json(); // Renomme "data" en "portfolioData"
        displayPortfolio(portfolioProjects); // Appelle la fonction avec "portfolioProjects"
    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
    }
}

// Appel de la fonction pour récupérer les projets du portfolio et les afficher
fetchProjects();


// Mise en place des boutons de filtrage
const filterButton = document.getElementById('filterButton');
filterButton.addEventListener('click', () => {
  // Ajoutez ici le code de la fonction de filtrage
  console.log('Le bouton de filtrage a été cliqué !'); // vérification avec console.log
});