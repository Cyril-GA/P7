const formulaireLogin = document.querySelector(".loginForm");

formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Création de l'objet
    const dataForm = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    };
    // Création de la charge utile en JSON
    const chargeUtile = JSON.stringify(dataForm);

    // Appel de la fonction fetch
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile,
    })

    // Revoir cette partie
    console.log(response)
    const data = await response.json();
    console.log(data)

    if (!response.ok) {
        document.querySelector(".error").textContent = 'Erreur dans l\'identifiant ou le mot de passe';

        // Est ce qu'il faut vider le token en prévention si reconnexion ultérieur raté ? 
    }

    if (response.ok) {
        document.querySelector(".error").textContent = " ";
        // Sauvegarde du Token
        const token = data.token;
        sessionStorage.setItem("authToken", token);

        console.log("Token sauvegardé", token);

        // Redicréction
        window.location.href = "index.html"
    }
})
