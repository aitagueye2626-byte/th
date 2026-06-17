async function ajouterAuPanier() {
  const selectProduit = document.getElementById("produit");
  const inputQuantite = document.getElementById("quantiteCmd");
  const produitChoisi = selectProduit.value;
  const quantite = parseInt(inputQuantite.value);

  if (isNaN(quantite) || quantite <= 0) {
    toast("error", "Erreur", "Quantité invalide.");
    return;
  }

  try {
    const produits = await getProduits();
    const produitInfo = produits.find(p => p.nom.toLowerCase() === produitChoisi.toLowerCase());

    const nouvelArticle = {
      produit: produitInfo ? produitInfo.nom : produitChoisi,
      quantite: quantite,
      prix: produitInfo ? produitInfo.prix : 1000,
      clientEmail: utilisateurConnecte.email
    };

    await ajouterAuPanierAPI(nouvelArticle);
    toast("success", "Panier", `${quantite} kg de ${produitChoisi} ajoutés.`);
    inputQuantite.value = "";
    await afficherPanier();
  } catch (error) {
    console.error("Erreur ajout:", error);
    toast("error", "Erreur", "Impossible d'ajouter au panier.");
  }
}

async function afficherPanier() {
  try {
    const panier = await getPanier();
    const mesArticles = panier.filter(a => a.clientEmail === utilisateurConnecte.email);

    const corps = document.getElementById("corpsPanier");
    if (!corps) return;
    corps.innerHTML = "";

    let total = 0;
    mesArticles.forEach(article => {
      const sousTotal = article.quantite * article.prix;
      total += sousTotal;

      const ligne = document.createElement("tr");
      ligne.innerHTML = `
        <td>${article.produit}</td>
        <td>${article.quantite}</td>
        <td>${article.prix} FCFA</td>
        <td>${sousTotal} FCFA</td>
        <td><button onclick="retirerDuPanier(${article.id})">🗑️</button></td>
      `;
      corps.appendChild(ligne);
    });

    document.getElementById("totalPanier").innerText = `${total} FCFA`;
  } catch (error) {
    console.error("Erreur affichage panier:", error);
  }
}

async function retirerDuPanier(id) {
  try {
    await fetch(`${BASE_URL}/paniers/${id}`, { method: "DELETE" });
    toast("success", "Panier", "Article retiré.");
    await afficherPanier();
  } catch (error) {
    console.error("Erreur suppression:", error);
    toast("error", "Erreur", "Impossible de retirer l'article.");
  }
}

async function validerCommande() {
  try {
    const panier = await getPanier();
    const mesArticles = panier.filter(a => a.clientEmail === utilisateurConnecte.email);

    if (mesArticles.length === 0) {
      toast("error", "Panier vide", "Ajoutez des produits avant de valider.");
      return;
    }

    const aujourdHui = new Date().toLocaleDateString("fr-FR");

    for (const article of mesArticles) {
      const transaction = {
        client: utilisateurConnecte.nom || utilisateurConnecte.email,
        clientEmail: utilisateurConnecte.email,
        produit: article.produit,
        quantite: article.quantite,
        prix: article.prix,
        total: article.quantite * article.prix,
        date: aujourdHui,
        statut: "En attente"
      };
      await ajouterTransaction(transaction);
      await fetch(`${BASE_URL}/paniers/${article.id}`, { method: "DELETE" });
    }

    toast("success", "Commande validée", "Votre commande a bien été enregistrée.");
    await afficherPanier();
    await afficherCommandesClient();
  } catch (error) {
    console.error("Erreur validation commande:", error);
    toast("error", "Erreur", "Impossible de valider la commande.");
  }
}

async function afficherCommandesClient() {
  try {
    const transactions = await getTransactions();
    const mesCommandes = transactions.filter(t => t.clientEmail === utilisateurConnecte.email);

    const corps = document.getElementById("corpsTableauClient");
    if (!corps) return;
    corps.innerHTML = "";

    mesCommandes.forEach(commande => {
      const ligne = document.createElement("tr");
      ligne.innerHTML = `
        <td>${commande.date}</td>
        <td>${commande.produit}</td>
        <td>${commande.quantite}</td>
        <td>${commande.total} FCFA</td>
        <td>${commande.statut}</td>
      `;
      corps.appendChild(ligne);
    });
  } catch (error) {
    console.error("Erreur affichage commandes:", error);
  }
}

async function remplirSelectProduits() {
  try {
    const produits = await getProduits();
    const select = document.getElementById("produit");
    if (!select) return;
    select.innerHTML = "";
    produits.forEach(p => {
      const option = document.createElement("option");
      option.value = p.nom;
      option.innerText = `${p.nom} - ${p.prix} FCFA/kg`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur chargement produits:", error);
  }
}

const observerClient = new MutationObserver(() => {
  const page = document.getElementById("dashboardClient");
  if (page && !page.dataset.initialise) {
    page.dataset.initialise = "true";
    if (typeof utilisateurConnecte !== "undefined" && utilisateurConnecte) {
      const nomEl = document.getElementById("nomUtilisateurClient");
      if (nomEl) nomEl.innerText = utilisateurConnecte.nom || utilisateurConnecte.email;
    }
    remplirSelectProduits();
    afficherPanier();
    afficherCommandesClient();
  }
});
observerClient.observe(document.body, { childList: true, subtree: true });