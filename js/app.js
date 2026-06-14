function afficherPage(typeOuRole) {
  if (!utilisateurConnecte) {
    const data = sessionStorage.getItem("utilisateurConnecte");
    if (data) utilisateurConnecte = JSON.parse(data);
  }
  const app = document.getElementById("app");
  if (typeOuRole === "connexion") {
    app.innerHTML = getConnexionPage();
  } else if (typeOuRole === "admin" || typeOuRole === "mareyeur") {
    if (!document.getElementById("dashboardAdmin")) {
      app.innerHTML = getAdminPage();
      document.getElementById("nomUtilisateurAdmin").textContent = utilisateurConnecte.nom;
      naviguerVers(sectionActive); // ← au lieu de "tableau-de-bord" en dur
    }
  } else if (typeOuRole === "client") {
    app.innerHTML = getClientPage();
    remplirDashboardClient(utilisateurConnecte.email);
  }
}