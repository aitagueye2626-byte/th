// ============================================================
// PAGE ADMIN - STRUCTURE PRINCIPALE
// ============================================================

function getAdminPage() {
  return `
    <div id="dashboardAdmin">
      <nav class="barre-navigation">
        <div class="logo-barre">
          <span>🐟</span>
          <span>SenThiof - Admin</span>
        </div>
        <div class="menu-barre">
          <span id="nomUtilisateurAdmin"></span>
          <button onclick="seDeconnecter()">🔓 Déconnexion</button>
        </div>
      </nav>
      <div class="mise-en-page">
        <aside class="barre-laterale">
          <div class="element-menu actif"  onclick="naviguerVers('tableau-de-bord')">📊 Table De Bord</div>
          <div class="element-menu"        onclick="naviguerVers('poisson')">🐠 Poissons</div>
          <div class="element-menu"        onclick="naviguerVers('stock')">🏪 Stocks</div>
          <div class="element-menu"        onclick="naviguerVers('vente')">💵 Ventes</div>
          <div class="element-menu"        onclick="naviguerVers('commandes')">🛒 Commandes</div>
        </aside>
        <main class="contenu" id="contenuPrincipal">
          <!-- contenu injecté dynamiquement -->
        </main>
      </div>
    </div>
  `;
}

// ============================================================
// NAVIGATION
// ============================================================

function naviguerVers(section) {
  const menus = document.querySelectorAll(".element-menu");
  const indexMenu = {
    "tableau-de-bord": 0,
    poisson: 1,
    stock: 2,
    vente: 3,
    commandes: 4,
  };
  menus.forEach((el) => el.classList.remove("actif"));
  if (menus[indexMenu[section]] !== undefined) {
    menus[indexMenu[section]].classList.add("actif");
  }

  const contenu = document.getElementById("contenuPrincipal");
  switch (section) {
    case "tableau-de-bord":
      contenu.innerHTML = getSectionTableauDeBord();
      remplirDashboardAdmin(donneesJSON.transactions);
      break;
    case "poisson":
      contenu.innerHTML = getSectionPoisson();
      break;
    case "stock":
      contenu.innerHTML = getSectionStock();
      break;
    case "vente":
      contenu.innerHTML = getSectionVente();
      break;
    case "commandes":
      contenu.innerHTML = getSectionCommandes();
      break;
  }
}

// ============================================================
// SECTION : TABLEAU DE BORD
// ============================================================

function getSectionTableauDeBord() {
  return `
    <h1 class="titre-page">Tableau de bord Admin</h1>
    <div class="metriques">
      <div class="metrique">
        <div class="etiquette">Transactions</div>
        <div class="valeur" id="nbLignesAdmin">—</div>
        <div class="unite">entrées</div>
      </div>
      <div class="metrique">
        <div class="etiquette">Quantité totale</div>
        <div class="valeur" id="totalQteAdmin">—</div>
        <div class="unite">kg</div>
      </div>
      <div class="metrique">
        <div class="etiquette">Montant total</div>
        <div class="valeur" id="totalMontantAdmin">—</div>
        <div class="unite">FCFA</div>
      </div>
      <div class="metrique">
        <div class="etiquette">Top produit</div>
        <div class="valeur" id="topProduitAdmin">—</div>
        <div class="unite">ce mois</div>
      </div>
    </div>
    <div class="section-tableau">
      <h2>Transactions récentes</h2>
      <table>
        <thead>
          <tr>
            <th>Client</th><th>Date</th><th>Produit</th>
            <th>Quantité</th><th>Prix unitaire</th><th>Montant total</th>
          </tr>
        </thead>
        <tbody id="corpsTableauAdmin"></tbody>
      </table>
    </div>
    <div class="totaux">
      <p>Nombre de transactions : <strong id="totalTransactionsAdmin">—</strong></p>
      <p>Montant général : <strong id="totalGeneralAdmin">—</strong> FCFA</p>
    </div>
  `;
}

// ============================================================
// SECTION : POISSON
// ============================================================

function getSectionPoisson() {
  const lignes = donneesJSON.produits.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>🐟 ${p.nom}</td>
      <td>${p.prix.toLocaleString()} FCFA / kg</td>
      <td>
        <button onclick="modifierProduit(${i})" class="btn-modifier">✏️ Modifier</button>
        <button onclick="supprimerProduit(${i})" class="btn-supprimer">🗑️ Supprimer</button>
      </td>
    </tr>`).join("");

  return `
    <h1 class="titre-page">🐠 Gestion des Poissons</h1>
    <div class="section-tableau" style="margin-bottom:24px;">
      <h2>➕ Ajouter un poisson</h2>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:16px 0;">
        <input type="text" id="nomNouveauPoisson" placeholder="Nom du poisson" class="input-admin"/>
        <input type="number" id="prixNouveauPoisson" placeholder="Prix (FCFA/kg)" class="input-admin"/>
        <button onclick="ajouterProduit()" class="btn-ajouter">➕ Ajouter</button>
      </div>
    </div>
    <div class="section-tableau">
      <h2>Liste des poissons (${donneesJSON.produits.length})</h2>
      <table>
        <thead><tr><th>#</th><th>Nom</th><th>Prix unitaire</th><th>Actions</th></tr></thead>
        <tbody>${lignes}</tbody>
      </table>
    </div>
  `;
}

function ajouterProduit() {
  const nom = document.getElementById("nomNouveauPoisson").value.trim();
  const prix = parseInt(document.getElementById("prixNouveauPoisson").value);
  if (!nom || isNaN(prix) || prix <= 0) { alert("❌ Nom et prix valide requis."); return; }
  if (donneesJSON.produits.find(p => p.nom.toLowerCase() === nom.toLowerCase())) { alert("❌ Ce poisson existe déjà."); return; }
  donneesJSON.produits.push({ nom, prix });
  alert(`✅ ${nom} ajouté !`);
  naviguerVers("poisson");
}

function supprimerProduit(index) {
  if (confirm(`🗑️ Supprimer "${donneesJSON.produits[index].nom}" ?`)) {
    donneesJSON.produits.splice(index, 1);
    naviguerVers("poisson");
  }
}

function modifierProduit(index) {
  const p = donneesJSON.produits[index];
  const nouveauPrix = prompt(`Nouveau prix pour ${p.nom} (actuel: ${p.prix} FCFA/kg):`, p.prix);
  if (nouveauPrix !== null && parseInt(nouveauPrix) > 0) {
    donneesJSON.produits[index].prix = parseInt(nouveauPrix);
    naviguerVers("poisson");
  }
}

// ============================================================
// SECTION : STOCK (selon maquette)
// ============================================================

// Stock initial simulé (quantité disponible par produit)
if (!donneesJSON.stocks) {
  donneesJSON.stocks = {
    "Thiof":     { disponible: 150 },
    "Yakh":      { disponible: 200 },
    "Capitaine": { disponible: 48  },
    "Carpe":     { disponible: 70  },
    "Sole":      { disponible: 70  },
  };
}

function getSectionStock() {
  // Calculer les vendus par produit
  const vendus = {};
  donneesJSON.transactions.forEach(t => {
    vendus[t.produit] = (vendus[t.produit] || 0) + t.quantite;
  });

  let stockTotal = 0;
  let enStock = 0;
  let horsStock = 0;
  let ruptureStock = 0;

  const lignes = donneesJSON.produits.map((p, i) => {
    const dispo = donneesJSON.stocks[p.nom] ? donneesJSON.stocks[p.nom].disponible : 0;
    stockTotal += dispo;
    const valeur = dispo * p.prix;

    let statut, statutClass;
    if (dispo === 0) {
      statutClass = "statut-rupture"; statut = "Rupture stock"; ruptureStock++;
    } else if (dispo < 50) {
      statutClass = "statut-alerte"; statut = "À surveiller"; horsStock++;
    } else {
      statutClass = "statut-dispo"; statut = "Disponible"; enStock++;
    }

    return `
      <tr>
        <td><span class="poisson-icone">🐟</span> ${p.nom}</td>
        <td>${p.prix.toLocaleString()} FCFA/kg</td>
        <td>${dispo} kg</td>
        <td><span class="badge-statut ${statutClass}">${statut}</span></td>
        <td>
          <button onclick="ajouterStock(${i})" class="btn-stock-add" title="Ajouter stock">+</button>
          <button onclick="retirerStock(${i})" class="btn-stock-remove" title="Retirer stock">−</button>
        </td>
      </tr>`;
  }).join("");

  const valeurTotale = donneesJSON.produits.reduce((s, p) => {
    return s + (donneesJSON.stocks[p.nom] ? donneesJSON.stocks[p.nom].disponible * p.prix : 0);
  }, 0);

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
      <h1 class="titre-page" style="margin:0;">🏪 Gestion des  Stocks</h1>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        <input type="text" id="rechercheStock" placeholder="🔍 rechercher un poisson..." 
          oninput="filtrerStock(this.value)"
          style="padding:8px 14px;border:1px solid #ddd;border-radius:20px;outline:none;font-size:13px;width:220px;"/>
        <button onclick="ouvrirAjoutStock()" 
          style="background:#4caf50;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;font-size:14px;">
          + Ajouter du stock
        </button>
      </div>
    </div>

    <!-- Métriques stock -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
      <div class="metrique-stock" style="background:#1565c0;color:white;">
        <div style="font-size:12px;opacity:.8;">Stock total</div>
        <div style="font-size:24px;font-weight:bold;">${stockTotal.toLocaleString()} kg</div>
      </div>
      <div class="metrique-stock" style="background:#ff9800;color:white;">
        <div style="font-size:12px;opacity:.8;">Produit en stock</div>
        <div style="font-size:24px;font-weight:bold;">${enStock}</div>
      </div>
      <div class="metrique-stock" style="background:#9c27b0;color:white;">
        <div style="font-size:12px;opacity:.8;">Hors stock</div>
        <div style="font-size:24px;font-weight:bold;">${horsStock} <span style="font-size:13px;">à surveiller</span></div>
      </div>
      <div class="metrique-stock" style="background:#f44336;color:white;">
        <div style="font-size:12px;opacity:.8;">Rupture de stock</div>
        <div style="font-size:24px;font-weight:bold;">${ruptureStock}</div>
      </div>
    </div>

    <!-- Tableau stock -->
    <div class="section-tableau">
      <table id="tableauStock">
        <thead>
          <tr>
            <th>Nom du poisson</th>
            <th>Prix(FCFA/kg)</th>
            <th>Stock disponible</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="corpsStock">${lignes}</tbody>
      </table>
      <div class="totaux" style="margin-top:12px;">
        <p>Totale : <strong style="color:#1565c0;">${valeurTotale.toLocaleString()} FCFA</strong></p>
      </div>
    </div>

    <!-- Modal ajout stock -->
    <div id="modalStock" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:999;justify-content:center;align-items:center;">
      <div style="background:white;border-radius:12px;padding:32px;width:380px;box-shadow:0 8px 32px rgba(0,0,0,.2);">
        <h2 style="margin-bottom:20px;">+ Ajouter du stock</h2>
        <div style="margin-bottom:14px;">
          <label style="display:block;margin-bottom:6px;font-weight:600;">Produit</label>
          <select id="modalProduitStock" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;">
            ${donneesJSON.produits.map(p => `<option value="${p.nom}">${p.nom}</option>`).join("")}
          </select>
        </div>
        <div style="margin-bottom:20px;">
          <label style="display:block;margin-bottom:6px;font-weight:600;">Quantité à ajouter (kg)</label>
          <input type="number" id="modalQteStock" placeholder="Ex: 100" min="1"
            style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"/>
        </div>
        <div style="display:flex;gap:10px;">
          <button onclick="confirmerAjoutStock()" 
            style="flex:1;background:#1565c0;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:bold;">
            ✅ Confirmer
          </button>
          <button onclick="fermerModalStock()" 
            style="flex:1;background:#eee;color:#333;border:none;padding:12px;border-radius:6px;cursor:pointer;">
            Annuler
          </button>
        </div>
      </div>
    </div>
  `;
}

function ouvrirAjoutStock() {
  const modal = document.getElementById("modalStock");
  modal.style.display = "flex";
}

function fermerModalStock() {
  document.getElementById("modalStock").style.display = "none";
}

function confirmerAjoutStock() {
  const produit = document.getElementById("modalProduitStock").value;
  const qte = parseInt(document.getElementById("modalQteStock").value);
  if (!qte || qte <= 0) { alert("❌ Quantité invalide."); return; }
  if (!donneesJSON.stocks[produit]) donneesJSON.stocks[produit] = { disponible: 0 };
  donneesJSON.stocks[produit].disponible += qte;
  alert(`✅ ${qte} kg de ${produit} ajoutés au stock !`);
  fermerModalStock();
  naviguerVers("stock");
}

function ajouterStock(index) {
  const produit = donneesJSON.produits[index];
  const qte = parseInt(prompt(`Ajouter du stock pour ${produit.nom} (kg):`, "50"));
  if (!isNaN(qte) && qte > 0) {
    if (!donneesJSON.stocks[produit.nom]) donneesJSON.stocks[produit.nom] = { disponible: 0 };
    donneesJSON.stocks[produit.nom].disponible += qte;
    naviguerVers("stock");
  }
}

function retirerStock(index) {
  const produit = donneesJSON.produits[index];
  const actuel = donneesJSON.stocks[produit.nom] ? donneesJSON.stocks[produit.nom].disponible : 0;
  const qte = parseInt(prompt(`Retirer du stock pour ${produit.nom} (actuel: ${actuel} kg):`, "10"));
  if (!isNaN(qte) && qte > 0) {
    if (!donneesJSON.stocks[produit.nom]) donneesJSON.stocks[produit.nom] = { disponible: 0 };
    donneesJSON.stocks[produit.nom].disponible = Math.max(0, actuel - qte);
    naviguerVers("stock");
  }
}

function filtrerStock(recherche) {
  const tbody = document.getElementById("corpsStock");
  const lignes = tbody.querySelectorAll("tr");
  lignes.forEach(ligne => {
    const nom = ligne.cells[0] ? ligne.cells[0].textContent.toLowerCase() : "";
    ligne.style.display = nom.includes(recherche.toLowerCase()) ? "" : "none";
  });
}

// ============================================================
// SECTION : VENTE (selon maquette)
// ============================================================

let clientVenteActuel = null;

function getSectionVente() {
  const lignesProduits = donneesJSON.produits.map((p, i) => `
    <tr>
      <td><span>🐟</span> ${p.nom}</td>
      <td>${p.prix.toLocaleString()} FCFA/kg</td>
      <td>
        <input type="number" id="qte_${i}" min="0" value="0" 
          onchange="calculerTotalVente()"
          style="width:70px;padding:6px;border:1px solid #ddd;border-radius:4px;text-align:center;"/>
      </td>
      <td id="montant_${i}" style="color:#1565c0;font-weight:bold;">0 FCFA</td>
    </tr>`).join("");

  return `
    <h1 class="titre-page">💵 Gestion des Ventes</h1>

    <!-- Choix type client -->
    <div id="choixClient" style="display:flex;gap:16px;margin-bottom:24px;">
      <button onclick="choisirClientFrequent()" id="btnClientFrequent"
        style="flex:1;padding:14px;border:2px solid #1565c0;border-radius:8px;background:white;color:#1565c0;font-size:15px;font-weight:bold;cursor:pointer;">
        👤 Client fréquent
      </button>
      <button onclick="choisirClientAnonyme()" id="btnClientAnonyme"
        style="flex:1;padding:14px;border:2px solid #ddd;border-radius:8px;background:white;color:#555;font-size:15px;font-weight:bold;cursor:pointer;">
        👤 Client anonyme
      </button>
    </div>

    <!-- Zone client fréquent -->
    <div id="zoneClientFrequent" style="display:none;background:white;border-radius:8px;padding:20px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
      <div style="display:flex;gap:10px;margin-bottom:16px;">
        <input type="text" id="rechercheClient" placeholder="🔍 rechercher un client..."
          oninput="rechercherClient(this.value)"
          style="flex:1;padding:10px 16px;border:1px solid #ddd;border-radius:20px;outline:none;"/>
      </div>
      <div id="resultatsClient" style="display:flex;flex-wrap:wrap;gap:10px;"></div>
      <div id="clientSelectionne" style="display:none;margin-top:16px;padding:14px;background:#e3f2fd;border-radius:8px;border-left:4px solid #1565c0;">
        <div style="font-size:16px;font-weight:bold;color:#1565c0;" id="nomClientAffiche"></div>
        <div style="font-size:13px;color:#666;margin-top:4px;" id="infoClientAffiche"></div>
      </div>
    </div>

    <!-- Zone client anonyme -->
    <div id="zoneClientAnonyme" style="display:none;background:white;border-radius:8px;padding:20px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
      <input type="text" id="nomClientAnonyme" placeholder="Nom du client (optionnel)"
        style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;"/>
    </div>

    <!-- Panier de vente -->
    <div class="section-tableau" style="margin-bottom:20px;">
      <h2>Panier de vente</h2>
      <table>
        <thead>
          <tr>
            <th>Nom du poisson</th>
            <th>Prix(FCFA/kg)</th>
            <th>Ajoutez dans le panier (Quantité)</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>${lignesProduits}</tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;align-items:center;padding:16px 0;gap:20px;">
        <span style="font-size:16px;font-weight:bold;">Total :</span>
        <span id="totalVente" style="font-size:22px;font-weight:bold;color:#1565c0;">0 FCFA</span>
      </div>
      <button onclick="enregistrerVente()"
        style="width:100%;background:#1565c0;color:white;border:none;padding:14px;border-radius:8px;cursor:pointer;font-size:16px;font-weight:bold;">
        Valider la commande 🛒
      </button>
    </div>
  `;
}

function choisirClientFrequent() {
  document.getElementById("zoneClientFrequent").style.display = "block";
  document.getElementById("zoneClientAnonyme").style.display = "none";
  document.getElementById("btnClientFrequent").style.borderColor = "#1565c0";
  document.getElementById("btnClientFrequent").style.background = "#e3f2fd";
  document.getElementById("btnClientAnonyme").style.borderColor = "#ddd";
  document.getElementById("btnClientAnonyme").style.background = "white";
  // Afficher tous les clients par défaut
  rechercherClient("");
}

function choisirClientAnonyme() {
  document.getElementById("zoneClientAnonyme").style.display = "block";
  document.getElementById("zoneClientFrequent").style.display = "none";
  document.getElementById("btnClientAnonyme").style.borderColor = "#1565c0";
  document.getElementById("btnClientAnonyme").style.background = "#e3f2fd";
  document.getElementById("btnClientFrequent").style.borderColor = "#ddd";
  document.getElementById("btnClientFrequent").style.background = "white";
  clientVenteActuel = null;
}

function rechercherClient(recherche) {
  const clients = [...new Set(donneesJSON.transactions.map(t => t.client))];
  const filtres = clients.filter(c => c.toLowerCase().includes(recherche.toLowerCase()));
  const resultats = document.getElementById("resultatsClient");
  resultats.innerHTML = filtres.map(c => {
    const nbCommandes = donneesJSON.transactions.filter(t => t.client === c).length;
    const totalAchats = donneesJSON.transactions
      .filter(t => t.client === c)
      .reduce((s, t) => s + t.quantite * t.prix, 0);
    return `
      <div onclick="selectionnerClient('${c}', ${nbCommandes}, ${totalAchats})"
        style="padding:10px 16px;border:1px solid #ddd;border-radius:8px;cursor:pointer;background:white;min-width:160px;transition:all .2s;"
        onmouseover="this.style.borderColor='#1565c0';this.style.background='#f0f4ff';"
        onmouseout="this.style.borderColor='#ddd';this.style.background='white';">
        <div style="font-weight:bold;">${c}</div>
        <div style="font-size:12px;color:#888;">${nbCommandes} commande(s)</div>
      </div>`;
  }).join("");
}

function selectionnerClient(nom, nbCommandes, totalAchats) {
  clientVenteActuel = nom;
  document.getElementById("clientSelectionne").style.display = "block";
  document.getElementById("nomClientAffiche").textContent = nom;
  document.getElementById("infoClientAffiche").textContent =
    `Total ventes : ${totalAchats.toLocaleString()} FCFA  |  Commandes : ${nbCommandes}`;
}

function calculerTotalVente() {
  let total = 0;
  donneesJSON.produits.forEach((p, i) => {
    const qte = parseInt(document.getElementById(`qte_${i}`)?.value) || 0;
    const montant = qte * p.prix;
    total += montant;
    const cellMontant = document.getElementById(`montant_${i}`);
    if (cellMontant) cellMontant.textContent = montant.toLocaleString() + " FCFA";
  });
  const el = document.getElementById("totalVente");
  if (el) el.textContent = total.toLocaleString() + " FCFA";
}

function enregistrerVente() {
  // Déterminer le nom du client
  let nomClient = clientVenteActuel;
  const zoneAnonyme = document.getElementById("zoneClientAnonyme");
  if (zoneAnonyme && zoneAnonyme.style.display !== "none") {
    const inputAnonyme = document.getElementById("nomClientAnonyme");
    nomClient = (inputAnonyme && inputAnonyme.value.trim()) ? inputAnonyme.value.trim() : "Client anonyme";
  }
  if (!nomClient) {
    alert("❌ Veuillez sélectionner ou saisir un client.");
    return;
  }

  let totalVendu = 0;
  const lignesAEnregistrer = [];
  donneesJSON.produits.forEach((p, i) => {
    const qte = parseInt(document.getElementById(`qte_${i}`)?.value) || 0;
    if (qte > 0) {
      lignesAEnregistrer.push({ client: nomClient, produit: p.nom, quantite: qte, prix: p.prix });
      totalVendu += qte;
    }
  });

  if (lignesAEnregistrer.length === 0) {
    alert("❌ Veuillez ajouter au moins un produit.");
    return;
  }

  const date = new Date().toLocaleDateString("fr-FR");
  lignesAEnregistrer.forEach(l => {
    donneesJSON.transactions.push({ ...l, date });
    // Déduire du stock
    if (donneesJSON.stocks[l.produit]) {
      donneesJSON.stocks[l.produit].disponible = Math.max(0, donneesJSON.stocks[l.produit].disponible - l.quantite);
    }
  });

  const total = lignesAEnregistrer.reduce((s, l) => s + l.quantite * l.prix, 0);
  alert(`✅ Vente enregistrée pour ${nomClient} !\n${lignesAEnregistrer.length} produit(s) — ${total.toLocaleString()} FCFA`);
  clientVenteActuel = null;
  naviguerVers("vente");
}

// ============================================================
// SECTION : COMMANDES (selon maquette)
// ============================================================

// Statuts possibles
const STATUTS = ["En attente", "Livrée", "Confirmée", "Annulée"];
const STATUT_COULEURS = {
  "En attente": { bg: "#fff3e0", color: "#e65100" },
  "Livrée":     { bg: "#e8f5e9", color: "#2e7d32" },
  "Confirmée":  { bg: "#e3f2fd", color: "#1565c0" },
  "Annulée":    { bg: "#ffebee", color: "#c62828" },
};

// Ajouter statut aux transactions existantes si absent
function initialiserStatuts() {
  donneesJSON.transactions.forEach(t => {
    if (!t.statut) t.statut = "Livrée";
  });
}

let filtreStatutActuel = "tous";

function getSectionCommandes() {
  initialiserStatuts();

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
      <h1 class="titre-page" style="margin:0;">🛒 Gestion des Commandes</h1>
      <input type="text" id="rechercheCommande" placeholder="🔍 rechercher une commande..."
        oninput="filtrerCommandes()"
        style="padding:8px 16px;border:1px solid #ddd;border-radius:20px;outline:none;font-size:13px;width:220px;"/>
    </div>

    <!-- Filtres statut -->
    <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;">
      <button onclick="filtrerParStatut('tous')" id="filtre-tous"
        style="padding:8px 20px;border-radius:20px;border:none;cursor:pointer;font-weight:bold;background:#1565c0;color:white;">
        Tous
      </button>
      <button onclick="filtrerParStatut('En attente')" id="filtre-En attente"
        style="padding:8px 20px;border-radius:20px;border:2px solid #e65100;cursor:pointer;font-weight:bold;background:#fff3e0;color:#e65100;">
        En attente
      </button>
      <button onclick="filtrerParStatut('Livrée')" id="filtre-Livrée"
        style="padding:8px 20px;border-radius:20px;border:2px solid #2e7d32;cursor:pointer;font-weight:bold;background:#e8f5e9;color:#2e7d32;">
        ✓ Livrée
      </button>
      <button onclick="filtrerParStatut('Confirmée')" id="filtre-Confirmée"
        style="padding:8px 20px;border-radius:20px;border:2px solid #1565c0;cursor:pointer;font-weight:bold;background:#e3f2fd;color:#1565c0;">
        ✓ Confirmée
      </button>
      <button onclick="filtrerParStatut('Annulée')" id="filtre-Annulée"
        style="padding:8px 20px;border-radius:20px;border:2px solid #c62828;cursor:pointer;font-weight:bold;background:#ffebee;color:#c62828;">
        Annulée
      </button>
    </div>

    <!-- Tableau commandes -->
    <div class="section-tableau">
      <table>
        <thead>
          <tr>
            <th>Clients</th>
            <th>Montants</th>
            <th>Statuts</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="corpsCommandes"></tbody>
      </table>
      <div style="text-align:center;margin-top:16px;">
        <button onclick="voirToutesCommandes()"
          style="background:white;border:2px solid #1565c0;color:#1565c0;padding:10px 28px;border-radius:6px;cursor:pointer;font-weight:bold;">
          Voir toutes les commandes
        </button>
      </div>
    </div>
  `;
}

function afficherLignesCommandes(transactions) {
  const tbody = document.getElementById("corpsCommandes");
  if (!tbody) return;

  // Regrouper par client
  const parClient = {};
  transactions.forEach(t => {
    if (!parClient[t.client]) parClient[t.client] = { total: 0, statut: t.statut || "Livrée", index: donneesJSON.transactions.indexOf(t) };
    parClient[t.client].total += t.quantite * t.prix;
  });

  tbody.innerHTML = Object.entries(parClient).map(([client, data]) => {
    const sc = STATUT_COULEURS[data.statut] || STATUT_COULEURS["Livrée"];
    const idx = donneesJSON.transactions.findIndex(t => t.client === client);
    return `
      <tr>
        <td><strong>${client}</strong></td>
        <td>${data.total.toLocaleString()} FCFA</td>
        <td>
          <span style="background:${sc.bg};color:${sc.color};padding:4px 12px;border-radius:12px;font-size:12px;font-weight:bold;">
            ${data.statut}
          </span>
        </td>
        <td style="display:flex;gap:6px;">
          <button onclick="changerStatutCommande('${client}', 1)" 
            style="background:#e8f5e9;color:#2e7d32;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:18px;" title="Avancer statut">+</button>
          <button onclick="supprimerCommande('${client}')"
            style="background:#ffebee;color:#c62828;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:18px;" title="Supprimer">🗑</button>
        </td>
      </tr>`;
  }).join("");
}

function filtrerParStatut(statut) {
  filtreStatutActuel = statut;
  filtrerCommandes();
}

function filtrerCommandes() {
  const recherche = (document.getElementById("rechercheCommande")?.value || "").toLowerCase();
  let transactions = donneesJSON.transactions;
  if (filtreStatutActuel !== "tous") {
    transactions = transactions.filter(t => (t.statut || "Livrée") === filtreStatutActuel);
  }
  if (recherche) {
    transactions = transactions.filter(t => t.client.toLowerCase().includes(recherche));
  }
  afficherLignesCommandes(transactions);
}

function changerStatutCommande(client, direction) {
  donneesJSON.transactions.forEach(t => {
    if (t.client === client) {
      const idx = STATUTS.indexOf(t.statut || "Livrée");
      const nouvelIdx = (idx + direction + STATUTS.length) % STATUTS.length;
      t.statut = STATUTS[nouvelIdx];
    }
  });
  filtrerCommandes();
}

function supprimerCommande(client) {
  if (confirm(`🗑️ Supprimer toutes les commandes de "${client}" ?`)) {
    donneesJSON.transactions = donneesJSON.transactions.filter(t => t.client !== client);
    filtrerCommandes();
  }
}

function voirToutesCommandes() {
  filtreStatutActuel = "tous";
  filtrerCommandes();
}

function remplirDashboardAdmin(transactions) {
  afficherTableauAdmin(transactions);
  afficherMetriquesAdmin(transactions);
}

function afficherTableauAdmin(transactions) {
  const corps = document.getElementById("corpsTableauAdmin");
  corps.innerHTML = "";
  transactions.forEach(t => {
    const montant = t.quantite * t.prix;
    corps.innerHTML += `
      <tr>
        <td>${t.client}</td><td>${t.date}</td><td>${t.produit}</td>
        <td>${t.quantite} kg</td>
        <td>${t.prix.toLocaleString()} FCFA</td>
        <td>${montant.toLocaleString()} FCFA</td>
      </tr>`;
  });
}

function afficherMetriquesAdmin(transactions) {
  let totalQte = 0, totalMontant = 0;
  transactions.forEach(t => { totalQte += t.quantite; totalMontant += t.quantite * t.prix; });
  document.getElementById("nbLignesAdmin").textContent = transactions.length;
  document.getElementById("totalQteAdmin").textContent = totalQte;
  document.getElementById("totalMontantAdmin").textContent = totalMontant.toLocaleString();
  document.getElementById("topProduitAdmin").textContent = trouverTopProduit(transactions);
  document.getElementById("totalTransactionsAdmin").textContent = transactions.length;
  document.getElementById("totalGeneralAdmin").textContent = totalMontant.toLocaleString();
}

function trouverTopProduit(transactions) {
  const totaux = {};
  transactions.forEach(t => { totaux[t.produit] = (totaux[t.produit] || 0) + t.quantite; });
  return Object.entries(totaux).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
}