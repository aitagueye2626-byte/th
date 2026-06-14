let utilisateurConnecte = null;

function seConnecter() {
  const emailSaisi = document.getElementById("email").value.trim().toLowerCase();
  const motdepasseSaisi = document.getElementById("motdepasse").value.trim();
  const zoneErreur = document.getElementById("messageErreur");
  zoneErreur.style.display = "none";
  zoneErreur.textContent = "";

  if (emailSaisi === "" || motdepasseSaisi === "") {
    afficherErreur("messageErreur", "❌ Veuillez remplir tous les champs.");
    return;
  }

  connecterUtilisateur(emailSaisi, motdepasseSaisi).then(utilisateur => {
    if (!utilisateur) {
      afficherErreur("messageErreur", "❌ Email ou mot de passe incorrect.");
      return;
    }
    utilisateurConnecte = utilisateur;
    sessionStorage.setItem("utilisateurConnecte", JSON.stringify(utilisateur));
    afficherPage(utilisateur.role);
  });
}

function sInscrire() {
  const nom = document.getElementById("nomInscription").value.trim();
  const email = document.getElementById("emailInscription").value.trim().toLowerCase();
  const motdepasse = document.getElementById("motdepasseInscription").value.trim();
  const confirmerMdp = document.getElementById("confirmerMotdepasse").value.trim();
  const role = document.getElementById("roleInscription").value;
  const zoneErreur = document.getElementById("messageErreurInscription");
  zoneErreur.style.display = "none";
  zoneErreur.textContent = "";

  if (nom === "" || email === "" || motdepasse === "" || confirmerMdp === "") {
    afficherErreur("messageErreurInscription", "❌ Veuillez remplir tous les champs.");
    return;
  }
  if (!email.endsWith("@senthiof.sn")) {
    afficherErreur("messageErreurInscription", "❌ Seules les adresses @senthiof.sn sont autorisées.");
    return;
  }
  if (motdepasse !== confirmerMdp) {
    afficherErreur("messageErreurInscription", "❌ Les mots de passe ne correspondent pas.");
    return;
  }
  if (motdepasse.length < 4) {
    afficherErreur("messageErreurInscription", "❌ Le mot de passe doit faire au moins 4 caractères.");
    return;
  }

  getUtilisateurs().then(utilisateurs => {
    const existe = utilisateurs.find(u => u.email.toLowerCase() === email);
    if (existe) {
      afficherErreur("messageErreurInscription", "❌ Cet email est déjà utilisé.");
      return;
    }
    ajouterUtilisateur({ email, motdepasse, nom, role }).then(() => {
      toast("success", "Compte créé !", "Vous pouvez maintenant vous connecter.");
      reinitialiserFormulaireInscription();
      afficherFormulaireConnexion();
    });
  });
}

function seDeconnecter() {
  utilisateurConnecte = null;
  sessionStorage.removeItem("utilisateurConnecte");
  sessionStorage.removeItem("sectionActiveAdmin"); // ← AJOUT
  afficherPage("connexion");
  document.getElementById("email").value = "";
  document.getElementById("motdepasse").value = "";
}

function afficherErreur(elementId, message) {
  const zone = document.getElementById(elementId);
  zone.style.display = "block";
  zone.textContent = message;
}

function afficherFormulaireConnexion() {
  document.getElementById("formuConnexion").classList.remove("cache");
  document.getElementById("formuInscription").classList.add("cache");
}

function afficherFormulaireInscription() {
  document.getElementById("formuConnexion").classList.add("cache");
  document.getElementById("formuInscription").classList.remove("cache");
}

function reinitialiserFormulaireInscription() {
  document.getElementById("nomInscription").value = "";
  document.getElementById("emailInscription").value = "";
  document.getElementById("motdepasseInscription").value = "";
  document.getElementById("confirmerMotdepasse").value = "";
  document.getElementById("roleInscription").value = "client";
}

function afficherInscription() { afficherFormulaireInscription(); }

function afficherConnexion() {
  afficherFormulaireConnexion();
  document.getElementById("messageErreur").style.display = "none";
  document.getElementById("messageErreurInscription").style.display = "none";
}