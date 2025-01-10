const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");

// Tableaux vide pour ranger les données de l'API
let works = [];
let categories = [];

let buttons = [];
let currentIndex = 0;

// Récupération des Travaux sur l'API puis désérialisation
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    
   works = data;
}

// Récupération des Catégories sur l'API puis désérialisation
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
    createButtons(categories);
}

init();




// Ajout/Retrait classe
function addClass() {
    const selectedButton = buttons[currentIndex];
	selectedButton.classList.add("button_selected");
}

function removeClass() {
    const removeButton = buttons[currentIndex];
	removeButton.classList.remove("button_selected");
}


// Création des boutons

function createButton(category) {
    const button = document.createElement("button");
    button.innerText = category.name;

    if (category.id === 0) {
        button.classList.add("button_selected");
    }

    button.addEventListener("click", () => {
        const filteredWorks = works.filter(work => work.categoryId === category.id);

        if (category.id === 0) {
            galleryElement.innerHTML = "";
            removeClass();
            currentIndex = category.id;
            createWorks(works);
            addClass();
            return
        }
        
        galleryElement.innerHTML = "";
        createWorks(filteredWorks);

        removeClass();
        currentIndex = category.id;
        addClass();
    });

    filtersElement.appendChild(button);
    buttons.push(button)
}

function createButtons(categories) {
    createButton({ name: "Tous", id: 0 });
    categories.forEach(category => {
        createButton(category);
    });
}

