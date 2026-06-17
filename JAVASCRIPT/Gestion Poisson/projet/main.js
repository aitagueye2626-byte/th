function chargerScripts(scripts, index) {
  if (index >= scripts.length) {
    const data = sessionStorage.getItem("utilisateurConnecte");
    if (data) {
      utilisateurConnecte = JSON.parse(data);
      afficherPage(utilisateurConnecte.role);
    } else {
      afficherPage("connexion");
    }
    return;
  }
  const script = document.createElement("script");
  script.src = scripts[index];
  script.onload = () => chargerScripts(scripts, index + 1);
  document.body.appendChild(script);
}

chargerScripts([
  "js/data.js",
  "js/auth.js",
  "js/toast.js",
  "js/connexion.js",
  "js/dashboard.js",
  "js/cart.js",
  "js/client.js",
  "js/admin.js",
  "js/app.js"
], 0);