const gallery = document.getElementById('gallery');
const figure = document.createElement('figure');
const img = document.createElement('img');
const figcaption = document.createElement('figcaption');

img.src = "Test image"; //à la place on aura un lien vers BDD pour récupérer les images
img.alt = "Test titre"; //le même texte que le figcaption
figcaption.textContent = "Test titre";

gallery.appendChild(figure);
figure.appendChild(img);
figure.appendChild(figcaption);




