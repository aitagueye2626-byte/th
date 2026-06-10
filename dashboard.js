
function remplirDashboardAdmin(transactions) {
  afficherTableauAdmin(transactions);
  afficherMetriquesAdmin(transactions);
}

function afficherTableauAdmin(transactions) {
  const corpsTableau = document.getElementById("corpsTableauAdmin");
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
    if (!totaux[t.produit]) {
      totaux[t.produit] = 0;
    }
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


function remplirDashboardClient(nomClient) {
  document.getElementById("nomUtilisateurClient").textContent = nomClient;
  document.getElementById("corpsTableauClient").innerHTML = "";

  const mesCommandes = donneesJSON.transactions.filter(t => t.client === nomClient);

  mesCommandes.forEach((t) => {
    const montant = t.quantite * t.prix;

    const ligne = `<tr>
      <td>${t.date}</td>
      <td>${t.produit}</td>
      <td>${t.quantite} kg</td>
      <td>${montant.toLocaleString()} FCFA</td>
      <td><span style="color: #4caf50; font-weight: bold;">✅ Livrée</span></td>
    </tr>`;

    document.getElementById("corpsTableauClient").innerHTML += ligne;
  });

  afficherPanier();
}
