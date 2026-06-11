
function afficherPage(typeOuRole) {
  const app = document.getElementById("app");

  if (typeOuRole === "connexion") {
    app.innerHTML = getConnexionPage();
  } else if (typeOuRole === "admin") {
    app.innerHTML = getAdminPage();
    document.getElementById("nomUtilisateurAdmin").textContent = utilisateurConnecte.nom;
    remplirDashboardAdmin(donneesJSON.transactions);
  } else if (typeOuRole === "client" || typeOuRole === "mareyeur") {
    app.innerHTML = getClientPage();
    remplirDashboardClient(utilisateurConnecte.nom);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("🐟 SenThiof - Application chargée");
  console.log("Données disponibles:", donneesJSON);
  
  afficherPage("connexion");
});

console.log("📊 Données de l'application:", {
  utilisateurs: donneesJSON.utilisateurs,
  transactions: donneesJSON.transactions,
  produits: donneesJSON.produits,
  panier: donneesJSON.panier
});
