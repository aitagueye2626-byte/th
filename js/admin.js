let sectionActive = sessionStorage.getItem("sectionActiveAdmin") || "tableau-de-bord";
function getAdminPage() {
  const sections = [
    { id: "tableau-de-bord", label: "📊 Table De Bord" },
    { id: "poisson",         label: "🐠 Poissons" },
    { id: "stock",           label: "🏪 Stocks" },
    { id: "vente",           label: "💵 Ventes" },
    { id: "commandes",       label: "🛒 Commandes" },
  ];
  const menuHtml = sections.map(s =>
    `<div class="element-menu${sectionActive === s.id ? ' actif' : ''}" onclick="naviguerVers('${s.id}')">${s.label}</div>`
  ).join("");

  return `
    <div id="dashboardAdmin">
      <nav class="barre-navigation">
        <div class="logo-barre"><span>🐟</span><span>SenThiof - Admin</span></div>
        <div class="menu-barre">
          <span id="nomUtilisateurAdmin"></span>
          <button type="button" onclick="seDeconnecter()">🔓 Déconnexion</button>
        </div>
      </nav>
      <div class="mise-en-page">
        <aside class="barre-laterale">${menuHtml}</aside>
        <main class="contenu" id="contenuPrincipal"></main>
      </div>
    </div>
  `;
}

function naviguerVers(section) {
  sectionActive = section;
  sessionStorage.setItem("sectionActiveAdmin", section); // ← AJOUT
  const menus = document.querySelectorAll(".element-menu");
  const indexMenu = { "tableau-de-bord": 0, poisson: 1, stock: 2, vente: 3, commandes: 4 };
  menus.forEach(el => el.classList.remove("actif"));
  if (menus[indexMenu[section]] !== undefined) menus[indexMenu[section]].classList.add("actif");
  rechargerSection(section);
}
function rechargerSection(section) {
  const contenu = document.getElementById("contenuPrincipal");
  if (!contenu) return;
  switch (section) {
    case "tableau-de-bord":
      contenu.innerHTML = getSectionTableauDeBord();
      remplirDashboardAdmin();
      break;
    case "poisson":
      contenu.innerHTML = "<p>Chargement...</p>";
      getProduits().then(produits => { contenu.innerHTML = getSectionPoisson(produits); });
      break;
    case "stock":
      contenu.innerHTML = "<p>Chargement...</p>";
      Promise.all([getProduits(), getTransactions(), getStocks()]).then(([produits, transactions, stocks]) => {
        contenu.innerHTML = getSectionStock(produits, transactions, stocks);
      });
      break;
    case "vente":
      contenu.innerHTML = "<p>Chargement...</p>";
      getProduits().then(produits => { contenu.innerHTML = getSectionVente(produits); });
      break;
    case "commandes":
      contenu.innerHTML = getSectionCommandes();
      getTransactions().then(transactions => {
        initialiserStatuts(transactions);
        afficherLignesCommandes(transactions);
      });
      break;
  }
}

function getSectionTableauDeBord() {
  return `
    <h1 class="titre-page">Tableau de bord Admin</h1>
    <div class="metriques">
      <div class="metrique"><div class="etiquette">Transactions</div><div class="valeur" id="nbLignesAdmin">—</div><div class="unite">entrées</div></div>
      <div class="metrique"><div class="etiquette">Quantité totale</div><div class="valeur" id="totalQteAdmin">—</div><div class="unite">kg</div></div>
      <div class="metrique"><div class="etiquette">Montant total</div><div class="valeur" id="totalMontantAdmin">—</div><div class="unite">FCFA</div></div>
      <div class="metrique"><div class="etiquette">Top produit</div><div class="valeur" id="topProduitAdmin">—</div><div class="unite">ce mois</div></div>
    </div>
    <div class="section-tableau">
      <h2>Transactions récentes</h2>
      <table>
        <thead><tr><th>Client</th><th>Date</th><th>Produit</th><th>Quantité</th><th>Prix unitaire</th><th>Montant total</th></tr></thead>
        <tbody id="corpsTableauAdmin"></tbody>
      </table>
    </div>
    <div class="totaux">
      <p>Nombre de transactions : <strong id="totalTransactionsAdmin">—</strong></p>
      <p>Montant général : <strong id="totalGeneralAdmin">—</strong> FCFA</p>
    </div>
  `;
}

function getSectionPoisson(produits) {
  const lignes = produits.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>🐟 ${p.nom}</td>
      <td>${p.prix.toLocaleString()} FCFA / kg</td>
      <td>
        <button type="button" onclick="modifierProduitAdmin(${p.id}, '${p.nom}', ${p.prix})" class="btn-modifier">✏️ Modifier</button>
        <button type="button" onclick="supprimerProduitAdmin(${p.id})" class="btn-supprimer">🗑️ Supprimer</button>
      </td>
    </tr>`).join("");
  return `
    <h1 class="titre-page">🐠 Gestion des Poissons</h1>
    <div class="section-tableau" style="margin-bottom:24px;">
      <h2>➕ Ajouter un poisson</h2>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:16px 0;">
        <input type="text" id="nomNouveauPoisson" placeholder="Nom du poisson" class="input-admin"/>
        <input type="number" id="prixNouveauPoisson" placeholder="Prix (FCFA/kg)" class="input-admin"/>
        <button type="button" onclick="ajouterProduitAdmin()" class="btn-ajouter">➕ Ajouter</button>
      </div>
    </div>
    <div class="section-tableau">
      <h2>Liste des poissons (${produits.length})</h2>
      <table>
        <thead><tr><th>#</th><th>Nom</th><th>Prix unitaire</th><th>Actions</th></tr></thead>
        <tbody>${lignes}</tbody>
      </table>
    </div>
  `;
}

function ajouterProduitAdmin() {
  const nom = document.getElementById("nomNouveauPoisson").value.trim();
  const prix = parseInt(document.getElementById("prixNouveauPoisson").value);
  if (!nom || isNaN(prix) || prix <= 0) { toast("error", "Champs invalides", "Veuillez saisir un nom et un prix valide."); return; }
  getProduits().then(produits => {
    if (produits.find(p => p.nom.toLowerCase() === nom.toLowerCase())) {
      toast("warning", "Doublon détecté", `"${nom}" existe déjà dans la liste.`); return;
    }
    ajouterProduit({ nom, prix }).then(() => {
      toast("success", "Poisson ajouté !", `${nom} a été ajouté avec succès.`);
      rechargerSection(sectionActive);
    });
  });
}

function supprimerProduitAdmin(id) {
  confirmerAction("Supprimer ce poisson définitivement ?", () => {
    supprimerProduit(id).then(() => {
      toast("success", "Supprimé", "Le poisson a été supprimé.");
      rechargerSection(sectionActive);
    });
  });
}

function modifierProduitAdmin(id, nom, prixActuel) {
  demanderValeur(`Modifier le prix de ${nom}`, `Prix actuel : ${prixActuel.toLocaleString()} FCFA/kg`, "Nouveau prix (FCFA/kg)", prixActuel, (valeur) => {
    const nouveauPrix = parseInt(valeur);
    if (!nouveauPrix || nouveauPrix <= 0) { toast("error", "Prix invalide", "Veuillez saisir un prix supérieur à 0."); return; }
    modifierProduit(id, { nom, prix: nouveauPrix }).then(() => {
      toast("success", "Prix modifié", `${nom} → ${nouveauPrix.toLocaleString()} FCFA/kg`);
      rechargerSection(sectionActive);
    });
  });
}

function getStocks() {
  return fetch(`${BASE_URL}/stocks`).then(res => res.json());
}

function getSectionStock(produits, transactions, stocks) {
  let stockTotal = 0, enStock = 0, horsStock = 0, ruptureStock = 0;
  const lignes = produits.map(p => {
    const stockItem = stocks.find(s => s.nom === p.nom);
    const dispo = stockItem ? stockItem.disponible : 0;
    stockTotal += dispo;
    let statut, statutClass;
    if (dispo === 0)     { statutClass = "statut-rupture"; statut = "Rupture stock"; ruptureStock++; }
    else if (dispo < 50) { statutClass = "statut-alerte";  statut = "À surveiller";  horsStock++; }
    else                 { statutClass = "statut-dispo";   statut = "Disponible";    enStock++; }
    return `
      <tr>
        <td><span class="poisson-icone">🐟</span> ${p.nom}</td>
        <td>${p.prix.toLocaleString()} FCFA/kg</td>
        <td>${dispo} kg</td>
        <td><span class="badge-statut ${statutClass}">${statut}</span></td>
        <td>
          <button type="button" onclick="ajouterStockAdmin('${p.nom}')" class="btn-stock-add">+</button>
          <button type="button" onclick="retirerStockAdmin('${p.nom}', ${dispo})" class="btn-stock-remove">−</button>
        </td>
      </tr>`;
  }).join("");
  const valeurTotale = produits.reduce((s, p) => {
    const st = stocks.find(x => x.nom === p.nom);
    return s + (st ? st.disponible * p.prix : 0);
  }, 0);
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
      <h1 class="titre-page" style="margin:0;">🏪 Gestion des Stocks</h1>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        <input type="text" id="rechercheStock" placeholder="🔍 rechercher un poisson..." oninput="filtrerStock(this.value)"
          style="padding:8px 14px;border:1px solid #ddd;border-radius:20px;outline:none;font-size:13px;width:220px;"/>
        <button type="button" onclick="ouvrirAjoutStock()" style="background:#4caf50;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;">+ Ajouter du stock</button>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
      <div class="metrique-stock" style="background:#1565c0;color:white;"><div style="font-size:12px;opacity:.8;">Stock total</div><div style="font-size:24px;font-weight:bold;">${stockTotal.toLocaleString()} kg</div></div>
      <div class="metrique-stock" style="background:#ff9800;color:white;"><div style="font-size:12px;opacity:.8;">Produit en stock</div><div style="font-size:24px;font-weight:bold;">${enStock}</div></div>
      <div class="metrique-stock" style="background:#9c27b0;color:white;"><div style="font-size:12px;opacity:.8;">Hors stock</div><div style="font-size:24px;font-weight:bold;">${horsStock}</div></div>
      <div class="metrique-stock" style="background:#f44336;color:white;"><div style="font-size:12px;opacity:.8;">Rupture de stock</div><div style="font-size:24px;font-weight:bold;">${ruptureStock}</div></div>
    </div>
    <div class="section-tableau">
      <table id="tableauStock">
        <thead><tr><th>Nom du poisson</th><th>Prix(FCFA/kg)</th><th>Stock disponible</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody id="corpsStock">${lignes}</tbody>
      </table>
      <div class="totaux" style="margin-top:12px;">
        <p>Totale : <strong style="color:#1565c0;">${valeurTotale.toLocaleString()} FCFA</strong></p>
      </div>
    </div>
    <div id="modalStock" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:999;justify-content:center;align-items:center;">
      <div style="background:white;border-radius:12px;padding:32px;width:380px;box-shadow:0 8px 32px rgba(0,0,0,.2);">
        <h2 style="margin-bottom:20px;">+ Ajouter du stock</h2>
        <div style="margin-bottom:14px;">
          <label style="display:block;margin-bottom:6px;font-weight:600;">Produit</label>
          <select id="modalProduitStock" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;">
            ${produits.map(p => `<option value="${p.nom}">${p.nom}</option>`).join("")}
          </select>
        </div>
        <div style="margin-bottom:20px;">
          <label style="display:block;margin-bottom:6px;font-weight:600;">Quantité à ajouter (kg)</label>
          <input type="number" id="modalQteStock" placeholder="Ex: 100" min="1" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"/>
        </div>
        <div style="display:flex;gap:10px;">
          <button type="button" onclick="confirmerAjoutStock()" style="flex:1;background:#1565c0;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;">✅ Confirmer</button>
          <button type="button" onclick="fermerModalStock()" style="flex:1;background:#eee;color:#333;border:none;padding:12px;border-radius:6px;cursor:pointer;">Annuler</button>
        </div>
      </div>
    </div>
  `;
}

function ouvrirAjoutStock() { document.getElementById("modalStock").style.display = "flex"; }
function fermerModalStock() { document.getElementById("modalStock").style.display = "none"; }

function confirmerAjoutStock() {
  const nom = document.getElementById("modalProduitStock").value;
  const qte = parseInt(document.getElementById("modalQteStock").value);
  if (!qte || qte <= 0) { toast("error", "Quantité invalide", "Veuillez saisir une quantité supérieure à 0."); return; }
  mettreAJourStock(nom, qte).then(() => {
    toast("success", "Stock ajouté !", `${qte} kg de ${nom} ajoutés au stock.`);
    fermerModalStock();
    rechargerSection(sectionActive);
  });
}

function ajouterStockAdmin(nom) {
  demanderValeur(`Ajouter du stock — ${nom}`, "Saisissez la quantité à ajouter", "Quantité (kg)", 50, (valeur) => {
    const qte = parseInt(valeur);
    if (!isNaN(qte) && qte > 0) {
      mettreAJourStock(nom, qte).then(() => {
        toast("success", "Stock mis à jour", `+${qte} kg ajoutés pour ${nom}.`);
        rechargerSection(sectionActive);
      });
    } else { toast("error", "Quantité invalide", "Veuillez saisir un nombre supérieur à 0."); }
  });
}

function retirerStockAdmin(nom, actuel) {
  demanderValeur(`Retirer du stock — ${nom}`, `Stock actuel : ${actuel} kg`, "Quantité à retirer (kg)", 10, (valeur) => {
    const qte = parseInt(valeur);
    if (!isNaN(qte) && qte > 0) {
      mettreAJourStock(nom, -qte).then(() => {
        toast("warning", "Stock retiré", `−${qte} kg retirés pour ${nom}.`);
        rechargerSection(sectionActive);
      });
    } else { toast("error", "Quantité invalide", "Veuillez saisir un nombre supérieur à 0."); }
  });
}

function mettreAJourStock(nom, delta) {
  return fetch(`${BASE_URL}/stocks?nom=${nom}`).then(res => res.json()).then(items => {
    if (items.length > 0) {
      const item = items[0];
      const nouvelleDispo = Math.max(0, item.disponible + delta);
      return fetch(`${BASE_URL}/stocks/${item.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, disponible: nouvelleDispo })
      });
    } else {
      return fetch(`${BASE_URL}/stocks`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, disponible: Math.max(0, delta) })
      });
    }
  });
}

function filtrerStock(recherche) {
  const tbody = document.getElementById("corpsStock");
  tbody.querySelectorAll("tr").forEach(ligne => {
    const nom = ligne.cells[0] ? ligne.cells[0].textContent.toLowerCase() : "";
    ligne.style.display = nom.includes(recherche.toLowerCase()) ? "" : "none";
  });
}

let clientVenteActuel = null;

function getSectionVente(produits) {
  const lignesProduits = produits.map((p, i) => `
    <tr>
      <td><span>🐟</span> ${p.nom}</td>
      <td>${p.prix.toLocaleString()} FCFA/kg</td>
      <td><input type="number" id="qte_${i}" data-prix="${p.prix}" data-nom="${p.nom}" min="0" value="0" onchange="calculerTotalVente()" style="width:70px;padding:6px;border:1px solid #ddd;border-radius:4px;text-align:center;"/></td>
      <td id="montant_${i}" style="color:#1565c0;font-weight:bold;">0 FCFA</td>
    </tr>`).join("");
  return `
    <h1 class="titre-page">💵 Gestion des Ventes</h1>
    <div id="choixClient" style="display:flex;gap:16px;margin-bottom:24px;">
      <button type="button" onclick="choisirClientFrequent()" id="btnClientFrequent" style="flex:1;padding:14px;border:2px solid #1565c0;border-radius:8px;background:white;color:#1565c0;font-size:15px;font-weight:bold;cursor:pointer;">👤 Client fréquent</button>
      <button type="button" onclick="choisirClientAnonyme()" id="btnClientAnonyme" style="flex:1;padding:14px;border:2px solid #ddd;border-radius:8px;background:white;color:#555;font-size:15px;font-weight:bold;cursor:pointer;">👤 Client anonyme</button>
    </div>
    <div id="zoneClientFrequent" style="display:none;background:white;border-radius:8px;padding:20px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
      <input type="text" id="rechercheClient" placeholder="🔍 rechercher un client..." oninput="rechercherClient(this.value)" style="width:100%;padding:10px 16px;border:1px solid #ddd;border-radius:20px;outline:none;margin-bottom:16px;"/>
      <div id="resultatsClient" style="display:flex;flex-wrap:wrap;gap:10px;"></div>
      <div id="clientSelectionne" style="display:none;margin-top:16px;padding:14px;background:#e3f2fd;border-radius:8px;border-left:4px solid #1565c0;">
        <div style="font-size:16px;font-weight:bold;color:#1565c0;" id="nomClientAffiche"></div>
        <div style="font-size:13px;color:#666;margin-top:4px;" id="infoClientAffiche"></div>
      </div>
    </div>
    <div id="zoneClientAnonyme" style="display:none;background:white;border-radius:8px;padding:20px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
      <input type="text" id="nomClientAnonyme" placeholder="Nom du client (optionnel)" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"/>
    </div>
    <div class="section-tableau" style="margin-bottom:20px;">
      <h2>Panier de vente</h2>
      <table>
        <thead><tr><th>Nom du poisson</th><th>Prix(FCFA/kg)</th><th>Quantité</th><th>Montant</th></tr></thead>
        <tbody>${lignesProduits}</tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;align-items:center;padding:16px 0;gap:20px;">
        <span style="font-size:16px;font-weight:bold;">Total :</span>
        <span id="totalVente" style="font-size:22px;font-weight:bold;color:#1565c0;">0 FCFA</span>
      </div>
      <button type="button" onclick="enregistrerVente()" style="width:100%;background:#1565c0;color:white;border:none;padding:14px;border-radius:8px;cursor:pointer;font-size:16px;font-weight:bold;">Valider la commande 🛒</button>
    </div>
  `;
}

function choisirClientFrequent() {
  document.getElementById("zoneClientFrequent").style.display = "block";
  document.getElementById("zoneClientAnonyme").style.display = "none";
  document.getElementById("btnClientFrequent").style.background = "#e3f2fd";
  document.getElementById("btnClientAnonyme").style.background = "white";
  rechercherClient("");
}

function choisirClientAnonyme() {
  document.getElementById("zoneClientAnonyme").style.display = "block";
  document.getElementById("zoneClientFrequent").style.display = "none";
  document.getElementById("btnClientAnonyme").style.background = "#e3f2fd";
  document.getElementById("btnClientFrequent").style.background = "white";
  clientVenteActuel = null;
}

function rechercherClient(recherche) {
  getTransactions().then(transactions => {
    const clients = [...new Set(transactions.map(t => t.client))];
    const filtres = clients.filter(c => c.toLowerCase().includes(recherche.toLowerCase()));
    document.getElementById("resultatsClient").innerHTML = filtres.map(c => {
      const nb = transactions.filter(t => t.client === c).length;
      const total = transactions.filter(t => t.client === c).reduce((s, t) => s + t.quantite * t.prix, 0);
      return `<div onclick="selectionnerClient('${c}', ${nb}, ${total})" style="padding:10px 16px;border:1px solid #ddd;border-radius:8px;cursor:pointer;background:white;min-width:160px;" onmouseover="this.style.borderColor='#1565c0'" onmouseout="this.style.borderColor='#ddd'"><div style="font-weight:bold;">${c}</div><div style="font-size:12px;color:#888;">${nb} commande(s)</div></div>`;
    }).join("");
  });
}

function selectionnerClient(nom, nb, total) {
  clientVenteActuel = nom;
  document.getElementById("clientSelectionne").style.display = "block";
  document.getElementById("nomClientAffiche").textContent = nom;
  document.getElementById("infoClientAffiche").textContent = `Total ventes : ${total.toLocaleString()} FCFA  |  Commandes : ${nb}`;
}

function calculerTotalVente() {
  let total = 0;
  document.querySelectorAll("[id^='qte_']").forEach((input, i) => {
    const qte = parseInt(input.value) || 0;
    const montant = qte * parseInt(input.dataset.prix);
    total += montant;
    const cell = document.getElementById(`montant_${i}`);
    if (cell) cell.textContent = montant.toLocaleString() + " FCFA";
  });
  const el = document.getElementById("totalVente");
  if (el) el.textContent = total.toLocaleString() + " FCFA";
}

function enregistrerVente() {
  let nomClient = clientVenteActuel;
  const zoneAnonyme = document.getElementById("zoneClientAnonyme");
  if (zoneAnonyme && zoneAnonyme.style.display !== "none") {
    const input = document.getElementById("nomClientAnonyme");
    nomClient = (input && input.value.trim()) ? input.value.trim() : "Client anonyme";
  }
  if (!nomClient) { toast("error", "Client manquant", "Veuillez sélectionner ou saisir un client."); return; }
  const lignes = [];
  document.querySelectorAll("[id^='qte_']").forEach(input => {
    const qte = parseInt(input.value) || 0;
    if (qte > 0) lignes.push({ client: nomClient, produit: input.dataset.nom, quantite: qte, prix: parseInt(input.dataset.prix), total: qte * parseInt(input.dataset.prix), date: new Date().toLocaleDateString("fr-FR") });
  });
  if (lignes.length === 0) { toast("error", "Panier vide", "Veuillez ajouter au moins un produit."); return; }
  Promise.all(lignes.map(l => ajouterTransaction(l))).then(() => {
    const total = lignes.reduce((s, l) => s + l.total, 0);
    toast("success", "Vente enregistrée !", `${lignes.length} produit(s) — ${total.toLocaleString()} FCFA pour ${nomClient}.`);
    clientVenteActuel = null;
    rechargerSection(sectionActive);
  });
}

const STATUTS = ["En attente", "Livrée", "Confirmée", "Annulée"];
const STATUT_COULEURS = {
  "En attente": { bg: "#fff3e0", color: "#e65100" },
  "Livrée":     { bg: "#e8f5e9", color: "#2e7d32" },
  "Confirmée":  { bg: "#e3f2fd", color: "#1565c0" },
  "Annulée":    { bg: "#ffebee", color: "#c62828" },
};
let filtreStatutActuel = "tous";

function initialiserStatuts(transactions) {
  return Promise.all(transactions.filter(t => !t.statut).map(t =>
    fetch(`${BASE_URL}/transactions/${t.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...t, statut: "Livrée" }) })
  ));
}

function getSectionCommandes() {
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
      <h1 class="titre-page" style="margin:0;">🛒 Gestion des Commandes</h1>
      <input type="text" id="rechercheCommande" placeholder="🔍 rechercher une commande..." oninput="filtrerCommandes()" style="padding:8px 16px;border:1px solid #ddd;border-radius:20px;outline:none;font-size:13px;width:220px;"/>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
      <button type="button" onclick="filtrerParStatut('tous')" style="padding:8px 20px;border-radius:20px;border:none;cursor:pointer;font-weight:bold;background:#1565c0;color:white;">Tous</button>
      <button type="button" onclick="filtrerParStatut('En attente')" style="padding:8px 20px;border-radius:20px;border:2px solid #e65100;cursor:pointer;font-weight:bold;background:#fff3e0;color:#e65100;">En attente</button>
      <button type="button" onclick="filtrerParStatut('Livrée')" style="padding:8px 20px;border-radius:20px;border:2px solid #2e7d32;cursor:pointer;font-weight:bold;background:#e8f5e9;color:#2e7d32;">✓ Livrée</button>
      <button type="button" onclick="filtrerParStatut('Confirmée')" style="padding:8px 20px;border-radius:20px;border:2px solid #1565c0;cursor:pointer;font-weight:bold;background:#e3f2fd;color:#1565c0;">✓ Confirmée</button>
      <button type="button" onclick="filtrerParStatut('Annulée')" style="padding:8px 20px;border-radius:20px;border:2px solid #c62828;cursor:pointer;font-weight:bold;background:#ffebee;color:#c62828;">Annulée</button>
    </div>
    <div class="section-tableau">
      <table><thead><tr><th>Clients</th><th>Montants</th><th>Statuts</th><th>Action</th></tr></thead><tbody id="corpsCommandes"></tbody></table>
      <div style="text-align:center;margin-top:16px;">
        <button type="button" onclick="voirToutesCommandes()" style="background:white;border:2px solid #1565c0;color:#1565c0;padding:10px 28px;border-radius:6px;cursor:pointer;font-weight:bold;">Voir toutes les commandes</button>
      </div>
    </div>
  `;
}

function afficherLignesCommandes(transactions) {
  const tbody = document.getElementById("corpsCommandes");
  if (!tbody) return;
  const parClient = {};
  transactions.forEach(t => {
    if (!parClient[t.client]) parClient[t.client] = { total: 0, statut: t.statut || "Livrée", id: t.id };
    parClient[t.client].total += t.quantite * t.prix;
  });
  tbody.innerHTML = Object.entries(parClient).map(([client, data]) => {
    const sc = STATUT_COULEURS[data.statut] || STATUT_COULEURS["Livrée"];
    return `<tr>
      <td><strong>${client}</strong></td>
      <td>${data.total.toLocaleString()} FCFA</td>
      <td><span style="background:${sc.bg};color:${sc.color};padding:4px 12px;border-radius:12px;font-size:12px;font-weight:bold;">${data.statut}</span></td>
      <td style="display:flex;gap:6px;">
        <button type="button" onclick="changerStatutCommande('${client}')" style="background:#e8f5e9;color:#2e7d32;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:18px;">+</button>
        <button type="button" onclick="supprimerCommande('${client}')" style="background:#ffebee;color:#c62828;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:18px;">🗑</button>
      </td>
    </tr>`;
  }).join("");
}

function filtrerParStatut(statut) { filtreStatutActuel = statut; filtrerCommandes(); }

function filtrerCommandes() {
  const recherche = (document.getElementById("rechercheCommande")?.value || "").toLowerCase();
  getTransactions().then(transactions => {
    let filtrees = transactions;
    if (filtreStatutActuel !== "tous") filtrees = filtrees.filter(t => (t.statut || "Livrée") === filtreStatutActuel);
    if (recherche) filtrees = filtrees.filter(t => t.client.toLowerCase().includes(recherche));
    afficherLignesCommandes(filtrees);
  });
}

function changerStatutCommande(client) {
  getTransactions().then(transactions => {
    const siennes = transactions.filter(t => t.client === client);
    const idx = STATUTS.indexOf(siennes[0]?.statut || "Livrée");
    const nouveauStatut = STATUTS[(idx + 1) % STATUTS.length];
    Promise.all(siennes.map(t => fetch(`${BASE_URL}/transactions/${t.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...t, statut: nouveauStatut })
    }))).then(() => { toast("info", "Statut mis à jour", `${client} → ${nouveauStatut}`); filtrerCommandes(); });
  });
}

function supprimerCommande(client) {
  confirmerAction(`Supprimer toutes les commandes de "${client}" ?`, () => {
    getTransactions().then(transactions => {
      Promise.all(transactions.filter(t => t.client === client).map(t =>
        fetch(`${BASE_URL}/transactions/${t.id}`, { method: "DELETE" })
      )).then(() => { toast("success", "Commandes supprimées", `Commandes de ${client} supprimées.`); filtrerCommandes(); });
    });
  });
}

function voirToutesCommandes() { filtreStatutActuel = "tous"; filtrerCommandes(); }