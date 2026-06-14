function ajouterAuPanier() {
  const produit = document.getElementById("produit").value;
  const quantite = parseInt(document.getElementById("quantiteCmd").value);
  if (quantite <= 0 || isNaN(quantite)) {
    toast("error", "Quantité invalide", "Veuillez entrer une quantité valide.");
    return;
  }
  getProduits().then(produits => {
    const produitInfo = produits.find(p => p.nom === produit);
    const prix = produitInfo.prix;
    getPanier().then(panier => {
      // ✅ Filtrer le panier par email du client connecté
      const monPanier = panier.filter(a => a.clientEmail === utilisateurConnecte.email);
      const articleExistant = monPanier.find(a => a.produit === produit);
      if (articleExistant) {
        const nouvelleQuantite = articleExistant.quantite + quantite;
        fetch(`${BASE_URL}/paniers/${articleExistant.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...articleExistant, quantite: nouvelleQuantite })
        }).then(() => {
          toast("success", "Panier mis à jour !", `${quantite} kg de ${produit} ajoutés au panier.`);
          document.getElementById("quantiteCmd").value = "";
          afficherPanier();
        });
      } else {
        ajouterAuPanierAPI({ 
          produit, quantite, prix,
          clientEmail: utilisateurConnecte.email // ✅ stocker l'email
        }).then(() => {
          toast("success", "Ajouté au panier !", `${quantite} kg de ${produit} ajoutés au panier.`);
          document.getElementById("quantiteCmd").value = "";
          afficherPanier();
        });
      }
    });
  });
}

function retirerDuPanier(id) {
  fetch(`${BASE_URL}/paniers/${id}`, { method: "DELETE" })
    .then(() => {
      toast("warning", "Article retiré", "L'article a été retiré du panier.");
      afficherPanier();
    });
}

function afficherPanier() {
  const corpsPanier = document.getElementById("corpsPanier");
  if (!corpsPanier) return;
  corpsPanier.innerHTML = "";
  let totalGeneral = 0;
  getPanier().then(panier => {
    // ✅ Chaque client ne voit que son propre panier
    const monPanier = panier.filter(a => a.clientEmail === utilisateurConnecte.email);
    if (monPanier.length === 0) {
      corpsPanier.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>Votre panier est vide</td></tr>";
      document.getElementById("totalPanier").textContent = "0 FCFA";
      return;
    }
    monPanier.forEach((article) => {
      const montant = article.quantite * article.prix;
      totalGeneral += montant;
      const ligne = `<tr>
        <td>${article.produit}</td>
        <td>${article.quantite} kg</td>
        <td>${article.prix.toLocaleString()} FCFA</td>
        <td>${montant.toLocaleString()} FCFA</td>
        <td><button onclick="retirerDuPanier(${article.id})" style="background: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">❌ Retirer</button></td>
      </tr>`;
      corpsPanier.innerHTML += ligne;
    });
    document.getElementById("totalPanier").textContent = totalGeneral.toLocaleString() + " FCFA";
  });
}

function validerCommande() {
  getPanier().then(panier => {
    // ✅ Filtrer par email
    const monPanier = panier.filter(a => a.clientEmail === utilisateurConnecte.email);
    if (monPanier.length === 0) {
      toast("error", "Panier vide", "Veuillez ajouter au moins un produit avant de valider.");
      return;
    }
    const date = new Date().toLocaleDateString("fr-FR");
    const ajouts = monPanier.map((article, index) =>
      ajouterTransaction({
        id: Date.now() + index,
        client: utilisateurConnecte.nom,
        clientEmail: utilisateurConnecte.email, 
        date: date,
        produit: article.produit,
        quantite: article.quantite,
        prix: article.prix,
        total: article.quantite * article.prix
      })
    );
    Promise.all(ajouts).then(() => {
      monPanier.forEach(a => {
        fetch(`${BASE_URL}/paniers/${a.id}`, { method: "DELETE" });
      });
      toast("success", "Commande validée !", "Votre commande a été passée avec succès.");
      afficherPanier();
      remplirDashboardClient(utilisateurConnecte.email);
    });
  });
}