function getClientPage() {
  return `
    <div id="dashboardClient">
      <nav class="barre-navigation">
        <div class="logo-barre">
          <span>🐟</span> <span>SenThiof - Client</span>
        </div>
        <div class="menu-barre">
          <span id="nomUtilisateurClient"></span>
          <button onclick="seDeconnecter()">🔓 Déconnexion</button>
        </div>
      </nav>

      <main class="contenu">
        <h1 class="titre-page">Espace Client</h1>

        <div class="section-tableau">
          <h2>Mes Commandes</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Produit</th><th>Qté</th><th>Montant</th><th>Statut</th>
                </tr>
              </thead>
              <tbody id="corpsTableauClient"></tbody>
            </table>
          </div>
        </div>

        <div class="section-tableau">
          <h2>🛒 Mon Panier</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Produit</th><th>Qté</th><th>Prix</th><th>Total</th><th>Action</th>
                </tr>
              </thead>
              <tbody id="corpsPanier"></tbody>
            </table>
          </div>
          <div style="margin-top: 15px; text-align: right; font-weight: bold;">
            Total panier : <span id="totalPanier">0 FCFA</span>
          </div>
          <button class="bouton-connexion" style="margin-top: 15px; background: #4caf50;" onclick="validerCommande()">
            ✅ Valider la commande
          </button>
        </div>

        <div class="section-tableau">
          <h2>Ajouter au panier</h2>
          <form onsubmit="return false">
            <div class="champ">
              <label>Produit</label>
              <select id="produit">
                <option>Thiof</option><option>Yakh</option><option>Capitaine</option>
              </select>
            </div>
            <div class="champ">
              <label>Quantité (kg)</label>
              <input type="number" id="quantiteCmd" placeholder="5" />
            </div>
            <button class="bouton-connexion" onclick="ajouterAuPanier()">
              ➕ Ajouter
            </button>
          </form>
        </div>
      </main>
    </div>
  `;
}