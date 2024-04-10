let boutonTous;
let boutonObjets;
let boutonAppartements;
let boutonHotelEtRestaurant;

const inputMail = document.getElementById("emailLogin")
const inputPassword = document.getElementById("passwordLogin")
const boutonSubmitSeConnecter = document.querySelector(".formualireDeConnexion")

let boutonModifier;
let boutonSupprimer;
let token;

async function recupérationApi(){
    const data = await fetch("http://localhost:5678/api/works")
    const response = await data.json()
    genererPage(response)
    apparaitionFiltre()
    filtre(response)
    
}

//Génération de la page en utilisant l'APi//

function genererPage(response){
    for (let i=0; i<response.length; i++){
        
        const galeriePhoto = document.querySelector(".gallery")
        const imagesAffichePageAcceuil = document.createElement("img")
        const figure = document.createElement("figure")
        const figcaption = document.createElement("figcaption")

        const imgageUrl = response[i].imageUrl
        const titlePicutre = response[i].title

        imagesAffichePageAcceuil.src = imgageUrl
        figcaption.innerText= titlePicutre

        galeriePhoto.appendChild(figure)
        figure.appendChild(imagesAffichePageAcceuil)
        figure.appendChild(figcaption)


    }
}

//Mise en place des fonction filtres//
function apparaitionFiltre(){
    const insertionFiltre = document.querySelector(".barreDeFiltre")
    const containerFilter = document.createElement("ul")

    boutonTous = document.createElement("button")
    boutonObjets = document.createElement("button")
    boutonAppartements = document.createElement("button")
    boutonHotelEtRestaurant = document.createElement("button")

    boutonTous.innerText="Tous"
    boutonObjets.innerText="Objet"
    boutonAppartements.innerText="Appartements"
    boutonHotelEtRestaurant.innerText="Hôtels et restaurants"

    boutonTous.classList.add(".barreDeFiltre")
    containerFilter.classList.add(".barreDeFiltre")

    insertionFiltre.appendChild(containerFilter)

    containerFilter.appendChild(boutonTous)
    containerFilter.appendChild(boutonObjets)
    containerFilter.appendChild(boutonAppartements)
    containerFilter.appendChild(boutonHotelEtRestaurant)
}

function filtre(response){
    boutonTous.addEventListener("click", ()=>{
        document.querySelector(".gallery").innerHTML=""
        genererPage(response)   
    })

    boutonObjets.addEventListener("click", ()=>{
        const affichageObjet = response.filter(function(response){
        return response.categoryId === 1
        })
            document.querySelector(".gallery").innerHTML=""
            genererPage(affichageObjet)
    })

    boutonAppartements.addEventListener("click", ()=>{
        const affichageAppartement = response.filter(function(response){
            return response.categoryId === 2
            })
                document.querySelector(".gallery").innerHTML=""
                genererPage(affichageAppartement)
    })

    boutonHotelEtRestaurant.addEventListener("click", ()=>{
        const affichageHotelEtRestaurant = response.filter(function(response){
            return response.categoryId === 3
            })
                document.querySelector(".gallery").innerHTML=""
                genererPage(affichageHotelEtRestaurant)
    })
}

//Récupération du Token//

// async function recuperationToken(){

//     const chargeUtile = {
//         "email" : `${inputMail.value}`,
//         "password" : `${inputPassword.value}`
//     }

//     const data = await fetch("http://localhost:5678/api/users/login", {
//         method : "POST",
//         headers : {"Content-Type" : "application/json"},
//         body : JSON.stringify(chargeUtile)
//     })
//     .then(async(response)=>{
//         const responseData = await response.json()
//         token = responseData.token
//         console.log(token);
//     })
//     localStorage.setItem("token", token)
// }

async function recuperationToken(email, password) {
    const chargeUtile = {
        email,
        password
    };

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chargeUtile)
    });

    if (!response.ok) {
        throw new Error("Identifiant ou mot de passe incorrect");
    }

    const responseData = await response.json();
    const token = responseData.token;
    localStorage.setItem("token", token);
}

//Fonction de connexion grâce à l'email et le mdp//

function connexionLogin() {
    boutonSubmitSeConnecter.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = inputMail.value;
        const password = inputPassword.value;

        try {
            await recuperationToken(email, password);
            window.location.href = "index.html";

        } catch (error) {
            console.error("Erreur lors de l'authentification:", error);
            identifiantMotDePasseIncorrect();
        }
    });
}

// function connexionLogin(){
//     boutonSubmitSeConnecter.addEventListener("submit", (event)=>{
//         event.preventDefault()
//         if(inputMail.value != "sophie.bluel@test.tld" || inputPassword.value != "S0phie"){
//             identifiantMotDePasseIncorrect()
//         } else {

//             recuperationToken() 
//             setTimeout(function() {
//                 window.location.href= "index.html";
//             }, 100);  
//             testLocalStorage()
//         }
        
//     })
// }


// Function pour le message d'erreur si mauvais mdp ou identifiant//

function identifiantMotDePasseIncorrect(){
    const messageMauvaismdp = document.querySelector(".formualireDeConnexion span")
    messageMauvaismdp.style.display ="block"
}




//Je créer une fonction TestLocalStorage pour faire un test : si mon localStorage détient qqch alors ...//

function testLocalStorage(){
    if(localStorage.getItem("token")){
        apparitionBarreEdit()
        logout()
        boutonModifiers()
        disparitionBarreDeFiltre()
        gestionModal()
        
    }
}

//je vais créer toute les fonctions à mettre dans TestLocalStorage//

/**/ /*Apparition de ma barre de modification */ /**/
function apparitionBarreEdit(){
    const barreModification = document.createElement("div")
    const contenuBarreModification = document.createElement("p")
    const html =  document.querySelector("#affichageBarreModification")

    contenuBarreModification.innerHTML=`<i class="fa-solid fa-pen-to-square"></i>Mode Edition`

    contenuBarreModification.classList.add("barre")
    barreModification.classList.add("conteneurBarre")

    html.appendChild(barreModification)
    barreModification.appendChild(contenuBarreModification)
 
}
/**/ /*Apparition bouton logout et disparition du bouton login quand on est connecté */ /**/

function logout(){
    const boutonLogin = document.getElementById("boutonLoginAcceuil")
    const listeHeader = document.getElementById("listeHeader")

    const boutonLogout = document.createElement("button")
    boutonLogout.innerText="logout"
    boutonLogout.classList.add("logout")

    listeHeader.appendChild(boutonLogout)

    boutonLogin.style.display = "none"

    boutonLogout.addEventListener("click", ()=>{
        localStorage.clear()
        location.reload();
    })  
}

/**/ /*Apparition bouton modifier au dessus des filtres */ /**/

function boutonModifiers(){
    boutonModifier = document.createElement("button")
    const emplacementBoutonModifier = document.getElementById("emplacementBoutonModifier")
    boutonModifier.classList.add("boutonModifier")

    boutonModifier.innerHTML=`<i class="fa-regular fa-pen-to-square"></i>Modifier`
    emplacementBoutonModifier.appendChild(boutonModifier)
}

/**/ /*Disparition de ma barre de filtre quand le mode édition est acitvé */ /**/

function disparitionBarreDeFiltre(){
    const filtre =document.getElementById("filtre")
    filtre.style.display ="none"

    const placementh2EtModifier = document.querySelector(".placementh2EtModifier")
    placementh2EtModifier.classList.add("ajoutPadding")
}

/**/ /* Gestion du bouton pour faire apparaitre et disparaitre la modale */ /**/

function gestionModal(){
    boutonModifier.classList.add("modal-trigger")
    const modalContainer = document.querySelector(".modalContainer")
    const modalTriggers = document.querySelectorAll(".modal-trigger")
    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

        function toggleModal(){
        modalContainer.classList.toggle("active")
    }
}



/**/ /* Permet de changer de modal modal 1 --> modal 2 et inversement */ /**/

function changementModal(){
    const boutonAjoutPhoto = document.querySelector(".addPhotos")
    const deuxiemeModal = document.querySelector("#modal2")
    const modal = document.querySelector("#modalAFerme")
    const boutonretour = document.querySelector(".retourModalune")
    const premierModal = document.getElementById("modal1")
    
    boutonAjoutPhoto.addEventListener("click", ()=>{
      deuxiemeModal.style.display="block"
      premierModal.style.display="none"
    })

    boutonretour.addEventListener("click", ()=>{
        deuxiemeModal.style.display="none"
        premierModal.style.display="block"
    })
}

/**/ /* Permet de supprimer les images */ /**/

async function suppressionImage(id){
    let response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method : "DELETE",
        body: null,
        headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`,
            "Content-Type":"application/json"
        }
    })
    
}
    
/**/ /* Insertion de des images dans la modal pour les supprimer */ /**/


async function recupérationApiModal(){
    const data = await fetch("http://localhost:5678/api/works")
    const response = await data.json()
    genererPageModal(response)
    filtre(response)
    
}

function genererPageModal(response){
    for (let i=0; i<response.length; i++){
        
        const galeriePhoto = document.querySelector(".imageApiModal")
        const imagesAffichePageAcceuil = document.createElement("img")
        const figure = document.createElement("figure")

        boutonSupprimer = document.createElement("button")
        boutonSupprimer.innerHTML=`<i class="fa-solid fa-trash-can"></i>`
        boutonSupprimer.classList.add("boutonSupprimer")

        const imgageUrl = response[i].imageUrl
        const imageId = response[i].id
        

        imagesAffichePageAcceuil.src = imgageUrl
        

        galeriePhoto.appendChild(figure)
        figure.appendChild(imagesAffichePageAcceuil)
        figure.appendChild(boutonSupprimer)

        boutonSupprimer.addEventListener("click", ()=>{
        suppressionImage(imageId)

    })
}
}

function ajoutPhoto(){
    const inputFichier = document.getElementById("ajoutDeLimage")
    const contenuAjoutPhoto = document.querySelector(".contenuAjoutPhoto")
    inputFichier.addEventListener("change", function(){
        const zoneImage = document.getElementById("apparitionImage")
        if(inputFichier.files && inputFichier.files[0]){
            const reader = new FileReader();
            
            reader.onload = function(e) {
              
              const image = document.createElement('img');
              image.src = e.target.result;
              
              zoneImage.innerHTML = '';
              zoneImage.appendChild(image);
              contenuAjoutPhoto.style.display="none"
            }
           
            reader.readAsDataURL(inputFichier.files[0]);
          } else {
            
            zoneImage.innerHTML = '';
          }
        });  
        }    







// function envoieDeLaPhotoApi(){
//   const formulaireAjoutDePhotoa = document.querySelector(".formulaireAjoutDePhoto")
//     formulaireAjoutDePhotoa.addEventListener("submit", async (event)=>{
//     event.preventDefault() 
    
// const inputTitreOeuvre = document.getElementById("titreImageAjoute")
// const inputCatégorie = document.getElementById("categorie")
// const inputFichier = document.getElementById("ajoutDeLimage")
// const inputFile = inputFichier.files[0]

// const oeuvre=
// {   
//     "image":`${inputFichier.value}`,
//     "title": `${inputTitreOeuvre.value }`,
//     "category": `${inputCatégorie.value}`
//   }

// console.log(oeuvre);

// await fetch("http://localhost:5678/api/works", {
//         method : "POST",
//         body: JSON.stringify(oeuvre) ,
//         headers : {
//             Authorization : `Bearer ${localStorage.getItem("token")}`,
//             "accept" : "application/json",
//             "Content-Type": "multipart/form-data" 
//         }
//     }) 
    
// })
// }

async function envoieDeLaPhotoApi() {
    const formulaireAjoutDePhotoa = document.querySelector(".formulaireAjoutDePhoto")
    formulaireAjoutDePhotoa.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const inputTitreOeuvre = document.getElementById("titreImageAjoute");
      const inputCatégorie = document.getElementById("categorie");
      const inputFichier = document.getElementById("ajoutDeLimage");
      const inputFile = inputFichier.files[0];
  
      const formData = new FormData();
      formData.append('image', inputFile);
      formData.append('title', inputTitreOeuvre.value);
      formData.append('category', inputCatégorie.value);
  
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
  
     
    });
  }



function verifierChamp(){
    const inputTitreOeuvre = document.getElementById("titreImageAjoute")
    const inputCatégorie = document.getElementById("categorie")
    const inputFichier = document.getElementById("ajoutDeLimage")
    const btnAjoutPhotoFormulaireAjoutPhoto = document.getElementById("boutonAjoutPhoto")

    if(inputFichier.value && inputCatégorie.value && inputTitreOeuvre.value) {
        btnAjoutPhotoFormulaireAjoutPhoto.classList.add("greenBouton")
        btnAjoutPhotoFormulaireAjoutPhoto.classList.remove("boutonAjoutPhoto")
        
    } else {
        btnAjoutPhotoFormulaireAjoutPhoto.classList.remove("greenBouton")
        
    }
}

function appelVerifierChamp(){
    const inputTitreOeuvre = document.getElementById("titreImageAjoute")
const inputCatégorie = document.getElementById("categorie")
const inputFichier = document.getElementById("ajoutDeLimage")
const btnAjoutPhotoFormulaireAjoutPhoto = document.getElementById("boutonAjoutPhoto")

inputCatégorie.addEventListener("change", verifierChamp)
inputTitreOeuvre.addEventListener("change", verifierChamp)
inputFichier.addEventListener("change", verifierChamp)
}


/*async function recuperationToken(){
const chargeUtile = {
    "email" : `${inputMail.value}`,
    "password" : `${inputPassword.value}`
}

const data = await fetch("http://localhost:5678/api/users/login", {
    method : "POST",
    headers : {"Content-Type" : "application/json"},
    body : JSON.stringify(chargeUtile)
})
.then(async(response)=>{
    const responseData = await response.json()
    token = responseData.token
    console.log(token);
})
localStorage.setItem("token", token)

}


{
    "id": 0,
    "title": `${inputTitreOeuvre.value }`,
    "imageUrl":`${inputFichier.value}`,
    "categoryId": `${inputCatégorie.value}`,
    "userId": 0
  }

*/

