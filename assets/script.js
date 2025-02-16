const galleryElement = document.querySelector(".gallery");
const filtersElement = document.querySelector(".filters");
const smallGallery = document.querySelector('.smallGallery');
const categorie = document.getElementById('categorie');

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
    await getWorks();
    await getCategories()
    createWorks(works);
    createButtons(categories);
    createSmallWorks(works);
    createCategorie(categories);
}

init();




// Ajout/Retrait class bouton selectionné
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


/****** Modale  ****/
let modal = null;

const galleryModal = document.querySelector('.firstModal');
const addPictureModal = document.querySelector('.secondModal');

function openModal(event) {
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute('href')); 
    target.style.display = null;
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelectorAll('.js-modal-close').forEach(el => el.addEventListener('click', closeModal)); 
    modal.querySelectorAll('.js-modal-stop').forEach(el => el.addEventListener('click', stopPropagation));
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('errorMessage');
    galleryModal.appendChild(errorMessage); 
}

function closeModal(event) {
    if (modal === null) return;
    event.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener('click', closeModal);
    modal.querySelectorAll('.js-modal-close').forEach(el => el.removeEventListener('click', closeModal)); 
    modal.querySelectorAll('.js-modal-stop').forEach(el => el.removeEventListener('click', stopPropagation));
    modal = null
    galleryModal.style.display = null;
    addPictureModal.style.display = 'none';
}


function stopPropagation(event) {
    event.stopPropagation();
}

document.querySelector('.js-modal').addEventListener('click', openModal);


// Cible le bouton Ajouter de la modale
const btnAjouter = document.querySelector('.btnAjouter')

// Listener sur le bouton Ajouter pour changer de modale
btnAjouter.addEventListener("click", () => {
    galleryModal.style.display = 'none';
    addPictureModal.style.display = null;
})

const btnRetour = document.querySelector('.fa-arrow-left');
btnRetour.addEventListener("click", () => {
    galleryModal.style.display = null;
    addPictureModal.style.display = 'none';
})



// Gestion des différences login/logout
const authToken = sessionStorage.getItem('authToken');
const btnModifier = document.querySelector('.js-modal');
const editionMode = document.querySelector('.editionMode');
const login = document.querySelector('a[href="login.html"]');
const body = document.querySelector('body');
const portfolioTitle = document.querySelector('#portfolio h2');

if (authToken) { 
    btnModifier.classList.remove('hidden');
    editionMode.classList.remove('hidden');
    login.innerText = "logout";
    body.style.paddingTop = "59px";
    filtersElement.style.display = 'none';
    portfolioTitle.style.marginBottom = "92px";
} else { 
    btnModifier.classList.add('hidden');
    editionMode.classList.add('hidden');
    login.innerText = "login";
    body.style.paddingTop = "0";
    filtersElement.style.display = null;
    portfolioTitle.style.marginBottom = "92px";
}

login.addEventListener("click", (event) => {
    if (authToken) {
        event.preventDefault();
        sessionStorage.removeItem('authToken');
        location.reload();
    } else {
        window.location.href = login.href;
    }
})


// Génération des miniature dans la première modale 
function createSmallWorks(data) {
    data.forEach(work => {
        const container = document.createElement("div");
        const img = document.createElement("img");
        const trashCan = document.createElement("i"); 

        container.classList.add('container');
        img.src = work.imageUrl;
        img.alt = work.title;
        trashCan.classList.add('fa-solid', 'fa-trash-can');
        trashCan.id = work.id;

        

        container.appendChild(img);
        container.appendChild(trashCan);

        smallGallery.appendChild(container);
    })
}

// *** Suppression des Works *** //

// Ajout d'un listener sur les trash cans (icônes de suppression)
smallGallery.addEventListener("click", async (event) => {
    // On récupère la valeur actuelle du authToken à chaque clic
    const authToken = sessionStorage.getItem('authToken');
    // Vérifie si l'élément cliqué est une icône trashCan
    if (event.target.classList.contains('fa-trash-can')) {
        const trashCan = event.target; // L'élément cliqué (trashCan)
        const workId = trashCan.id; // L'ID à supprimer
        const errorMessage = document.querySelector('.errorMessage')
        errorMessage.style.color = "red";
        errorMessage.style.textAlign = "center";
        errorMessage.innerText = 'Suppression imposible !';
        errorMessage.style.display = 'none';
        // Requête API pour supprimer l'élément côté serveur
        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression de l'élément avec l'ID ${workId}`);
            }
            
            updateUI();
        } catch (error) {
            errorMessage.style.display = null;
        }
    }
});

async function updateUI() {
    await getWorks();
    galleryElement.innerHTML = "";
    smallGallery.innerHTML = "";
    createWorks(works);
    createSmallWorks(works);
}

// Ajout des catégories dans addPictureForm
function createCategorie(data) {
    const firstOption = document.createElement('option');
    firstOption.value = "";
    firstOption.innerText = "";
    categorie.appendChild(firstOption);
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.innerText = category.name;

        categorie.appendChild(option);
    })
}


// Listener label addPicture
const labelFile = document.querySelector('.addPicture');
const addPicture = document.getElementById('addPicture');
fileSelect.addEventListener('click', () => { 
    if (addPicture) {
        addPicture.click();
    }
})

addPicture.addEventListener("change", (event) => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(event.target.files[0]);
    labelFile.appendChild(img);
    img.classList.add('newPicture');
    labelFile.querySelector("button").style.display = 'none';
});

// A l'envoie du formulaire d'ajout : 
//  - Preventdefault sur le submit : Ajout photo
//  - autoriser uniquement un seul document
//  - afficher le bouton si pas de document
const inputAddPicture = document.getElementById('addPicture');
inputAddPicture.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onloadend = function(){
        const imageUrl = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    }
})

const addPictureForm = document.querySelector('.addPictureForm');
addPictureForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(addPictureForm)

    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
        body: data

    })

    if (response.ok) {
        updateUI();
        addPictureForm.reset();
        document.querySelector('.newPicture').remove();
        labelFile.querySelector("button").style.display = 'block';
        document.querySelector('.js-modal-close').click();
    }
    // Création de l'objet du nouveau Work
    // const newWork = {
    //     image: event.target.querySelector('[name="addPicture]').value,
    //     title: event.target.querySelector('[name="title"]').value,
    //     category: event.target.querySelector('[name="categorie"]').value
    // }


} )



// Modifier le bouton submit quand les champs sont rempli
const addPictureFile = document.getElementById('addPicture');
const addPictureTitle = document.getElementById('title');
const addPictureSelect = addPictureModal.querySelector('select');
const addPictureSubmit = addPictureModal.querySelector('input[type="submit"]');

function checkFormCompletion () {
    if (
        addPictureFile.files.length > 0 &&
        addPictureTitle.value.trim() !== '' &&
        addPictureSelect.selectedIndex !== 0 
    ) {
        addPictureSubmit.classList.remove('disabled');
    } else {
        addPictureSubmit.classList.add('disabled');
    }
}

addPictureFile.addEventListener('change', checkFormCompletion);
addPictureTitle.addEventListener('input', checkFormCompletion);
addPictureSelect.addEventListener('change', checkFormCompletion);
addPictureSubmit.classList.add('disabled');

