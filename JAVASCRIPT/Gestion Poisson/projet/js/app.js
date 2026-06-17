
function afficherPage(typeOuRole) {
  if (!utilisateurConnecte) {
    const data = sessionStorage.getItem("utilisateurConnecte");
    if (data) utilisateurConnecte = JSON.parse(data);
  }

  const app = document.getElementById("app");

  if (typeOuRole === "connexion") {
    document.body.classList.remove("avec-fond"); // ← pas de fond sur la connexion
    app.innerHTML = getConnexionPage();
  } else if (typeOuRole === "admin" || typeOuRole === "mareyeur") {
    document.body.classList.add("avec-fond"); // ← fond actif pour l'admin
    if (!document.getElementById("dashboardAdmin")) {
      app.innerHTML = getAdminPage();
      document.getElementById("nomUtilisateurAdmin").textContent = utilisateurConnecte.nom;
      naviguerVers(sectionActive);
    }
  } else if (typeOuRole === "client") {
    document.body.classList.add("avec-fond"); // ← fond actif pour le client
    app.innerHTML = getClientPage();
    remplirDashboardClient(utilisateurConnecte.email);
  }
}