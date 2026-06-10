
function ajouterAuPanier() {
  const produit = document.getElementById("produit").value;
  const quantite = parseInt(document.getElementById("quantiteCmd").value);

  if (quantite <= 0 || isNaN(quantite)) {
    alert("❌ Veuillez entrer une quantité valide");
    return;
  }

  const produitInfo = donneesJSON.produits.find(p => p.nom === produit);
  const prix = produitInfo.prix;

  const articleExistant = donneesJSON.panier.find(a => a.produit === produit);

  if (articleExistant) {
    articleExistant.quantite += quantite;
  } else {
    donneesJSON.panier.push({
      produit: produit,
      quantite: quantite,
      prix: prix
    });
  }

  alert(`✅ ${quantite} kg de ${produit} ajouté au panier !`);
  document.getElementById("quantiteCmd").value = "";
  afficherPanier();
}

function retirerDuPanier(index) {
  donneesJSON.panier.splice(index, 1);
  afficherPanier();
}

function afficherPanier() {
  const corpsPanier = document.getElementById("corpsPanier");
  corpsPanier.innerHTML = "";

  let totalGeneral = 0;

  if (donneesJSON.panier.length === 0) {
    corpsPanier.innerHTML = "<tr><td colspan='5' style='text-align: center; padding: 20px;'>Votre panier est vide</td></tr>";
    document.getElementById("totalPanier").textContent = "0 FCFA";
    return;
  }

  donneesJSON.panier.forEach((article, index) => {
    const montant = article.quantite * article.prix;
    totalGeneral += montant;

    const ligne = `<tr>
      <td>${article.produit}</td>
      <td>${article.quantite} kg</td>
      <td>${article.prix.toLocaleString()} FCFA</td>
      <td>${montant.toLocaleString()} FCFA</td>
      <td><button onclick="retirerDuPanier(${index})" style="background: #c62828; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">❌ Retirer</button></td>
    </tr>`;

    corpsPanier.innerHTML += ligne;
  });

  document.getElementById("totalPanier").textContent = totalGeneral.toLocaleString() + " FCFA";
}

function validerCommande() {
  if (donneesJSON.panier.length === 0) {
    alert("❌ Votre panier est vide !");
    return;
  }

  donneesJSON.panier.forEach((article) => {
    donneesJSON.transactions.push({
      client: utilisateurConnecte.nom,
      date: new Date().toLocaleDateString("fr-FR"),
      produit: article.produit,
      quantite: article.quantite,
      prix: article.prix
    });
  });

  alert("✅ Commande passée avec succès !");
  donneesJSON.panier = [];  
  afficherPanier();
  remplirDashboardClient(utilisateurConnecte.nom);
}
