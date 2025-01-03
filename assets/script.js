const galleryElement = document.querySelector(".gallery");

// Tableaux vide pour ranger les données de l'API
let works = [];
let categories = []

// Récupération des Travaux sur l'API puis désérialisation
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    
   works = data;
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();

   categories = data;
}

// Fonction pour créer le HTML en récupérant les données de l'API
function createWorks(data) {
    data.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.innerText = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        galleryElement.appendChild(figure);
    })
}

// Appel des fonctions
async function init() {
    console.log('avant fetch', categories)
    await getWorks();
    await getCategories()
    console.log('après fetch', categories)
    createWorks(works);
}

init();


//Ajout à la galerie des travaux récupéré


