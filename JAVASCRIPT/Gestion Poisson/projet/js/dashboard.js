function remplirDashboardAdmin() {
  if (!document.getElementById("corpsTableauAdmin")) return;
  getTransactions().then(transactions => {
    afficherTableauAdmin(transactions);
    afficherMetriquesAdmin(transactions);
  });
}

function afficherTableauAdmin(transactions) {
  const corpsTableau = document.getElementById("corpsTableauAdmin");
  if (!corpsTableau) return;
  corpsTableau.innerHTML = "";
  transactions.forEach((t) => {
    const montant = t.quantite * t.prix;
    const ligne = `<tr>
      <td>${t.client}</td>
      <td>${t.date}</td>
      <td>${t.produit}</td>
      <td>${t.quantite} kg</td>
      <td>${t.prix.toLocaleString()} FCFA</td>
      <td>${montant.toLocaleString()} FCFA</td>
    </tr>`;
    corpsTableau.innerHTML += ligne;
  });
}

function afficherMetriquesAdmin(transactions) {
  if (!document.getElementById("nbLignesAdmin")) return;
  let totalQte = 0;
  let totalMontant = 0;
  transactions.forEach((t) => {
    totalQte += t.quantite;
    totalMontant += t.quantite * t.prix;
  });
  document.getElementById("nbLignesAdmin").textContent = transactions.length;
  document.getElementById("totalQteAdmin").textContent = totalQte;
  document.getElementById("totalMontantAdmin").textContent = totalMontant.toLocaleString();
  document.getElementById("topProduitAdmin").textContent = trouverTopProduit(transactions);
  document.getElementById("totalTransactionsAdmin").textContent = transactions.length;
  document.getElementById("totalGeneralAdmin").textContent = totalMontant.toLocaleString();
}

function trouverTopProduit(transactions) {
  const totaux = {};
  transactions.forEach((t) => {
    if (!totaux[t.produit]) totaux[t.produit] = 0;
    totaux[t.produit] += t.quantite;
  });
  let meilleurNom = "";
  let meilleureQte = 0;
  Object.keys(totaux).forEach((nom) => {
    if (totaux[nom] > meilleureQte) {
      meilleureQte = totaux[nom];
      meilleurNom = nom;
    }
  });
  return meilleurNom;
}

function remplirDashboardClient(emailClient) {
  const nomEl = document.getElementById("nomUtilisateurClient");
  const corpsEl = document.getElementById("corpsTableauClient");
  if (!nomEl || !corpsEl) return;

  nomEl.textContent = utilisateurConnecte.nom;
  corpsEl.innerHTML = "";

  getTransactions().then(transactions => {
    // ✅ Filtrer par email pour isoler les commandes de chaque client
    const mesCommandes = transactions.filter(t => t.clientEmail === emailClient);
    if (mesCommandes.length === 0) {
      corpsEl.innerHTML = "<tr><td colspan='5' style='text-align:center;padding:20px;color:#888;'>Aucune commande pour le moment</td></tr>";
      return;
    }
    mesCommandes.forEach((t) => {
      const montant = t.quantite * t.prix;
      const ligne = `<tr>
        <td>${t.date}</td>
        <td>${t.produit}</td>
        <td>${t.quantite} kg</td>
        <td>${montant.toLocaleString()} FCFA</td>
        <td><span style="color: #4caf50; font-weight: bold;">✅ Livrée</span></td>
      </tr>`;
      corpsEl.innerHTML += ligne;
    });
  });

  afficherPanier();
}