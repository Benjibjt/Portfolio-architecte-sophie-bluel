
//Fonction en vue d'afficher les éléments du portfolio
function displayPortfolio(projects) {
    const gallery = document.getElementById('gallery');

    //Boucle pour parcourir les projets - projects 
    for (let i = 0; i < projects.length; i++) {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        // En prévision de la récupération des données depuis la BDD
        img.src = "Test image"; // à la place on aura un lien vers BDD pour récupérer les images. Du genre "projects[i].imageUrl"
        img.alt = "Test titre"; // le même que le figcaption. Idem on va récupérer ensuite les titres en BDD. Ex: "projects[i].title"
        figcaption.textContent = "Test titre"; // idem 

        // Assemble les éléments dans le DOM
        gallery.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(figcaption);

    }
    
}




